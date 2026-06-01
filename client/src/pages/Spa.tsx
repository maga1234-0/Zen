import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, Calendar, Users, Package, ShoppingBag, 
  TrendingUp, Plus, Search, Filter, Clock, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToastContext } from '@/App';
import api from '@/services/api';

interface SpaService {
  id: string;
  name: string;
  category_name: string;
  duration: number;
  price: number;
  description: string;
  is_active: boolean;
}

interface SpaBooking {
  id: string;
  booking_reference: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  guest_name: string;
  service_name: string;
  therapist_name: string;
  status: string;
  total_amount: number;
}

interface Therapist {
  id: string;
  first_name: string;
  last_name: string;
  specialties: string[];
  is_active: boolean;
}

interface SpaPackage {
  id: string;
  name: string;
  description: string;
  total_duration: number;
  regular_price: number;
  package_price: number;
  savings: number;
  services: any[];
}

interface Statistics {
  general: {
    completed_bookings: number;
    confirmed_bookings: number;
    pending_bookings: number;
    total_revenue: number;
  };
  topServices: any[];
  therapistPerformance: any[];
}

export default function Spa() {
  const { t } = useTranslation();
  const toast = useToastContext();
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'therapists' | 'packages' | 'products'>('bookings');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [bookings, setBookings] = useState<SpaBooking[]>([]);
  const [services, setServices] = useState<SpaService[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [packages, setPackages] = useState<SpaPackage[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  
  // Modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [backendError, setBackendError] = useState(false);


  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setBackendError(false);
    try {
      if (activeTab === 'bookings') {
        await loadBookings();
        await loadStatistics();
      } else if (activeTab === 'services') {
        await loadServices();
      } else if (activeTab === 'therapists') {
        await loadTherapists();
      } else if (activeTab === 'packages') {
        await loadPackages();
      }
    } catch (error) {
      console.error('Load data error:', error);
      setBackendError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await api.get('/spa/bookings');
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Bookings load error:', error);
      setBookings([]);
      toast.error('Impossible de charger les réservations. Vérifiez que le backend est déployé.');
    }
  };

  const loadServices = async () => {
    try {
      const response = await api.get('/spa/services');
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Services load error:', error);
      setServices([]);
      toast.error('Impossible de charger les services. Vérifiez que le backend est déployé.');
    }
  };

  const loadTherapists = async () => {
    try {
      const response = await api.get('/spa/therapists');
      setTherapists(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Therapists load error:', error);
      setTherapists([]);
      toast.error('Impossible de charger les thérapeutes. Vérifiez que le backend est déployé.');
    }
  };

  const loadPackages = async () => {
    try {
      const response = await api.get('/spa/packages');
      setPackages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Packages load error:', error);
      setPackages([]);
      toast.error('Impossible de charger les forfaits. Vérifiez que le backend est déployé.');
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await api.get('/spa/statistics');
      // Ensure all numeric values have defaults
      const data = response.data || {};
      setStatistics({
        general: {
          completed_bookings: data.general?.completed_bookings || 0,
          confirmed_bookings: data.general?.confirmed_bookings || 0,
          pending_bookings: data.general?.pending_bookings || 0,
          total_revenue: data.general?.total_revenue || 0
        },
        topServices: data.topServices || [],
        therapistPerformance: data.therapistPerformance || []
      });
    } catch (error) {
      console.error('Statistics load error:', error);
      // Set default empty statistics if backend is not ready
      setStatistics({
        general: {
          completed_bookings: 0,
          confirmed_bookings: 0,
          pending_bookings: 0,
          total_revenue: 0
        },
        topServices: [],
        therapistPerformance: []
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      in_progress: 'En cours',
      completed: 'Terminée',
      cancelled: 'Annulée',
      no_show: 'Absent'
    };
    return labels[status] || status;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = booking.booking_date === new Date().toISOString().split('T')[0];
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(booking.booking_date) >= weekAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading && !statistics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-seafoam-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-300">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-500" />
            Gestion du Spa
          </h1>
          <p className="text-gray-600 dark:text-slate-300 mt-1">
            Services, réservations et bien-être
          </p>
        </div>
        <Button onClick={() => setShowBookingModal(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Réservation
        </Button>
      </div>

      {/* Backend Warning */}
      {backendError && (
        <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-yellow-600 dark:text-yellow-400 text-sm font-bold">!</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                Backend non déployé
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                Le module spa n'est pas encore disponible sur le backend. Veuillez redéployer le backend sur Render.
              </p>
              <div className="text-xs text-yellow-600 dark:text-yellow-500">
                <strong>Action requise:</strong> Aller sur{' '}
                <a 
                  href="https://dashboard.render.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-yellow-800 dark:hover:text-yellow-300"
                >
                  dashboard.render.com
                </a>
                {' '}→ Sélectionner votre service → Cliquer "Manual Deploy"
              </div>
            </div>
          </div>
        </Card>
      )}


      {/* Statistics Cards */}
      {statistics && activeTab === 'bookings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Réservations complétées</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {statistics.general.completed_bookings}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Confirmées</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {statistics.general.confirmed_bookings}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">En attente</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {statistics.general.pending_bookings}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Revenu total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {Number(statistics.general.total_revenue || 0).toFixed(2)}€
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Réservations
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'services'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Services
          </button>
          <button
            onClick={() => setActiveTab('therapists')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'therapists'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Thérapeutes
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'packages'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Packages
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Produits
          </button>
        </nav>
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
              </select>
            </div>
          </Card>

          {/* Bookings List */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Référence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Thérapeute
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Date & Heure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-slate-400">
                        Aucune réservation trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {booking.booking_reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {booking.guest_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {booking.service_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {booking.therapist_name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(booking.booking_date).toLocaleDateString('fr-FR')}
                          <br />
                          <span className="text-gray-500 dark:text-slate-400">
                            {booking.start_time} - {booking.end_time}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {Number(booking.total_amount || 0).toFixed(2)}€
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}


      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {service.category_name}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  service.is_active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {service.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 line-clamp-2">
                {service.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {service.duration} min
                </div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {Number(service.price || 0).toFixed(2)}€
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Therapists Tab */}
      {activeTab === 'therapists' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.map((therapist) => (
            <Card key={therapist.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {therapist.first_name} {therapist.last_name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {therapist.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  therapist.is_active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {therapist.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Packages Tab */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="p-6 hover:shadow-lg transition-shadow border-2 border-purple-200 dark:border-purple-800">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {pkg.name}
                  </h3>
                  <Package className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                  {pkg.description}
                </p>
                <div className="flex items-center text-sm text-gray-600 dark:text-slate-400 mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  {pkg.total_duration} minutes
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-xs text-gray-500 dark:text-slate-500">Services inclus:</p>
                  {pkg.services.map((service: any, index: number) => (
                    <p key={index} className="text-sm text-gray-700 dark:text-slate-300">
                      • {service.name}
                    </p>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-slate-500 line-through">
                    {Number(pkg.regular_price || 0).toFixed(2)}€
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full">
                    Économisez {Number(pkg.savings || 0).toFixed(2)}€
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Number(pkg.package_price || 0).toFixed(2)}€
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-slate-400">
            Gestion des produits spa à venir
          </p>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowBookingModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl p-6 border dark:border-slate-700 my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-purple-500" />
                  Nouvelle Réservation Spa
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-gray-500 dark:text-slate-400">×</span>
                </button>
              </div>

              {backendError ? (
                <>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-yellow-600 dark:text-yellow-400 text-sm font-bold">!</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                          Module Spa en cours de déploiement
                        </h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                          Le module spa n'est pas encore disponible sur le backend. Pour activer cette fonctionnalité:
                        </p>
                        <ol className="text-sm text-yellow-700 dark:text-yellow-400 list-decimal list-inside space-y-1">
                          <li>Allez sur <a href="https://dashboard.render.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">dashboard.render.com</a></li>
                          <li>Sélectionnez votre service backend</li>
                          <li>Cliquez sur "Manual Deploy" → "Deploy latest commit"</li>
                          <li>Attendez 3-5 minutes pour le déploiement</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-8">
                    <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-slate-400 mb-4">
                      Une fois le backend déployé, vous pourrez créer des réservations spa avec:
                    </p>
                    <ul className="text-sm text-gray-500 dark:text-slate-500 space-y-2 text-left max-w-md mx-auto">
                      <li>✓ Sélection du service spa</li>
                      <li>✓ Choix du thérapeute</li>
                      <li>✓ Date et heure de rendez-vous</li>
                      <li>✓ Informations du client</li>
                      <li>✓ Gestion des paiements</li>
                    </ul>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      onClick={() => setShowBookingModal(false)}
                      variant="secondary"
                      className="dark:border-slate-600 dark:text-slate-200"
                    >
                      Fermer
                    </Button>
                    <Button
                      onClick={() => window.open('https://dashboard.render.com', '_blank')}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      Aller sur Render
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">ℹ</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                          Module Spa actif
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          Le module spa est déployé et fonctionnel. Créez une réservation en remplissant le formulaire ci-dessous.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-8">
                    <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-slate-400 mb-4">
                      Formulaire de réservation spa complet à venir
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-500 mb-4">
                      Pour l'instant, vous pouvez consulter les services, thérapeutes et packages disponibles dans les onglets ci-dessus.
                    </p>
                    <ul className="text-sm text-gray-500 dark:text-slate-500 space-y-2 text-left max-w-md mx-auto">
                      <li>✓ Onglet "Services" - Voir tous les soins disponibles</li>
                      <li>✓ Onglet "Thérapeutes" - Consulter les spécialistes</li>
                      <li>✓ Onglet "Packages" - Découvrir les forfaits</li>
                      <li>✓ Onglet "Réservations" - Gérer les rendez-vous existants</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      <strong>Note:</strong> Le formulaire complet de création de réservation sera disponible dans une prochaine mise à jour. 
                      Pour l'instant, vous pouvez gérer les réservations existantes depuis l'onglet "Réservations".
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={() => setShowBookingModal(false)}
                      variant="secondary"
                      className="dark:border-slate-600 dark:text-slate-200"
                    >
                      Fermer
                    </Button>
                    <Button
                      onClick={() => {
                        setShowBookingModal(false);
                        setActiveTab('bookings');
                      }}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      Voir les Réservations
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}