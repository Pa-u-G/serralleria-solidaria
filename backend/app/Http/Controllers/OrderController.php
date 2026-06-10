<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\Pack;
use App\Models\Direction;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class OrderController extends Controller
{
    // Admin: Listar todos los pedidos (excepto carrito)
    public function adminIndex()
    {
        $orders = Order::with(['user', 'direction', 'facturation'])
            ->where('status', '!=', 'carrito')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    // Admin: Ver detalle de un pedido
    public function adminShow($id)
    {
        $order = Order::with([
            'user',
            'direction',
            'facturation',
            'details'
        ])->findOrFail($id);

        // Cargar productos de los detalles
        $order->details->each(function ($detail) {
            if ($detail->product_type === Product::class) {
                $detail->setRelation('product', Product::with('images')->find($detail->product_id));
            } elseif ($detail->product_type === Pack::class) {
                $detail->setRelation('product', Pack::with('images')->find($detail->product_id));
            }
        });

        return response()->json($order);
    }
    // Cliente: Listar sus propios pedidos (excepto carrito)
    public function myOrders(Request $request)
    {
        $orders = Order::with(['direction', 'facturation'])
            ->where('user_id', $request->user()->id)
            ->where('status', '!=', 'carrito')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    // Cliente: Ver detalle de un pedido suyo
    public function myOrderDetail(Request $request, $id)
    {
        $order = Order::with([
            'direction',
            'facturation',
            'details'
        ])
        ->where('user_id', $request->user()->id)
        ->where('id', $id)
        ->firstOrFail();

        // Cargar productos de los detalles
        $order->details->each(function ($detail) {
            if ($detail->product_type === Product::class) {
                $detail->setRelation('product', Product::with('images')->find($detail->product_id));
            } elseif ($detail->product_type === Pack::class) {
                $detail->setRelation('product', Pack::with('images')->find($detail->product_id));
            }
        });

        return response()->json($order);
    }

    // Admin: Actualizar estado del pedido
    public function adminUpdateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pendiente,enviado,en camino,recibido'
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Estado actualizado correctamente',
            'order' => $order
        ]);
    }
    public function addToCart(Request $request)
    {
        $request->validate([
            'type'      => 'required|in:product,pack',
            'id'        => 'required|integer',
            'quantity'  => 'required|integer|min:1',
        ]);

        $user = $request->user();

        if ($request->type === 'product') {
            $item      = Product::findOrFail($request->id);
            $morphClass = Product::class;
        } else {
            $item      = Pack::findOrFail($request->id);
            $morphClass = Pack::class;
        }

        $order = Order::firstOrCreate(
            ['user_id' => $user->id, 'status' => 'carrito'],
            ['install' => false]
        );

        $detail = OrderDetail::where('order_id', $order->id)
            ->where('product_type', $morphClass)
            ->where('product_id', $item->id)
            ->first();

        if ($detail) {
            $detail->quantity += $request->quantity;
            $detail->save();
        } else {
            OrderDetail::create([
                'order_id'     => $order->id,
                'product_type' => $morphClass,
                'product_id'   => $item->id,
                'quantity'     => $request->quantity,
                'extra_key'    => 0,
            ]);
        }

        return response()->json([
            'message' => 'Producto añadido al carrito',
            'cart'    => $this->loadCart($order->id),
        ]);
    }

    public function getCart(Request $request)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->where('status', 'carrito')
            ->first();

        return response()->json([
            'cart'     => $order ? $this->loadCart($order->id) : null,
            'settings' => $this->getSettings(),
        ]);
    }

    public function updateDetail(Request $request, $detailId)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $detail = OrderDetail::where('id', $detailId)
            ->whereHas('order', fn($q) => $q
                ->where('user_id', $request->user()->id)
                ->where('status', 'carrito'))
            ->firstOrFail();

        $detail->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Cantidad actualizada']);
    }

    public function updateExtraKey(Request $request, $detailId)
    {
        $request->validate(['extra_key' => 'required|integer|min:0']);

        $detail = OrderDetail::where('id', $detailId)
            ->whereHas('order', fn($q) => $q
                ->where('user_id', $request->user()->id)
                ->where('status', 'carrito'))
            ->firstOrFail();

        $detail->update(['extra_key' => $request->extra_key]);

        return response()->json(['message' => 'Llaves extra actualizadas']);
    }

    public function updateInstall(Request $request)
    {
        $request->validate(['install' => 'required|boolean']);

        $order = Order::where('user_id', $request->user()->id)
            ->where('status', 'carrito')
            ->firstOrFail();

        $order->update(['install' => $request->install]);

        return response()->json(['message' => 'Instalación actualizada']);
    }

    public function removeDetail(Request $request, $detailId)
    {
        $detail = OrderDetail::where('id', $detailId)
            ->whereHas('order', fn($q) => $q
                ->where('user_id', $request->user()->id)
                ->where('status', 'carrito'))
            ->firstOrFail();

        $detail->delete();

        return response()->json(['message' => 'Producto eliminado del carrito']);
    }

    // Confirmar pedido: guarda direcciones, cambia status y resta stock
    public function checkout(Request $request)
    {
        $request->validate([
            'payment_intent_id'      => 'required|string',

            'direction.address'      => 'required|string',
            'direction.postal_code'  => 'required|string',
            'direction.city'         => 'required|string',
            'direction.nif'          => 'required|string',
            'direction.name'         => 'required|string',
            'direction.surnames'     => 'nullable|string',
            'direction.phone_number' => 'required|string',

            'facturation.address'      => 'required|string',
            'facturation.postal_code'  => 'required|string',
            'facturation.city'         => 'required|string',
            'facturation.nif'          => 'required|string',
            'facturation.name'         => 'required|string',
            'facturation.surnames'     => 'nullable|string',
            'facturation.phone_number' => 'required|string',
        ]);

        // Verificar pago con Stripe
        Stripe::setApiKey(config('services.stripe.secret'));
        $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);

        if ($paymentIntent->status !== 'succeeded') {
            return response()->json(['message' => 'El pago no se ha completado'], 422);
        }

        $order = Order::where('user_id', $request->user()->id)
            ->where('status', 'carrito')
            ->with('details')
            ->firstOrFail();

        // Verificar que el PaymentIntent corresponde a esta orden
        if ($paymentIntent->metadata->order_id != $order->id) {
            return response()->json(['message' => 'El pago no corresponde a este pedido'], 422);
        }

        $order->details->each(function ($detail) {
            if ($detail->product_type === Product::class) {
                $detail->setRelation('product', Product::find($detail->product_id));
            } elseif ($detail->product_type === Pack::class) {
                $detail->setRelation('product',
                    Pack::with('products')->find($detail->product_id)
                );
            }
        });

        // Validación de stock agrupado
        $stockNeeded = [];
        foreach ($order->details as $detail) {
            if ($detail->product_type === Product::class) {
                $pid = $detail->product_id;
                $stockNeeded[$pid] = ($stockNeeded[$pid] ?? 0) + $detail->quantity;
            } elseif ($detail->product_type === Pack::class) {
                foreach ($detail->product->products as $packProduct) {
                    $pid    = $packProduct->id;
                    $needed = $packProduct->pivot->amount * $detail->quantity;
                    $stockNeeded[$pid] = ($stockNeeded[$pid] ?? 0) + $needed;
                }
            }
        }

        $stockErrors = [];
        foreach ($stockNeeded as $productId => $totalNeeded) {
            $product = Product::find($productId);
            if ($product->stock < $totalNeeded) {
                $stockErrors[] = [
                    'name'      => $product->name,
                    'available' => $product->stock,
                    'requested' => $totalNeeded,
                ];
            }
        }

        if (!empty($stockErrors)) {
            return response()->json([
                'message' => 'Stock insuficiente',
                'errors'  => $stockErrors,
            ], 422);
        }

        DB::transaction(function () use ($order, $request, $stockNeeded) {
            $direction   = Direction::create($request->direction);
            $facturation = Direction::create($request->facturation);

            foreach ($stockNeeded as $productId => $totalNeeded) {
                Product::where('id', $productId)->decrement('stock', $totalNeeded);
            }

            // Calcular total real desde el PaymentIntent ya verificado
            Stripe::setApiKey(config('services.stripe.secret'));
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);
            $totalPrice    = $paymentIntent->amount / 100; // céntimos → euros

            $order->update([
                'status'         => 'pendiente',
                'direction_id'   => $direction->id,
                'facturation_id' => $facturation->id,
                'total_price'    => $totalPrice,
            ]);
        });

        return response()->json(['message' => 'Pedido confirmado correctamente']);
    }


    // ---- helpers ----

    private function loadCart(int $orderId): Order
    {
        $order = Order::with([
            'details',
        ])->findOrFail($orderId);

        // Cargar manualmente el producto morph con sus relaciones
        $order->details->each(function ($detail) {
            if ($detail->product_type === Product::class) {
                $detail->setRelation('product',
                    Product::with('images')->find($detail->product_id)
                );
            } elseif ($detail->product_type === Pack::class) {
                $detail->setRelation('product',
                    Pack::with([
                        'images',
                        'products.images', // productos del pack con su stock
                    ])->find($detail->product_id)
                );
            }
        });

        return $order;
    }


    private function getSettings(): array
    {
        return [
            'shipping_price'     => (float) Setting::get('shipping_price', 9),
            'install_price_tier1' => (float) Setting::get('install_price_tier1', 90),
            'install_price_tier2' => (float) Setting::get('install_price_tier2', 120),
            'install_price_tier3' => (float) Setting::get('install_price_tier3', 180),
            'install_price_tier4' => Setting::get('install_price_tier4', -1), // -1 = a consultar
        ];
    }

    public function createPaymentIntent(Request $request)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->where('status', 'carrito')
            ->with('details')
            ->firstOrFail();

        // Cargar productos manualmente
        $order->details->each(function ($detail) {
            if ($detail->product_type === Product::class) {
                $detail->setRelation('product', Product::find($detail->product_id));
            } elseif ($detail->product_type === Pack::class) {
                $detail->setRelation('product',
                    Pack::with('products')->find($detail->product_id)
                );
            }
        });

        // Calcular total (igual que en el frontend)
        $subtotal = $order->details->sum(function ($detail) {
            $base = $detail->product->price * $detail->quantity;
            $keys = ($detail->product->extra_key && $detail->extra_key)
                ? $detail->product->key_price * $detail->extra_key
                : 0;
            return $base + $keys;
        });

        $settings       = $this->getSettings();
        $shippingPrice  = $settings['shipping_price'];

        // Instalación
        $installPrice = 0;
        if ($order->install) {
            $installableTotal = $order->details->sum(function ($detail) {
                $p = $detail->product;
                if ($p->installable) return $p->price * $detail->quantity;
                if (isset($p->products)) {
                    return $p->products
                        ->filter(fn($pp) => $pp->installable)
                        ->sum(fn($pp) => $pp->price * $pp->pivot->amount * $detail->quantity);
                }
                return 0;
            });

            if ($installableTotal > 0 && $installableTotal <= 250)       $installPrice = $settings['install_price_tier1'];
            elseif ($installableTotal <= 500)                             $installPrice = $settings['install_price_tier2'];
            elseif ($installableTotal <= 1000)                            $installPrice = $settings['install_price_tier3'];
            // >1000 = a consultar, no se cobra por Stripe
        }

        $total = $subtotal + $shippingPrice + $installPrice;

        // Stripe trabaja en céntimos (entero)
        $amountCents = (int) round($total * 100);

        Stripe::setApiKey(config('services.stripe.secret'));

        $paymentIntent = PaymentIntent::create([
            'amount'   => $amountCents,
            'currency' => 'eur',
            'metadata' => ['order_id' => $order->id],
        ]);

        return response()->json([
            'client_secret' => $paymentIntent->client_secret,
            'amount'        => $amountCents,
        ]);
    }

}