import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserPlus, LogIn, LogOut, Key, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export const FrontDesk = () => {
  const { data: checkIns, isLoading: loadingCheckIns } = useQuery({
    queryKey: ['todayCheckIns'],
    queryFn: async () => {
      const res = await api.get('/bookings/today/checkins');
      console.log('Today\'s check-ins from API:', res.data);
      return res.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true, // Refresh when window gains focus
  });

  const { data: checkOuts, isLoading: loadingCheckOuts } = useQuery({
    queryKey: ['todayCheckOuts'],
    queryFn: async () => {
      const res = await api.get('/bookings/today/checkouts');
      console.log('Today\'s check-outs from API:', res.data);
      return res.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true, // Refresh when window gains focus
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Front Desk</h1>
        <p className="text-gray-500 dark:text-slate-300">Manage check-ins, check-outs, and guest services</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button className="bg-seafoam-500 hover:bg-seafoam-600 h-20 flex-col gap-2">
          <LogIn className="w-6 h-6" />
          <span>Check In</span>
        </Button>
        <Button className="bg-greybrown-500 hover:bg-greybrown-600 h-20 flex-col gap-2">
          <LogOut className="w-6 h-6" />
          <span>Check Out</span>
        </Button>
        <Button className="bg-gold-500 hover:bg-gold-600 h-20 flex-col gap-2">
          <Key className="w-6 h-6" />
          <span>Room Keys</span>
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600 h-20 flex-col gap-2">
          <UserPlus className="w-6 h-6" />
          <span>Walk-in Guest</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currently Checked In Guests */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <LogIn className="w-5 h-5 text-green-500" />
              Currently Checked In
            </h2>
            <span className="text-sm text-gray-500 dark:text-slate-300">
              {checkIns?.length || 0} guests
            </span>
          </div>
          {loadingCheckIns ? (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-4 border-seafoam-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : checkIns?.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
              No guests currently checked in
            </div>
          ) : (
            <div className="space-y-3">
              {checkIns?.map((checkin: any) => (
                <div key={checkin.id} className="flex items-center justify-between p-4 bg-mint-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{checkin.guest_name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-300">Room {checkin.room_number}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                      <Clock className="w-4 h-4" />
                      Check-in: {new Date(checkin.check_in_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Check-out: {new Date(checkin.check_out_date).toLocaleDateString()}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full mt-1 inline-block bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      checked in
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Checking Out Today */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <LogOut className="w-5 h-5 text-red-500" />
              Checking Out Today
            </h2>
            <span className="text-sm text-gray-500 dark:text-slate-300">
              {checkOuts?.length || 0} guests
            </span>
          </div>
          {loadingCheckOuts ? (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-4 border-seafoam-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : checkOuts?.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
              No guests checking out today
            </div>
          ) : (
            <div className="space-y-3">
              {checkOuts?.map((checkout: any) => (
                <div key={checkout.id} className="flex items-center justify-between p-4 bg-mint-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{checkout.guest_name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-300">Room {checkout.room_number}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                      <Clock className="w-4 h-4" />
                      {formatTime(checkout.check_out_date)}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full mt-1 inline-block bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                      checking out
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
