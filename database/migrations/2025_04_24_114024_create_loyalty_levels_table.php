<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loyalty_levels', function (Blueprint $table) {
            $table->id(); // Using Laravel's default id column name
            $table->string('name_loyalty', 30);
            $table->integer('min_points');
            $table->text('description_loyalty')->nullable();
            $table->timestamps();
        });
        
        // Insert a default loyalty level
        DB::table('loyalty_levels')->insert([
            'name_loyalty' => 'Basic',
            'min_points' => 0,
            'description_loyalty' => 'Default loyalty level',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loyalty_levels');
    }
};