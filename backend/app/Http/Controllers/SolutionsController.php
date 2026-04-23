<?php

namespace App\Http\Controllers;
use App\Models\Solution;
use App\Models\Solution_img;
use Illuminate\Support\Facades\Storage;

use Illuminate\Http\Request;

class SolutionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Solution::all());
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
        $validated = $request->validate([
            'name' => 'required',
            'surname' => 'required',
            'email' => 'required|email',
            'phone_number' => 'required|digits:9',
            'issue' => 'required',
            'description' => 'required',
        ]);
        $validated["status"] = "Pendent de revisar";
        $solution = Solution::create($validated);
        if ($request->hasFile('images')) {
            $request->validate([
                'images.*' => 'image|mimes:jpg,jpeg,png,webp'
            ]);

            foreach ($request->file('images') as $image) {
                $filename = uniqid().'_'.$image->getClientOriginalName();
                $path = $image->storeAs('solutions', $filename, 'public');

                Solution_img::create([
                    'solution_id' => $solution->id,
                    'name_img' => $filename,
                    'path' => $path
                ]);
            }
        }
        return response()->json(['message' => 'Solicitud enviada correctamente']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
