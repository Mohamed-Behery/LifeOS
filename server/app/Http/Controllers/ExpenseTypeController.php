<?php

namespace App\Http\Controllers;

use App\Models\ExpenseType;
use Illuminate\Http\Request;

class ExpenseTypeController extends Controller
{
    public function index()
    {
        $expenseTypes = ExpenseType::all();
        return response()->json($expenseTypes);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $expenseType = ExpenseType::create($validatedData);
        return response()->json($expenseType, 201);
    }

    public function update(Request $request, $id)
    {
        $expenseType = ExpenseType::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $expenseType->update($validatedData);
        return response()->json($expenseType);
    }

    public function destroy($id)
    {
        $expenseType = ExpenseType::findOrFail($id);
        $expenseType->delete();
        return response()->json(['message' => 'Expense Type deleted successfully']);
    }
}
