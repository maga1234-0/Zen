import { useState, useEffect } from 'react';
import { X, FileText, Printer, Download, DollarSign } from 'lucide-react';
import { Button } from './ui/Button';
import api from '@/services/api';
import { useSettingsStore } from '@/store/settingsStore';
import { useCurrencyFormat } from '@/utils/currency';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onPaymentSuccess?: () => void;
}

interface InvoiceData {
  booking: {
    id: string;
    check_in_date: string;
    check_out_date: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    room_number: string;
    room_type: string;
    price_per_night: number;
    status: string;
  };
  charges: {
    room: {
      description: string;
      amount: number;
      details: {
        check_in: string;
        check_out: string;
        price_per_night: number;
      };
    };
    restaurant: {
      total: number;
      orders: Array<{
        id: string;
        order_number: string;
        order_type: string;
        amount: number;
        payment_status: string;
        date: string;
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
      }>;
    };
  };
  summary: {
    room_charges: number;
    restaurant_charges: number;
    spa_charges: number;
    subtotal: number;
    tax: number;
    grand_total: number;
    total_paid: number;
    balance: number;
  };
}

export const InvoiceModal = ({ 
  isOpen, 
  onClose, 
  bookingId,
  onPaymentSuccess 
}: InvoiceModalProps) => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer' | 'mobile_payment'>('cash');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const settingsStore = useSettingsStore();
  const { formatPrice } = useCurrencyFormat();

  useEffect(() => {
    if (isOpen && bookingId) {
      fetchInvoice();
    }
  }, [isOpen, bookingId]);

  const fetchInvoice = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get(`/invoices/booking/${bookingId}`);
      setInvoice(response.data);
    } catch (err: any) {
      console.error('Error fetching invoice:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement de la facture');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!invoice || invoice.summary.balance <= 0) return;

    setIsPaymentProcessing(true);
    setError('');

    try {
      await api.post(`/invoices/booking/${bookingId}/pay`, {
        amount: invoice.summary.balance,
        payment_method: paymentMethod,
        notes: 'Paiement facture consolidée'
      });

      // Refresh invoice to show updated balance
      await fetchInvoice();
      setShowPaymentForm(false);
      
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
    // TODO: Implement PDF generation
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
            Facture Consolidée
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
                    <p className="text-xs text-gray-600 dark:text-slate-400">Numéro de Facture</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      INV-{invoice.booking.id.slice(0, 8).toUpperCase()}
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
                  Facturé à
                </h3>
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                  <p className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {invoice.booking.guest_name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Email: {invoice.booking.guest_email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Tél: {invoice.booking.guest_phone || 'Non renseigné'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                    Chambre: <strong>{invoice.booking.room_number}</strong> - {invoice.booking.room_type}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Séjour: {new Date(invoice.booking.check_in_date).toLocaleDateString('fr-FR')} - {new Date(invoice.booking.check_out_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              {/* Charges Detail */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase mb-3">
                  Détail des Charges
                </h3>

                {/* Room Charges */}
                <div className="mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800 dark:text-white">🏨 Hébergement</h4>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(invoice.charges.room.amount)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {invoice.charges.room.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                      Tarif: {formatPrice(invoice.charges.room.details.price_per_night)}/nuit
                    </p>
                  </div>
                </div>

                {/* Restaurant Charges */}
                {invoice.charges.restaurant.orders.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800 dark:text-white">🍽️ Restaurant / Room Service</h4>
                        <span className="font-bold text-orange-600 dark:text-orange-400">
                          {formatPrice(invoice.charges.restaurant.total)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {invoice.charges.restaurant.orders.map((order) => (
                          <div key={order.id} className="border-l-2 border-orange-300 dark:border-orange-700 pl-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                  Commande #{order.order_number} - {order.order_type}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-500">
                                  {new Date(order.date).toLocaleDateString('fr-FR')}
                                </p>
                                {order.items && order.items.length > 0 && (
                                  <ul className="text-xs text-gray-600 dark:text-slate-400 mt-1 space-y-1">
                                    {order.items.map((item, idx) => (
                                      <li key={idx}>
                                        {item.quantity}x {item.item_name} ({formatPrice(item.unit_price)})
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <span className="text-sm font-semibold text-gray-800 dark:text-white">
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
                                  {new Date(booking.date).toLocaleDateString('fr-FR')} à {booking.time}
                                </p>
                                {booking.therapist && (
                                  <p className="text-xs text-gray-600 dark:text-slate-400">
                                    Thérapeute: {booking.therapist}
                                  </p>
                                )}
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
              </div>

              <div className="border-t-2 border-gray-200 dark:border-slate-700"></div>

              {/* Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase mb-3">
                  Résumé
                </h3>
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Frais d'hébergement</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {formatPrice(invoice.summary.room_charges)}
                    </span>
                  </div>
                  {invoice.summary.restaurant_charges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-slate-400">Frais de restaurant</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {formatPrice(invoice.summary.restaurant_charges)}
                      </span>
                    </div>
                  )}
                  {invoice.summary.spa_charges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-slate-400">Frais de spa</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {formatPrice(invoice.summary.spa_charges)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-2 mt-2">
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-gray-800 dark:text-white">Total Général</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {formatPrice(invoice.summary.grand_total)}
                      </span>
                    </div>
                  </div>
                  {invoice.summary.total_paid > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Montant Payé</span>
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
                          ⚠️ Facture Non Réglée
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                          Il reste {formatPrice(invoice.summary.balance)} à payer
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowPaymentForm(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Payer Maintenant
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        Procéder au Paiement
                      </h4>
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
                          <option value="bank_transfer">🏦 Virement Bancaire</option>
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
                          onClick={() => setShowPaymentForm(false)}
                          disabled={isPaymentProcessing}
                          className="flex-1"
                        >
                          Annuler
                        </Button>
                        <Button
                          onClick={handlePayment}
                          disabled={isPaymentProcessing}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {isPaymentProcessing ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Traitement...
                            </span>
                          ) : (
                            <>Confirmer - {formatPrice(invoice.summary.balance)}</>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {invoice.summary.balance <= 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg p-4 text-center">
                  <p className="font-bold text-green-800 dark:text-green-300 text-lg">
                    ✓ Facture Entièrement Réglée
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Merci pour votre paiement
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
