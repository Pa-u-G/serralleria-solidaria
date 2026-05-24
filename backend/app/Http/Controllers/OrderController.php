<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\Pack;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Añadir producto o pack al carrito.
     * Body: { type: 'product'|'pack', id: int, quantity: int }
     */
    public function addToCart(Request $request)
    {
        $request->validate([
            'type'     => 'required|in:product,pack',
            'id'       => 'required|integer',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();

        // Resolver el modelo según el tipo
        if ($request->type === 'product') {
            $item = Product::findOrFail($request->id);
            $morphClass = Product::class;
        } else {
            $item = Pack::findOrFail($request->id);
            $morphClass = Pack::class;
        }

        // Buscar carrito activo o crear uno nuevo
        $order = Order::firstOrCreate(
            ['user_id' => $user->id, 'status' => 'carrito'],
            ['install' => false]
        );

        // Buscar si ya existe ese item en el carrito
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

        // Devolver carrito actualizado
        $order->load('details.product');

        return response()->json([
            'message' => 'Producto añadido al carrito',
            'cart'    => $order,
        ]);
    }

    /**
     * Obtener el carrito actual del usuario.
     */
    public function getCart(Request $request)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->where('status', 'carrito')
            ->with('details.product')
            ->first();

        return response()->json(['cart' => $order]);
    }

    /**
     * Actualizar cantidad de un detalle.
     */
    public function updateDetail(Request $request, $detailId)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $detail = OrderDetail::where('id', $detailId)
            ->whereHas('order', fn($q) => $q->where('user_id', $request->user()->id)
                ->where('status', 'carrito'))
            ->firstOrFail();

        $detail->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Cantidad actualizada', 'detail' => $detail]);
    }

    /**
     * Eliminar un item del carrito.
     */
    public function removeDetail(Request $request, $detailId)
    {
        $detail = OrderDetail::where('id', $detailId)
            ->whereHas('order', fn($q) => $q->where('user_id', $request->user()->id)
                ->where('status', 'carrito'))
            ->firstOrFail();

        $detail->delete();

        return response()->json(['message' => 'Producto eliminado del carrito']);
    }
}