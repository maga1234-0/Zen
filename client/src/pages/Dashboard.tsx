import { useQuery } from '@tantml:parameter>
import { DollarSign, Calendar, TrendingUp, Home, Users, Bed, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatCardMinimal } from '@/components/dashboard/StatCardMinimal';
import { ChartContainer } from '@/components/dashboard/ChartContainer';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { Card } from '@/components/ui/Card';
import api from '@/services/api';
import { DashboardStats, BookingTrend, RevenueData } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { useCurrencyFormat } from '@/utils/currency';
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
  BarChart,
} from 'recharts';

// Minimal color palette for charts
const CHART_COLORS = {
  primary: '#6B7280',
  secondary: '#9CA3AF',
  positive: '#10B981',
  negative: '#EF4444',
  grid: '#E5E7EB',
  neutral: ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB'],
};

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
const HousekeepingDashboard = () => {
  const { data: rooms } = useQuery({
    queryKey: ['rooms-housekeeping'],
    queryFn: async () => {
      const res = await api.get('/rooms');
      return res.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Calculate statistics from real room data
  const dirtyRooms = rooms?.filter((r: any) => r.status === 'dirty').length || 0;
  const cleaningRooms = rooms?.filter((r: any) => r.status === 'cleaning').length || 0;
  const cleanedToday = rooms?.filter((r: any) => 
    r.status === 'clean' && 
    new Date(r.updated_at).toDateString() === new Date().toDateString()
  ).length || 0;
  const totalRooms = rooms?.length || 0;

  // Get rooms that need attention
  const tasksToShow = rooms?.filter((r: any) => 
    ['dirty', 'cleaning'].includes(r.status)
  ).slice(0, 10) || [];

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Housekeeping Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-slate-300">Manage room cleaning and maintenance tasks</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <StatCard title="Dirty Rooms" value={dirtyRooms} icon={Clock} color="bg-yellow-400" />
        <StatCard title="In Progress" value={cleaningRooms} icon={Sparkles} color="bg-blue-400" />
        <StatCard title="Cleaned Today" value={cleanedToday} icon={CheckCircle} color="bg-green-400" />
        <StatCard title="Total Rooms" value={totalRooms} icon={Bed} color="bg-purple-400" />
      </div>

      <Card>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">Today's Tasks</h3>
        <div className="space-y-2 sm:space-y-3">
          {tasksToShow.length > 0 ? (
            tasksToShow.map((room: any) => (
              <div key={room.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-mint-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white">Room {room.room_number}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-300">
                      {room.room_type} - {room.status === 'dirty' ? 'Needs cleaning' : 'Being cleaned'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 sm:px-3 py-1 rounded-full w-fit ${
                  room.status === 'cleaning' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                }`}>
                  {room.status === 'dirty' ? 'Pending' : 'In Progress'}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>All rooms are clean! 🎉</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

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
const AccountantDashboard = ({ stats, revenueData }: any) => {
  const { formatPrice } = useCurrencyFormat();
  
  return (
  <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
    <div>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Financial Dashboard</h1>
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-300">Monitor revenue and financial metrics</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      <StatCard
        title="Monthly Revenue"
        value={formatPrice(stats?.revenue || 0)}
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
            formatter={(value: any) => [formatPrice(value), 'Revenue']}
            contentStyle={{ fontSize: '12px' }}
          />
          <Area type="monotone" dataKey="revenue" fill="url(#revenueGradient)" stroke="none" />
          <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  </div>
);
}; // ← Ajout de l'accolade fermante manquante

// Restaurant Chef Dashboard - Focus on kitchen orders
const RestaurantChefDashboard = () => {
  const { formatPrice } = useCurrencyFormat();
  const { data: restaurantStats } = useQuery({
    queryKey: ['restaurant-stats'],
    queryFn: async () => {
      const res = await api.get('/restaurant/stats');
      return res.data;
    },
    refetchInterval: 15000, // Rafraîchir toutes les 15 secondes pour la cuisine
  });

  const { data: activeOrders } = useQuery({
    queryKey: ['restaurant-orders-active'],
    queryFn: async () => {
      const res = await api.get('/restaurant/orders?status=pending,preparing,ready');
      return res.data;
    },
    refetchInterval: 10000, // Rafraîchir toutes les 10 secondes
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          🍳 Tableau de Bord - Chef
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-slate-300">
          Gérez les commandes et la production de la cuisine
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Commandes en Attente"
          value={activeOrders?.filter((o: any) => o.status === 'pending').length || 0}
          icon={Clock}
          color="bg-yellow-400"
        />
        <StatCard
          title="En Préparation"
          value={activeOrders?.filter((o: any) => o.status === 'preparing').length || 0}
          icon={CheckCircle}
          color="bg-orange-400"
        />
        <StatCard
          title="Prêtes à Servir"
          value={activeOrders?.filter((o: any) => o.status === 'ready').length || 0}
          icon={CheckCircle}
          color="bg-green-400"
        />
      </div>

      <Card>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
          📋 Commandes Actives
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {activeOrders && activeOrders.length > 0 ? (
            activeOrders.slice(0, 10).map((order: any) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-mint-50 dark:bg-slate-700 rounded-lg"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white">
                    {order.order_number}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-300">
                    {order.order_type === 'dine_in' && `Table ${order.table_number}`}
                    {order.order_type === 'room_service' && `Chambre ${order.room_number}`}
                    {order.order_type === 'takeaway' && 'À emporter'}
                    {order.order_type === 'bar' && 'Bar'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    {new Date(order.created_at).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        : order.status === 'preparing'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    }`}
                  >
                    {order.status === 'pending' && 'En attente'}
                    {order.status === 'preparing' && 'En cours'}
                    {order.status === 'ready' && 'Prête'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
              Aucune commande active
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
          📊 Statistiques de Production
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {restaurantStats?.orders?.completed_today || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Plats Servis Aujourd'hui</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {restaurantStats?.orders?.active_orders || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Commandes Actives</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Restaurant Server Dashboard - Focus on taking orders
const RestaurantServerDashboard = () => {
  const { formatPrice } = useCurrencyFormat();
  const { data: restaurantStats } = useQuery({
    queryKey: ['restaurant-stats'],
    queryFn: async () => {
      const res = await api.get('/restaurant/stats');
      return res.data;
    },
    refetchInterval: 30000,
  });

  const { data: myOrders } = useQuery({
    queryKey: ['my-restaurant-orders'],
    queryFn: async () => {
      const res = await api.get('/restaurant/orders');
      return res.data;
    },
    refetchInterval: 15000,
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          🍽️ Tableau de Bord - Serveur
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-slate-300">
          Prenez les commandes et servez les clients
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Tables Disponibles"
          value={restaurantStats?.tables?.available_tables || 0}
          icon={CheckCircle}
          color="bg-green-400"
        />
        <StatCard
          title="Mes Commandes Actives"
          value={myOrders?.filter((o: any) => ['pending', 'preparing', 'ready'].includes(o.status)).length || 0}
          icon={Clock}
          color="bg-orange-400"
        />
        <StatCard
          title="Commandes Servies"
          value={myOrders?.filter((o: any) => o.status === 'served').length || 0}
          icon={CheckCircle}
          color="bg-blue-400"
        />
      </div>

      <Card>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
          📋 Mes Dernières Commandes
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {myOrders && myOrders.length > 0 ? (
            myOrders.slice(0, 8).map((order: any) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-mint-50 dark:bg-slate-700 rounded-lg"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white">
                    {order.order_number}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-300">
                    {order.order_type === 'dine_in' && `Table ${order.table_number}`}
                    {order.order_type === 'room_service' && `Chambre ${order.room_number}`}
                    • {formatPrice(order.total_amount)}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    ['pending', 'preparing'].includes(order.status)
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      : order.status === 'ready'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                  }`}
                >
                  {order.status === 'pending' && 'En attente'}
                  {order.status === 'preparing' && 'En cours'}
                  {order.status === 'ready' && 'Prête'}
                  {order.status === 'served' && 'Servie'}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
              Aucune commande
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Restaurant Cashier Dashboard - Focus on payments
const RestaurantCashierDashboard = () => {
  const { formatPrice } = useCurrencyFormat();
  const { data: restaurantStats } = useQuery({
    queryKey: ['restaurant-stats'],
    queryFn: async () => {
      const res = await api.get('/restaurant/stats');
      return res.data;
    },
    refetchInterval: 30000,
  });

  const { data: pendingPayments } = useQuery({
    queryKey: ['restaurant-orders-payment'],
    queryFn: async () => {
      const res = await api.get('/restaurant/orders?payment_status=pending');
      return res.data;
    },
    refetchInterval: 15000,
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          💳 Tableau de Bord - Caissier
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-slate-300">
          Gérez les paiements et les transactions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Revenus du Jour"
          value={formatPrice(parseFloat(restaurantStats?.orders?.total_revenue || 0))}
          icon={DollarSign}
          color="bg-green-400"
        />
        <StatCard
          title="Paiements en Attente"
          value={pendingPayments?.length || 0}
          icon={Clock}
          color="bg-yellow-400"
        />
        <StatCard
          title="Transactions Aujourd'hui"
          value={restaurantStats?.orders?.completed_today || 0}
          icon={CheckCircle}
          color="bg-blue-400"
        />
      </div>

      <Card>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
          💰 Paiements en Attente
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {pendingPayments && pendingPayments.length > 0 ? (
            pendingPayments.slice(0, 10).map((order: any) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-mint-50 dark:bg-slate-700 rounded-lg"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white">
                    {order.order_number}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-300">
                    {order.order_type === 'dine_in' && `Table ${order.table_number}`}
                    {order.order_type === 'room_service' && `Chambre ${order.room_number}`}
                    {order.order_type === 'takeaway' && 'À emporter'}
                    {order.order_type === 'bar' && 'Bar'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatPrice(order.total_amount)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                    À payer
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
              Aucun paiement en attente
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Restaurant Manager Dashboard - Full overview
const RestaurantManagerDashboard = () => {
  const { formatPrice } = useCurrencyFormat();
  const { data: restaurantStats } = useQuery({
    queryKey: ['restaurant-stats'],
    queryFn: async () => {
      const res = await api.get('/restaurant/stats');
      return res.data;
    },
    refetchInterval: 30000,
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          👨‍💼 Tableau de Bord - Manager Restaurant
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-slate-300">
          Vue d'ensemble de toutes les opérations du restaurant
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Commandes Actives"
          value={restaurantStats?.orders?.active_orders || 0}
          icon={Clock}
          color="bg-orange-400"
        />
        <StatCard
          title="Revenus du Jour"
          value={formatPrice(parseFloat(restaurantStats?.orders?.total_revenue || 0))}
          icon={DollarSign}
          color="bg-green-400"
        />
        <StatCard
          title="Tables Disponibles"
          value={`${restaurantStats?.tables?.available_tables || 0}/${restaurantStats?.tables?.total_tables || 0}`}
          icon={Users}
          color="bg-blue-400"
        />
        <StatCard
          title="Clients Aujourd'hui"
          value={restaurantStats?.orders?.unique_customers || 0}
          icon={Users}
          color="bg-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
            📊 Performance du Jour
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-mint-50 dark:bg-slate-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">Commandes Terminées</span>
              <span className="text-lg font-bold text-gray-800 dark:text-white">
                {restaurantStats?.orders?.completed_today || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-mint-50 dark:bg-slate-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">Ticket Moyen</span>
              <span className="text-lg font-bold text-gray-800 dark:text-white">
                {formatPrice(parseFloat(restaurantStats?.orders?.average_order_value || 0))}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-mint-50 dark:bg-slate-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">Taux d'Occupation</span>
              <span className="text-lg font-bold text-gray-800 dark:text-white">
                {restaurantStats?.tables?.occupancy_rate || 0}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
            ⚡ Vue Rapide
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">Commandes en Attente</span>
              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {restaurantStats?.orders?.pending_orders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">En Préparation</span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {restaurantStats?.orders?.preparing_orders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">Prêtes à Servir</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {restaurantStats?.orders?.ready_orders || 0}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { formatPrice } = useCurrencyFormat();

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data;
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    refetchOnWindowFocus: true, // Rafraîchir quand la fenêtre reprend le focus
  });

  const { data: bookingTrends } = useQuery<BookingTrend[]>({
    queryKey: ['booking-trends'],
    queryFn: async () => {
      const res = await api.get('/dashboard/booking-trends');
      return res.data;
    },
    refetchInterval: 60000, // Rafraîchir toutes les 60 secondes
    refetchOnWindowFocus: true,
  });

  const { data: revenueData } = useQuery<RevenueData[]>({
    queryKey: ['revenue-analytics'],
    queryFn: async () => {
      const res = await api.get('/dashboard/revenue-analytics');
      return res.data;
    },
    refetchInterval: 60000, // Rafraîchir toutes les 60 secondes
    refetchOnWindowFocus: true,
  });

  const { data: recentActivities } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const res = await api.get('/dashboard/recent-activities');
      return res.data;
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    refetchOnWindowFocus: true,
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

  // Restaurant roles
  if (user?.role === 'restaurant_chef') {
    return <RestaurantChefDashboard />;
  }

  if (user?.role === 'restaurant_server') {
    return <RestaurantServerDashboard />;
  }

  if (user?.role === 'restaurant_cashier') {
    return <RestaurantCashierDashboard />;
  }

  if (user?.role === 'restaurant_manager') {
    return <RestaurantManagerDashboard />;
  }

  // Fetch restaurant stats for Admin/Manager
  const { data: restaurantStats } = useQuery({
    queryKey: ['restaurant-stats'],
    queryFn: async () => {
      const res = await api.get('/restaurant/stats');
      return res.data;
    },
    refetchInterval: 30000,
    enabled: user?.role === 'admin' || user?.role === 'manager',
  });

  // Fetch spa stats for Admin/Manager
  const { data: spaStats } = useQuery({
    queryKey: ['spa-stats'],
    queryFn: async () => {
      const res = await api.get('/spa/stats');
      return res.data;
    },
    refetchInterval: 30000,
    enabled: user?.role === 'admin' || user?.role === 'manager',
  });

  // Admin and Manager see the full dashboard
  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-gray-50 dark:bg-slate-900">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
          {user?.role === 'admin' ? 'Tableau de Bord Admin' : 'Tableau de Bord Manager'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 mt-1">
          Vue d'ensemble complète de toutes les opérations
        </p>
      </div>

      {/* Stats Grid - Hotel */}
      <div>
        <h2 className="text-base font-medium text-gray-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <span className="text-gray-400">🏨</span> Hôtel
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCardMinimal
            label="Total Réservations"
            value={stats?.totalBookings || 0}
            change={12}
            icon={Calendar}
            description="30 derniers jours"
          />
          <StatCardMinimal
            label="Revenus"
            value={formatPrice(stats?.revenue || 0)}
            change={8}
            icon={DollarSign}
            description="30 derniers jours"
          />
          <StatCardMinimal
            label="Taux d'Occupation"
            value={`${stats?.occupancyRate || 0}%`}
            change={5}
            icon={TrendingUp}
          />
          <StatCardMinimal
            label="Chambres Disponibles"
            value={stats?.availableRooms || 0}
            icon={Home}
          />
        </div>
      </div>

      {/* Stats Grid - Restaurant */}
      <div>
        <h2 className="text-base font-medium text-gray-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <span className="text-gray-400">🍽️</span> Restaurant
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCardMinimal
            label="Commandes Actives"
            value={restaurantStats?.orders?.active_orders || 0}
            icon={Clock}
          />
          <StatCardMinimal
            label="Revenus du Jour"
            value={formatPrice(parseFloat(restaurantStats?.orders?.total_revenue || 0))}
            icon={DollarSign}
          />
          <StatCardMinimal
            label="Tables Disponibles"
            value={`${restaurantStats?.tables?.available_tables || 0}/${restaurantStats?.tables?.total_tables || 0}`}
            icon={Users}
          />
          <StatCardMinimal
            label="Commandes Terminées"
            value={restaurantStats?.orders?.completed_today || 0}
            icon={CheckCircle}
          />
        </div>
      </div>

      {/* Stats Grid - Spa */}
      <div>
        <h2 className="text-base font-medium text-gray-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <span className="text-gray-400">💆</span> Spa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCardMinimal
            label="Réservations Actives"
            value={spaStats?.bookings?.active_bookings || 0}
            icon={Clock}
          />
          <StatCardMinimal
            label="Revenus du Jour"
            value={formatPrice(parseFloat(spaStats?.bookings?.total_revenue || 0))}
            icon={DollarSign}
          />
          <StatCardMinimal
            label="Réservations Terminées"
            value={spaStats?.bookings?.completed_today || 0}
            icon={CheckCircle}
          />
          <StatCardMinimal
            label="Thérapeutes Disponibles"
            value={spaStats?.therapists?.available_therapists || 0}
            icon={Users}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Booking Trends */}
        <ChartContainer 
          title="Tendances des Réservations"
          subtitle="30 derniers jours"
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={bookingTrends}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={CHART_COLORS.grid}
                opacity={0.5}
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                stroke={CHART_COLORS.secondary}
                style={{ fontSize: '11px' }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.grid }}
              />
              <YAxis 
                stroke={CHART_COLORS.secondary}
                style={{ fontSize: '11px' }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.grid }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: `1px solid ${CHART_COLORS.grid}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                formatter={(value: any) => [`${value} réservations`, '']}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: CHART_COLORS.primary }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Revenue Analytics */}
        <ChartContainer 
          title="Analyse des Revenus"
          subtitle="6 derniers mois"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={CHART_COLORS.grid}
                opacity={0.5}
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                stroke={CHART_COLORS.secondary}
                style={{ fontSize: '11px' }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.grid }}
              />
              <YAxis 
                stroke={CHART_COLORS.secondary}
                style={{ fontSize: '11px' }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.grid }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: `1px solid ${CHART_COLORS.grid}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                formatter={(value: any) => [formatPrice(value), '']}
              />
              <Bar 
                dataKey="revenue" 
                fill={CHART_COLORS.primary}
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Restaurant & Spa Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Restaurant Details */}
        <ChartContainer title="Restaurant - Détails">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">Commandes en Attente</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {restaurantStats?.orders?.pending_orders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">En Préparation</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {restaurantStats?.orders?.preparing_orders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">Ticket Moyen</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPrice(parseFloat(restaurantStats?.orders?.average_order_value || 0))}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">Taux d'Occupation</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {restaurantStats?.tables?.occupancy_rate || 0}%
              </span>
            </div>
          </div>
        </ChartContainer>

        {/* Spa Details */}
        <ChartContainer title="Spa - Détails">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">Réservations en Cours</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {spaStats?.bookings?.in_progress || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">Prochaines 24h</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {spaStats?.bookings?.upcoming_24h || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">Revenu Moyen/Service</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPrice(parseFloat(spaStats?.bookings?.average_booking_value || 0))}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-slate-300">Taux d'Occupation</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {spaStats?.therapists?.occupancy_rate || 0}%
              </span>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* AI Insights Section */}
      <AIInsights />
    </div>
  );
};
