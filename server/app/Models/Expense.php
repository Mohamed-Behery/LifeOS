<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'amount',
        'description',
        'expense_type_id',
        'cash_register_id',
        'bank_id',
        'notes',
    ];

    public function expenseType()
    {
        return $this->belongsTo(ExpenseType::class, 'expense_type_id');
    }

    public function cashRegister()
    {
        return $this->belongsTo(CashRegister::class, 'cash_register_id');
    }

    public function bank()
    {
        return $this->belongsTo(Bank::class, 'bank_id');
    }
}
