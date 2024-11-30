<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'opening_balance',
        'total_income',
        'total_expenses',
        'current_balance',
    ];

    public function updateCurrentBalance()
    {
        $this->current_balance = $this->opening_balance + $this->total_income - $this->total_expenses;
        $this->save();
    }
}
