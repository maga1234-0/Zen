import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hotel, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import { useTranslation } from 'react-i18next';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      setAuth(response.data.user, response.data.token);
      
      // Wait for Zustand to persist to localStorage
      console.log('Waiting for state persistence...');
      let attempts = 0;
      while (attempts < 10) {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          try {
            const { state } = JSON.parse(authStorage);
            if (state?.token) {
              console.log('Token found in localStorage, navigating to dashboard');
              navigate('/dashboard');
              return;
            }
          } catch (error) {
            console.error('Failed to parse auth storage:', error);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 50));
        attempts++;
      }
      
      console.log('Timeout waiting for localStorage, navigating anyway');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || t('login.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@hotel.com', color: 'bg-seafoam-400' },
    { role: 'Manager', email: 'manager@hotel.com', color: 'bg-greybrown-400' },
    { role: 'Reception', email: 'reception@hotel.com', color: 'bg-gold-400' },
  ];

  const fillDemo = (email: string) => {
    setEmail(email);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-seafoam-50 via-mint-50 to-gold-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-seafoam-200 dark:bg-seafoam-900 opacity-20 dark:opacity-10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gold-200 dark:bg-gold-900 opacity-20 dark:opacity-10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-700/50">
          {/* Logo and Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-seafoam-400 to-seafoam-600 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-br from-seafoam-400 to-seafoam-600 p-4 rounded-2xl">
                <Hotel className="w-12 h-12 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-6 h-6 text-gold-400" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-seafoam-600 to-greybrown-600 dark:from-seafoam-400 dark:to-gold-400 bg-clip-text text-transparent mb-2">
              {t('login.title')}
            </h1>
            <p className="text-gray-600 dark:text-slate-300 text-sm">
              {t('login.subtitle')}
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                {t('login.email')}
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-400 group-focus-within:text-seafoam-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-seafoam-400 focus:border-seafoam-400 outline-none transition-all bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm dark:text-white"
                  placeholder="admin@hotel.com"
                  required
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                {t('login.passwordLabel')}
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-400 group-focus-within:text-seafoam-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-seafoam-400 focus:border-seafoam-400 outline-none transition-all bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm dark:text-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-seafoam-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-seafoam-400 to-seafoam-600 hover:from-seafoam-500 hover:to-seafoam-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('login.signingIn')}
                  </div>
                ) : (
                  t('login.signIn')
                )}
              </Button>
            </motion.div>
          </form>

          {/* Demo Accounts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 p-5 bg-gradient-to-br from-mint-50 to-seafoam-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-2xl border border-seafoam-100 dark:border-slate-600"
          >
            <p className="text-xs font-semibold text-gray-600 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              {t('login.demoAccounts')}
            </p>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <motion.button
                  key={account.email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  onClick={() => fillDemo(account.email)}
                  className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-xl transition-all group border border-gray-100 dark:border-slate-600 hover:border-seafoam-200 dark:hover:border-seafoam-500 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 ${account.color} rounded-full`}></div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-700 dark:text-white">{account.role}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{account.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-slate-400 group-hover:text-seafoam-500 transition-colors">
                    {t('login.clickToFill')}
                  </div>
                </motion.button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-3 text-center">
              Password: <span className="font-mono font-semibold text-gray-700 dark:text-white">password123</span>
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-sm text-gray-600 dark:text-slate-300 mt-6"
        >
          {t('login.footer')}
        </motion.p>
      </motion.div>
    </div>
  );
};
