import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Pencil, Trash2, Calendar, X, Info, Bed, DollarSign, Home, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';
import { useState } from 'react';
import { useToastContext } from '@/App';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAuthStore } from '@/store/authStore';

export const Rooms = () => {
  const { t } = useTranslation();
  const toast = useToastContext();
  const confirmDialog = useConfirm();
  const { user } = useAuthStore();
  const canManageRooms = user?.role === 'admin' || user?.role === 'manager';
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showQuickBookModal, setShowQuickBookModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [maintenanceReason, setMaintenanceReason] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    roomType: 'all',
    floor: 'all',
  });
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    floor: 1,
    roomTypeId: '',
    status: 'available',
    customPrice: '',
  });
  const [bookingData, setBookingData] = useState({
    guestName: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
  });
  const queryClient = useQueryClient();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await api.get('/rooms');
      return res.data;
    },
  });

  const { data: roomTypes } = useQuery({
    queryKey: ['room-types'],
    queryFn: async () => {
      const res = await api.get('/rooms/types');
      return res.data;
    },
  });

  const createRoomMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/rooms', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setShowAddModal(false);
      setNewRoom({
        roomNumber: '',
        floor: 1,
        roomTypeId: '',
        status: 'available',
        customPrice: '',
      });
      toast.success('Room created successfully!');
    },
    onError: (error: any) => {
      console.error('Create room error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create room';
      toast.error(errorMessage);
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/rooms/${data.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setShowEditModal(false);
      setEditingRoom(null);
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/rooms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const handleEdit = (room: any) => {
    setEditingRoom({
      id: room.id,
      room_number: room.room_number,
      floor: room.floor,
      status: room.status,
    });
    setMaintenanceReason(room.maintenance_reason || '');
    setIsUrgent(room.is_urgent || false);
    setShowEditModal(true);
  };

  const handleDelete = async (room: any) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Delete Room',
      message: `Are you sure you want to delete Room ${room.room_number}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (confirmed) {
      deleteRoomMutation.mutate(room.id);
      toast.success(`Room ${room.room_number} deleted successfully`);
    }
  };

  const handleViewDetails = (room: any) => {
    setSelectedRoom(room);
    setShowDetailsModal(true);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate maintenance fields if status is maintenance
    if (editingRoom.status === 'maintenance' && !maintenanceReason.trim()) {
      toast.error('Please provide a reason for maintenance');
      return;
    }
    
    const updateData = {
      ...editingRoom,
      maintenanceReason: editingRoom.status === 'maintenance' ? maintenanceReason : null,
      isUrgent: editingRoom.status === 'maintenance' ? isUrgent : false,
    };
    
    updateRoomMutation.mutate(updateData);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const hotelId = '550e8400-e29b-41d4-a716-446655440000';
    createRoomMutation.mutate({
      hotelId,
      roomTypeId: newRoom.roomTypeId,
      roomNumber: newRoom.roomNumber,
      floor: newRoom.floor,
      status: newRoom.status,
      customPrice: newRoom.customPrice ? parseFloat(newRoom.customPrice) : null,
    });
  };

  const handleQuickBook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create or get guest
      const guestRes = await api.post('/guests', {
        firstName: bookingData.guestName.split(' ')[0],
        lastName: bookingData.guestName.split(' ').slice(1).join(' ') || bookingData.guestName.split(' ')[0],
        email: `${bookingData.guestName.toLowerCase().replace(/\s+/g, '')}@guest.com`,
        phone: '000-000-0000',
      });

      const guestId = guestRes.data.id;
      const hotelId = '550e8400-e29b-41d4-a716-446655440000'; // Correct hotel ID

      // Calculate total amount (days * base_price)
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = days * (selectedRoom?.base_price || 100);

      // Create booking
      await api.post('/bookings', {
        hotelId,
        guestId,
        roomId: selectedRoom.id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: bookingData.numberOfGuests,
        totalAmount,
        status: 'confirmed',
        specialRequests: '',
      });

      toast.success(`Room ${selectedRoom.room_number} booked successfully!`);
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setShowQuickBookModal(false);
      setBookingData({
        guestName: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
      });
    } catch (error: any) {
      console.error('Quick booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'occupied':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cleaning':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'dirty':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-slate-200';
    }
  };

  // Filter and search rooms
  const filteredRooms = rooms?.filter((room: any) => {
    // Search filter
    const matchesSearch = 
      room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.type_name && room.type_name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = filters.status === 'all' || room.status === filters.status;

    // Room type filter
    const matchesRoomType = filters.roomType === 'all' || room.type_name === filters.roomType;

    // Floor filter
    const matchesFloor = filters.floor === 'all' || room.floor.toString() === filters.floor;

    return matchesSearch && matchesStatus && matchesRoomType && matchesFloor;
  });

  // Get unique floors for filter
  const uniqueFloors = [...new Set(rooms?.map((room: any) => room.floor))].sort((a: any, b: any) => a - b);

  // Get unique room types for filter
  const uniqueRoomTypes = [...new Set(rooms?.map((room: any) => room.type_name).filter(Boolean))];

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      roomType: 'all',
      floor: 'all',
    });
    setSearchTerm('');
  };

  // Check if any filters are active
  const hasActiveFilters = filters.status !== 'all' || filters.roomType !== 'all' || filters.floor !== 'all' || searchTerm !== '';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('rooms.title')}</h1>
          <p className="text-gray-500 dark:text-slate-300">{t('rooms.subtitle')}</p>
        </div>
        {canManageRooms && (
          <Button className="bg-seafoam-500 hover:bg-seafoam-600" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('rooms.addRoom')}
          </Button>
        )}
      </div>

      <Card>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by room number or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <Button 
            variant="secondary" 
            className="dark:border-slate-600 dark:text-slate-200"
            onClick={() => setShowFilterModal(true)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 bg-seafoam-500 text-white text-xs rounded-full">
                Active
              </span>
            )}
          </Button>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="text-gray-600 dark:text-slate-300"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                Search: "{searchTerm}"
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                Status: {filters.status}
              </span>
            )}
            {filters.roomType !== 'all' && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                Type: {filters.roomType}
              </span>
            )}
            {filters.floor !== 'all' && (
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm">
                Floor: {filters.floor}
              </span>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-seafoam-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredRooms && filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRooms.map((room: any) => (
              <div key={room.id} onClick={() => handleViewDetails(room)} className="cursor-pointer">
                <Card hover className="relative group overflow-hidden h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Room {room.room_number}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(room.status)}`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-300">
                      <p>Floor: {room.floor}</p>
                      <p>Type: {room.type_name || 'N/A'}</p>
                      <p className="font-semibold text-seafoam-600 dark:text-gold-400 mt-2">
                        ${room.base_price}/night
                      </p>
                    </div>
                    
                    {/* Quick Book Button for Available Rooms */}
                    {room.status === 'available' && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoom(room);
                          setShowQuickBookModal(true);
                        }}
                        className="w-full bg-seafoam-500 hover:bg-seafoam-600 text-white"
                        size="sm"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Quick Book
                      </Button>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(room);
                        }}
                        className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                        title="Edit Room"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {canManageRooms && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(room);
                          }}
                          className="p-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                          title="Delete Room"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-slate-500 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No rooms found</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
            {hasActiveFilters && (
              <Button onClick={clearFilters} className="mt-4 bg-seafoam-500 hover:bg-seafoam-600">
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFilterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Filter Rooms</h2>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="dirty">Dirty</option>
                  </select>
                </div>

                {/* Room Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Room Type
                  </label>
                  <select
                    value={filters.roomType}
                    onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="all">All Types</option>
                    {uniqueRoomTypes.map((type: any) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Floor Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Floor
                  </label>
                  <select
                    value={filters.floor}
                    onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="all">All Floors</option>
                    {uniqueFloors.map((floor: any) => (
                      <option key={floor} value={floor.toString()}>
                        Floor {floor}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      clearFilters();
                      setShowFilterModal(false);
                    }}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 bg-seafoam-500 hover:bg-seafoam-600"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedRoom && (
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
              {/* Header */}
              <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-seafoam-100 dark:bg-seafoam-900 rounded-lg">
                    <Bed className="w-6 h-6 text-seafoam-600 dark:text-seafoam-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Room {selectedRoom.room_number}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-300">
                      {selectedRoom.type_name || 'Standard Room'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-center">
                  <span className={`text-sm px-4 py-2 rounded-full font-medium ${getStatusColor(selectedRoom.status)}`}>
                    {selectedRoom.status.toUpperCase()}
                  </span>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                      <span className="text-sm text-gray-500 dark:text-slate-400">Room Number</span>
                    </div>
                    <p className="text-xl font-bold text-gray-800 dark:text-white">
                      {selectedRoom.room_number}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                      <span className="text-sm text-gray-500 dark:text-slate-400">Room Type</span>
                    </div>
                    <p className="text-xl font-bold text-gray-800 dark:text-white">
                      {selectedRoom.type_name || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                      <span className="text-sm text-gray-500 dark:text-slate-400">Price per Night</span>
                    </div>
                    <p className="text-xl font-bold text-seafoam-600 dark:text-gold-400">
                      ${selectedRoom.base_price}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                      <span className="text-sm text-gray-500 dark:text-slate-400">Floor</span>
                    </div>
                    <p className="text-xl font-bold text-gray-800 dark:text-white">
                      {selectedRoom.floor}
                    </p>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t dark:border-slate-700 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    Additional Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-slate-400">Room ID:</span>
                      <span className="text-gray-800 dark:text-white font-mono text-xs">
                        {selectedRoom.id.substring(0, 8)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-slate-400">Created:</span>
                      <span className="text-gray-800 dark:text-white">
                        {selectedRoom.created_at ? new Date(selectedRoom.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-slate-400">Last Updated:</span>
                      <span className="text-gray-800 dark:text-white">
                        {selectedRoom.updated_at ? new Date(selectedRoom.updated_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {selectedRoom.status === 'available' && (
                    <Button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setShowQuickBookModal(true);
                      }}
                      className="flex-1 bg-seafoam-500 hover:bg-seafoam-600"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Quick Book
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleEdit(selectedRoom);
                    }}
                    variant="secondary"
                    className="flex-1"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Room
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Room Modal */}
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
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Room</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitAdd} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Room Number
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    placeholder="e.g., 101, 205"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Room Type
                  </label>
                  <select
                    required
                    value={newRoom.roomTypeId}
                    onChange={(e) => setNewRoom({ ...newRoom, roomTypeId: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select room type</option>
                    {roomTypes?.map((type: any) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Price per Night
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={newRoom.customPrice}
                      onChange={(e) => setNewRoom({ ...newRoom, customPrice: e.target.value })}
                      className="w-full pl-8 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Floor
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={newRoom.status}
                    onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="dirty">Dirty</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 dark:border-slate-600 dark:text-slate-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createRoomMutation.isPending}
                    className="flex-1 bg-seafoam-500 hover:bg-seafoam-600"
                  >
                    {createRoomMutation.isPending ? 'Creating...' : 'Create Room'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Room Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Room</h2>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  value={editingRoom.room_number}
                  onChange={(e) => setEditingRoom({ ...editingRoom, room_number: e.target.value })}
                  className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Floor
                </label>
                <input
                  type="number"
                  value={editingRoom.floor}
                  onChange={(e) => setEditingRoom({ ...editingRoom, floor: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={editingRoom.status}
                  onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value })}
                  className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  required
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="dirty">Dirty</option>
                </select>
              </div>

              {/* Maintenance Fields - Only show when status is maintenance */}
              {editingRoom.status === 'maintenance' && (
                <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Maintenance Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={maintenanceReason}
                      onChange={(e) => setMaintenanceReason(e.target.value)}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                      rows={3}
                      placeholder="Describe the maintenance issue..."
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isUrgent"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="w-4 h-4 text-seafoam-500 border-gray-300 rounded focus:ring-seafoam-400"
                    />
                    <label htmlFor="isUrgent" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Mark as Urgent
                    </label>
                  </div>

                  {isUrgent && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                      <Info className="w-4 h-4" />
                      <span>Urgent maintenance will be prioritized and notify the maintenance team immediately.</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingRoom(null);
                  }}
                  className="flex-1 dark:border-slate-600 dark:text-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateRoomMutation.isPending}
                  className="flex-1 bg-seafoam-500 hover:bg-seafoam-600"
                >
                  {updateRoomMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Book Modal */}
      <AnimatePresence>
        {showQuickBookModal && selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQuickBookModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Quick Book Room {selectedRoom.room_number}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-slate-300">
                    ${selectedRoom.base_price}/night • Floor {selectedRoom.floor}
                  </p>
                </div>
                <button
                  onClick={() => setShowQuickBookModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleQuickBook} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.guestName}
                    onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    placeholder="Enter guest name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.checkInDate}
                      onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.checkOutDate}
                      onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
                      min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={bookingData.numberOfGuests}
                    onChange={(e) => setBookingData({ ...bookingData, numberOfGuests: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowQuickBookModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-seafoam-500 hover:bg-seafoam-600"
                  >
                    Confirm Booking
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
