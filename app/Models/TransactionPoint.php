<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionPoint extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'transactions_points';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'points_transaction',
        'reason',
    ];

    /**
     * Get the users for the transaction point.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'avoir', 'transaction_id', 'user_id')
                    ->withTimestamps();
    }
}