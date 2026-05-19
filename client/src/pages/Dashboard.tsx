import { useQuery } from '@tanstack/react-query';
import { DollarSign, Calendar, TrendingUp, Home, Users, Bed, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import api from '@/services/api';
import { DashboardStats, BookingTrend, RevenueData } from '@/types';
import { useAuthStore } from '@/store/authStore';
import {
  LineChart,
  Line,
  Bar,
  Area,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#20B2AA', '#FFD700', '#8B7D6B', '#F0FFF4'];

// Receptionist Dashboard - Focus on bookings and guests
const ReceptionistDashboard = ({ stats, recentActivities }: any) => (
  <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
    <div>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Welcome, Receptionist!</h1>
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-300">Manage check-ins, bookings, and guest services</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      <StatCard
        title="Today's Check-ins"
        value={stats?.totalBookings || 0}
        icon={Calendar}
        color="bg-blue-400"
      />
      <StatCard
        title="Available Rooms"
        value={stats?.availableRooms || 0}
        icon={Home}
        color="bg-green-400"
      />
      <StatCard
        title="Total Guests"
        value={stats?.totalBookings || 0}
        icon={Users}
        color="bg-purple-400"
      />
    </div>

    <Card>
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
        Recent Bookings
      </h3>
      <div className="space-y-2 sm:space-y-3">
        {recentActivities?.slice(0, 5).map((activity: any) => (
          <div
            key={activity.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-mint-50 dark:bg-slate-700 rounded-lg"
          >
            <div className="mb-2 sm:mb-0">
              <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">{activity.guest_name}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-300">Room {activity.room_number}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 w-fit">
              {activity.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// Housekeeping Dashboard - Focus on room status and cleaning tasks
const HousekeepingDashboard = () => (
  <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
    <div>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Housekeeping Dashboard</h1>
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-300">Manage room cleaning and maintenance tasks</p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      <StatCard title="Pending Tasks" value={5} icon={Clock} color="bg-yellow-400" />
      <StatCard title="In Progress" value={3} icon={Sparkles} color="bg-blue-400" />
      <StatCard title="Completed Today" value={12} icon={CheckCircle} color="bg-green-400" />
      <StatCard title="Total Rooms" value={20} icon={Bed} color="bg-purple-400" />
    </div>

    <Card>
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">Today's Tasks</h3>
      <div className="space-y-2 sm:space-y-3">
        {[
          { room: '101', status: 'pending', task: 'Deep cleaning' },
          { room: '205', status: 'in_progress', task: 'Standard cleaning' },
          { room: '301', status: 'completed', task: 'Turnover service' },
        ].map((task, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-mint-50 dark:bg-slate-700 rounded-lg">
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
              <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <div>
                <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white">Room {task.room}</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-300">{task.task}</p>
              </div>
            </div>
            <span className={`text-xs px-2 sm:px-3 py-1 rounded-full w-fit ${
              task.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
              task.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
            }`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// Maintenance Dashboard - Focus on maintenance alerts
const MaintenanceDashboard = () => (
  <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
    <div>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Maintenance Dashboard</h1>
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-300">Track and resolve maintenance issues</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      <StatCard title="Urgent Issues" value={2} icon={AlertCircle} color="bg-red-400" />
      <StatCard title="In Progress" value={4} icon={Clock} color="bg-yellow-400" />
      <StatCard title="Resolved Today" value={8} icon={CheckCircle} color="bg-green-400" />
    </div>

    <Card>
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">Active Maintenance Requests</h3>
      <div className="space-y-2 sm:space-y-3">
        {[
          { room: '301', issue: 'AC not working', priority: 'urgent' },
          { room: '205', issue: 'Leaking faucet', priority: 'high' },
          { room: '102', issue: 'Light bulb replacement', priority: 'normal' },
        ].map((request, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-mint-50 dark:bg-slate-700 rounded-lg">
            <div className="mb-2 sm:mb-0">
              <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white">Room {request.room}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-300">{request.issue}</p>
            </div>
            <span className={`text-xs px-2 sm:px-3 py-1 rounded-full w-fit ${
              request.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
              request.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
              'bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-slate-200'
            }`}>
              {request.priority}
            </span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// Accountant Dashboard - Focus on financial data
const AccountantDashboard = ({ stats, revenueData }: any) => (
  <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
    <div>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Financial Dashboard</h1>
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-300">Monitor revenue and financial metrics</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      <StatCard
        title="Monthly Revenue"
        value={`$${stats?.revenue?.toFixed(2) || 0}`}
        icon={DollarSign}
        color="bg-green-400"
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Total Bookings"
        value={stats?.totalBookings || 0}
        icon={Calendar}
        color="bg-blue-400"
      />
      <StatCard
        title="Occupancy Rate"
        value={`${stats?.occupancyRate || 0}%`}
        icon={TrendingUp}
        color="bg-purple-400"
      />
    </div>

    <Card>
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
        Revenue Trend (Last 6 Months)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={revenueData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="month" style={{ fontSize: '10px' }} />
          <YAxis style={{ fontSize: '10px' }} />
          <Tooltip 
            formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
            contentStyle={{ fontSize: '12px' }}
          />
          <Area type="monotone" dataKey="revenue" fill="url(#revenueGradient)" stroke="none" />
          <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  </div>
);

export const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data;
    },
  });

  const { data: bookingTrends } = useQuery<BookingTrend[]>({
    queryKey: ['booking-trends'],
    queryFn: async () => {
      const res = await api.get('/dashboard/booking-trends');
      return res.data;
    },
  });

  const { data: revenueData } = useQuery<RevenueData[]>({
    queryKey: ['revenue-analytics'],
    queryFn: async () => {
      const res = await api.get('/dashboard/revenue-analytics');
      return res.data;
    },
  });

  const { data: recentActivities } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const res = await api.get('/dashboard/recent-activities');
      return res.data;
    },
  });

  const roomStatusData = [
    { name: 'Available', value: stats?.availableRooms || 0 },
    { name: 'Occupied', value: (stats?.totalBookings || 0) - (stats?.availableRooms || 0) },
  ];

  // Render different dashboards based on role
  if (user?.role === 'receptionist') {
    return <ReceptionistDashboard stats={stats} recentActivities={recentActivities} />;
  }

  if (user?.role === 'housekeeping') {
    return <HousekeepingDashboard />;
  }

  if (user?.role === 'maintenance') {
    return <MaintenanceDashboard />;
  }

  if (user?.role === 'accountant') {
    return <AccountantDashboard stats={stats} revenueData={revenueData} />;
  }

  // Admin and Manager see the full dashboard
  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={Calendar}
          color="bg-seafoam-400"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Revenue (30 days)"
          value={`$${stats?.revenue.toFixed(2) || 0}`}
          icon={DollarSign}
          color="bg-gold-400"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats?.occupancyRate || 0}%`}
          icon={TrendingUp}
          color="bg-greybrown-400"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Available Rooms"
          value={stats?.availableRooms || 0}
          icon={Home}
          color="bg-seafoam-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Booking Trends */}
        <Card>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
            Booking Trends (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bookingTrends}>
              <defs>
                <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#20B2AA" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#20B2AA" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-greybrown-600" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                className="dark:stroke-greybrown-300"
                style={{ fontSize: '10px' }}
              />
              <YAxis 
                stroke="#6b7280" 
                className="dark:stroke-greybrown-300"
                style={{ fontSize: '10px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [value, 'Bookings']}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#20B2AA"
                strokeWidth={2}
                dot={{ fill: '#20B2AA', r: 3 }}
                activeDot={{ r: 5 }}
                fill="url(#bookingGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Analytics */}
        <Card>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
            Revenue Analytics (Last 6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-greybrown-600" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280" 
                className="dark:stroke-greybrown-300"
                style={{ fontSize: '10px' }}
              />
              <YAxis 
                stroke="#6b7280" 
                className="dark:stroke-greybrown-300"
                style={{ fontSize: '10px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #3B82F6',
                  borderRadius: '8px',
                  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
                  padding: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                fill="url(#revenueGradient)"
                stroke="none"
                animationDuration={1500}
                animationBegin={0}
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#barGradient)" 
                radius={[4, 4, 0, 0]}
                maxBarSize={30}
                animationDuration={1000}
                animationBegin={300}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 3, strokeWidth: 1, stroke: '#fff' }}
                activeDot={{ r: 5, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
                animationDuration={2000}
                animationBegin={600}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Room Occupancy */}
        <Card>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
            Room Occupancy
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={roomStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {roomStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
            Recent Activities
          </h3>
          <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
            {recentActivities?.map((activity: any) => (
              <div
                key={activity.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-mint-50 dark:bg-slate-700 rounded-lg"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">
                    {activity.guest_name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-300">
                    Room {activity.room_number} • {activity.status}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2">
                  <p className="text-xs sm:text-sm font-medium text-seafoam-600 dark:text-gold-400">
                    {new Date(activity.check_in_date).toLocaleDateString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === 'checked_in'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : activity.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-slate-200'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
