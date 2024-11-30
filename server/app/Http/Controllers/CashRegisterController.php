<?php

namespace App\Http\Controllers;

use App\Models\CashRegister;
use Illuminate\Http\Request;

class CashRegisterController extends Controller
{
    public function index()
    {
        $cashRegisters = CashRegister::all();
        return response()->json($cashRegisters);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'opening_balance' => 'nullable|numeric',
            'total_income' => 'nullable|numeric',
            'total_expenses' => 'nullable|numeric',
            'current_balance' => 'nullable|numeric',
        ]);

        $cashRegister = CashRegister::create($validatedData);
        $cashRegister->updateCurrentBalance();
        return response()->json($cashRegister, 201);
    }

    public function update(Request $request, $id)
    {
        $cashRegister = CashRegister::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'opening_balance' => 'nullable|numeric',
            'total_income' => 'nullable|numeric',
            'total_expenses' => 'nullable|numeric',
            'current_balance' => 'nullable|numeric',
        ]);

        $cashRegister->update($validatedData);
        $cashRegister->updateCurrentBalance();
        return response()->json($cashRegister);
    }

    public function destroy($id)
    {
        $cashRegister = CashRegister::findOrFail($id);
        $cashRegister->delete();
        return response()->json(['message' => 'Cash Register deleted successfully']);
    }
}
