import { useQuery } from '@tanstack/react-query';
import { DollarSign, CreditCard, Banknote, Plus, X, Search, FileText, Printer, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastContext } from '@/App';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';

export const Payments = () => {
  const toast = useToastContext();
  const settingsStore = useSettingsStore();
  const { user } = useAuthStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'cash',
    transactionId: '',
  });

  const { data: payments, isLoading, refetch } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await api.get('/payments');
      return res.data;
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    refetchOnWindowFocus: true, // Rafraîchir quand la fenêtre reprend le focus
  });

  // Fetch restaurant orders payments for restaurant cashier
  const { data: restaurantPayments, isLoading: restaurantPaymentsLoading } = useQuery({
    queryKey: ['restaurant-payments'],
    queryFn: async () => {
      // Get all restaurant orders with payment info
      const res = await api.get('/restaurant/orders');
      return res.data.map((order: any) => ({
        id: order.id,
        guest_name: order.guest_name || 'Walk-in Customer',
        room_number: order.room_number || (order.table_number ? `Table ${order.table_number}` : 'N/A'),
        amount: order.total_amount,
        payment_method: order.payment_method || 'pending',
        payment_status: order.payment_status || 'pending',
        transaction_id: order.transaction_id || `REST-${order.order_number}`,
        created_at: order.created_at,
        payment_date: order.payment_date || order.created_at,
        type: 'restaurant',
        order_number: order.order_number,
      }));
    },
    enabled: user?.role === 'restaurant_cashier',
    refetchInterval: 15000,
  });

  // Fetch unpaid bookings
  const { data: unpaidBookings } = useQuery({
    queryKey: ['unpaid-bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/unpaid');
      return res.data;
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    refetchOnWindowFocus: true, // Rafraîchir quand la fenêtre reprend le focus
  });

  const handleBookingSelect = (booking: any) => {
    setSelectedBooking(booking);
  };

  // Filter and search payments
  const filteredPayments = useMemo(() => {
    // Restaurant cashier sees only restaurant payments
    if (user?.role === 'restaurant_cashier') {
      if (!restaurantPayments) return [];
      
      return restaurantPayments.filter((payment: any) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          payment.guest_name?.toLowerCase().includes(searchLower) ||
          payment.room_number?.toLowerCase().includes(searchLower) ||
          payment.transaction_id?.toLowerCase().includes(searchLower) ||
          payment.order_number?.toLowerCase().includes(searchLower);
        
        const matchesMethod = filterMethod === 'all' || payment.payment_method === filterMethod;
        
        return matchesSearch && matchesMethod;
      });
    }
    
    // All other roles see regular hotel payments
    if (!payments) return [];
    
    return payments.filter((payment: any) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        payment.guest_name?.toLowerCase().includes(searchLower) ||
        payment.room_number?.toLowerCase().includes(searchLower) ||
        payment.transaction_id?.toLowerCase().includes(searchLower);
      
      // Method filter
      const matchesMethod = filterMethod === 'all' || payment.payment_method === filterMethod;
      
      return matchesSearch && matchesMethod;
    });
  }, [payments, restaurantPayments, user?.role, searchTerm, filterMethod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBooking) {
      toast.error('Please select a booking');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const paymentPayload = {
        bookingId: selectedBooking.id,
        amount: selectedBooking.total_amount,
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId || `TXN${Date.now()}`
      };
      
      console.log('💰 Processing payment:', paymentPayload);
      await api.post('/payments', paymentPayload);
      
      setShowPaymentModal(false);
      setSelectedBooking(null);
      setPaymentData({
        paymentMethod: 'cash',
        transactionId: '',
      });
      
      toast.success('Payment processed successfully!');
      refetch();
    } catch (error: any) {
      console.error('❌ Error processing payment:', error);
      toast.error(error.response?.data?.message || 'Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      case 'cash':
        return <Banknote className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-slate-200';
    }
  };

  const handleViewInvoice = (payment: any) => {
    setSelectedInvoice(payment);
    setShowInvoiceModal(true);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    toast.success('Invoice download started');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Payments</h1>
          <p className="text-gray-500 dark:text-slate-300">Track and manage payments</p>
        </div>
        <Button 
          onClick={() => setShowPaymentModal(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Process Payment
        </Button>
      </div>

      <Card>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by guest, room, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-400 dark:bg-slate-700 dark:text-white"
            />
          </div>
          
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-400 dark:bg-slate-700 dark:text-white"
          >
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="mobile_payment">Mobile</option>
          </select>
        </div>

        {(isLoading || (user?.role === 'restaurant_cashier' && restaurantPaymentsLoading)) ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-seafoam-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-slate-400">
                      No payments found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {payment.guest_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                      {payment.room_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      {payment.transaction_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                        {getPaymentMethodIcon(payment.payment_method)}
                        <span className="capitalize text-sm">{payment.payment_method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-seafoam-600 dark:text-gold-400">
                      ${payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.payment_status)}`}>
                        {payment.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => handleViewInvoice(payment)}
                        variant="secondary"
                        className="text-xs py-1 px-3 dark:border-slate-600 dark:text-slate-200"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Invoice
                      </Button>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Process Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 border dark:border-slate-700 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Process Payment</h2>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-slate-300" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1">
                      Select Booking
                    </label>
                    <div className="max-h-48 overflow-y-auto space-y-1 border dark:border-slate-600 rounded-lg p-2 bg-gray-50 dark:bg-slate-900">
                      {unpaidBookings?.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-slate-400 text-center py-4">
                          No unpaid bookings available
                        </p>
                      ) : (
                        unpaidBookings?.map((booking: any) => (
                          <div
                            key={booking.id}
                            onClick={() => handleBookingSelect(booking)}
                            className={`p-2 rounded-lg cursor-pointer transition-all ${
                              selectedBooking?.id === booking.id
                                ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500'
                                : 'bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                  {booking.guest_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-300">
                                  Room {booking.room_number}
                                </p>
                              </div>
                              <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                ${booking.total_amount}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {selectedBooking && (
                    <>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600 dark:text-slate-300">Guest:</span>
                            <p className="font-medium text-gray-800 dark:text-white">{selectedBooking.guest_name}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-slate-300">Room:</span>
                            <p className="font-medium text-gray-800 dark:text-white">{selectedBooking.room_number}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-slate-300">Check-in:</span>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {new Date(selectedBooking.check_in_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-slate-300">Check-out:</span>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {new Date(selectedBooking.check_out_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1">
                          Payment Method
                        </label>
                        <select
                          value={paymentData.paymentMethod}
                          onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                          className="w-full px-3 py-2 text-sm border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-400 dark:bg-slate-700 dark:text-white"
                        >
                          <option value="cash">💵 Cash</option>
                          <option value="card">💳 Card</option>
                          <option value="bank_transfer">🏦 Bank Transfer</option>
                          <option value="mobile_payment">📱 Mobile</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-slate-200 mb-1">
                          Transaction ID (Optional)
                        </label>
                        <input
                          type="text"
                          value={paymentData.transactionId}
                          onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                          className="w-full px-3 py-2 text-sm border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-400 dark:bg-slate-700 dark:text-white"
                          placeholder="TXN123456"
                        />
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 dark:text-slate-200">Total:</span>
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">
                            ${selectedBooking.total_amount}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 text-sm py-2 dark:border-slate-600 dark:text-slate-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !selectedBooking}
                      className="flex-1 text-sm py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4 mr-1" />
                          Process
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Invoice Modal */}
      <AnimatePresence>
        {showInvoiceModal && selectedInvoice && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInvoiceModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200">
                {/* Invoice Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-seafoam-500" />
                    Invoice
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handlePrintInvoice}
                      variant="secondary"
                      className="text-sm"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                    <Button
                      onClick={handleDownloadInvoice}
                      variant="secondary"
                      className="text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <button
                      onClick={() => setShowInvoiceModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Invoice Content */}
                <div className="p-8 space-y-6 bg-white">
                  {/* Hotel & Invoice Info */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold text-seafoam-600 mb-2">
                        {settingsStore.hotelName}
                      </h1>
                      <p className="text-sm text-gray-600">{settingsStore.hotelAddress}</p>
                      <p className="text-sm text-gray-600">{settingsStore.hotelCity}</p>
                      <p className="text-sm text-gray-600">Phone: {settingsStore.hotelPhone}</p>
                      <p className="text-sm text-gray-600">Email: {settingsStore.hotelEmail}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-seafoam-100 px-4 py-2 rounded-lg mb-2">
                        <p className="text-xs text-gray-600">Invoice Number</p>
                        <p className="text-lg font-bold text-seafoam-700">
                          INV-{selectedInvoice.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">Date Issued</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(selectedInvoice.payment_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t-2 border-seafoam-200"></div>

                  {/* Guest Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Bill To
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-lg font-bold text-gray-800 mb-1">
                        {selectedInvoice.guest_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedInvoice.guest_phone || 'Phone not available'}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Booking Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-mint-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Room Number</p>
                        <p className="text-xl font-bold text-seafoam-600">
                          {selectedInvoice.room_number}
                        </p>
                      </div>
                      <div className="bg-mint-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Booking ID</p>
                        <p className="text-sm font-mono font-semibold text-gray-800">
                          {selectedInvoice.booking_id?.slice(0, 13).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Payment Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Method</span>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(selectedInvoice.payment_method)}
                          <span className="font-semibold text-gray-800 capitalize">
                            {selectedInvoice.payment_method}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Transaction ID</span>
                        <span className="font-mono text-sm font-semibold text-gray-800">
                          {selectedInvoice.transaction_id}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Status</span>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(selectedInvoice.payment_status)}`}>
                          {selectedInvoice.payment_status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount Breakdown */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Amount Details
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Subtotal</span>
                        <span className="font-semibold text-gray-800">
                          ${selectedInvoice.amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tax (0%)</span>
                        <span className="font-semibold text-gray-800">$0.00</span>
                      </div>
                      <div className="border-t border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-800">Total Amount</span>
                          <span className="text-2xl font-bold text-green-600">
                            ${selectedInvoice.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t-2 border-gray-200 pt-6 mt-6">
                    {settingsStore.signature && (
                      <div className="mb-6 flex flex-col items-center">
                        <img 
                          src={settingsStore.signature} 
                          alt="Authorized Signature" 
                          className="max-h-16 mb-2"
                        />
                        <div className="border-t border-gray-400 w-48 mb-1"></div>
                        <p className="text-xs text-gray-600">Authorized Signature</p>
                      </div>
                    )}
                    <div className="text-center space-y-2">
                      <p className="text-sm font-semibold text-seafoam-600">
                        Thank you for choosing {settingsStore.hotelName}!
                      </p>
                      <p className="text-xs text-gray-500">
                        This is a computer-generated invoice and does not require a signature.
                      </p>
                      <p className="text-xs text-gray-500">
                        For any queries, please contact us at {settingsStore.hotelEmail} or call {settingsStore.hotelPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
