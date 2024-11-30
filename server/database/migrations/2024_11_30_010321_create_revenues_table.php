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
        Schema::create('revenues', function (Blueprint $table) {
            $table->id();
            $table->date('date')->nullable();
            $table->string('description')->nullable();
            $table->decimal('amount', 15, 2);
            $table->foreignId('revenue_type_id')->constrained('revenue_types');
            $table->foreignId('cash_register_id')->nullable()->constrained('cash_registers');
            $table->foreignId('bank_id')->nullable()->constrained('banks');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('revenues');
    }
};
