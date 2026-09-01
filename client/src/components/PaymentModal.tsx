import { useState } from 'react';
import { X, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { Button } from './ui/Button';
import api from '@/services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'restaurant' | 'spa';
  itemId: string; // restaurant order ID or spa booking ID
  amount: number;
  itemName?: string;
  onSuccess?: () => void;
}

export const PaymentModal = ({ 
  isOpen, 
  onClose, 
  type, 
  itemId, 
  amount, 
  itemName,
  onSuccess 
}: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile_money'>('cash');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const endpoint = type === 'restaurant' 
        ? `/payments/restaurant/${itemId}`
        : `/payments/spa/${itemId}`;

      await api.post(endpoint, {
        amount,
        payment_method: paymentMethod,
        notes: notes || undefined
      });

      // Success!
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement du paiement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    { value: 'cash', label: 'Espèces', icon: DollarSign },
    { value: 'card', label: 'Carte Bancaire', icon: CreditCard },
    { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Enregistrer Paiement
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Item Info */}
          {itemName && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {type === 'restaurant' ? 'Commande' : 'Réservation'}: <strong>{itemName}</strong>
              </p>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Montant à Payer
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                disabled
                className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white font-bold text-lg"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
              Méthode de Paiement
            </label>
            <div className="space-y-2">
              {paymentMethods.map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="sr-only"
                  />
                  <Icon className={`w-5 h-5 mr-3 ${
                    paymentMethod === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    paymentMethod === value 
                      ? 'text-blue-900 dark:text-blue-200' 
                      : 'text-gray-700 dark:text-slate-300'
                  }`}>
                    {label}
                  </span>
                  {paymentMethod === value && (
                    <span className="ml-auto text-blue-600 dark:text-blue-400">✓</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Ajoutez des notes sur ce paiement..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Enregistrement...' : '✓ Confirmer Paiement'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
