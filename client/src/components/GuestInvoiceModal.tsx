import { useState, useEffect } from 'react';
import { X, FileText, Printer, Download, DollarSign } from 'lucide-react';
import { Button } from './ui/Button';
import api from '@/services/api';
import { useSettingsStore } from '@/store/settingsStore';
import { useCurrencyFormat } from '@/utils/currency';

interface GuestInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestId: string;
  onPaymentSuccess?: () => void;
}

interface GuestInvoiceData {
  guest: {
    id: string;
    name: string;
    email: string;
    phone: string;
    member_since: string;
  };
  charges: {
    restaurant: {
      total: number;
      orders: Array<{
        id: string;
        order_number: string;
        order_type: string;
        amount: number;
        payment_status: string;
        date: string;
        booking_id: string | null;
        items: Array<{
          item_name: string;
          quantity: number;
          unit_price: number;
          total: number;
        }>;
      }>;
    };
    spa: {
      total: number;
      bookings: Array<{
        id: string;
        reference: string;
        service_name: string;
        therapist: string;
        date: string;
        time: string;
        amount: number;
        payment_status: string;
        status: string;
        booking_id: string | null;
      }>;
    };
    room: {
      total: number;
      bookings: Array<{
        id: string;
        room_number: string;
        room_type: string;
        check_in: string;
        check_out: string;
        amount: number;
        status: string;
      }>;
    };
  };
  payments: Array<{
    id: string;
    amount: number;
    method: string;
    date: string;
    transaction_id: string;
    notes: string;
  }>;
  summary: {
    restaurant_charges: number;
    spa_charges: number;
    room_charges: number;
    subtotal: number;
    tax: number;
    grand_total: number;
    total_paid: number;
    balance: number;
  };
}

