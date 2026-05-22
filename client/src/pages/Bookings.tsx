import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, X, Edit2, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastContext } from '@/App';
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export const Bookings = () => {
  const toast = useToastContext();
  const confirmDialog = useConfirm();
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const queryClient = useQueryClient();
  
  const [bookingData, setBookingData] = useState({
    guestName: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    status: 'pending',
    specialRequests: '',
  });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings');
      return res.data;
    },
  });

  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await api.get('/rooms');
      return res.data;
    },
  });

  const { data: guests } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const res = await api.get('/guests');
      return res.data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingBooking) {
        // Update existing booking
        const checkIn = new Date(bookingData.checkInDate);
        const checkOut = new Date(bookingData.checkOutDate);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        
        // Get room price for calculation
        const room = rooms?.find((r: any) => r.id === editingBooking.room_id);
        const roomPrice = room?.base_price || 100;
        const totalAmount = nights * roomPrice;

        // Check if status changed
        const statusChanged = editingBooking.status !== bookingData.status;

        // Update booking details
        await api.patch(`/bookings/${editingBooking.id}`, {
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          numberOfGuests: bookingData.numberOfGuests,
          status: bookingData.status,
          totalAmount,
          specialRequests: bookingData.specialRequests,
        });

        // If status changed, also call the status endpoint to update room status
        if (statusChanged) {
          await api.patch(`/bookings/${editingBooking.id}/status`, {
            status: bookingData.status,
          });
          console.log(`✅ Booking status changed from ${editingBooking.status} to ${bookingData.status}`);
        }

        toast.success('Booking updated successfully!');
      } else {
        // Create new booking
        const checkIn = new Date(bookingData.checkInDate);
        const checkOut = new Date(bookingData.checkOutDate);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        
        // Get room price for calculation
        const room = rooms?.find((r: any) => r.id === bookingData.roomId);
        const roomPrice = room?.base_price || 100;
        const totalAmount = nights * roomPrice;

        // Parse guest name - handle various formats
        const nameParts = bookingData.guestName.trim().split(/\s+/); // Split by any whitespace
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''; // Empty string if no last name provided

        // Check if guest already exists (case-insensitive, trimmed comparison)
        const guestsResponse = await api.get('/guests');
        const existingGuest = guestsResponse.data.find((g: any) => {
          const existingFirst = g.first_name.toLowerCase().trim();
          const existingLast = (g.last_name || '').toLowerCase().trim();
          const inputFirst = firstName.toLowerCase().trim();
          const inputLast = lastName.toLowerCase().trim();
          
          // Match if both first and last names match (or both last names are empty)
          return existingFirst === inputFirst && existingLast === inputLast;
        });

        let guestId;
        if (existingGuest) {
          guestId = existingGuest.id;
          console.log('✅ Using existing guest:', existingGuest);
          toast.info(`Using existing guest: ${existingGuest.first_name} ${existingGuest.last_name}`);
        } else {
          // Create minimal guest record (can be completed later in Guests page)
          const guestResponse = await api.post('/guests', {
            firstName: firstName.trim(),
            lastName: lastName.trim() || firstName.trim(), // Use first name as last name if empty (required by DB)
            phone: null, // NULL - to be filled later
            email: null, // NULL - to be filled later
          });
          guestId = guestResponse.data.id;
          console.log('✅ Created minimal guest record:', guestResponse.data);
          toast.info('New guest created. Complete their details in the Guests page.');
        }

        const payload = {
          hotelId: '550e8400-e29b-41d4-a716-446655440000',
          guestId,
          roomId: bookingData.roomId,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          numberOfGuests: bookingData.numberOfGuests,
          status: bookingData.status,
          totalAmount,
          specialRequests: bookingData.specialRequests,
        };

        try {
          await api.post('/bookings', payload);
          toast.success('Booking created successfully!');
        } catch (error: any) {
          if (error.response?.data?.message?.includes('already booked')) {
            toast.error('This room is already booked for these dates!');
          } else {
            throw error;
          }
        }
      }
      
      setShowBookingModal(false);
      setEditingBooking(null);
      setBookingData({
        guestName: '',
        roomId: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        status: 'pending',
        specialRequests: '',
      });
      
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] }); // Refresh rooms to show updated status
    } catch (error: any) {
      console.error('❌ Error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Operation failed';
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (booking: any) => {
    setEditingBooking(booking);
    setBookingData({
      guestName: booking.guest_name,
      roomId: booking.room_id,
      checkInDate: booking.check_in_date.split('T')[0],
      checkOutDate: booking.check_out_date.split('T')[0],
      numberOfGuests: booking.number_of_guests,
      status: booking.status,
      specialRequests: booking.special_requests || '',
    });
    setShowBookingModal(true);
  };

  const handleDelete = async (bookingId: string) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Delete Booking',
      message: 'Are you sure you want to delete this booking? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      await api.delete(`/bookings/${bookingId}`);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] }); // Refresh rooms to show updated status
      toast.success('Booking deleted successfully!');
    } catch (error: any) {
      console.error('❌ Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setEditingBooking(null);
    setBookingData({
      guestName: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
      status: 'pending',
      specialRequests: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'checked_in':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'checked_out':
        return 'bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-slate-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-slate-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bookings</h1>
          <p className="text-gray-500 dark:text-slate-300">Manage reservations and check-ins</p>
        </div>
        <Button 
          onClick={() => setShowBookingModal(true)}
          className="bg-seafoam-500 hover:bg-seafoam-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      <Card>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>

        {isLoading ? (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Check-out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-200 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {bookings?.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {booking.guest_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                      Room {booking.room_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                      {new Date(booking.check_in_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-seafoam-600 dark:text-gold-400">
                      ${booking.total_amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(booking)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit booking"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AnimatePresence>
        {showBookingModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 border dark:border-slate-700 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {editingBooking ? 'Edit Booking' : 'New Booking'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-slate-300" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!editingBooking && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                        Guest Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.guestName}
                        onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })}
                        className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                        placeholder="John Doe"
                        list="guest-suggestions"
                      />
                      <datalist id="guest-suggestions">
                        {guests?.map((guest: any) => (
                          <option key={guest.id} value={`${guest.first_name} ${guest.last_name}`} />
                        ))}
                      </datalist>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Enter guest name. Complete details later in Guests page.
                      </p>
                    </div>
                  )}

                  {editingBooking && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm text-gray-600 dark:text-slate-300">
                        <span className="font-medium">Guest:</span> {editingBooking.guest_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-300">
                        <span className="font-medium">Room:</span> {editingBooking.room_number}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {!editingBooking && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                          Room
                        </label>
                        <select
                          required
                          value={bookingData.roomId}
                          onChange={(e) => setBookingData({ ...bookingData, roomId: e.target.value })}
                          className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                        >
                          <option value="">Select Room</option>
                          {rooms?.filter((room: any) => {
                            // Only show available rooms (not occupied, dirty, maintenance, etc.)
                            return room.status === 'available';
                          }).map((room: any) => (
                            <option key={room.id} value={room.id}>
                              Room {room.room_number} - {room.type_name} (${room.base_price}/night)
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                          Only available rooms are shown
                        </p>
                      </div>
                    )}

                    <div className={!editingBooking ? '' : 'col-span-2'}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                        Booking Status
                      </label>
                      <select
                        required
                        value={bookingData.status}
                        onChange={(e) => setBookingData({ ...bookingData, status: e.target.value })}
                        className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="checked_in">Checked In</option>
                        <option value="checked_out">Checked Out</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingData.checkInDate}
                        onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
                        className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingData.checkOutDate}
                        onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
                        className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={bookingData.numberOfGuests}
                      onChange={(e) => setBookingData({ ...bookingData, numberOfGuests: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                      placeholder="Any special requirements..."
                    />
                  </div>

                  {/* Price Calculation Display */}
                  {bookingData.roomId && bookingData.checkInDate && bookingData.checkOutDate && (() => {
                    const room = rooms?.find((r: any) => r.id === (editingBooking ? editingBooking.room_id : bookingData.roomId));
                    const checkIn = new Date(bookingData.checkInDate);
                    const checkOut = new Date(bookingData.checkOutDate);
                    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                    const roomPrice = room?.base_price || 0;
                    const totalAmount = nights * roomPrice;

                    return nights > 0 && (
                      <div className="bg-seafoam-50 dark:bg-seafoam-900/20 border border-seafoam-200 dark:border-seafoam-800 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-slate-300">Room Price per Night:</span>
                            <span className="font-semibold text-gray-800 dark:text-white">${roomPrice}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-slate-300">Number of Nights:</span>
                            <span className="font-semibold text-gray-800 dark:text-white">{nights}</span>
                          </div>
                          <div className="border-t border-seafoam-300 dark:border-seafoam-700 pt-2 mt-2">
                            <div className="flex justify-between">
                              <span className="font-bold text-gray-800 dark:text-white">Total Amount:</span>
                              <span className="text-xl font-bold text-seafoam-600 dark:text-seafoam-400">${totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCloseModal}
                      className="flex-1 dark:border-slate-600 dark:text-slate-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-seafoam-500 hover:bg-seafoam-600 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {editingBooking ? 'Updating...' : 'Creating...'}
                        </div>
                      ) : (
                        editingBooking ? 'Update Booking' : 'Create Booking'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.options.title}
        message={confirmDialog.options.message}
        confirmText={confirmDialog.options.confirmText}
        cancelText={confirmDialog.options.cancelText}
        type={confirmDialog.options.type}
        onConfirm={confirmDialog.handleConfirm}
        onCancel={confirmDialog.handleCancel}
      />
    </div>
  );
};
