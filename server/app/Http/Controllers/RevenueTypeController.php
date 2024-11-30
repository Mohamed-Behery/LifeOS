<?php

namespace App\Http\Controllers;

use App\Models\RevenueType;
use Illuminate\Http\Request;

class RevenueTypeController extends Controller
{
    public function index()
    {
        $revenueTypes = RevenueType::all();
        return response()->json($revenueTypes);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $revenueType = RevenueType::create($validatedData);
        return response()->json($revenueType, 201);
    }

    public function update(Request $request, $id)
    {
        $revenueType = RevenueType::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $revenueType->update($validatedData);
        return response()->json($revenueType);
    }

    public function destroy($id)
    {
        $revenueType = RevenueType::findOrFail($id);
        $revenueType->delete();
        return response()->json(['message' => 'Revenue Type deleted successfully']);
    }
}
