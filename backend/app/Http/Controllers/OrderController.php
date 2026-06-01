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

        $order = Order::where('user_id', $request->user()->id)
            ->where('status', 'carrito')
            ->with('details')
            ->firstOrFail();

        // Cargar productos manualmente (morph)
        $order->details->each(function ($detail) {
            if ($detail->product_type === Product::class) {
                $detail->setRelation('product', Product::find($detail->product_id));
            } elseif ($detail->product_type === Pack::class) {
                $detail->setRelation('product',
                    Pack::with('products')->find($detail->product_id)
                );
            }
        });

        // Validación de stock
        // Calcular stock necesario total agrupado por product_id
        $stockNeeded = [];

        foreach ($order->details as $detail) {
            if ($detail->product_type === Product::class) {
                $pid = $detail->product_id;
                $stockNeeded[$pid] = ($stockNeeded[$pid] ?? 0) + $detail->quantity;

            } elseif ($detail->product_type === Pack::class) {
                foreach ($detail->product->products as $packProduct) {
                    $pid = $packProduct->id;
                    $needed = $packProduct->pivot->amount * $detail->quantity;
                    $stockNeeded[$pid] = ($stockNeeded[$pid] ?? 0) + $needed;
                }
            }
        }

        // Validar contra el stock real
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
                'message' => 'Stock insuficiente para algunos productos',
                'errors'  => $stockErrors,
            ], 422);
        }

        DB::transaction(function () use ($order, $request, $stockNeeded) {
            $direction   = Direction::create($request->direction);
            $facturation = Direction::create($request->facturation);

            // Restar stock agrupado (un solo decrement por producto)
            foreach ($stockNeeded as $productId => $totalNeeded) {
                Product::where('id', $productId)->decrement('stock', $totalNeeded);
            }

            $order->update([
                'status'         => 'pendiente',
                'direction_id'   => $direction->id,
                'facturation_id' => $facturation->id,
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
}