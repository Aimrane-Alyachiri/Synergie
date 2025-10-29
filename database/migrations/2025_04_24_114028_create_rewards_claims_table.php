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
        Schema::create('rewards_claims', function (Blueprint $table) {
            $table->id(); // Using Laravel's default id column name
            $table->foreignId('reward_id');
            $table->foreignId('user_id');
            $table->integer('points_spent');
            $table->string('reward_code', 30)->nullable();
            $table->timestamp('claimed_at')->useCurrent();
            $table->timestamps();

            // Define foreign keys with correct column references
            $table->foreign('reward_id')->references('id')->on('rewards');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rewards_claims');
    }
};