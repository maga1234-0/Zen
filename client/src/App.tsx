import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Rooms } from '@/pages/Rooms';
import { Bookings } from '@/pages/Bookings';
import { Guests } from '@/pages/Guests';
import { Payments } from '@/pages/Payments';
import { Staff } from '@/pages/Staff';
import { Settings } from '@/pages/Settings';
import { Profile } from '@/pages/Profile';
import { FrontDesk } from '@/pages/FrontDesk';
import { Reports } from '@/pages/Reports';
import { Housekeeping } from '@/pages/Housekeeping';
import { Notifications } from '@/pages/Notifications';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { ToastContainer } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useToast } from '@/hooks/useToast';
import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToastContext must be used within ToastProvider');
  return context;
};

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  console.log('ProtectedLayout - token from store:', token ? 'present' : 'missing');

  // Also check localStorage directly as a fallback
  const [checkingLocalStorage, setCheckingLocalStorage] = useState(true);
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(null);

  useEffect(() => {
    const checkLocalStorage = () => {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage);
          setLocalStorageToken(state?.token || null);
          console.log('ProtectedLayout - token from localStorage:', state?.token ? 'present' : 'missing');
        } catch (error) {
          console.error('Failed to parse auth storage:', error);
        }
      }
      setCheckingLocalStorage(false);
    };

    checkLocalStorage();
  }, []);

  // Show loading while checking
  if (checkingLocalStorage) {
    return (
      <div className="flex h-screen items-center justify-center bg-mint-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-seafoam-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Check both store and localStorage
  const hasToken = token || localStorageToken;
  console.log('ProtectedLayout - hasToken:', hasToken ? 'yes' : 'no');

  if (!hasToken) {
    console.log('ProtectedLayout - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-mint-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar />
        <main className="p-3 sm:p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

function App() {
  const toast = useToast();
  const applyTheme = useSettingsStore((state) => state.applyTheme);
  const language = useSettingsStore((state) => state.language);
  const { i18n } = useTranslation();

  // Apply theme on mount and when system preference changes
  useEffect(() => {
    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyTheme]);

  // Update i18n language when settings store language changes
  useEffect(() => {
    console.log('App: language changed to:', language, 'i18n current language:', i18n.language);
    if (language && i18n.language !== language) {
      console.log('App: Changing i18n language to:', language);
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContext.Provider value={toast}>
        <BrowserRouter>
          <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedLayout>
                  <Bookings />
                </ProtectedLayout>
              }
            />
            <Route
              path="/front-desk"
              element={
                <ProtectedLayout>
                  <FrontDesk />
                </ProtectedLayout>
              }
            />
            <Route
              path="/rooms"
              element={
                <ProtectedLayout>
                  <Rooms />
                </ProtectedLayout>
              }
            />
            <Route
              path="/guests"
              element={
                <ProtectedLayout>
                  <Guests />
                </ProtectedLayout>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedLayout>
                  <Payments />
                </ProtectedLayout>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedLayout>
                  <Reports />
                </ProtectedLayout>
              }
            />
            <Route
              path="/housekeeping"
              element={
                <ProtectedLayout>
                  <Housekeeping />
                </ProtectedLayout>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedLayout>
                  <Staff />
                </ProtectedLayout>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedLayout>
                  <Notifications />
                </ProtectedLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedLayout>
                  <Settings />
                </ProtectedLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedLayout>
                  <Profile />
                </ProtectedLayout>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
