import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotel, Mail, Key, Lock, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';

type Step = 'email' | 'code' | 'password';

export const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Étape 1: Envoyer le code par email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(response.data.message);
      setTimeout(() => {
        setCurrentStep('code');
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  // Étape 2: Vérifier le code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-reset-code', { email, code });
      if (response.data.valid) {
        setSuccess('Code vérifié avec succès!');
        setTimeout(() => {
          setCurrentStep('password');
          setSuccess('');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  // Étape 3: Réinitialiser le mot de passe
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        email,
        code,
        newPassword,
      });
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'code', name: 'Code', icon: Key },
    { id: 'password', name: 'Nouveau mot de passe', icon: Lock },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-seafoam-50 via-mint-50 to-gold-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-seafoam-200 dark:bg-seafoam-900 opacity-20 dark:opacity-10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
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
          {/* Back button */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-seafoam-600 dark:hover:text-seafoam-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour à la connexion</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-seafoam-400 via-seafoam-500 to-seafoam-600 rounded-2xl blur-lg opacity-60"></div>
                <div className="relative bg-gradient-to-br from-seafoam-400 via-seafoam-500 to-seafoam-600 p-4 rounded-2xl">
                  <Hotel className="w-10 h-10 text-white" />
                </div>
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mot de passe oublié?
            </h1>
            <p className="text-gray-600 dark:text-slate-300">
              Réinitialisez votre mot de passe en 3 étapes
            </p>
          </div>

          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        index <= currentStepIndex
                          ? 'bg-gradient-to-br from-seafoam-400 to-seafoam-600 text-white shadow-lg'
                          : 'bg-gray-200 dark:bg-slate-700 text-gray-400'
                      }`}
                    >
                      {index < currentStepIndex ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <p className="text-xs mt-2 text-center text-gray-600 dark:text-slate-400">
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded transition-all ${
                        index < currentStepIndex
                          ? 'bg-gradient-to-r from-seafoam-400 to-seafoam-600'
                          : 'bg-gray-200 dark:bg-slate-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2"
              >
                <Check className="w-5 h-5 flex-shrink-0" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {currentStep === 'email' && (
              <motion.form
                key="email-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSendCode}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                    Adresse email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-400 group-focus-within:text-seafoam-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-seafoam-400 focus:border-seafoam-400 outline-none transition-all bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm dark:text-white"
                      placeholder="votre-email@exemple.com"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                    Un code de vérification sera envoyé à cette adresse
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-seafoam-400 via-seafoam-500 to-seafoam-600 hover:from-seafoam-500 hover:via-seafoam-600 hover:to-seafoam-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    'Envoyer le code'
                  )}
                </Button>
              </motion.form>
            )}

            {/* Step 2: Code */}
            {currentStep === 'code' && (
              <motion.form
                key="code-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyCode}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                    Code de vérification
                  </label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-400 group-focus-within:text-seafoam-500 transition-colors" />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-seafoam-400 focus:border-seafoam-400 outline-none transition-all bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm dark:text-white text-2xl text-center tracking-widest font-mono"
                      placeholder="123456"
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                    Entrez le code à 6 chiffres envoyé à <strong>{email}</strong>
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full bg-gradient-to-r from-seafoam-400 via-seafoam-500 to-seafoam-600 hover:from-seafoam-500 hover:via-seafoam-600 hover:to-seafoam-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Vérification...
                    </div>
                  ) : (
                    'Vérifier le code'
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setCurrentStep('email')}
                  className="w-full text-sm text-seafoam-600 dark:text-seafoam-400 hover:underline"
                >
                  Renvoyer le code
                </button>
              </motion.form>
            )}

            {/* Step 3: New Password */}
            {currentStep === 'password' && (
              <motion.form
                key="password-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-400 group-focus-within:text-seafoam-500 transition-colors" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-seafoam-400 focus:border-seafoam-400 outline-none transition-all bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm dark:text-white"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-400 group-focus-within:text-seafoam-500 transition-colors" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-seafoam-400 focus:border-seafoam-400 outline-none transition-all bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm dark:text-white"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                    Minimum 6 caractères
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-seafoam-400 via-seafoam-500 to-seafoam-600 hover:from-seafoam-500 hover:via-seafoam-600 hover:to-seafoam-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Réinitialisation...
                    </div>
                  ) : (
                    'Réinitialiser le mot de passe'
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-600 dark:text-slate-300 mt-6 font-medium"
        >
          © 2026 ZENIT PMS - Property Management System
        </motion.p>
      </motion.div>
    </div>
  );
};
