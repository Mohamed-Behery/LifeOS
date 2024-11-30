<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('banks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('opening_balance', 15, 2)->default(0);
            $table->decimal('total_income', 15, 2)->default(0);
            $table->decimal('total_expenses', 15, 2)->default(0);
            $table->decimal('current_balance', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('banks');
    }
};
