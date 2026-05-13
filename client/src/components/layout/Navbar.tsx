import { Bell, Moon, Sun, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const { t } = useTranslation();
  const { theme, hotelName } = useSettingsStore();
  const [darkMode, setDarkMode] = useState(theme === 'Dark');
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Fetch unread notifications count
  const { data: notifications } = useQuery({
    queryKey: ['notifications-count'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCount = notifications?.filter((n: any) => !n.is_read).length || 0;

  // Sync darkMode state with settings store
  useEffect(() => {
    setDarkMode(theme === 'Dark' || (theme === 'System' && window.matchMedia('(prefers-color-scheme: dark)').matches));
  }, [theme]);

  const toggleDarkMode = () => {
    const settingsStore = useSettingsStore.getState();
    const newTheme = darkMode ? 'Light' : 'Dark';
    settingsStore.setSettings({ theme: newTheme });
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    setShowProfile(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('nav.welcomeBack')}, {user?.firstName}!
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-200">
            {hotelName} • {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-slate-100"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button 
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors relative text-gray-700 dark:text-slate-100"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="w-8 h-8 bg-seafoam-400 dark:bg-gold-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <>{user?.firstName?.[0]}{user?.lastName?.[0]}</>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-white">{user?.firstName}</span>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl py-2 border dark:border-slate-700"
                >
                  <div className="px-4 py-2 border-b dark:border-slate-700">
                    <p className="text-sm font-medium dark:text-white">{user?.email}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-200 capitalize">{user?.role}</p>
                  </div>
                  <button 
                    onClick={() => {
                      navigate('/profile');
                      setShowProfile(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-gray-700 dark:text-slate-100"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-red-500 dark:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};
