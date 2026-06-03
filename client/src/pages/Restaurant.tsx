import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UtensilsCrossed, Plus, Search, Filter, Clock, DollarSign,
  CheckCircle, XCircle, Coffee, Wine, ChefHat, Users, Edit, Trash2, X, Check
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreateOrderModal } from '@/components/restaurant/CreateOrderModal';
import { CreateTableModal } from '@/components/restaurant/CreateTableModal';
import { CreateReservationModal } from '@/components/restaurant/CreateReservationModal';
import EditReservationModal from '@/components/restaurant/EditReservationModal';
import api from '@/services/api';
import { useToastContext } from '@/App';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/utils/permissions';

type TabType = 'orders' | 'menu' | 'tables' | 'reservations';

interface MenuItem {
  id: string;
  name: string;
  name_fr?: string;
  description?: string;
  price: number;
  category_name: string;
  is_available: boolean;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  preparation_time?: number;
}

// Chef View - Simplified kitchen interface
const ChefView = () => {
  const toast = useToastContext();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>('pending,preparing,ready');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');

  // Fetch orders for kitchen
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['restaurant-orders-kitchen', filterStatus],
    queryFn: async () => {
      const params = filterStatus ? `?status=${filterStatus}` : '';
      const res = await api.get(`/restaurant/orders${params}`);
      return res.data;
    },
    enabled: activeTab === 'orders',
    refetchInterval: 10000, // Rafraîchir toutes les 10 secondes pour la cuisine
  });

  // Fetch menu items (read-only for chef)
  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['menu-items-chef'],
    queryFn: async () => {
      const res = await api.get('/restaurant/menu/items');
      return res.data;
    },
    enabled: activeTab === 'menu',
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.put(`/restaurant/orders/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders-kitchen'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-stats'] });
      toast.success('Statut de commande mis à jour!');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    },
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-700 dark:text-yellow-300', label: 'En attente' },
      preparing: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-700 dark:text-orange-300', label: 'En préparation' },
      ready: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300', label: 'Prête' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <ChefHat className="w-7 h-7 text-orange-500" />
          Cuisine - Vue Chef
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-slate-300">
          Gérez la préparation des commandes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b dark:border-slate-700">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-gray-500 dark:text-slate-400'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          Commandes
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'menu'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-gray-500 dark:text-slate-400'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          Menu
        </button>
      </div>

      {/* Content */}
      {activeTab === 'orders' && (
        <Card>
          <div className="p-4 border-b dark:border-slate-700">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterStatus('pending,preparing,ready')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'pending,preparing,ready'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
                }`}
              >
                Actives
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
                }`}
              >
                En attente
              </button>
              <button
                onClick={() => setFilterStatus('preparing')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'preparing'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
                }`}
              >
                En cours
              </button>
              <button
                onClick={() => setFilterStatus('ready')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'ready'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
                }`}
              >
                Prêtes
              </button>
            </div>
          </div>

          <div className="p-4">
            {ordersLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {orders.map((order: any) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`border-2 rounded-lg p-4 ${
                      order.status === 'pending'
                        ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20'
                        : order.status === 'preparing'
                        ? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20'
                        : 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                          {order.order_number}
                        </h3>
                        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                          {order.order_type === 'dine_in' && `🍽️ Table ${order.table_number}`}
                          {order.order_type === 'room_service' && `🏨 Chambre ${order.room_number}`}
                          {order.order_type === 'takeaway' && '📦 À emporter'}
                          {order.order_type === 'bar' && '🍸 Bar'}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="mb-3 text-xs text-gray-500 dark:text-slate-400">
                      ⏰ {new Date(order.created_at).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>

                    {/* Order items details */}
                    {order.items && order.items.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="bg-white dark:bg-slate-800 p-2 rounded border dark:border-slate-600">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-800 dark:text-white">
                                {item.quantity}x {item.item_name}
                              </span>
                              {item.preparation_time && (
                                <span className="text-xs text-gray-500 dark:text-slate-400">
                                  ⏱️ {item.preparation_time}min
                                </span>
                              )}
                            </div>
                            {item.special_instructions && (
                              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                📝 {item.special_instructions}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {order.special_instructions && (
                      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded">
                        <p className="text-xs text-blue-800 dark:text-blue-300">
                          <strong>Instructions:</strong> {order.special_instructions}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'preparing' })}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold"
                        >
                          ▶️ Commencer
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'ready' })}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold"
                        >
                          ✅ Prête
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <div className="flex-1 text-center py-2 bg-green-100 dark:bg-green-900/30 rounded font-bold text-green-700 dark:text-green-300">
                          ✅ Prête à servir
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-slate-400">Aucune commande active</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'menu' && (
        <Card className="p-4">
          {menuLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : menuItems && menuItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                      Temps Préparation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                  {menuItems.map((item: MenuItem) => (
                    <tr key={item.id} className={item.is_available ? '' : 'opacity-50'}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {item.category_name}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {item.preparation_time ? `⏱️ ${item.preparation_time} min` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.is_available
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                        }`}>
                          {item.is_available ? 'Disponible' : 'Indisponible'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UtensilsCrossed className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-slate-400">Aucun article dans le menu</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export const Restaurant = () => {
  const toast = useToastContext();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // If user is a chef, show simplified chef view
  if (user?.role === 'restaurant_chef') {
    return <ChefView />;
  }
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingTable, setEditingTable] = useState<any>(null);
  const [editingReservation, setEditingReservation] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    name_fr: '',
    description: '',
    price: '',
    category_id: '',
    is_available: true,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    preparation_time: '',
  });

  // Check user permissions
  const canCreateOrder = user?.role ? hasPermission(user.role, 'restaurant.orders.create') : false;
  const canUpdateMenu = user?.role ? hasPermission(user.role, 'restaurant.menu.update') : false;
  const canDeleteMenu = user?.role ? hasPermission(user.role, 'restaurant.menu.delete') : false;
  const canViewStats = user?.role ? hasPermission(user.role, 'restaurant.stats.view') : false;
  const canUpdateOrderStatus = user?.role ? hasPermission(user.role, 'restaurant.orders.update_status') : false;
  const canManageTables = user?.role ? hasPermission(user.role, 'restaurant.tables.create') : false;
  const canManageReservations = user?.role ? hasPermission(user.role, 'restaurant.reservations.create') : false;

  // Order form states
  const [orderForm, setOrderForm] = useState({
    order_type: 'room_service' as 'room_service' | 'dine_in' | 'takeaway' | 'bar',
    room_id: '',
    table_id: '',
    guest_id: '',
    booking_id: '',
    special_instructions: '',
  });
  const [orderItems, setOrderItems] = useState<Array<{
    menu_item_id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    special_instructions: string;
  }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch restaurant stats
  const { data: stats } = useQuery({
    queryKey: ['restaurant-stats'],
    queryFn: async () => {
      const res = await api.get('/restaurant/stats');
      return res.data;
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    refetchOnWindowFocus: true, // Rafraîchir quand la fenêtre reprend le focus
  });

  // Fetch orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['restaurant-orders', filterStatus],
    queryFn: async () => {
      const params = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
      const res = await api.get(`/restaurant/orders${params}`);
      return res.data;
    },
    enabled: activeTab === 'orders',
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    refetchOnWindowFocus: true, // Rafraîchir quand la fenêtre reprend le focus
  });

  // Fetch menu items
  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const res = await api.get('/restaurant/menu/items');
      return res.data;
    },
    enabled: activeTab === 'menu',
    refetchInterval: 60000, // Rafraîchir toutes les 60 secondes
    refetchOnWindowFocus: true, // Rafraîchir quand la fenêtre reprend le focus
  });

  // Fetch menu categories
  const { data: menuCategories } = useQuery({
    queryKey: ['menu-categories'],
    queryFn: async () => {
      const res = await api.get('/restaurant/menu/categories');
      return res.data;
    },
    enabled: activeTab === 'menu' || showMenuModal || showOrderModal,
  });

  // Fetch active bookings (occupied rooms) for order creation
  const { data: activeBookings } = useQuery({
    queryKey: ['active-bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings?status=checked_in');
      return res.data;
    },
    enabled: showOrderModal,
  });

  // Fetch menu items for order creation
  const { data: availableMenuItems } = useQuery({
    queryKey: ['available-menu-items'],
    queryFn: async () => {
      const res = await api.get('/restaurant/menu/items?available_only=true');
      return res.data;
    },
    enabled: showOrderModal,
  });

  // Fetch tables
  const { data: tables, isLoading: tablesLoading } = useQuery({
    queryKey: ['restaurant-tables'],
    queryFn: async () => {
      const res = await api.get('/restaurant/tables');
      return res.data;
    },
    enabled: activeTab === 'tables',
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    refetchOnWindowFocus: true, // Rafraîchir quand la fenêtre reprend le focus
  });

  // Fetch reservations
  const { data: reservations, isLoading: reservationsLoading } = useQuery({
    queryKey: ['table-reservations'],
    queryFn: async () => {
      const res = await api.get('/restaurant/reservations');
      return res.data;
    },
    enabled: activeTab === 'reservations',
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    refetchOnWindowFocus: true, // Rafraîchir quand la fenêtre reprend le focus
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.put(`/restaurant/orders/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-stats'] });
      toast.success('Statut de commande mis à jour!');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    },
  });

  // Create/Update menu item mutation
  const saveMenuItemMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingMenuItem) {
        const res = await api.put(`/restaurant/menu/items/${editingMenuItem.id}`, data);
        return res.data;
      } else {
        const res = await api.post('/restaurant/menu/items', data);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success(editingMenuItem ? 'Article modifié avec succès!' : 'Article créé avec succès!');
      setShowMenuModal(false);
      setEditingMenuItem(null);
      resetMenuForm();
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement');
    },
  });

  // Delete menu item mutation
  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/restaurant/menu/items/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Article supprimé avec succès!');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  const resetMenuForm = () => {
    setMenuFormData({
      name: '',
      name_fr: '',
      description: '',
      price: '',
      category_id: '',
      is_available: true,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      preparation_time: '',
    });
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuFormData({
      name: item.name || '',
      name_fr: item.name_fr || '',
      description: item.description || '',
      price: item.price.toString(),
      category_id: '', // Will be filled from backend data
      is_available: item.is_available,
      is_vegetarian: item.is_vegetarian || false,
      is_vegan: item.is_vegan || false,
      is_gluten_free: item.is_gluten_free || false,
      preparation_time: item.preparation_time?.toString() || '',
    });
    setShowMenuModal(true);
  };

  const handleSaveMenuItem = () => {
    if (!menuFormData.name || !menuFormData.price || !menuFormData.category_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const data = {
      ...menuFormData,
      price: parseFloat(menuFormData.price),
      preparation_time: menuFormData.preparation_time ? parseInt(menuFormData.preparation_time) : null,
    };

    saveMenuItemMutation.mutate(data);
  };

  // Order management functions
  const addItemToOrder = (item: any) => {
    const existingItem = orderItems.find(oi => oi.menu_item_id === item.id);
    if (existingItem) {
      setOrderItems(orderItems.map(oi => 
        oi.menu_item_id === item.id 
          ? { ...oi, quantity: oi.quantity + 1 }
          : oi
      ));
    } else {
      setOrderItems([...orderItems, {
        menu_item_id: item.id,
        item_name: item.name,
        quantity: 1,
        unit_price: item.price,
        special_instructions: '',
      }]);
    }
  };

  const removeItemFromOrder = (menu_item_id: string) => {
    setOrderItems(orderItems.filter(item => item.menu_item_id !== menu_item_id));
  };

  const updateItemQuantity = (menu_item_id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(menu_item_id);
    } else {
      setOrderItems(orderItems.map(item =>
        item.menu_item_id === menu_item_id ? { ...item, quantity } : item
      ));
    }
  };

  const calculateOrderTotal = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const service_charge = orderForm.order_type === 'room_service' ? subtotal * 0.15 : 0; // 15% for room service
    return {
      subtotal,
      tax,
      service_charge,
      total: subtotal + tax + service_charge,
    };
  };

  const resetOrderForm = () => {
    setOrderForm({
      order_type: 'room_service',
      room_id: '',
      table_id: '',
      guest_id: '',
      booking_id: '',
      special_instructions: '',
    });
    setOrderItems([]);
    setSelectedCategory('all');
  };

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/restaurant/orders', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-stats'] });
      toast.success('Commande créée avec succès!');
      setShowOrderModal(false);
      resetOrderForm();
    },
    onError: () => {
      toast.error('Erreur lors de la création de la commande');
    },
  });

  // Table mutations
  const createTableMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/restaurant/tables', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
      toast.success('Table créée avec succès!');
      setShowTableModal(false);
      setEditingTable(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  const updateTableMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put(`/restaurant/tables/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
      toast.success('Table modifiée avec succès!');
      setShowTableModal(false);
      setEditingTable(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    },
  });

  const deleteTableMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/restaurant/tables/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
      toast.success('Table supprimée avec succès!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Impossible de supprimer cette table');
    },
  });

  // Reservation mutations
  const createReservationMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/restaurant/reservations', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
      toast.success('Réservation créée avec succès!');
      setShowReservationModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création de la réservation');
    },
  });

  // Handlers pour réservations
  const handleEditReservation = (reservation: any) => {
    setEditingReservation(reservation);
    setIsEditModalOpen(true);
  };

  const handleSaveReservation = async (id: string, data: any) => {
    try {
      await api.put(`/restaurant/reservations/${id}`, data);
      queryClient.invalidateQueries({ queryKey: ['table-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
      toast.success('Réservation modifiée avec succès');
      setIsEditModalOpen(false);
      setEditingReservation(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
      throw error;
    }
  };

  const handleMarkArrived = async (id: string) => {
    try {
      await api.put(`/restaurant/reservations/${id}`, { status: 'seated' });
      queryClient.invalidateQueries({ queryKey: ['table-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
      toast.success('Client marqué comme arrivé');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleDeleteReservation = async (id: string, guestName: string) => {
    if (!confirm(`Supprimer la réservation de ${guestName} ?`)) return;
    
    try {
      await api.delete(`/restaurant/reservations/${id}`);
      queryClient.invalidateQueries({ queryKey: ['table-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
      toast.success('Réservation supprimée');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  // Helper functions pour les badges de statut
  const getReservationStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      pending: 'px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-xs font-medium',
      confirmed: 'px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-medium',
      seated: 'px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-medium',
      completed: 'px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-medium',
      cancelled: 'px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-xs font-medium',
      no_show: 'px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 rounded-full text-xs font-medium',
    };
    return classes[status] || classes.pending;
  };

  const getReservationStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      seated: 'Client assis',
      completed: 'Terminée',
      cancelled: 'Annulée',
      no_show: 'Absent',
    };
    return labels[status] || status;
  };

  const handleCreateOrder = () => {
    if (orderItems.length === 0) {
      toast.error('Ajoutez au moins un article à la commande');
      return;
    }

    if (orderForm.order_type === 'room_service' && !orderForm.booking_id) {
      toast.error('Sélectionnez une chambre');
      return;
    }

    if (orderForm.order_type === 'dine_in' && !orderForm.table_id) {
      toast.error('Sélectionnez une table');
      return;
    }

    const totals = calculateOrderTotal();
    const orderData = {
      ...orderForm,
      items: orderItems,
      subtotal: totals.subtotal,
      tax: totals.tax,
      service_charge: totals.service_charge,
      total_amount: totals.total,
    };

    createOrderMutation.mutate(orderData);
  };

  // Table handlers
  const handleCreateTable = (data: any) => {
    if (editingTable) {
      updateTableMutation.mutate({ id: editingTable.id, data });
    } else {
      createTableMutation.mutate(data);
    }
  };

  const handleDeleteTable = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette table?')) {
      deleteTableMutation.mutate(id);
    }
  };

  // Reservation handlers
  const handleCreateReservation = (data: any) => {
    createReservationMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-700 dark:text-yellow-300', label: 'En attente' },
      confirmed: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-700 dark:text-blue-300', label: 'Confirmée' },
      preparing: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-700 dark:text-orange-300', label: 'En préparation' },
      ready: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-700 dark:text-purple-300', label: 'Prête' },
      served: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300', label: 'Servie' },
      completed: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300', label: 'Terminée' },
      cancelled: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-300', label: 'Annulée' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getTableStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      available: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300', label: 'Disponible' },
      occupied: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-300', label: 'Occupée' },
      reserved: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-700 dark:text-blue-300', label: 'Réservée' },
      cleaning: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-700 dark:text-yellow-300', label: 'Nettoyage' },
    };
    const badge = badges[status] || badges.available;
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <UtensilsCrossed className="w-7 h-7 text-seafoam-500" />
            Restaurant & Bar
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-slate-300">
            Gestion des commandes, menu et réservations
          </p>
        </div>
        {canCreateOrder && (
          <Button onClick={() => setShowOrderModal(true)} className="bg-seafoam-500 hover:bg-seafoam-600 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Commande
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      {canViewStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Commandes Actives</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stats?.orders?.active_orders || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Revenus du Jour</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {parseFloat(stats?.orders?.total_revenue || 0).toFixed(2)}€
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Tables Disponibles</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stats?.tables?.available_tables || 0}/{stats?.tables?.total_tables || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Coffee className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Clients Uniques</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stats?.orders?.unique_customers || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b dark:border-slate-700 overflow-x-auto">
        {[
          { id: 'orders', label: 'Commandes', icon: ChefHat },
          { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
          { id: 'tables', label: 'Tables', icon: Coffee },
          { id: 'reservations', label: 'Réservations', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-seafoam-500 text-seafoam-600 dark:text-seafoam-400'
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'orders' && (
        <Card>
          <div className="p-4 border-b dark:border-slate-700">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="preparing">En préparation</option>
                <option value="ready">Prête</option>
                <option value="served">Servie</option>
                <option value="completed">Terminée</option>
              </select>
            </div>
          </div>

          <div className="p-4">
            {ordersLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-seafoam-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order: any) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {order.order_number}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {order.order_type === 'dine_in' && `Table ${order.table_number}`}
                          {order.order_type === 'room_service' && `Chambre ${order.room_number}`}
                          {order.order_type === 'takeaway' && 'À emporter'}
                          {order.order_type === 'bar' && 'Bar'}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-gray-500 dark:text-slate-400">Client</p>
                        <p className="font-medium dark:text-white">{order.guest_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-slate-400">Montant</p>
                        <p className="font-medium dark:text-white">{order.total_amount}€</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-slate-400">Serveur</p>
                        <p className="font-medium dark:text-white">{order.server_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-slate-400">Heure</p>
                        <p className="font-medium dark:text-white">
                          {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {canUpdateOrderStatus && order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'preparing' })}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Commencer
                        </Button>
                      )}
                      {canUpdateOrderStatus && order.status === 'preparing' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'ready' })}
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          Prête
                        </Button>
                      )}
                      {canUpdateOrderStatus && order.status === 'ready' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'served' })}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Servir
                        </Button>
                      )}
                      {canUpdateOrderStatus && order.status === 'served' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'completed' })}
                          className="bg-gray-500 hover:bg-gray-600"
                        >
                          Terminer
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-slate-400">Aucune commande</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'menu' && (
        <div className="space-y-4">
          {canUpdateMenu && (
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setEditingMenuItem(null);
                  resetMenuForm();
                  setShowMenuModal(true);
                }}
                className="bg-seafoam-500 hover:bg-seafoam-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un Article
              </Button>
            </div>
          )}

          <Card>
            {menuLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-seafoam-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : menuItems && menuItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                        Article
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                        Temps
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                        Options
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                    {menuItems.map((item: MenuItem) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {item.category_name}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {Number(item.price || 0).toFixed(2)}€
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {item.preparation_time ? `${item.preparation_time} min` : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.is_available
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                          }`}>
                            {item.is_available ? 'Disponible' : 'Indisponible'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {item.is_vegetarian && (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                                🌱 Végé
                              </span>
                            )}
                            {item.is_vegan && (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                                🌿 Vegan
                              </span>
                            )}
                            {item.is_gluten_free && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                Sans gluten
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {canUpdateMenu && (
                              <button
                                onClick={() => handleEditMenuItem(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {canDeleteMenu && (
                              <button
                                onClick={() => {
                                  if (confirm('Êtes-vous sûr de vouloir supprimer cet article?')) {
                                    deleteMenuItemMutation.mutate(item.id);
                                  }
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <UtensilsCrossed className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-slate-400 mb-4">Aucun article dans le menu</p>
                {canUpdateMenu && (
                  <Button
                    onClick={() => {
                      setEditingMenuItem(null);
                      resetMenuForm();
                      setShowMenuModal(true);
                    }}
                    className="bg-seafoam-500 hover:bg-seafoam-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter le premier article
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'tables' && (
        <div className="space-y-4">
          {/* Header avec bouton */}
          {canManageTables && (
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setEditingTable(null);
                  setShowTableModal(true);
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une Table
              </Button>
            </div>
          )}

          <Card className="p-4">
            {tablesLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-seafoam-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : tables && tables.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {tables.map((table: any) => (
                  <motion.div
                    key={table.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                        <Coffee className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      {getTableStatusBadge(table.status)}
                    </div>

                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">
                      {table.table_number}
                    </h3>

                    <div className="text-sm text-gray-600 dark:text-slate-400 space-y-1 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {table.capacity} places
                      </div>
                      <div>
                        {table.location === 'indoor' && '🏠 Intérieur'}
                        {table.location === 'outdoor' && '🌳 Extérieur'}
                        {table.location === 'terrace' && '☀️ Terrasse'}
                        {table.location === 'bar' && '🍸 Bar'}
                      </div>
                    </div>

                    {table.notes && (
                      <p className="text-xs text-gray-500 dark:text-slate-500 mb-3 line-clamp-2">
                        {table.notes}
                      </p>
                    )}

                    {canManageTables && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTable(table);
                            setShowTableModal(true);
                          }}
                          className="flex-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteTable(table.id)}
                          className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Coffee className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-slate-400 mb-4">Aucune table disponible</p>
                {canManageTables && (
                  <Button
                    onClick={() => {
                      setEditingTable(null);
                      setShowTableModal(true);
                    }}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter la première table
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {/* Header avec bouton */}
          {canManageReservations && (
            <div className="flex justify-end">
              <Button
                onClick={() => setShowReservationModal(true)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Réservation
              </Button>
            </div>
          )}

          <Card className="p-4">
            {reservationsLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-seafoam-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : reservations && reservations.length > 0 ? (
              <div className="space-y-3">
                {reservations.map((reservation: any) => (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-1">
                          {reservation.guest_name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {reservation.guest_phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={getReservationStatusBadge(reservation.status)}>
                          {getReservationStatusLabel(reservation.status)}
                        </span>
                        {reservation.guest_id ? (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded">
                            🏨 Client Hôtel
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                            👤 Externe
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-gray-500 dark:text-slate-400">Date</p>
                        <p className="font-medium dark:text-white">
                          {new Date(reservation.reservation_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-slate-400">Heure</p>
                        <p className="font-medium dark:text-white">{reservation.reservation_time}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-slate-400">Personnes</p>
                        <p className="font-medium dark:text-white">
                          <Users className="w-3 h-3 inline mr-1" />
                          {reservation.number_of_guests}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-slate-400">Table</p>
                        <p className="font-medium dark:text-white">{reservation.table_number || 'N/A'}</p>
                      </div>
                    </div>

                    {reservation.special_requests && (
                      <div className="mt-3 p-2 bg-gray-50 dark:bg-slate-800 rounded mb-3">
                        <p className="text-xs text-gray-600 dark:text-slate-400">
                          <strong>Demandes:</strong> {reservation.special_requests}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t dark:border-slate-700">
                      {/* Bouton Modifier */}
                      <button
                        onClick={() => handleEditReservation(reservation)}
                        className="flex items-center gap-1 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm font-medium"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                        Modifier
                      </button>
                      
                      {/* Bouton Arrivé (seulement si confirmed) */}
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => handleMarkArrived(reservation.id)}
                          className="flex items-center gap-1 px-3 py-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors text-sm font-medium"
                          title="Marquer comme arrivé"
                        >
                          <Check className="h-4 w-4" />
                          Arrivé
                        </button>
                      )}
                      
                      {/* Bouton Supprimer (sauf si completed) */}
                      {reservation.status !== 'completed' && (
                        <button
                          onClick={() => handleDeleteReservation(reservation.id, reservation.guest_name)}
                          className="flex items-center gap-1 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium ml-auto"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-slate-400 mb-4">Aucune réservation</p>
                {canManageReservations && (
                  <Button
                    onClick={() => setShowReservationModal(true)}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer la première réservation
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <CreateOrderModal
          onClose={() => {
            setShowOrderModal(false);
            resetOrderForm();
          }}
          orderForm={orderForm}
          setOrderForm={setOrderForm}
          orderItems={orderItems}
          addItemToOrder={addItemToOrder}
          removeItemFromOrder={removeItemFromOrder}
          updateItemQuantity={updateItemQuantity}
          calculateOrderTotal={calculateOrderTotal}
          handleCreateOrder={handleCreateOrder}
          activeBookings={activeBookings}
          tables={tables}
          availableMenuItems={availableMenuItems}
          menuCategories={menuCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isLoading={createOrderMutation.isPending}
        />
      )}

      {/* Menu Item Modal */}
      {showMenuModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => {
              setShowMenuModal(false);
              setEditingMenuItem(null);
              resetMenuForm();
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 border dark:border-slate-700 my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <UtensilsCrossed className="w-6 h-6 text-seafoam-500" />
                  {editingMenuItem ? 'Modifier l\'Article' : 'Nouvel Article Menu'}
                </h2>
                <button
                  onClick={() => {
                    setShowMenuModal(false);
                    setEditingMenuItem(null);
                    resetMenuForm();
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Nom de l'article *
                  </label>
                  <input
                    type="text"
                    value={menuFormData.name}
                    onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    placeholder="Ex: Salade César"
                  />
                </div>

                {/* Nom français */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Nom en français
                  </label>
                  <input
                    type="text"
                    value={menuFormData.name_fr}
                    onChange={(e) => setMenuFormData({ ...menuFormData, name_fr: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    placeholder="Ex: Salade César"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={menuFormData.description}
                    onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    placeholder="Décrivez l'article..."
                  />
                </div>

                {/* Prix et Catégorie */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Prix (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={menuFormData.price}
                      onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                      placeholder="12.50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={menuFormData.category_id}
                      onChange={(e) => setMenuFormData({ ...menuFormData, category_id: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Sélectionner...</option>
                      {menuCategories?.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Temps de préparation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Temps de préparation (minutes)
                  </label>
                  <input
                    type="number"
                    value={menuFormData.preparation_time}
                    onChange={(e) => setMenuFormData({ ...menuFormData, preparation_time: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    placeholder="15"
                  />
                </div>

                {/* Disponibilité */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={menuFormData.is_available}
                    onChange={(e) => setMenuFormData({ ...menuFormData, is_available: e.target.checked })}
                    className="w-4 h-4 text-seafoam-500 border-gray-300 rounded focus:ring-seafoam-400"
                  />
                  <label htmlFor="is_available" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    Article disponible
                  </label>
                </div>

                {/* Options alimentaires */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Options alimentaires
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_vegetarian"
                        checked={menuFormData.is_vegetarian}
                        onChange={(e) => setMenuFormData({ ...menuFormData, is_vegetarian: e.target.checked })}
                        className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-400"
                      />
                      <label htmlFor="is_vegetarian" className="text-sm text-gray-700 dark:text-slate-300">
                        🌱 Végétarien
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_vegan"
                        checked={menuFormData.is_vegan}
                        onChange={(e) => setMenuFormData({ ...menuFormData, is_vegan: e.target.checked })}
                        className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-400"
                      />
                      <label htmlFor="is_vegan" className="text-sm text-gray-700 dark:text-slate-300">
                        🌿 Vegan
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_gluten_free"
                        checked={menuFormData.is_gluten_free}
                        onChange={(e) => setMenuFormData({ ...menuFormData, is_gluten_free: e.target.checked })}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                      />
                      <label htmlFor="is_gluten_free" className="text-sm text-gray-700 dark:text-slate-300">
                        Sans gluten
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-slate-700">
                <Button
                  onClick={() => {
                    setShowMenuModal(false);
                    setEditingMenuItem(null);
                    resetMenuForm();
                  }}
                  variant="secondary"
                  className="dark:border-slate-600 dark:text-slate-200"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSaveMenuItem}
                  disabled={saveMenuItemMutation.isPending}
                  className="bg-seafoam-500 hover:bg-seafoam-600"
                >
                  {saveMenuItemMutation.isPending ? 'Enregistrement...' : editingMenuItem ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Table Modal */}
      <CreateTableModal
        isOpen={showTableModal}
        onClose={() => {
          setShowTableModal(false);
          setEditingTable(null);
        }}
        onSubmit={handleCreateTable}
        editingTable={editingTable}
      />

      {/* Reservation Modal */}
      <CreateReservationModal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        onSubmit={handleCreateReservation}
      />

      {/* Edit Reservation Modal */}
      <EditReservationModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingReservation(null);
        }}
        reservation={editingReservation}
        tables={tables || []}
        onSave={handleSaveReservation}
      />
    </div>
  );
};
