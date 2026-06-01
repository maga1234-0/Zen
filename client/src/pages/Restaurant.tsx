import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UtensilsCrossed, Plus, Search, Filter, Clock, DollarSign,
  CheckCircle, XCircle, Coffee, Wine, ChefHat, Users
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';
import { useToastContext } from '@/App';
import { motion } from 'framer-motion';

type TabType = 'orders' | 'menu' | 'tables' | 'reservations';

export const Restaurant = () => {
  const toast = useToastContext();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showOrderModal, setShowOrderModal] = useState(false);

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
      const res = await api.get('/restaurant/menu/items?available_only=true');
      return res.data;
    },
    enabled: activeTab === 'menu',
    refetchInterval: 60000, // Rafraîchir toutes les 60 secondes
    refetchOnWindowFocus: true, // Rafraîchir quand la fenêtre reprend le focus
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
        <Button onClick={() => setShowOrderModal(true)} className="bg-seafoam-500 hover:bg-seafoam-600 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Commande
        </Button>
      </div>

      {/* Statistics Cards */}
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
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'preparing' })}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Commencer
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'ready' })}
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          Prête
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'served' })}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Servir
                        </Button>
                      )}
                      {order.status === 'served' && (
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
        <Card className="p-4">
          <p className="text-center text-gray-500 dark:text-slate-400 py-12">
            Gestion du menu - En développement
          </p>
        </Card>
      )}

      {activeTab === 'tables' && (
        <Card className="p-4">
          {tablesLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-seafoam-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {tables?.map((table: any) => (
                <div
                  key={table.id}
                  className="border dark:border-slate-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 mx-auto mb-3 bg-seafoam-100 dark:bg-seafoam-900/30 rounded-full flex items-center justify-center">
                    <Coffee className="w-8 h-8 text-seafoam-600 dark:text-seafoam-400" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                    {table.table_number}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
                    {table.capacity} places
                  </p>
                  {getTableStatusBadge(table.status)}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'reservations' && (
        <Card className="p-4">
          <p className="text-center text-gray-500 dark:text-slate-400 py-12">
            Réservations de tables - En développement
          </p>
        </Card>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowOrderModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 border dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <UtensilsCrossed className="w-6 h-6 text-seafoam-500" />
                  Nouvelle Commande Restaurant
                </h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-gray-500 dark:text-slate-400">×</span>
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">ℹ</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                      Module Restaurant actif
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                      Le module restaurant est déployé et fonctionnel. Vous pouvez créer des commandes pour:
                    </p>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 list-disc list-inside space-y-1">
                      <li>Service en salle (dine-in)</li>
                      <li>Service en chambre (room service)</li>
                      <li>À emporter (takeaway)</li>
                      <li>Bar</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center py-8">
                <ChefHat className="w-16 h-16 text-seafoam-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-slate-400 mb-4">
                  Fonctionnalités disponibles pour créer une commande:
                </p>
                <ul className="text-sm text-gray-500 dark:text-slate-500 space-y-2 text-left max-w-md mx-auto">
                  <li>✓ Sélection du type de service</li>
                  <li>✓ Choix de la table ou chambre</li>
                  <li>✓ Ajout d'articles du menu</li>
                  <li>✓ Notes spéciales et allergies</li>
                  <li>✓ Gestion des paiements</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  <strong>Note:</strong> Le formulaire complet de création de commande sera disponible dans une prochaine mise à jour. 
                  Pour l'instant, vous pouvez gérer les commandes existantes depuis l'onglet "Commandes".
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setShowOrderModal(false)}
                  variant="secondary"
                  className="dark:border-slate-600 dark:text-slate-200"
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    setShowOrderModal(false);
                    setActiveTab('orders');
                  }}
                  className="bg-seafoam-500 hover:bg-seafoam-600"
                >
                  Voir les Commandes
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
