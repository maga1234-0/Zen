import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, Phone, Mail, User, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

interface CreateReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReservationFormData) => void;
}

export interface ReservationFormData {
  table_id: string;
  guest_id: string | null; // Si lié à un guest existant
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  number_of_guests: number;
  reservation_date: string;
  reservation_time: string;
  duration_minutes: number;
  special_requests: string;
  reservation_type: 'hotel' | 'external'; // Nouveau champ
}

export const CreateReservationModal = ({ isOpen, onClose, onSubmit }: CreateReservationModalProps) => {
  const [step, setStep] = useState(1); // 1: Type, 2: Table & Date, 3: Guest Info
  const [formData, setFormData] = useState<ReservationFormData>({
    table_id: '',
    guest_id: null,
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    number_of_guests: 2,
    reservation_date: new Date().toISOString().split('T')[0],
    reservation_time: '19:00',
    duration_minutes: 120,
    special_requests: '',
    reservation_type: 'external',
  });

  const [guestSearchTerm, setGuestSearchTerm] = useState('');
  const [showGuestSearch, setShowGuestSearch] = useState(false);

  // Fetch available tables
  const { data: tables } = useQuery({
    queryKey: ['restaurant-tables'],
    queryFn: async () => {
      const res = await api.get('/restaurant/tables');
      return res.data;
    },
    enabled: isOpen,
  });

  // Fetch guests (for hotel guests)
  const { data: guests } = useQuery({
    queryKey: ['guests-search', guestSearchTerm],
    queryFn: async () => {
      const res = await api.get(`/guests?search=${guestSearchTerm}`);
      return res.data;
    },
    enabled: showGuestSearch && guestSearchTerm.length > 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setStep(1);
    setFormData({
      table_id: '',
      guest_id: null,
      guest_name: '',
      guest_phone: '',
      guest_email: '',
      number_of_guests: 2,
      reservation_date: new Date().toISOString().split('T')[0],
      reservation_time: '19:00',
      duration_minutes: 120,
      special_requests: '',
      reservation_type: 'external',
    });
  };

  const selectGuest = (guest: any) => {
    setFormData({
      ...formData,
      guest_id: guest.id,
      guest_name: `${guest.first_name} ${guest.last_name}`,
      guest_phone: guest.phone || '',
      guest_email: guest.email || '',
    });
    setShowGuestSearch(false);
    setGuestSearchTerm('');
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceedStep1 = formData.reservation_type === 'hotel' || formData.reservation_type === 'external';
  const canProceedStep2 = formData.table_id !== '' && formData.reservation_date !== '' && formData.reservation_time !== '';
  const canSubmit = formData.guest_name !== '' && formData.guest_phone !== '';

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border dark:border-slate-700 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 px-6 py-4 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Nouvelle Réservation
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-slate-300" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    s <= step ? 'bg-orange-500' : 'bg-gray-200 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-slate-400">
              Étape {step} sur 3: {step === 1 ? 'Type de réservation' : step === 2 ? 'Table & Date' : 'Informations client'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* STEP 1: Type de réservation */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-4">
                    Type de réservation
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, reservation_type: 'hotel' })}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.reservation_type === 'hotel'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-slate-600 hover:border-orange-300'
                      }`}
                    >
                      <Home className="w-12 h-12 mx-auto mb-3 text-orange-500" />
                      <div className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        Client Hôtel
                      </div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">
                        Lié à une réservation de chambre
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, reservation_type: 'external' })}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.reservation_type === 'external'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-slate-600 hover:border-orange-300'
                      }`}
                    >
                      <User className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                      <div className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        Client Externe
                      </div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">
                        Walk-in ou réservation externe
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Table & Date */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Select Table */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Table <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.table_id}
                    onChange={(e) => setFormData({ ...formData, table_id: e.target.value })}
                    className="w-full px-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Sélectionner une table</option>
                    {tables?.map((table: any) => (
                      <option key={table.id} value={table.id}>
                        Table {table.table_number} - {table.capacity} personnes ({table.location})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Nombre de personnes <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="20"
                    value={formData.number_of_guests}
                    onChange={(e) => setFormData({ ...formData, number_of_guests: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.reservation_date}
                      onChange={(e) => setFormData({ ...formData, reservation_date: e.target.value })}
                      className="w-full px-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Heure <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.reservation_time}
                      onChange={(e) => setFormData({ ...formData, reservation_time: e.target.value })}
                      className="w-full px-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Durée (minutes)
                  </label>
                  <select
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="60">1 heure</option>
                    <option value="90">1h30</option>
                    <option value="120">2 heures</option>
                    <option value="150">2h30</option>
                    <option value="180">3 heures</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3: Guest Information */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Search Guest (if hotel type) */}
                {formData.reservation_type === 'hotel' && !formData.guest_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                      Rechercher un client
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={guestSearchTerm}
                        onChange={(e) => {
                          setGuestSearchTerm(e.target.value);
                          setShowGuestSearch(true);
                        }}
                        placeholder="Nom, email ou téléphone..."
                        className="w-full pl-10 pr-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white"
                      />
                    </div>

                    {/* Guest Search Results */}
                    {showGuestSearch && guests && guests.length > 0 && (
                      <div className="mt-2 border dark:border-slate-600 rounded-lg max-h-48 overflow-y-auto">
                        {guests.map((guest: any) => (
                          <button
                            key={guest.id}
                            type="button"
                            onClick={() => selectGuest(guest)}
                            className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 border-b dark:border-slate-700 last:border-b-0"
                          >
                            <div className="font-medium text-gray-800 dark:text-white">
                              {guest.first_name} {guest.last_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-slate-400">
                              {guest.email} • {guest.phone}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Guest Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guest_name}
                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                    className="w-full px-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white"
                    placeholder="Jean Dupont"
                    disabled={formData.reservation_type === 'hotel' && !!formData.guest_id}
                  />
                </div>

                {/* Guest Phone & Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.guest_phone}
                      onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                      className="w-full px-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white"
                      placeholder="+33 6 12 34 56 78"
                      disabled={formData.reservation_type === 'hotel' && !!formData.guest_id}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.guest_email}
                      onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                      className="w-full px-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white"
                      placeholder="jean@example.com"
                      disabled={formData.reservation_type === 'hotel' && !!formData.guest_id}
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Demandes spéciales
                  </label>
                  <textarea
                    value={formData.special_requests}
                    onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white resize-none"
                    placeholder="Allergies, préférences, occasion spéciale..."
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-6 mt-6 border-t dark:border-slate-700">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 border dark:border-slate-600 dark:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Retour
                </button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Créer la Réservation
                </Button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};
