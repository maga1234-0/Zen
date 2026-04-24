import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Mail, Phone, MapPin, CreditCard, Pencil, Trash2, X, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';
import { useState } from 'react';
import { useToastContext } from '@/App';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export const Guests = () => {
  const toast = useToastContext();
  const confirmDialog = useConfirm();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [editingGuest, setEditingGuest] = useState<any>(null);
  const [newGuest, setNewGuest] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idType: '',
    idNumber: '',
    address: '',
    city: '',
    country: '',
  });

  const { data: guests, isLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const res = await api.get('/guests');
      return res.data;
    },
  });

  const createGuestMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/guests', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      setShowAddModal(false);
      setNewGuest({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        idType: '',
        idNumber: '',
        address: '',
        city: '',
        country: '',
      });
      toast.success('Guest added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add guest');
    },
  });

  const updateGuestMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/guests/${data.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      setShowEditModal(false);
      setEditingGuest(null);
      toast.success('Guest updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update guest');
    },
  });

  const deleteGuestMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/guests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast.success('Guest deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete guest');
    },
  });

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    createGuestMutation.mutate(newGuest);
  };

  const handleEditGuest = (e: React.FormEvent) => {
    e.preventDefault();
    updateGuestMutation.mutate(editingGuest);
  };

  const handleDelete = async (guest: any) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Delete Guest',
      message: `Are you sure you want to delete ${guest.first_name} ${guest.last_name}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (confirmed) {
      deleteGuestMutation.mutate(guest.id);
    }
  };

  const handleViewDetails = (guest: any) => {
    setSelectedGuest(guest);
    setShowDetailsModal(true);
  };

  const handleEdit = (guest: any) => {
    setEditingGuest({
      id: guest.id,
      firstName: guest.first_name,
      lastName: guest.last_name,
      email: guest.email || '',
      phone: guest.phone,
      idType: guest.id_type || '',
      idNumber: guest.id_number || '',
      address: guest.address || '',
      city: guest.city || '',
      country: guest.country || '',
    });
    setShowEditModal(true);
  };

  // Filter guests by search term
  const filteredGuests = guests?.filter((guest: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      guest.first_name.toLowerCase().includes(searchLower) ||
      guest.last_name.toLowerCase().includes(searchLower) ||
      (guest.email && guest.email.toLowerCase().includes(searchLower)) ||
      guest.phone.includes(searchTerm) ||
      (guest.country && guest.country.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Guests</h1>
          <p className="text-gray-500 dark:text-slate-300">Manage guest information</p>
        </div>
        <Button className="bg-seafoam-500 hover:bg-seafoam-600" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Guest
        </Button>
      </div>

      <Card>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or country..."
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
        ) : filteredGuests && filteredGuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGuests.map((guest: any) => (
              <div key={guest.id} onClick={() => handleViewDetails(guest)} className="cursor-pointer">
                <Card hover className="relative group h-full">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-seafoam-400 dark:bg-gold-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {guest.first_name[0]}{guest.last_name[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {guest.first_name} {guest.last_name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-slate-300">{guest.country || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {guest.email && guest.email.trim() !== '' ? (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{guest.email}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500 italic">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="text-xs">Email not provided</span>
                        </div>
                      )}
                      {guest.phone && guest.phone.trim() !== '' ? (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{guest.phone}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500 italic">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span className="text-xs">Phone not provided</span>
                        </div>
                      )}
                    </div>

                    {/* Incomplete profile badge */}
                    {(!guest.email || guest.email.trim() === '' || !guest.phone || guest.phone.trim() === '') && (
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                          Incomplete Profile
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(guest);
                        }}
                        className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                        title="Edit Guest"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(guest);
                        }}
                        className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                        title="Delete Guest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-slate-500 mb-4">
              <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No guests found</p>
              {searchTerm && <p className="text-sm mt-2">Try adjusting your search</p>}
            </div>
          </div>
        )}
      </Card>

      {/* Guest Details Modal - Continued in next part */}
      <AnimatePresence>
        {showDetailsModal && selectedGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-seafoam-400 dark:bg-gold-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {selectedGuest.first_name[0]}{selectedGuest.last_name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {selectedGuest.first_name} {selectedGuest.last_name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-300">Guest Information</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                      <span className="text-sm text-gray-500 dark:text-slate-400">Email</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white break-all">
                      {selectedGuest.email || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                      <span className="text-sm text-gray-500 dark:text-slate-400">Phone</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {selectedGuest.phone || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                      <span className="text-sm text-gray-500 dark:text-slate-400">ID Type</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {selectedGuest.id_type || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                      <span className="text-sm text-sm text-gray-500 dark:text-slate-400">ID Number</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {selectedGuest.id_number || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="border-t dark:border-slate-700 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-slate-400">Address:</span>
                      <span className="text-gray-800 dark:text-white text-right">
                        {selectedGuest.address || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-slate-400">City:</span>
                      <span className="text-gray-800 dark:text-white">
                        {selectedGuest.city || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-slate-400">Country:</span>
                      <span className="text-gray-800 dark:text-white">
                        {selectedGuest.country || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleEdit(selectedGuest);
                    }}
                    className="flex-1 bg-seafoam-500 hover:bg-seafoam-600"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Guest
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modals and Confirm Dialog will be in next message */}
      
      {/* Add Guest Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Guest</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddGuest} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newGuest.firstName}
                      onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newGuest.lastName}
                      onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newGuest.phone}
                      onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      ID Type
                    </label>
                    <select
                      value={newGuest.idType}
                      onChange={(e) => setNewGuest({ ...newGuest, idType: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Select ID Type</option>
                      <option value="Passport">Passport</option>
                      <option value="Driver License">Driver License</option>
                      <option value="National ID">National ID</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      ID Number
                    </label>
                    <input
                      type="text"
                      value={newGuest.idNumber}
                      onChange={(e) => setNewGuest({ ...newGuest, idNumber: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newGuest.address}
                    onChange={(e) => setNewGuest({ ...newGuest, address: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={newGuest.city}
                      onChange={(e) => setNewGuest({ ...newGuest, city: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={newGuest.country}
                      onChange={(e) => setNewGuest({ ...newGuest, country: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createGuestMutation.isPending}
                    className="flex-1 bg-seafoam-500 hover:bg-seafoam-600"
                  >
                    {createGuestMutation.isPending ? 'Adding...' : 'Add Guest'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Guest Modal */}
      <AnimatePresence>
        {showEditModal && editingGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Guest</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditGuest} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingGuest.firstName}
                      onChange={(e) => setEditingGuest({ ...editingGuest, firstName: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingGuest.lastName}
                      onChange={(e) => setEditingGuest({ ...editingGuest, lastName: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingGuest.email}
                      onChange={(e) => setEditingGuest({ ...editingGuest, email: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editingGuest.phone}
                      onChange={(e) => setEditingGuest({ ...editingGuest, phone: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      ID Type
                    </label>
                    <select
                      value={editingGuest.idType}
                      onChange={(e) => setEditingGuest({ ...editingGuest, idType: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Select ID Type</option>
                      <option value="Passport">Passport</option>
                      <option value="Driver License">Driver License</option>
                      <option value="National ID">National ID</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      ID Number
                    </label>
                    <input
                      type="text"
                      value={editingGuest.idNumber}
                      onChange={(e) => setEditingGuest({ ...editingGuest, idNumber: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editingGuest.address}
                    onChange={(e) => setEditingGuest({ ...editingGuest, address: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={editingGuest.city}
                      onChange={(e) => setEditingGuest({ ...editingGuest, city: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={editingGuest.country}
                      onChange={(e) => setEditingGuest({ ...editingGuest, country: e.target.value })}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateGuestMutation.isPending}
                    className="flex-1 bg-seafoam-500 hover:bg-seafoam-600"
                  >
                    {updateGuestMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
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
