<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use App\Models\RewardClaim;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

class RewardController extends Controller
{
    /**
     * 🖼️ Inertia page - show all available rewards.
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $rewards = Reward::where('is_active', 1)
            ->where('stock_quantity', '>', 0)
            ->get();

        return Inertia::render('users/Rewards', [
            'user' => $user,
            'rewards' => $rewards,
        ]);
    }

    /**
     * ✅ Inertia claim - traditional post request.
     */
    public function claim($id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $reward = Reward::findOrFail($id);

        if ($user->points_balance < $reward->points_cost) {
            return redirect()->route('rewards.index')->with('error', 'Not enough points to claim this reward.');
        }

        if ($reward->stock_quantity < 1) {
            return redirect()->route('rewards.index')->with('error', 'This reward is out of stock.');
        }

        $user->points_balance -= $reward->points_cost;
        $user->save();

        $reward->stock_quantity -= 1;
        $reward->save();

        RewardClaim::create([
            'reward_id' => $reward->id,
            'user_id' => $user->id,
            'points_spent' => $reward->points_cost,
            'reward_code' => strtoupper(Str::random(10)),
            'claimed_at' => now(),
        ]);

        return redirect()->route('rewards.index')->with('success', '🎉 You have successfully claimed this reward!');
    }

    /**
     * 🎯 Inertia page - show all claimed rewards.
     */
    public function claimed()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $claimed = RewardClaim::with('reward')
            ->where('user_id', $user->id)
            ->orderBy('claimed_at', 'desc')
            ->get();

        return Inertia::render('users/ClaimedRewards', [
            'user' => $user,
            'claims' => $claimed,
        ]);
    }

    // ──────── API Endpoints for Axios ───────── //

    /**
     * 🎁 Axios API: get available rewards
     */
    public function apiRewards(): JsonResponse
    {
        $user = Auth::user();
        $rewards = Reward::where('is_active', 1)
            ->where('stock_quantity', '>', 0)
            ->get();

        return response()->json([
            'user' => $user,
            'rewards' => $rewards,
        ]);
    }

    /**
     * 🎯 Axios API: get claimed rewards
     */
    public function apiClaimedRewards(): JsonResponse
    {
        $user = Auth::user();
        $claimed = RewardClaim::with('reward')
            ->where('user_id', $user->id)
            ->orderBy('claimed_at', 'desc')
            ->get();

        return response()->json([
            'user' => $user,
            'claims' => $claimed,
        ]);
    }

    /**
     * ✅ Axios API: claim reward
     */
    public function apiClaim(Request $request, $id): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $reward = Reward::findOrFail($id);

        if ($user->points_balance < $reward->points_cost) {
            return response()->json(['error' => 'Not enough points to claim this reward.'], 400);
        }

        if ($reward->stock_quantity < 1) {
            return response()->json(['error' => 'This reward is out of stock.'], 400);
        }

        $user->points_balance -= $reward->points_cost;
        $user->save();

        $reward->stock_quantity -= 1;
        $reward->save();

        $claim = RewardClaim::create([
            'reward_id' => $reward->id,
            'user_id' => $user->id,
            'points_spent' => $reward->points_cost,
            'reward_code' => strtoupper(Str::random(10)),
            'claimed_at' => now(),
        ]);

        return response()->json([
            'message' => '🎉 Reward claimed successfully!',
            'claim' => $claim,
            'user' => $user,
        ]);
    }
}
