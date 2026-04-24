import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, CheckCircle, Clock, AlertCircle, Wrench } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { useToastContext } from '@/App';

export const Housekeeping = () => {
  const toast = useToastContext();
  const queryClient = useQueryClient();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await api.get('/rooms');
      return res.data;
    },
  });

  const updateRoomStatusMutation = useMutation({
    mutationFn: async ({ roomId, room_number, floor, status }: { roomId: string; room_number: string; floor: number; status: string }) => {
      await api.put(`/rooms/${roomId}`, { room_number, floor, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room status updated');
    },
    onError: (error: any) => {
      console.error('Update room error:', error);
      toast.error('Failed to update room status');
    },
  });

  const handleStatusUpdate = (room: any) => {
    let newStatus = room.status;
    
    if (room.status === 'dirty') {
      newStatus = 'cleaning';
    } else if (room.status === 'cleaning') {
      newStatus = 'available';
    } else if (room.status === 'maintenance') {
      newStatus = 'available';
    }
    
    updateRoomStatusMutation.mutate({ 
      roomId: room.id, 
      room_number: room.room_number,
      floor: room.floor,
      status: newStatus 
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-slate-300">Loading rooms...</div>
        </div>
      </div>
    );
  }

  const roomList = rooms || [];
  const dirtyRooms = roomList.filter((r: any) => r.status === 'dirty');
  const cleaningRooms = roomList.filter((r: any) => r.status === 'cleaning');
  const cleanRooms = roomList.filter((r: any) => r.status === 'available');
  const maintenanceRooms = roomList.filter((r: any) => r.status === 'maintenance');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cleaning':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'dirty':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'cleaning':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'dirty':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'maintenance':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-slate-200';
    }
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'dirty':
        return 'Start Cleaning';
      case 'cleaning':
        return 'Mark Available';
      case 'maintenance':
        return 'Mark Available';
      default:
        return 'Update';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Housekeeping</h1>
          <p className="text-gray-500 dark:text-slate-300">Manage room cleaning and maintenance tasks</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-300">Dirty Rooms</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{dirtyRooms.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-300">Cleaning</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{cleaningRooms.length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-300">Available</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{cleanRooms.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-300">Maintenance</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{maintenanceRooms.length}</p>
            </div>
            <Wrench className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Rooms List */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">All Rooms</h2>
        {roomList.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-slate-300">No rooms found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {roomList.map((room: any) => (
              <div key={room.id} className="flex items-center justify-between p-4 bg-mint-50 dark:bg-slate-700 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {getStatusIcon(room.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 dark:text-white">Room {room.room_number}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-slate-200">
                        Floor {room.floor}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-slate-300">
                      {room.status === 'dirty' && 'Needs cleaning'}
                      {room.status === 'cleaning' && 'Currently being cleaned'}
                      {room.status === 'available' && 'Ready for guests'}
                      {room.status === 'maintenance' && 'Under maintenance'}
                      {room.status === 'occupied' && 'Guest occupied'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(room.status)}`}>
                    {room.status}
                  </span>
                  {room.status !== 'available' && room.status !== 'occupied' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleStatusUpdate(room)}
                      disabled={updateRoomStatusMutation.isPending}
                    >
                      {getNextAction(room.status)}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
