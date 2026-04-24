import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, CheckCheck, Trash2, Calendar, CreditCard, AlertCircle, Info } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { useToastContext } from '@/App';
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export const Notifications = () => {
  const toast = useToastContext();
  const queryClient = useQueryClient();
  const confirmDialog = useConfirm();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await api.put('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
      toast.success('All notifications marked as read');
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
      toast.success('Notification deleted');
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      await api.delete('/notifications/all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
      toast.success('All notifications cleared');
    },
  });

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const handleClearAll = async () => {
    const confirmed = await confirmDialog.confirm({
      title: 'Clear All Notifications',
      message: 'Are you sure you want to delete all notifications? This action cannot be undone.',
      confirmText: 'Clear All',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (confirmed) {
      clearAllMutation.mutate();
    }
  };

  const handleDeleteNotification = async (id: string, title: string) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Delete Notification',
      message: `Are you sure you want to delete "${title}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (confirmed) {
      deleteNotificationMutation.mutate(id);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return { Icon: Calendar, color: 'text-blue-500' };
      case 'payment':
        return { Icon: CreditCard, color: 'text-green-500' };
      case 'check_in':
        return { Icon: Bell, color: 'text-purple-500' };
      case 'check_out':
        return { Icon: Bell, color: 'text-orange-500' };
      case 'system':
        return { Icon: Info, color: 'text-gray-500' };
      default:
        return { Icon: AlertCircle, color: 'text-red-500' };
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-slate-300">Loading notifications...</div>
        </div>
      </div>
    );
  }

  const notificationList = notifications || [];
  const unreadCount = notificationList.filter((n: any) => !n.is_read).length;
  const paymentCount = notificationList.filter((n: any) => n.type === 'payment').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-slate-300">Stay updated with important alerts</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={handleMarkAllRead}
            disabled={markAllReadMutation.isPending || unreadCount === 0}
            className="dark:border-slate-600 dark:text-slate-200"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button 
            variant="danger" 
            onClick={handleClearAll}
            disabled={clearAllMutation.isPending || notificationList.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-seafoam-600 dark:text-gold-400">
              {unreadCount}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">Unread</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {notificationList.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">Total</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {paymentCount}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">Payments</p>
          </div>
        </Card>
      </div>

      <Card>
        {notificationList.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-slate-300">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notificationList.map((notification: any) => {
              const { Icon, color } = getIcon(notification.type);
              return (
                <div 
                  key={notification.id} 
                  className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                    notification.is_read 
                      ? 'bg-gray-50 dark:bg-slate-700/50' 
                      : 'bg-seafoam-50 dark:bg-slate-700 border-l-4 border-seafoam-500 dark:border-gold-500'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${notification.is_read ? 'bg-gray-200 dark:bg-slate-600' : 'bg-white dark:bg-slate-800'}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-semibold ${notification.is_read ? 'text-gray-600 dark:text-slate-300' : 'text-gray-800 dark:text-white'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-slate-400 mt-2">
                          {getTimeAgo(notification.created_at)}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteNotification(notification.id, notification.title)}
                        className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

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
