<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LoyaltyLevel;
use App\Models\TransactionPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the users.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Get all loyalty levels.
     *
     * @return \Illuminate\Http\Response
     */
    public function getLoyaltyLevels()
    {
        $loyaltyLevels = LoyaltyLevel::orderBy('min_points')->get();
        return response()->json($loyaltyLevels);
    }

    /**
     * Update the specified user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'telephone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'loyalty_level_id' => 'required|exists:loyalty_levels,id',
            'points_balance' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::findOrFail($id);
        
        // Update user details
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'birth_date' => $request->birth_date,
            'loyalty_level_id' => $request->loyalty_level_id,
            'points_balance' => $request->points_balance,
        ]);

        return response()->json($user);
    }

    /**
     * Create a new points transaction for the user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function addTransaction(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'points_transaction' => [
                'required',
                'integer',
                'not_in:0',
                function ($attribute, $value, $fail) {
                    if ($value < 0) {
                        $fail('La valeur des points ne peut pas être négative.');
                    }
                },
            ],
            'reason' => 'required|string|max:255',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }
    
        $user = User::findOrFail($id);
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Create the transaction point
            $transaction = TransactionPoint::create([
                'points_transaction' => $request->points_transaction,
                'reason' => $request->reason,
            ]);
            
            // Associate the transaction with the user via the pivot table
            $user->transactionsPoints()->attach($transaction->id);
            
            // Update the user's points balance
            $newBalance = $user->points_balance + $request->points_transaction;
            
            // This check is now redundant since we validate against negative values
            // But we keep it as an extra safeguard
            if ($newBalance < 0) {
                throw new \Exception('Le solde de points ne peut pas être négatif');
            }
            
            $user->update([
                'points_balance' => $newBalance
            ]);
            
            // Check if we need to update loyalty level based on new points
            $this->updateUserLoyaltyLevel($user);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json([
                'message' => 'Transaction ajoutée avec succès',
                'transaction' => $transaction,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            // Rollback the transaction
            DB::rollBack();
            
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get user transaction history.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getUserTransactions($id)
    {
        $user = User::findOrFail($id);
        $transactions = $user->transactionsPoints()
            ->withPivot(['created_at'])
            ->orderBy('pivot_created_at', 'desc')
            ->get();
        
        return response()->json([
            'user' => $user,
            'transactions' => $transactions
        ]);
    }

    /**
     * Delete the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Delete associated transactions in pivot table
        $user->transactionsPoints()->detach();
        
        // Delete reward claims
        $user->rewardsClaims()->delete();
        
        // Delete the user
        $user->delete();
        
        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Update user's loyalty level based on points.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    private function updateUserLoyaltyLevel(User $user)
    {
        // Get the appropriate loyalty level based on points
        $loyaltyLevel = LoyaltyLevel::where('min_points', '<=', $user->points_balance)
            ->orderBy('min_points', 'desc')
            ->first();
        
        if ($loyaltyLevel && $user->loyalty_level_id != $loyaltyLevel->id) {
            $user->update([
                'loyalty_level_id' => $loyaltyLevel->id
            ]);
        }
    }
}