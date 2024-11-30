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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->date('date')->nullable();
            $table->decimal('amount', 15, 2);
            $table->string('description')->nullable();
            $table->foreignId('expense_type_id')->constrained('expense_types');
            $table->foreignId('cash_register_id')->nullable()->constrained('cash_registers');
            $table->foreignId('bank_id')->nullable()->constrained('banks');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('expenses');
    }
};
