import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Lock, Globe, Palette, Edit3, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { useToastContext } from '@/App';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslation } from 'react-i18next';

interface SettingsData {
  hotelName: string;
  hotelAddress: string;
  hotelCity: string;
  hotelPhone: string;
  hotelEmail: string;
  timeZone: string;
  emailNotifications: boolean;
  bookingAlerts: boolean;
  paymentNotifications: boolean;
  theme: string;
  language: string;
  signature: string;
}

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const toast = useToastContext();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const settingsStore = useSettingsStore();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const [settings, setSettings] = useState<SettingsData>({
    hotelName: settingsStore.hotelName,
    hotelAddress: settingsStore.hotelAddress,
    hotelCity: settingsStore.hotelCity,
    hotelPhone: settingsStore.hotelPhone,
    hotelEmail: settingsStore.hotelEmail,
    timeZone: settingsStore.timeZone,
    emailNotifications: settingsStore.emailNotifications,
    bookingAlerts: settingsStore.bookingAlerts,
    paymentNotifications: settingsStore.paymentNotifications,
    theme: settingsStore.theme,
    language: settingsStore.language,
    signature: settingsStore.signature || '',
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Initialize canvas when signature pad is shown
  useEffect(() => {
    if (showSignaturePad && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas background to white
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // If there's an existing signature, draw it
        if (settings.signature) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
          img.src = settings.signature;
        }
      }
    }
  }, [showSignaturePad, settings.signature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL('image/png');
    handleChange('signature', signatureData);
    setShowSignaturePad(false);
    toast.success('Signature saved! Remember to click "Save Changes" to persist it.');
  };

  const removeSignature = () => {
    handleChange('signature', '');
    toast.info('Signature removed! Remember to click "Save Changes".');
  };

  const { data: userSettings } = useQuery({
    queryKey: ['user-settings', user?.id],
    queryFn: async () => {
      const res = await api.get('/users/settings');
      return res.data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (userSettings) {
      const newSettings = {
        hotelName: userSettings.hotel_name || 'Grand Seafoam Hotel',
        hotelAddress: userSettings.hotel_address || '123 Luxury Avenue',
        hotelCity: userSettings.hotel_city || 'Paradise City, PC 12345',
        hotelPhone: userSettings.hotel_phone || '+1 (555) 123-4567',
        hotelEmail: userSettings.hotel_email || 'info@grandhotel.com',
        timeZone: userSettings.time_zone || 'UTC-5 (Eastern Time)',
        emailNotifications: userSettings.email_notifications ?? true,
        bookingAlerts: userSettings.booking_alerts ?? true,
        paymentNotifications: userSettings.payment_notifications ?? true,
        theme: userSettings.theme || 'Dark',
        language: userSettings.language || 'English',
        signature: userSettings.signature || '',
      };
      setSettings(newSettings);
      
      // Update settings store and i18n language
      settingsStore.setSettings({
        hotelName: newSettings.hotelName,
        hotelAddress: newSettings.hotelAddress,
        hotelCity: newSettings.hotelCity,
        hotelPhone: newSettings.hotelPhone,
        hotelEmail: newSettings.hotelEmail,
        timeZone: newSettings.timeZone,
        emailNotifications: newSettings.emailNotifications,
        bookingAlerts: newSettings.bookingAlerts,
        paymentNotifications: newSettings.paymentNotifications,
        theme: newSettings.theme as any,
        language: newSettings.language,
        signature: newSettings.signature,
      });
      
      // Change i18n language
      i18n.changeLanguage(newSettings.language);
    }
  }, [userSettings, i18n]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: SettingsData) => {
      console.log('Saving settings...', { ...data, signature: data.signature ? 'BASE64_IMAGE' : '' });
      const response = await api.put('/users/settings', {
        hotel_name: data.hotelName,
        hotel_address: data.hotelAddress,
        hotel_city: data.hotelCity,
        hotel_phone: data.hotelPhone,
        hotel_email: data.hotelEmail,
        time_zone: data.timeZone,
        email_notifications: data.emailNotifications,
        booking_alerts: data.bookingAlerts,
        payment_notifications: data.paymentNotifications,
        theme: data.theme,
        language: data.language,
        signature: data.signature,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Settings saved successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      
      // Update settings store to apply changes immediately
      settingsStore.setSettings({
        hotelName: settings.hotelName,
        hotelAddress: settings.hotelAddress,
        hotelCity: settings.hotelCity,
        hotelPhone: settings.hotelPhone,
        hotelEmail: settings.hotelEmail,
        timeZone: settings.timeZone,
        emailNotifications: settings.emailNotifications,
        bookingAlerts: settings.bookingAlerts,
        paymentNotifications: settings.paymentNotifications,
        theme: settings.theme as any,
        language: settings.language,
        signature: settings.signature,
      });
      
      // Change i18n language immediately
      i18n.changeLanguage(settings.language);
      
      toast.success(t('settings.settingsSaved'));
      setHasChanges(false);
    },
    onError: (error: any) => {
      console.error('Settings save error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || t('settings.settingsFailed'));
    },
  });

  const handleChange = (field: keyof SettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveSettingsMutation.mutate(settings);
  };

  const handleCancel = () => {
    if (userSettings) {
      setSettings({
        hotelName: userSettings.hotel_name || 'Grand Seafoam Hotel',
        hotelAddress: userSettings.hotel_address || '123 Luxury Avenue',
        hotelCity: userSettings.hotel_city || 'Paradise City, PC 12345',
        hotelPhone: userSettings.hotel_phone || '+1 (555) 123-4567',
        hotelEmail: userSettings.hotel_email || 'info@grandhotel.com',
        timeZone: userSettings.time_zone || 'UTC-5 (Eastern Time)',
        emailNotifications: userSettings.email_notifications ?? true,
        bookingAlerts: userSettings.booking_alerts ?? true,
        paymentNotifications: userSettings.payment_notifications ?? true,
        theme: userSettings.theme || 'Dark',
        language: userSettings.language || 'English',
        signature: userSettings.signature || '',
      });
    }
    setHasChanges(false);
    toast.info(t('settings.changesDiscarded'));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('settings.title')}</h1>
        <p className="text-gray-500 dark:text-slate-300">{t('settings.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-seafoam-100 dark:bg-slate-900 rounded-lg">
              <Globe className="w-5 h-5 text-seafoam-600 dark:text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('settings.general')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                {t('settings.hotelName')}
              </label>
              <input
                type="text"
                value={settings.hotelName}
                onChange={(e) => handleChange('hotelName', e.target.value)}
                className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                placeholder="Grand Seafoam Hotel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                Hotel Address
              </label>
              <input
                type="text"
                value={settings.hotelAddress}
                onChange={(e) => handleChange('hotelAddress', e.target.value)}
                className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                placeholder="123 Luxury Avenue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                City & Postal Code
              </label>
              <input
                type="text"
                value={settings.hotelCity}
                onChange={(e) => handleChange('hotelCity', e.target.value)}
                className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                placeholder="Paradise City, PC 12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                Hotel Phone
              </label>
              <input
                type="text"
                value={settings.hotelPhone}
                onChange={(e) => handleChange('hotelPhone', e.target.value)}
                className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                Hotel Email
              </label>
              <input
                type="email"
                value={settings.hotelEmail}
                onChange={(e) => handleChange('hotelEmail', e.target.value)}
                className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                placeholder="info@grandhotel.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                {t('settings.timeZone')}
              </label>
              <select 
                value={settings.timeZone}
                onChange={(e) => handleChange('timeZone', e.target.value)}
                className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
              >
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-6 (Central Time)</option>
                <option>UTC-7 (Mountain Time)</option>
                <option>UTC-8 (Pacific Time)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gold-100 dark:bg-gold-900 rounded-lg">
              <Bell className="w-5 h-5 text-gold-600 dark:text-gold-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('settings.notifications')}</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-slate-200">{t('settings.emailNotifications')}</span>
              <input 
                type="checkbox" 
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                className="w-5 h-5 text-seafoam-500 rounded" 
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-slate-200">{t('settings.bookingAlerts')}</span>
              <input 
                type="checkbox" 
                checked={settings.bookingAlerts}
                onChange={(e) => handleChange('bookingAlerts', e.target.checked)}
                className="w-5 h-5 text-seafoam-500 rounded" 
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-slate-200">{t('settings.paymentNotifications')}</span>
              <input 
                type="checkbox" 
                checked={settings.paymentNotifications}
                onChange={(e) => handleChange('paymentNotifications', e.target.checked)}
                className="w-5 h-5 text-seafoam-500 rounded" 
              />
            </label>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('settings.security')}</h2>
          </div>
          <div className="space-y-4">
            <Button variant="secondary" className="w-full dark:border-slate-600 dark:text-slate-200">
              {t('settings.changePassword')}
            </Button>
            <Button variant="secondary" className="w-full dark:border-slate-600 dark:text-slate-200">
              {t('settings.twoFactor')}
            </Button>
            <Button variant="danger" className="w-full">
              {t('settings.signOutAll')}
            </Button>
          </div>
        </Card>

        {/* Appearance */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('settings.appearance')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                {t('settings.theme')}
              </label>
              <select 
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
              >
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                {t('settings.language')}
              </label>
              <select 
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
              >
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Signature */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-seafoam-100 dark:bg-seafoam-900 rounded-lg">
              <Edit3 className="w-5 h-5 text-seafoam-600 dark:text-seafoam-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Invoice Signature</h2>
          </div>
          <div className="space-y-4">
            {settings.signature ? (
              <div className="space-y-3">
                <div className="border-2 border-gray-200 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-900">
                  <img 
                    src={settings.signature} 
                    alt="Signature" 
                    className="max-h-24 mx-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowSignaturePad(true)}
                    variant="secondary"
                    className="flex-1 dark:border-slate-600 dark:text-slate-200"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Signature
                  </Button>
                  <Button 
                    onClick={removeSignature}
                    variant="danger"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => setShowSignaturePad(true)}
                className="w-full bg-seafoam-500 hover:bg-seafoam-600"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Draw Signature
              </Button>
            )}
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Your signature will appear on invoices
            </p>
          </div>
        </Card>
      </div>

      {/* Signature Drawing Modal */}
      {showSignaturePad && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 border dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Draw Your Signature</h2>
            
            <div className="border-2 border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden mb-4">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full cursor-crosshair bg-white"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={clearSignature}
                variant="secondary"
                className="flex-1 dark:border-slate-600 dark:text-slate-200"
              >
                Clear
              </Button>
              <Button
                onClick={() => setShowSignaturePad(false)}
                variant="secondary"
                className="flex-1 dark:border-slate-600 dark:text-slate-200"
              >
                Cancel
              </Button>
              <Button
                onClick={saveSignature}
                className="flex-1 bg-seafoam-500 hover:bg-seafoam-600"
              >
                Save Signature
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button 
          variant="secondary" 
          onClick={handleCancel}
          disabled={!hasChanges || saveSettingsMutation.isPending}
          className="dark:border-slate-600 dark:text-slate-200"
        >
          {t('settings.cancel')}
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!hasChanges || saveSettingsMutation.isPending}
          className="bg-seafoam-500 hover:bg-seafoam-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveSettingsMutation.isPending ? t('settings.saving') : t('settings.saveChanges')}
        </Button>
      </div>
    </div>
  );
};
