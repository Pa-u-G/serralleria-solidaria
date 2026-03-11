<?php

namespace App\Http\Controllers;

use App\Models\Characteristic;
use Illuminate\Http\Request;

class CharacteristicController extends Controller
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
        $request->validate([
            'characteristic_id' => 'required|exists:characteristics_type,id',
            'description' => 'required|string|max:255',
        ]);

        return Characteristic::create([
            'characteristic_id' => $request->characteristic_id,
            'description' => $request->description,
            'status' => true,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Characteristic $characteristic)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Characteristic $characteristic)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $char = Characteristic::findOrFail($id);

        if ($request->has('description')) {
            $char->description = $request->description;
        }

        if ($request->has('status')) {
            $char->status = $request->status;
        }

        $char->save();

        return $char;
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Characteristic $characteristic)
    {
        //
    }
}
