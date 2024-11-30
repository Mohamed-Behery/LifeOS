<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\CashRegister;
use App\Models\ChartOfAccounts;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    public function index()
    {
        // استرجاع جميع المصروفات
        $expenses = Expense::all();
        return response()->json($expenses);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $validatedData = $request->validate([
                'date' => 'nullable|date',
                'description' => 'nullable|string',
                'amount' => 'required|numeric|min:0',
                'expense_type_id' => 'nullable|exists:expense_types,id',
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

            if ($request->bank_id) {
                $bank = Bank::findOrFail($request->bank_id);
                if ($bank->current_balance < $request->amount) {
                    return response()->json(['message' => 'رصيد البنك غير كافي لإتمام هذه العملية.'], 400);
                }
            }

            if ($request->cash_register_id) {
                $cashRegister = CashRegister::findOrFail($request->cash_register_id);
                if ($cashRegister->current_balance < $request->amount) {
                    return response()->json(['message' => 'رصيد الخزينة غير كافي لإتمام هذه العملية.'], 400);
                }
            }


            $expense = Expense::create($validatedData);

            if ($request->bank_id) {
                $bank = Bank::findOrFail($request->bank_id);
                $bank->increment('total_expenses', $request->amount);
                $bank->updateCurrentBalance();
            }

            if ($request->cash_register_id) {
                $cashRegister = CashRegister::findOrFail($request->cash_register_id);
                $cashRegister->increment('total_expenses', $request->amount);
                $cashRegister->updateCurrentBalance();
            }

            DB::commit();

            return response()->json($expense, 201);
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
                'expense_type_id' => 'nullable|exists:expense_types,id',
                'cash_register_id' => 'nullable|exists:cash_registers,id',
                'bank_id' => 'nullable|exists:banks,id',
                'notes' => 'nullable|string',
            ]);

            $expense = Expense::findOrFail($id);
            $previousAmount = $expense->amount;

            if (empty($request->bank_id) && empty($request->cash_register_id)) {
                return response()->json(['message' => 'يجب اختيار خزينة أو بنك.'], 400);
            }

            if (empty($request->bank_id) && empty($request->cash_register_id)) {
                return response()->json(['message' => 'لا يمكن اختيار خزينة وبنك معاً.'], 400);
            }

            if ($request->bank_id) {
                $bank = Bank::findOrFail($request->bank_id);
                $availableBalance = $bank->current_balance + $expense->amount;
                if ($availableBalance < $request->amount) {
                    return response()->json(['message' => 'رصيد البنك غير كافي لإتمام هذه العملية.'], 400);
                }
            }

            if ($request->cash_register_id) {
                $cashRegister = CashRegister::findOrFail($request->cash_register_id);
                $availableBalance = $cashRegister->current_balance + $expense->amount;
                if ($availableBalance < $request->amount) {
                    return response()->json(['message' => 'رصيد الخزينة غير كافي لإتمام هذه العملية.'], 400);
                }
            }

            if ($expense->bank_id) {
                $bank = Bank::findOrFail($expense->bank_id);
                $bank->decrement('total_expenses', $previousAmount);
                $bank->updateCurrentBalance();
            }

            if ($expense->cash_register_id) {
                $cashRegister = CashRegister::findOrFail($expense->cash_register_id);
                $cashRegister->decrement('total_expenses', $previousAmount);
                $cashRegister->updateCurrentBalance();
            }

            $expense->update($validatedData);

            if ($request->bank_id) {
                $bank = Bank::findOrFail($request->bank_id);
                $bank->increment('total_expenses', $request->amount);
                $bank->updateCurrentBalance();
            }

            if ($request->cash_register_id) {
                $cashRegister = CashRegister::findOrFail($request->cash_register_id);
                $cashRegister->increment('total_expenses', $request->amount);
                $cashRegister->updateCurrentBalance();
            }

            DB::commit();

            return response()->json($expense);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error updating expense'], 500);
        }
    }


    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $expense = Expense::findOrFail($id);
            $amount = $expense->amount;

            if ($expense->bank_id) {
                $bank = Bank::findOrFail($expense->bank_id);
                $bank->decrement('total_expenses', $amount);
                $bank->updateCurrentBalance();
            }

            if ($expense->cash_register_id) {
                $cashRegister = CashRegister::findOrFail($expense->cash_register_id);
                $cashRegister->decrement('total_expenses', $amount);
                $cashRegister->updateCurrentBalance();
            }

            $expense->delete();
            
            DB::commit();

            return response()->json(['message' => 'Expense deleted successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error deleting expense'], 500);
        }
    }
}
