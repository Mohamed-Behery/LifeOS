<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\CashRegister;
use App\Models\Revenue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RevenueController extends Controller
{
    public function index()
    {
        $revenues = Revenue::all();
        return response()->json($revenues);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validate([
                'date' => 'nullable|date',
                'description' => 'nullable|string',
                'amount' => 'required|numeric|min:0',
                'revenue_type_id' => 'nullable|exists:revenue_types,id',
                'cash_register_id' => 'nullable|exists:cash_registers,id',
                'bank_id' => 'nullable|exists:banks,id',
                'notes' => 'nullable|string',
            ]);

            if (empty($request->bank_id) && empty($request->cash_register_id)) {
                return response()->json(['message' => 'يجب اختيار خزينة أو بنك.'], 400);
            }

            if (!empty($request->bank_id) && !empty($request->cash_register_id)) {
                return response()->json(['message' => 'لا يمكن اختيار خزينة وبنك معاً.'], 400);
            }

            $revenue = Revenue::create($validatedData);


            if ($request->bank_id) {
                $bank = Bank::findOrFail($request->bank_id);
                $bank->increment('total_income', $request->amount);
                $bank->updateCurrentBalance();
            }

            if ($request->cash_register_id) {
                $cashRegister = CashRegister::findOrFail($request->cash_register_id);
                $cashRegister->increment('total_income', $request->amount);
                $cashRegister->updateCurrentBalance();
            }

            DB::commit();

            return response()->json($revenue, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validate([
                'date' => 'nullable|date',
                'description' => 'nullable|string',
                'amount' => 'required|numeric|min:0',
                'revenue_type_id' => 'nullable|exists:revenue_types,id',
                'cash_register_id' => 'nullable|exists:cash_registers,id',
                'bank_id' => 'nullable|exists:banks,id',
                'notes' => 'nullable|string',
            ]);

            $revenue = Revenue::findOrFail($id);
            $previousAmount = $revenue->amount;


            if (empty($request->bank_id) && empty($request->cash_register_id)) {
                return response()->json(['message' => 'يجب اختيار خزينة أو بنك.'], 400);
            }

            if (empty($request->bank_id) && empty($request->cash_register_id)) {
                return response()->json(['message' => 'لا يمكن اختيار خزينة وبنك معاً.'], 400);
            }

            if ($revenue->bank_id) {
                $bank = Bank::findOrFail($revenue->bank_id);
                $bank->decrement('total_income', $previousAmount);
                $bank->updateCurrentBalance();
            }

            if ($revenue->cash_register_id) {
                $cashRegister = CashRegister::findOrFail($revenue->cash_register_id);
                $cashRegister->decrement('total_income', $previousAmount);
                $cashRegister->updateCurrentBalance();
            }

            $revenue->update($validatedData);

            if ($request->bank_id) {
                $bank = Bank::findOrFail($request->bank_id);
                $bank->increment('total_income', $request->amount);
                $bank->updateCurrentBalance();
            }

            if ($request->cash_register_id) {
                $cashRegister = CashRegister::findOrFail($request->cash_register_id);
                $cashRegister->increment('total_income', $request->amount);
                $cashRegister->updateCurrentBalance();
            }

            DB::commit();

            return response()->json($revenue);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }


    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $revenue = Revenue::findOrFail($id);
            $amount = $revenue->amount;

            if ($revenue->bank_id) {
                $bank = Bank::findOrFail($revenue->bank_id);
                $bank->decrement('total_income', $amount);
                $bank->updateCurrentBalance();
            }

            if ($revenue->cash_register_id) {
                $cashRegister = CashRegister::findOrFail($revenue->cash_register_id);
                $cashRegister->decrement('total_income', $amount);
                $cashRegister->updateCurrentBalance();
            }

            $revenue->delete();

            DB::commit();

            return response()->json(['message' => 'Revenue deleted successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
