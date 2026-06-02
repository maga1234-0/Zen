import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import api from '@/services/api';
import { useToastContext } from '@/App';

interface CreateBookingModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category_name: string;
}

interface Package {
  id: string;
  name: string;
  package_price: number;
  total_duration: number;
}

interface Therapist {
  id: string;
  first_name: string;
  last_name: string;
  specialties: string[];
}

interface Booking {
  id: string;
  room_number: string;
  guest_name: string;
}

export const CreateBookingModal = ({ onClose, onSuccess }: CreateBookingModalProps) => {
  const toast = useToastContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Data states
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);

  // Form states
  const [bookingType, setBookingType] = useState<'service' | 'package'>('service');
  const [selectedService, setSelectedService] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
    booking_id: '', // Si client hôtel
  });
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servicesRes, packagesRes, therapistsRes, bookingsRes] = await Promise.all([
        api.get('/spa/services'),
        api.get('/spa/packages'),
        api.get('/spa/therapists'),
        api.get('/bookings?status=checked_in'),
      ]);

      setServices(servicesRes.data || []);
      setPackages(packagesRes.data || []);
      setTherapists(therapistsRes.data || []);
      setActiveBookings(bookingsRes.data || []);
    } catch (error) {
      console.error('Load data error:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

  const calculateEndTime = () => {
    if (!startTime) return '';

    let duration = 0;
    if (bookingType === 'service' && selectedService) {
      const service = services.find(s => s.id === selectedService);
      duration = service?.duration || 0;
    } else if (bookingType === 'package' && selectedPackage) {
      const pkg = packages.find(p => p.id === selectedPackage);
      duration = pkg?.total_duration || 0;
    }

    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  const calculateTotal = () => {
    if (bookingType === 'service' && selectedService) {
      const service = services.find(s => s.id === selectedService);
      return service?.price || 0;
    } else if (bookingType === 'package' && selectedPackage) {
      const pkg = packages.find(p => p.id === selectedPackage);
      return pkg?.package_price || 0;
    }
    return 0;
  };

  const handleSubmit = async () => {
    // Validation
    if (bookingType === 'service' && !selectedService) {
      toast.error('Veuillez sélectionner un service');
      return;
    }
    if (bookingType === 'package' && !selectedPackage) {
      toast.error('Veuillez sélectionner un forfait');
      return;
    }
    if (!bookingDate || !startTime) {
      toast.error('Veuillez renseigner la date et l\'heure');
      return;
    }
    if (!selectedTherapist) {
      toast.error('Veuillez sélectionner un thérapeute');
      return;
    }
    if (!guestInfo.name || !guestInfo.phone) {
      toast.error('Veuillez renseigner les informations du client');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        treatment_id: bookingType === 'service' ? selectedService : null,
        package_id: bookingType === 'package' ? selectedPackage : null,
        guest_id: null, // À implémenter si nécessaire
        booking_id: guestInfo.booking_id || null,
        therapist_id: selectedTherapist,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: calculateEndTime(),
        guest_name: guestInfo.name,
        guest_email: guestInfo.email || null,
        guest_phone: guestInfo.phone,
        notes: notes || null,
        total_amount: calculateTotal(),
        payment_method: paymentMethod,
        payment_status: 'paid',
        status: 'confirmed',
      };

      await api.post('/spa/bookings', bookingData);
      toast.success('Réservation créée avec succès!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Create booking error:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !((bookingType === 'service' && selectedService) || (bookingType === 'package' && selectedPackage))) {
      toast.error('Veuillez sélectionner un service ou forfait');
      return;
    }
    if (step === 2 && (!bookingDate || !startTime || !selectedTherapist)) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl p-6 border dark:border-slate-700 my-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-500" />
                Nouvelle Réservation Spa
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                Étape {step} sur 3
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${step >= 1 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                Service
              </span>
              <span className={`text-xs font-medium ${step >= 2 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                Date & Thérapeute
              </span>
              <span className={`text-xs font-medium ${step >= 3 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                Client & Paiement
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Select Service/Package */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setBookingType('service')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    bookingType === 'service'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-300 dark:border-slate-600 hover:border-purple-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Service Individuel</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Choisissez un soin</p>
                </button>
                <button
                  onClick={() => setBookingType('package')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    bookingType === 'package'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-300 dark:border-slate-600 hover:border-purple-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Forfait</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Package de soins</p>
                </button>
              </div>

              {bookingType === 'service' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-1">
                  {services.map(service => (
                    <Card
                      key={service.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedService === service.id
                          ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                        {selectedService === service.id && (
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{service.category_name}</p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {service.duration} min
                        </span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {service.price.toFixed(2)}€
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-1">
                  {packages.map(pkg => (
                    <Card
                      key={pkg.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{pkg.name}</h3>
                        {selectedPackage === pkg.id && (
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {pkg.total_duration} min
                        </span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {pkg.package_price.toFixed(2)}€
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date, Time & Therapist */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              {startTime && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-300">
                    <strong>Heure de fin estimée:</strong> {calculateEndTime()}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Thérapeute
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                  {therapists.filter(t => t.is_active).map(therapist => (
                    <Card
                      key={therapist.id}
                      className={`p-3 cursor-pointer transition-all ${
                        selectedTherapist === therapist.id
                          ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedTherapist(therapist.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {therapist.first_name} {therapist.last_name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            {therapist.specialties.join(', ')}
                          </p>
                        </div>
                        {selectedTherapist === therapist.id && (
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Client Info & Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Informations Client</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Client hôtel (optionnel)
                  </label>
                  <select
                    value={guestInfo.booking_id}
                    onChange={(e) => {
                      const booking = activeBookings.find(b => b.id === e.target.value);
                      if (booking) {
                        setGuestInfo({
                          ...guestInfo,
                          booking_id: e.target.value,
                          name: booking.guest_name,
                        });
                      } else {
                        setGuestInfo({ ...guestInfo, booking_id: '' });
                      }
                    }}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Client externe</option>
                    {activeBookings.map(booking => (
                      <option key={booking.id} value={booking.id}>
                        Chambre {booking.room_number} - {booking.guest_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                      placeholder="Jean Dupont"
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Email (optionnel)
                    </label>
                    <input
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                      placeholder="jean.dupont@email.com"
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Notes spéciales (optionnel)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Allergies, préférences, demandes spéciales..."
                  className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Paiement</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { value: 'cash', label: 'Espèces' },
                    { value: 'card', label: 'Carte' },
                    { value: 'transfer', label: 'Virement' },
                    { value: 'room_charge', label: 'Chambre' },
                  ].map(method => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      disabled={method.value === 'room_charge' && !guestInfo.booking_id}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        paymentMethod === method.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-slate-600 hover:border-purple-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{method.label}</p>
                    </button>
                  ))}
                </div>

                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total à payer</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {calculateTotal().toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t dark:border-slate-700">
            <Button
              onClick={step === 1 ? onClose : prevStep}
              variant="secondary"
              className="dark:border-slate-600 dark:text-slate-200"
            >
              {step === 1 ? 'Annuler' : 'Précédent'}
            </Button>

            {step < 3 ? (
              <Button onClick={nextStep} className="bg-purple-500 hover:bg-purple-600">
                Suivant
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-purple-500 hover:bg-purple-600"
              >
                {loading ? 'Création...' : 'Créer la Réservation'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
