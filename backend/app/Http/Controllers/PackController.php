<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use Illuminate\Http\Request;

class PackController extends Controller
{

    public function index()
    {
        return Pack::all();
    }

    public function show($id)
    {
        return Pack::with('products')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $pack = Pack::create($request->all());
        return $pack;
    }

    public function update(Request $request, $id)
    {
        $pack = Pack::findOrFail($id);
        $pack->update($request->all());

        return $pack;
    }

    public function destroy($id)
    {
        Pack::destroy($id);
        return response()->json(['message'=>'deleted']);
    }

}