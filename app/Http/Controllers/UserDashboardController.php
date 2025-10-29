<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\LoyaltyLevel;
use App\Models\Reward;
use App\Models\RewardsClaim;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    // Fetch user dashboard data for Axios/React
    public function getUserDashboardData()
    {
        $user = Auth::user();
        
        $loyaltyLevel = $this->updateUserLoyaltyLevel($user);
    
        return response()->json([
            'user' => $user,
            'loyaltyLevel' => $loyaltyLevel,
            'transactions' => $this->getUserTransactions($user->id),
            'availableRewards' => $this->getAvailableRewards(),
            'pointsToNextLevel' => $this->getPointsToNextLevel($user),
            'dailyPointsData' => $this->getDailyPointsData($user->id), // Changed from monthlyPointsData
            'userRank' => $this->getUserRank($user->points_balance),
        ]);
    }
    
    //chnage the level of user 
    private function updateUserLoyaltyLevel($user)
    {
        $newLevel = LoyaltyLevel::where('min_points', '<=', $user->points_balance)
                    ->orderBy('min_points', 'desc')
                    ->first();
    
        if ($newLevel && $user->loyalty_level_id !== $newLevel->id) {
            $user->loyalty_level_id = $newLevel->id;
            $user->save();
        }
    
        return $newLevel;
    }
    
    private function getUserTransactions($userId)
    {
        return DB::table('transactions_points')
            ->join('avoir', 'transactions_points.id', '=', 'avoir.transaction_id')
            ->where('avoir.user_id', $userId)
            ->select('transactions_points.*')
            ->orderBy('transactions_points.created_at', 'desc')
            ->take(10)
            ->get();
    }

    private function getAvailableRewards()
    {
        return Reward::where('is_active', true)
            ->where(function($query) {
                $query->whereNull('expiration_date')
                      ->orWhere('expiration_date', '>=', now());
            })
            ->where('stock_quantity', '>', 0)
            ->orderBy('points_cost', 'asc')
            ->take(6)
            ->get();
    }

    private function getPointsToNextLevel($user)
    {
        if (!$user->loyaltyLevel) {
            return 0;
        }

        $nextLevel = LoyaltyLevel::where('min_points', '>', $user->points_balance)
            ->orderBy('min_points', 'asc')
            ->first();

        return $nextLevel ? $nextLevel->min_points - $user->points_balance : 0;
    }

    private function getDailyPointsData($userId)
{
    $sixDaysAgo = now()->subDays(5)->startOfDay(); // Get 5 days ago to include current day (total 6)
    
    // First get actual transaction data
    $transactions = DB::table('transactions_points')
        ->join('avoir', 'transactions_points.id', '=', 'avoir.transaction_id')
        ->where('avoir.user_id', $userId)
        ->where('transactions_points.created_at', '>=', $sixDaysAgo)
        ->selectRaw('DATE(transactions_points.created_at) as day, SUM(points_transaction) as total_points')
        ->groupBy('day')
        ->orderBy('day')
        ->get()
        ->keyBy('day')
        ->toArray();
    
    // Create array with all days in range
    $result = [];
    for ($i = 0; $i < 6; $i++) {
        $day = now()->subDays(5 - $i)->format('Y-m-d');
        $formattedDay = now()->subDays(5 - $i)->format('m/d'); // Format for display (MM/DD)
        $result[] = [
            'day' => $formattedDay, // Use formatted date for display
            'fullDate' => $day, // Keep full date for reference if needed
            'points' => isset($transactions[$day]) ? $transactions[$day]->total_points : 0
        ];
    }
    
    return $result;
}
    private function getMonthlyPointsData($userId)
    {
        $sixMonthsAgo = now()->subMonths(6)->startOfMonth();

        return DB::table('transactions_points')
            ->join('avoir', 'transactions_points.id', '=', 'avoir.transaction_id')
            ->where('avoir.user_id', $userId)
            ->where('transactions_points.created_at', '>=', $sixMonthsAgo)
            ->selectRaw('DATE_FORMAT(transactions_points.created_at, "%Y-%m") as month, SUM(points_transaction) as total_points')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function($item) {
                return [
                    'month' => $item->month,
                    'points' => $item->total_points
                ];
            });
    }

   

    private function getUserRank($pointsBalance)
    {
        $totalUsers = DB::table('users')->count();
        $higherUsers = DB::table('users')->where('points_balance', '>', $pointsBalance)->count();

        $rank = $totalUsers - $higherUsers;
        $percentile = $totalUsers > 0 ? round((($totalUsers - $higherUsers) / $totalUsers) * 100) : 0;

        return [
            'rank' => $rank,
            'totalUsers' => $totalUsers,
            'percentile' => $percentile
        ];
    }
}
