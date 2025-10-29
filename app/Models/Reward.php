<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reward extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title_reward',
        'description_reward',
        'points_cost',
        'stock_quantity',
        'is_active',
        'image_reward_path',
        'expiration_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'expiration_date' => 'date',
    ];

    /**
     * Get the reward claims for the reward.
     */
    public function rewardsClaims()
    {
        return $this->hasMany(RewardClaim::class);
    }
}