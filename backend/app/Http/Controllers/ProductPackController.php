<?php

namespace App\Http\Controllers;

use App\Models\ProductPack;
use App\Models\Pack;
use Illuminate\Http\Request;


class ProductPackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $pack = Pack::findOrFail($request->pack_id);

        $pack->products()->attach($request->product_id, [
            'amount' => $request->amount
        ]);

        return response()->json(['message'=>'added']);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductPack $productPack)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductPack $productPack)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {

        $pack = Pack::findOrFail($request->pack_id);

        $pack->products()->updateExistingPivot(
            $request->product_id,
            ['amount'=>$request->amount]
        );

        return response()->json(['message'=>'updated']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($product_id, $pack_id)
    {

        $pack = Pack::findOrFail($pack_id);

        $pack->products()->detach($product_id);

        return response()->json(['message'=>'deleted']);
    }
}
