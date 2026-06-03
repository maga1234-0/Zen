import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Calendar, Clock, Users, MapPin } from 'lucide-react';

interface Reservation {
  id: string;
  table_id: string;
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  number_of_guests: number;
  reservation_date: string;
  reservation_time: string;
  duration_minutes?: number;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  special_requests?: string;
  table_number?: string;
}

interface Table {
  id: string;
  table_number: string;
  capacity: number;
  status: string;
}

interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  tables: Table[];
  onSave: (id: string, data: Partial<Reservation>) => Promise<void>;
}

const statusOptions = [
  { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
  { value: 'seated', label: 'Client assis', color: 'bg-green-100 text-green-800' },
  { value: 'completed', label: 'Terminée', color: 'bg-gray-100 text-gray-800' },
  { value: 'cancelled', label: 'Annulée', color: 'bg-red-100 text-red-800' },
  { value: 'no_show', label: 'Absent', color: 'bg-orange-100 text-orange-800' },
];

export default function EditReservationModal({
  isOpen,
  onClose,
  reservation,
  tables,
  onSave,
}: EditReservationModalProps) {
  const [formData, setFormData] = useState<Partial<Reservation>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reservation) {
      setFormData({
        table_id: reservation.table_id,
        guest_name: reservation.guest_name,
        guest_phone: reservation.guest_phone,
        guest_email: reservation.guest_email || '',
        number_of_guests: reservation.number_of_guests,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        duration_minutes: reservation.duration_minutes || 120,
        status: reservation.status,
        special_requests: reservation.special_requests || '',
      });
    }
  }, [reservation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) return;

    setLoading(true);
    try {
      await onSave(reservation.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating reservation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Reservation, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!reservation) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    Modifier la Réservation
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleChange('status', option.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            formData.status === option.value
                              ? option.color + ' ring-2 ring-offset-2 ring-blue-500'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du client *
                      </label>
                      <input
                        type="text"
                        value={formData.guest_name || ''}
                        onChange={(e) => handleChange('guest_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={formData.guest_phone || ''}
                        onChange={(e) => handleChange('guest_phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.guest_email || ''}
                      onChange={(e) => handleChange('guest_email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Reservation Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Date *
                      </label>
                      <input
                        type="date"
                        value={formData.reservation_date || ''}
                        onChange={(e) => handleChange('reservation_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Clock className="inline h-4 w-4 mr-1" />
                        Heure *
                      </label>
                      <input
                        type="time"
                        value={formData.reservation_time || ''}
                        onChange={(e) => handleChange('reservation_time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Users className="inline h-4 w-4 mr-1" />
                        Nombre de convives *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.number_of_guests || 2}
                        onChange={(e) => handleChange('number_of_guests', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Durée (minutes)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="480"
                        step="30"
                        value={formData.duration_minutes || 120}
                        onChange={(e) => handleChange('duration_minutes', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Table Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Table
                    </label>
                    <select
                      value={formData.table_id || ''}
                      onChange={(e) => handleChange('table_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner une table</option>
                      {tables.map((table) => (
                        <option key={table.id} value={table.id}>
                          Table {table.table_number} - {table.capacity} places ({table.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Demandes spéciales
                    </label>
                    <textarea
                      value={formData.special_requests || ''}
                      onChange={(e) => handleChange('special_requests', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Allergies, préférences de table, etc."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
