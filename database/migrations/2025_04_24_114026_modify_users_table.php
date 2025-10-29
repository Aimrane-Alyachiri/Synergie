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
        // Add new columns to the existing users table
        Schema::table('users', function (Blueprint $table) {
            // Add these columns only if they don't exist already
            if (!Schema::hasColumn('users', 'loyalty_level_id')) {
                $table->foreignId('loyalty_level_id')->default(1)->after('password');
                $table->foreign('loyalty_level_id')->references('id')->on('loyalty_levels');
            }
            
            if (!Schema::hasColumn('users', 'telephone')) {
                $table->string('telephone', 30)->nullable()->after('email');
            }
            
            if (!Schema::hasColumn('users', 'points_balance')) {
                $table->integer('points_balance')->default(0)->after('password');
            }
            
            if (!Schema::hasColumn('users', 'birth_date')) {
                $table->date('birth_date')->nullable()->after('points_balance');
            }
            
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role', 30)->default('user')->after('birth_date');
            }
            if (!Schema::hasColumn('users', 'user_image_path')) {
                $table->string('user_image_path', 255)->nullable()->after('role');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the foreign key constraint first
            $table->dropForeign(['loyalty_level_id']);
            
            // Drop the columns we added
            $table->dropColumn([
                'loyalty_level_id',
                'telephone',
                'points_balance',
                'birth_date',
                'role'
            ]);
        });
    }
};