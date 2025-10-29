import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Star, CreditCard, Target, Gift
} from 'lucide-react';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    user: null,
    transactions: [],
    availableRewards: [],
    loyaltyLevel: null,
    pointsToNextLevel: 0,
    monthlyPointsData: [],
    pointsByCategoryData: [],
    userRank: {},
    loading: true,
  });

  const displayLevelName = () => {
    return dashboardData.loyaltyLevel?.name_loyalty || 'Basic';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user/dashboard');
        const data = await response.json();
        setDashboardData({ ...data, loading: false });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, []);

  const ORANGE_COLORS = ['#FF7700', '#FF922B', '#FFA94D', '#FFC078', '#FFD8A8'];

  const formatPoints = (points) =>
    points?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";

  if (dashboardData.loading) {
    return (
      <AuthenticatedLayout>
        <Head title="Dashboard" />
        <div className="flex items-center justify-center min-h-[70vh] text-gray-600">
          Loading dashboard...
        </div>
      </AuthenticatedLayout>
    );
  }

  const { user, loyaltyLevel, pointsToNextLevel, monthlyPointsData, pointsByCategoryData, userRank, availableRewards } = dashboardData;

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      <div className="bg-gray-50 min-h-screen p-6 space-y-8">

        {/* Welcome */}
        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition-all">
        <div className="flex items-center space-x-3">
  <img src="/storage/Welcome.jpg" alt="Welcome" className="h-10 w-10 object-contain" />
  <h2 className="text-3xl font-extrabold text-gray-900">Welcome, {user?.name}!</h2>
</div>         
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Loyalty Level */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all flex flex-col items-center">
            <Star className="h-10 w-10 text-orange-500 mb-3" />
            <h4 className="text-gray-600 text-sm mb-1">Current Level</h4>
            <p className="text-2xl font-bold text-gray-900">{displayLevelName()}</p>
            <p className="text-xs text-gray-500 text-center mt-2">{loyaltyLevel?.description_loyalty}</p>
          </div>

          {/* Current Points */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all flex flex-col items-center">
            <CreditCard className="h-10 w-10 text-orange-500 mb-3" />
            <h4 className="text-gray-600 text-sm mb-1">Points Balance</h4>
            <p className="text-2xl font-bold text-gray-900">{formatPoints(user?.points_balance)}</p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {pointsToNextLevel > 0 ? `${formatPoints(pointsToNextLevel)} points to next level` : 'You reached the highest level!'}
            </p>
          </div>

          {/* Ranking */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all flex flex-col items-center">
            <Target className="h-10 w-10 text-orange-500 mb-3" />
            <h4 className="text-gray-600 text-sm mb-1">Your Ranking</h4>
            <p className="text-2xl font-bold text-gray-900">Top {userRank?.percentile || 0}%</p>
            <p className="text-xs text-gray-500 text-center mt-2">
              #{userRank?.rank || 0} of {userRank?.totalUsers || 0} members
            </p>
          </div>

        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Line Chart - Points History */}
        {/* Charts Section */}
<div className="space-y-6">
</div>


        </div>
        {/*hello*/}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all w-full">
  <div className="flex justify-between items-center mb-4">
    <h4 className="text-lg font-bold text-gray-900">Points History (Last 6 Days)</h4>
    <a 
      href="/transaction"
      className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm"
    >
      <span>View All</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  </div>
  <div className="h-72 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dashboardData.dailyPointsData || []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="points" stroke="#FF7700" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
        {/* Available Rewards */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Available Rewards</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableRewards.length > 0 ? (
              availableRewards.slice(0, 3).map((reward, idx) => (
                <div key={idx} className="bg-gray-100 p-4 rounded-xl flex flex-col items-center hover:bg-orange-100 transition-all">
                  <Gift className="h-8 w-8 text-orange-500 mb-2" />
                  <h5 className="text-gray-900 font-semibold">{reward.title_reward}</h5>
                  <p className="text-sm text-gray-600">{formatPoints(reward.points_cost)} points</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No rewards available currently.</p>
            )}
          </div>
        </div>

      </div>
    </AuthenticatedLayout>
  );
}
