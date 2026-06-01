import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Wrench, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/utils/permissions';
import api from '@/services/api';
import { useToastContext } from '@/App';
import { useState } from 'react';

export const Maintenance = () => {
  const { user } = useAuthStore();
  const toast = useToastContext();
  const queryClient = useQueryClient();
  const canUpdate = user?.role ? hasPermission(user.role, 'maintenance.update') : false;
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const { data: maintenanceRooms, isLoading } = useQuery({
    queryKey: ['maintenance-rooms'],
    queryFn: async () => {
      const res = await api.get('/rooms');
      return res.data.filter((room: any) => room.status === 'maintenance');
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    refetchOnWindowFocus: true, // Rafraîchir quand la fenêtre reprend le focus
  });

  const completeMaintenanceMutation = useMutation({
    mutationFn: async (roomId: string) => {
      await api.put(`/rooms/${roomId}`, {
        room_number: selectedTask.room_number,
        floor: selectedTask.floor,
        status: 'available',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Maintenance completed successfully!');
      setSelectedTask(null);
    },
    onError: () => {
      toast.error('Failed to complete maintenance');
    },
  });

  const handleComplete = (room: any) => {
    setSelectedTask(room);
    completeMaintenanceMutation.mutate(room.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-seafoam-500"></div>
      </div>
    );
  }

  const urgentTasks = maintenanceRooms?.filter((room: any) => room.is_urgent) || [];
  const normalTasks = maintenanceRooms?.filter((room: any) => !room.is_urgent) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Maintenance</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Manage room maintenance tasks
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                {maintenanceRooms?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Wrench className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Urgent</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                {urgentTasks.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Normal Priority</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                {normalTasks.length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
              <Clock className="w-8 h-8 text-gray-600 dark:text-slate-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Urgent Maintenance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentTasks.map((room: any) => (
              <Card key={room.id} className="p-6 dark:bg-slate-800 dark:border-slate-700 border-l-4 border-l-orange-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      Room {room.room_number}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">Floor {room.floor}</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-semibold">
                    URGENT
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Issue:</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {room.maintenance_reason || 'No reason provided'}
                    </p>
                  </div>

                  {room.maintenance_reported_at && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Reported: {new Date(room.maintenance_reported_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {canUpdate && (
                    <Button
                      onClick={() => handleComplete(room)}
                      disabled={completeMaintenanceMutation.isPending}
                      className="w-full bg-green-500 hover:bg-green-600 text-white mt-4"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Normal Tasks */}
      {normalTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Normal Priority
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {normalTasks.map((room: any) => (
              <Card key={room.id} className="p-6 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      Room {room.room_number}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">Floor {room.floor}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
                    NORMAL
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Issue:</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {room.maintenance_reason || 'No reason provided'}
                    </p>
                  </div>

                  {room.maintenance_reported_at && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Reported: {new Date(room.maintenance_reported_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {canUpdate && (
                    <Button
                      onClick={() => handleComplete(room)}
                      disabled={completeMaintenanceMutation.isPending}
                      className="w-full bg-green-500 hover:bg-green-600 text-white mt-4"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {maintenanceRooms?.length === 0 && (
        <Card className="p-12 text-center dark:bg-slate-800 dark:border-slate-700">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                No Maintenance Tasks
              </h3>
              <p className="text-gray-600 dark:text-slate-400">
                All rooms are in good condition. Great job!
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
