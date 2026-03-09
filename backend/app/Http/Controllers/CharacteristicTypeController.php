<?php

namespace App\Http\Controllers;

use App\Models\CharacteristicType;
use Illuminate\Http\Request;

class CharacteristicTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CharacteristicType::with('characteristics')->get();
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
        $request->validate(['type' => 'required|string|max:255']);
        return CharacteristicType::create([
            'type' => $request->type,
            'status' => true,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(CharacteristicType $characteristicType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CharacteristicType $characteristicType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $type = CharacteristicType::findOrFail($id);

        if ($request->has('type')) {
            $type->type = $request->type;
        }

        if ($request->has('status')) {
            $type->status = $request->status;
        }

        $type->save();

        return $type;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CharacteristicType $characteristicType)
    {
        //
    }
}
