<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HistoriqueController extends Controller
{
    public function transaction()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $transactions = $user->transactionsPoints()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'user' => $user,
            'transactions' => $transactions,
        ]);
    }
}
