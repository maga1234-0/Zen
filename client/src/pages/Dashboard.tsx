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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl border border-gray-100 dark:border-slate-700"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-seafoam-50 via-teal-50 to-cyan-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 opacity-50" />
          
          {/* Decorative Elements */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-seafoam-400/20 to-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-cyan-400/20 to-seafoam-500/20 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-seafoam-600 via-teal-600 to-cyan-600 dark:from-seafoam-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                📈 Booking Trends
              </h3>
              <span className="text-xs font-medium text-gray-500 dark:text-slate-400 bg-white/80 dark:bg-slate-700/80 px-3 py-1 rounded-full">
                Last 30 Days
              </span>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={bookingTrends}>
                <defs>
                  <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.8}/>
                    <stop offset="50%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                  </linearGradient>
                  <filter id="bookingShadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#14B8A6" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb" 
                  className="dark:stroke-slate-600" 
                  opacity={0.3}
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af" 
                  className="dark:stroke-slate-400"
                  style={{ fontSize: '11px', fontWeight: 500 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  className="dark:stroke-slate-400"
                  style={{ fontSize: '11px', fontWeight: 500 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(20, 184, 166, 0.2)',
                    padding: '12px 16px',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                  labelStyle={{ color: '#0f766e', marginBottom: '4px' }}
                  formatter={(value: any) => [`${value} bookings`, '']}
                  cursor={{ stroke: '#14B8A6', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  fill="url(#bookingGradient)"
                  stroke="none"
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="url(#bookingGradient)"
                  strokeWidth={3}
                  dot={{ 
                    fill: '#14B8A6', 
                    r: 5, 
                    strokeWidth: 3, 
                    stroke: '#fff',
                    filter: 'url(#bookingShadow)'
                  }}
                  activeDot={{ 
                    r: 7, 
                    fill: '#0d9488', 
                    strokeWidth: 4, 
                    stroke: '#fff',
                    filter: 'url(#bookingShadow)'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl border border-gray-100 dark:border-slate-700"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 opacity-50" />
          
          {/* Decorative Elements */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-fuchsia-400/20 to-violet-500/20 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                💰 Revenue Analytics
              </h3>
              <span className="text-xs font-medium text-gray-500 dark:text-slate-400 bg-white/80 dark:bg-slate-700/80 px-3 py-1 rounded-full">
                Last 6 Months
              </span>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="50%" stopColor="#A855F7" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#D946EF" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                  </linearGradient>
                  <filter id="revenueShadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#8B5CF6" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb" 
                  className="dark:stroke-slate-600" 
                  opacity={0.3}
                  vertical={false}
                />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af" 
                  className="dark:stroke-slate-400"
                  style={{ fontSize: '11px', fontWeight: 500 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  className="dark:stroke-slate-400"
                  style={{ fontSize: '11px', fontWeight: 500 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(139, 92, 246, 0.2)',
                    padding: '12px 16px',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                  labelStyle={{ color: '#7c3aed', marginBottom: '4px' }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                  cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
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
                  radius={[8, 8, 0, 0]}
                  maxBarSize={40}
                  animationDuration={1000}
                  animationBegin={300}
                  filter="url(#revenueShadow)"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ 
                    fill: '#A855F7', 
                    r: 5, 
                    strokeWidth: 3, 
                    stroke: '#fff',
                    filter: 'url(#revenueShadow)'
                  }}
                  activeDot={{ 
                    r: 7, 
                    fill: '#7c3aed', 
                    strokeWidth: 4, 
                    stroke: '#fff',
                    filter: 'url(#revenueShadow)'
                  }}
                  animationDuration={2000}
                  animationBegin={600}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
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
