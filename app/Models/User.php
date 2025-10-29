<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'telephone',
        'password',
        'points_balance',
        'birth_date',
        'role',
        'user_image_path',
        'loyalty_level_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'birth_date' => 'date',
    ];

    /**
     * Get the loyalty level that belongs to the user.
     */
    public function loyaltyLevel()
    {
        return $this->belongsTo(LoyaltyLevel::class, 'loyalty_level_id');
    }

    /**
     * Get the reward claims for the user.
     */
    public function rewardsClaims()
    {
        return $this->hasMany(RewardClaim::class);
    }

    /**
     * Get the point transactions for the user.
     */
    public function transactionsPoints()
    {
        return $this->belongsToMany(TransactionPoint::class, 'avoir', 'user_id', 'transaction_id')
                    ->withTimestamps();
    }
}