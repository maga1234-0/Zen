import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotel, Mail, Lock, Eye, EyeOff, Shield, Sparkles, Building2, KeyRound, ArrowRight } from 'lucide-react';
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
    e.stopPropagation(); // Extra guard to prevent event bubbling
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
      // Message d'erreur clair et spécifique
      if (err.response?.status === 401) {
        setError('Adresse e-mail ou mot de passe incorrect');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Connexion au serveur impossible. Veuillez réessayer.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Erreur réseau. Vérifiez votre connexion Internet.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
      // Important: Don't navigate on error - stay on login page
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900"></div>
        
        {/* Animated blobs - Opacité réduite */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-slate-700/10 to-slate-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-slate-700/10 to-slate-600/10 rounded-full blur-3xl"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-600/30 to-slate-500/30 rounded-2xl blur-xl"></div>
                <div className="relative bg-gradient-to-br from-slate-700 to-slate-600 p-4 rounded-2xl">
                  <Building2 className="w-8 h-8 text-slate-200" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">ZENITH</h1>
                <p className="text-sm text-slate-400">Hotel Management System</p>
              </div>
            </div>

            {/* Hero Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                  Bienvenue sur
                  <br />
                  <span className="text-slate-300">
                    ZENITH PMS
                  </span>
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                  Votre plateforme de gestion hôtelière moderne. Gérez vos réservations, chambres, staff et bien plus encore.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: Shield, text: "Sécurité maximale avec JWT" },
                  { icon: Sparkles, text: "Interface moderne et intuitive" },
                  { icon: Building2, text: "Gestion complète de l'hôtel" },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-800/50 backdrop-blur-sm flex items-center justify-center border border-slate-700/50">
                      <feature.icon className="w-5 h-5 text-slate-300" />
                    </div>
                    <span className="font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-slate-400"
          >
            © 2026 ZENITH. Tous droits réservés.
          </motion.p>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-slate-600/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-gradient-to-br from-slate-700 to-slate-600 p-3 rounded-2xl">
                  <Building2 className="w-6 h-6 text-slate-200" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ZENITH</h1>
                <p className="text-xs text-slate-400">Hotel Management</p>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Connexion</h2>
                <p className="text-slate-400">Entrez vos identifiants pour continuer</p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 animate-pulse flex-shrink-0"></div>
                      <p className="text-sm text-red-300 leading-relaxed">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Adresse e-mail
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-slate-700/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur"></div>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:border-slate-600 focus:bg-slate-800/70 outline-none transition-all text-white placeholder:text-slate-500"
                        placeholder="admin@hotel.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-slate-700/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur"></div>
                    <div className="relative flex items-center">
                      <KeyRound className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:border-slate-600 focus:bg-slate-800/70 outline-none transition-all text-white placeholder:text-slate-500"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-slate-400 hover:text-slate-200 font-medium transition-colors"
                  >
                    Mot de passe oublié?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl py-4 px-6 font-semibold text-white shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-500 transition-all duration-300 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Connexion...</span>
                      </>
                    ) : (
                      <>
                        <span>Se connecter</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Security Badge */}
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>Connexion sécurisée SSL</span>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <p className="text-center text-sm text-slate-400 mt-6">
              Propulsé par ZENITH PMS © 2026
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
