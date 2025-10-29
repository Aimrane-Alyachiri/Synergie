<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rewards', function (Blueprint $table) {
            $table->id(); // Using Laravel's default id column name
            $table->string('title_reward', 30);
            $table->text('description_reward')->nullable();
            $table->integer('points_cost');
            $table->integer('stock_quantity');
            $table->boolean('is_active')->default(true);
            $table->string('image_reward_path', 255)->nullable(); // Increased length for file paths
            $table->date('expiration_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rewards');
    }
};