export const GuestInvoiceModal = ({ 
  isOpen, 
  onClose, 
  guestId,
  onPaymentSuccess 
}: GuestInvoiceModalProps) => {
  const [invoice, setInvoice] = useState<GuestInvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer' | 'mobile_payment'>('cash');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const settingsStore = useSettingsStore();
  const { formatPrice } = useCurrencyFormat();

  useEffect(() => {
    if (isOpen && guestId) {
      fetchInvoice();
    }
  }, [isOpen, guestId]);

  const fetchInvoice = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get(`/guest-invoices/${guestId}`);
      setInvoice(response.data);
      // Set default payment amount to balance
      if (response.data && response.data.summary.balance > 0) {
        setPaymentAmount(response.data.summary.balance.toString());
      }
    } catch (err: any) {
      console.error('Error fetching guest invoice:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement de la facture');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!invoice || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount > invoice.summary.balance) {
      setError(`Le montant ne peut pas dépasser le solde (${formatPrice(invoice.summary.balance)})`);
      return;
    }

    setIsPaymentProcessing(true);
    setError('');

    try {
      await api.post(`/guest-invoices/${guestId}/pay`, {
        amount: amount,
        payment_method: paymentMethod,
        notes: 'Paiement facture client'
      });

      // Refresh invoice to show updated balance
      await fetchInvoice();
      setShowPaymentForm(false);
      setPaymentAmount('');
      
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Téléchargement de la facture en PDF - À implémenter');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Facture Client - Tous Achats
          </h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              variant="secondary"
              className="text-sm"
              disabled={isLoading}
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="text-sm"
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 dark:text-slate-400">Chargement de la facture...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-300">{error}</p>
              <Button onClick={fetchInvoice} className="mt-4 bg-red-600 hover:bg-red-700">
                Réessayer
              </Button>
            </div>
          ) : invoice ? (
            <>
              {/* Hotel & Invoice Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-blue-600 mb-2">
                    {settingsStore.hotelName}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{settingsStore.hotelAddress}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{settingsStore.hotelCity}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Tél: {settingsStore.hotelPhone}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Email: {settingsStore.hotelEmail}</p>
                </div>
                <div className="text-right">
                  <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-lg mb-2">
                    <p className="text-xs text-gray-600 dark:text-slate-400">Facture Client</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      GUEST-{invoice.guest.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Date d'émission</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {new Date().toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-blue-200 dark:border-blue-800"></div>

              {/* Guest Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase mb-3">
                  Client
                </h3>
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                  <p className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {invoice.guest.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Email: {invoice.guest.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Tél: {invoice.guest.phone || 'Non renseigné'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">
                    Client depuis: {new Date(invoice.guest.member_since).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              {/* Charges Detail */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase mb-3">
                  Tous les Achats
                </h3>

                {/* Room Charges */}
                {invoice.charges.room.bookings.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800 dark:text-white">🏨 Hébergement</h4>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {formatPrice(invoice.charges.room.total)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {invoice.charges.room.bookings.map((booking) => (
                          <div key={booking.id} className="border-l-2 border-blue-300 dark:border-blue-700 pl-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                  Chambre {booking.room_number} - {booking.room_type}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-500">
                                  {new Date(booking.check_in).toLocaleDateString('fr-FR')} - {new Date(booking.check_out).toLocaleDateString('fr-FR')}
                                </p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  booking.status === 'checked_out' ? 'bg-gray-200 text-gray-700' :
                                  booking.status === 'checked_in' ? 'bg-green-200 text-green-700' :
                                  'bg-blue-200 text-blue-700'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                {formatPrice(booking.amount)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Restaurant Charges */}
                {invoice.charges.restaurant.orders.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800 dark:text-white">🍽️ Restaurant</h4>
                        <span className="font-bold text-orange-600 dark:text-orange-400">
                          {formatPrice(invoice.charges.restaurant.total)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {invoice.charges.restaurant.orders.map((order) => (
                          <div key={order.id} className="border-l-2 border-orange-300 dark:border-orange-700 pl-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                  #{order.order_number} - {order.order_type}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-500">
                                  {new Date(order.date).toLocaleDateString('fr-FR')} {new Date(order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                {order.items && order.items.length > 0 && (
                                  <ul className="text-xs text-gray-600 dark:text-slate-400 mt-1 space-y-0.5">
                                    {order.items.map((item, idx) => (
                                      <li key={idx}>
                                        {item.quantity}x {item.item_name} - {formatPrice(item.total)}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <span className="text-sm font-semibold text-gray-800 dark:text-white ml-4">
                                {formatPrice(order.amount)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Spa Charges */}
                {invoice.charges.spa.bookings.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800 dark:text-white">💆 Spa</h4>
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {formatPrice(invoice.charges.spa.total)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {invoice.charges.spa.bookings.map((booking) => (
                          <div key={booking.id} className="border-l-2 border-purple-300 dark:border-purple-700 pl-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                  {booking.service_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-500">
                                  {new Date(booking.date).toLocaleDateString('fr-FR')} - {booking.time}
                                </p>
                                {booking.therapist && (
                                  <p className="text-xs text-gray-600 dark:text-slate-400">
                                    Thérapeute: {booking.therapist}
                                  </p>
                                )}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  booking.status === 'completed' ? 'bg-green-200 text-green-700' :
                                  booking.status === 'confirmed' ? 'bg-blue-200 text-blue-700' :
                                  'bg-yellow-200 text-yellow-700'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                {formatPrice(booking.amount)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* No charges message */}
                {invoice.charges.room.bookings.length === 0 && 
                 invoice.charges.restaurant.orders.length === 0 && 
                 invoice.charges.spa.bookings.length === 0 && (
                  <div className="bg-gray-50 dark:bg-slate-900 p-8 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-slate-400">
                      Aucun achat enregistré pour ce client
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-gray-200 dark:border-slate-700"></div>

              {/* Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase mb-3">
                  Résumé
                </h3>
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 space-y-2">
                  {invoice.summary.room_charges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-slate-400">Hébergement</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {formatPrice(invoice.summary.room_charges)}
                      </span>
                    </div>
                  )}
                  {invoice.summary.restaurant_charges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-slate-400">Restaurant</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {formatPrice(invoice.summary.restaurant_charges)}
                      </span>
                    </div>
                  )}
                  {invoice.summary.spa_charges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-slate-400">Spa</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {formatPrice(invoice.summary.spa_charges)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-2 mt-2">
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-gray-800 dark:text-white">Total</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {formatPrice(invoice.summary.grand_total)}
                      </span>
                    </div>
                  </div>
                  {invoice.summary.total_paid > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Payé</span>
                      <span className="font-semibold">
                        -{formatPrice(invoice.summary.total_paid)}
                      </span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-300 dark:border-slate-600 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span className={invoice.summary.balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                        Solde à Payer
                      </span>
                      <span className={invoice.summary.balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                        {formatPrice(invoice.summary.balance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              {invoice.summary.balance > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
                  {!showPaymentForm ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                          ⚠️ Solde Impayé
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                          Reste à payer: {formatPrice(invoice.summary.balance)}
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowPaymentForm(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Enregistrer un Paiement
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        Enregistrer un Paiement
                      </h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Montant ({settingsStore.currency})
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          max={invoice.summary.balance}
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                          placeholder="0.00"
                          disabled={isPaymentProcessing}
                        />
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                          Solde restant: {formatPrice(invoice.summary.balance)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Méthode de Paiement
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                          disabled={isPaymentProcessing}
                        >
                          <option value="cash">💵 Espèces</option>
                          <option value="card">💳 Carte Bancaire</option>
                          <option value="bank_transfer">🏦 Virement</option>
                          <option value="mobile_payment">📱 Paiement Mobile</option>
                        </select>
                      </div>
                      {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
                          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setShowPaymentForm(false);
                            setError('');
                          }}
                          disabled={isPaymentProcessing}
                          className="flex-1"
                        >
                          Annuler
                        </Button>
                        <Button
                          onClick={handlePayment}
                          disabled={isPaymentProcessing || !paymentAmount}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {isPaymentProcessing ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Traitement...
                            </span>
                          ) : (
                            <>Confirmer - {formatPrice(parseFloat(paymentAmount || '0'))}</>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {invoice.summary.balance <= 0 && invoice.summary.grand_total > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg p-4 text-center">
                  <p className="font-bold text-green-800 dark:text-green-300 text-lg">
                    ✓ Tout est Payé
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Ce client n'a aucun solde impayé
                  </p>
                </div>
              )}

              {/* Signature Section - Always visible on invoices */}
              {settingsStore.signature && (
                <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-slate-700">
                  <div className="flex justify-end">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-3">
                        Signature Autorisée
                      </p>
                      <div className="border-2 border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-900 inline-block">
                        <img 
                          src={settingsStore.signature} 
                          alt="Signature" 
                          className="h-16 w-auto"
                          style={{ maxWidth: '200px' }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">
                        {settingsStore.hotelName}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
