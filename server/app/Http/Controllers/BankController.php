<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use Illuminate\Http\Request;

class BankController extends Controller
{
    public function index()
    {
        $banks = Bank::all();
        return response()->json($banks);
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

        $bank = Bank::create($validatedData);
        $bank->updateCurrentBalance();
        return response()->json($bank, 201);
    }

    public function update(Request $request, $id)
    {
        $bank = Bank::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'opening_balance' => 'nullable|numeric',
            'total_income' => 'nullable|numeric',
            'total_expenses' => 'nullable|numeric',
            'current_balance' => 'nullable|numeric',
        ]);

        $bank->update($validatedData);
        $bank->updateCurrentBalance();
        return response()->json($bank);
    }

    public function destroy($id)
    {
        $bank = Bank::findOrFail($id);
        $bank->delete();
        return response()->json(['message' => 'Bank deleted successfully']);
    }
}
