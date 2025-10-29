<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    //
    public function getUsers(){
        $users = User::all();
        return response()->json($users);
    }

    public function deleteUserById(Request $request){

        $request->validate([
            'id' => 'required|integer|exists:users,id'
        ]);

        try {
            
            $user = User::findOrFail($request->id);
            $user->rewardsClaims()->delete();
            $user->transactionsPoints()->detach();
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully.',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }    

    
}
