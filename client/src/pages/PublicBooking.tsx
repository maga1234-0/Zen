import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, CreditCard, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import api from '@/services/api';

interface RoomAvailability {
  type: string;
  price: number;
  available: number;
  total_rooms: number;
  capacity: { min: number; max: number };
}

interface BookingSettings {
  is_enabled: boolean;
  min_advance_days: number;
  max_advance_days: number;
  min_stay_nights: number;
  max_stay_nights: number;
  require_deposit: boolean;
  deposit_percentage: number;
  cancellation_hours: number;
}

export const PublicBooking = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [availableRooms, setAvailableRooms] = useState<RoomAvailability[]>([]);
  
  // Form data
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  // Guest information
  const [guestInfo, setGuestInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    city: '',
    postal_code: '',
    special_requests: '',
    arrival_time: ''
  });

  const [bookingReference, setBookingReference] = useState('');
  const [error, setError] = useState('');

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/online-booking/public/settings');
      setSettings(response.data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const searchAvailability = async () => {
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.get('/online-booking/public/availability', {
        params: { check_in: checkIn, check_out: checkOut }
      });
      setAvailableRooms(response.data);
      if (response.data.length === 0) {
        setError('No rooms available for selected dates');
      } else {
        setStep(2);
      }
    } catch (err) {
      setError('Failed to check availability');
    } finally {
      setLoading(false);
    }
  };

  const validatePromoCode = async () => {
    if (!promoCode) return;

    const selectedRoom = availableRooms.find(r => r.type === selectedRoomType);
    if (!selectedRoom) return;

    const nights = calculateNights();
    const subtotal = selectedRoom.price * nights;

    try {
      const response = await api.post('/online-booking/public/validate-promo', {
        code: promoCode,
        room_type: selectedRoomType,
        check_in: checkIn,
        check_out: checkOut,
        total_amount: subtotal
      });
      setPromoDiscount(response.data.discount_amount);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid promo code');
      setPromoDiscount(0);
    }
  };

  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const selectedRoom = availableRooms.find(r => r.type === selectedRoomType);
    if (!selectedRoom) return { subtotal: 0, tax: 0, total: 0, deposit: 0 };

    const nights = calculateNights();
    let subtotal = selectedRoom.price * nights - promoDiscount;
    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    const deposit = settings?.require_deposit ? (total * (settings.deposit_percentage / 100)) : 0;

    return { subtotal, tax, total, deposit };
  };

  const submitBooking = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/online-booking/public/bookings', {
        ...guestInfo,
        guest_first_name: guestInfo.first_name,
        guest_last_name: guestInfo.last_name,
        guest_email: guestInfo.email,
        guest_phone: guestInfo.phone,
        guest_country: guestInfo.country,
        guest_address: guestInfo.address,
        guest_city: guestInfo.city,
        guest_postal_code: guestInfo.postal_code,
        room_type: selectedRoomType,
        check_in_date: checkIn,
        check_out_date: checkOut,
        number_of_guests: numberOfGuests,
        special_requests: guestInfo.special_requests,
        arrival_time: guestInfo.arrival_time,
        promo_code: promoCode || null
      });
      setBookingReference(response.data.booking_reference);
      setStep(4);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const date = new Date();
    if (settings) {
      date.setDate(date.getDate() + settings.min_advance_days);
    }
    return date.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const date = new Date();
    if (settings) {
      date.setDate(date.getDate() + settings.max_advance_days);
    }
    return date.toISOString().split('T')[0];
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-seafoam-50 to-mint-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-seafoam-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!settings.is_enabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-seafoam-50 to-mint-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Réservation en ligne désactivée</h2>
          <p className="text-gray-600">
            Les réservations en ligne ne sont pas disponibles pour le moment. 
            Veuillez nous contacter directement.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-seafoam-50 to-mint-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Réservation en ligne
          </h1>
          <p className="text-gray-600">Réservez votre chambre en quelques clics</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-seafoam-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 4 && <div className={`w-16 h-1 ${step > s ? 'bg-seafoam-500' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Select Dates */}
        {step === 1 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-seafoam-500" />
              Sélectionnez vos dates
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'arrivée
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seafoam-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de départ
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seafoam-500"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de personnes
              </label>
              <input
                type="number"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                min="1"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seafoam-500"
              />
            </div>
            <Button
              onClick={searchAvailability}
              disabled={loading || !checkIn || !checkOut}
              className="w-full mt-6"
            >
              {loading ? 'Recherche...' : 'Rechercher les disponibilités'}
            </Button>
          </Card>
        )}

        {/* Step 2: Select Room */}
        {step === 2 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Choisissez votre chambre
            </h2>
            <div className="space-y-4">
              {availableRooms.map((room) => (
                <div
                  key={room.type}
                  onClick={() => setSelectedRoomType(room.type)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRoomType === room.type
                      ? 'border-seafoam-500 bg-seafoam-50'
                      : 'border-gray-200 hover:border-seafoam-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{room.type}</h3>
                      <p className="text-gray-600 mt-1">
                        Capacité: {room.capacity.min}-{room.capacity.max} personnes
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {room.available} chambre(s) disponible(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-seafoam-600">
                        {room.price}€
                      </p>
                      <p className="text-sm text-gray-500">par nuit</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Retour
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedRoomType}
                className="flex-1"
              >
                Continuer
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Guest Information */}
        {step === 3 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Vos informations
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={guestInfo.first_name}
                  onChange={(e) => setGuestInfo({...guestInfo, first_name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seafoam-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={guestInfo.last_name}
                  onChange={(e) => setGuestInfo({...guestInfo, last_name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seafoam-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seafoam-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seafoam-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays
                </label>
                <input
                  type="text"
                  value={guestInfo.country}
                  onChange={(e) => setGuestInfo({...guestInfo, country: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seafoam-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  value={guestInfo.city}
                  onChange={(e) => setGuestInfo({...guestInfo, city: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seafoam-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Demandes spéciales
              </label>
              <textarea
                value={guestInfo.special_requests}
                onChange={(e) => setGuestInfo({...guestInfo, special_requests: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seafoam-500"
              />
            </div>

            {/* Promo Code */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code promo
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seafoam-500"
                  placeholder="PROMO2026"
                />
                <Button onClick={validatePromoCode} variant="outline">
                  Valider
                </Button>
              </div>
              {promoDiscount > 0 && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ Réduction de {promoDiscount.toFixed(2)}€ appliquée
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Récapitulatif</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Chambre {selectedRoomType}</span>
                  <span>{calculateNights()} nuit(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{calculateTotal().subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (10%)</span>
                  <span>{calculateTotal().tax.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{calculateTotal().total.toFixed(2)}€</span>
                </div>
                {settings.require_deposit && (
                  <div className="flex justify-between text-seafoam-600">
                    <span>Acompte requis ({settings.deposit_percentage}%)</span>
                    <span>{calculateTotal().deposit.toFixed(2)}€</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Retour
              </Button>
              <Button
                onClick={submitBooking}
                disabled={loading || !guestInfo.first_name || !guestInfo.last_name || !guestInfo.email || !guestInfo.phone}
                className="flex-1"
              >
                {loading ? 'Création...' : 'Confirmer la réservation'}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Réservation confirmée !
            </h2>
            <p className="text-gray-600 mb-6">
              Votre réservation a été créée avec succès.
            </p>
            <div className="bg-seafoam-50 p-6 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-2">Référence de réservation</p>
              <p className="text-2xl font-bold text-seafoam-600">{bookingReference}</p>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Un email de confirmation a été envoyé à {guestInfo.email}
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setStep(1);
                  setCheckIn('');
                  setCheckOut('');
                  setSelectedRoomType('');
                  setGuestInfo({
                    first_name: '', last_name: '', email: '', phone: '',
                    country: '', address: '', city: '', postal_code: '',
                    special_requests: '', arrival_time: ''
                  });
                  setBookingReference('');
                  setPromoCode('');
                  setPromoDiscount(0);
                }}
                className="w-full"
              >
                Faire une nouvelle réservation
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
