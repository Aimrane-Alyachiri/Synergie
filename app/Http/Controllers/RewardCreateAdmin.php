<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use Illuminate\Http\Request;

class RewardCreateAdmin extends Controller
{
    //
    public function create()
    {
        return view('admin.rewards.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_reward' => 'required|string|max:255',
            'description_reward' => 'required|string',
            'points_cost' => 'required|integer|min:1',
            'stock_quantity' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'expiration_date' => 'nullable|date|after:today',
        ]);
    
        // If image is uploaded via FormData, handle it
        if ($request->hasFile('image_reward_path')) {
            $path = $request->file('image_reward_path')->store('rewards_images', 'public');
            $validated['image_reward_path'] = $path;
        }
    
        $reward = Reward::create($validated);
    
        return response()->json([
            'message' => 'Reward created successfully!',
            'reward' => $reward
        ], 201);
    }

    
}
