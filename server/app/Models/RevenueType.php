<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RevenueType extends Model
{
    protected $fillable = ['name', 'description'];

    public function revenues()
    {
        return $this->hasMany(Revenue::class);
    }
}
