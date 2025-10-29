import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/Components/Spinner";

export default function Rewards() {
    const [user, setUser] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [flash, setFlash] = useState({});
    const [claimingId, setClaimingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        axios.get("/api/rewards")
            .then((res) => {
                setUser(res.data.user);
                setRewards(res.data.rewards);
            })
            .catch((err) => {
                setFlash({ error: "Failed to fetch rewards." });
                setShowFlash(true);
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (flash.success || flash.error) {
            setShowFlash(true);
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleClaim = (rewardId) => {
        if (!confirm("Are you sure you want to claim this reward?")) return;
    
        setClaimingId(rewardId);
    
        axios.post(`/api/rewards/claim/${rewardId}`)
            .then((res) => {
                setFlash({ success: res.data.message });
                setShowFlash(true);
                // re-fetch latest user & rewards
                return axios.get("/api/rewards");
            })
            .then((res) => {
                setUser(res.data.user);
                setRewards(res.data.rewards);
            })
            .catch((err) => {
                setFlash({
                    error: err.response?.data?.error || "Something went wrong."
                });
                setShowFlash(true);
            })
            .finally(() => {
                setClaimingId(null);
            });
    };
    
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17a3 3 0 015-2.236z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M10 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        Available Rewards
                    </h2>
                  
                </div>
            }
        >
            <Head title="Rewards" />

            {/* Flash Messages */}
            <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${showFlash ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                {flash.success && (
                    <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center max-w-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {flash.success}
                        <button onClick={() => setShowFlash(false)} className="ml-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
                {flash.error && (
                    <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center max-w-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {flash.error}
                        <button onClick={() => setShowFlash(false)} className="ml-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            ) : (
                <div className="max-w-7xl mx-auto py-8">
                    {rewards.length > 0 ? (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {rewards.map((reward) => {
                                const isClaiming = claimingId === reward.id;
                                const notEnoughPoints = user?.points_balance < reward.points_cost;

                                return (
                                    <div
                                        key={reward.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-md"
                                    >
                                        <div className="relative">
                                            {reward.image_reward_path ? (
                                                <img
                                                    src={`/storage/${reward.image_reward_path}`}
                                                    alt={reward.title_reward}
                                                    className="w-full h-48 object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-80" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17a3 3 0 015-2.236z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 bg-orange-50 dark:bg-gray-700 px-3 py-1 rounded-full text-orange-600 dark:text-orange-400 font-bold text-sm flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                </svg>
                                                {reward.points_cost}
                                            </div>
                                        </div>

                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{reward.title_reward}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">{reward.description_reward}</p>

                                            <div className="mt-auto">
                                                {notEnoughPoints ? (
                                                    <div className="w-full bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-lg text-center">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">You need {reward.points_cost - user.points_balance} more points</div>
                                                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-orange-500 rounded-full" 
                                                                style={{ width: `${Math.min(100, (user.points_balance / reward.points_cost) * 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        disabled={isClaiming}
                                                        onClick={() => handleClaim(reward.id)}
                                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                                    >
                                                        {isClaiming ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                Claim Reward
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-6">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">No Rewards Available</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                There are no rewards available at the moment. Please check back later for exciting new offerings!
                            </p>
                        </div>
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
}