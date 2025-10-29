<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\ProfileController;

use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\HistoriqueController;
use App\Http\Controllers\RewardCreateAdmin;
use App\Http\Controllers\TestFetshdata;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {

    if(Auth::check()){
        return redirect()->route("dashboard");
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


//amine:
// For Inertia rendering
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/api/user/dashboard', [UserDashboardController::class, 'getUserDashboardData']);
});

//rewards
Route::middleware(['auth'])->group(function () {
    Route::get('/rewards', [RewardController::class, 'index'])->name('rewards.index');
    Route::post('/rewards/claim/{id}', [RewardController::class, 'claim'])->name('rewards.claim');
    Route::get('/claimed-rewards', [RewardController::class, 'claimed'])->name('rewards.claimed');

    // API routes (Axios frontend)
    Route::get('/api/rewards', [RewardController::class, 'apiRewards']);
    Route::get('/api/claimed-rewards', [RewardController::class, 'apiClaimedRewards']);
    Route::post('/api/rewards/claim/{id}', [RewardController::class, 'apiClaim']);
});
// For API calls from axios

//HISTORIQUE dyal luser;
Route::get('/transaction', function () {
    return Inertia::render('users/Transactions');
})->middleware(['auth'])->name('transaction.index');

Route::get('/api/transaction', [HistoriqueController::class, 'transaction'])->middleware(['auth']);
//
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('api/getUsers', [TestFetshdata::class, 'getUsers']);
});



Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/users', function(){
        return Inertia::render('GestionUsers');
    })->name('GestionUsers.index');

    Route::get('/dashboard', function(){
        return Inertia::render('AdminDash');
    })->name('admindash.index');

    Route::get('/rewards', function(){
        return Inertia::render('CreateRewardsAdmin');
    })->name('CreateRewardsAdmin.index');

    Route::get('/EditUser/{userId}', function($userId) {
        return Inertia::render('AdminUserManagement', [
            'userId' => $userId
        ]);
    })->name('AdminUserManagement.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('adminprofile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('adminprofile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('adminprofile.destroy');
    Route::delete('/deleteUser', [AdminController::class, 'deleteUserById'])->name('admindeletionuser.destroy');
    Route::get('/getusers', [AdminUserController::class, 'index']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
    Route::post('/Createrewards', [RewardCreateAdmin::class, 'store']);


    // Transaction routes
    Route::post('/users/{id}/transactions', [AdminUserController::class, 'addTransaction']);
    Route::get('/users/{id}/transactions', [AdminUserController::class, 'getUserTransactions']);
    
    // Loyalty level routes
    Route::get('/loyalty-levels', [AdminUserController::class, 'getLoyaltyLevels']);
});




require __DIR__.'/auth.php';