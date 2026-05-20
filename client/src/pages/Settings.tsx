import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Lock, Globe, Palette, Edit3, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
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
    console.log('Signature saved! Remember to click "Save Changes" to persist it.');
    alert(t('settings.signatureSaved'));
  };

  const removeSignature = () => {
    handleChange('signature', '');
    console.log('Signature removed! Remember to click "Save Changes".');
    alert(t('settings.signatureRemoved'));
  };

  // Use settings from store directly instead of API call
  useEffect(() => {
    console.log('Settings: Loading settings from store');
    const storeSettings = {
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
    };
    
    console.log('Settings: Store settings:', storeSettings);
    setSettings(storeSettings);
    
    // Change i18n language
    console.log('Settings: Changing i18n language to:', storeSettings.language);
    console.log('Settings: Current i18n language:', i18n.language);
    
    i18n.changeLanguage(storeSettings.language).then(() => {
      console.log('Settings: i18n language changed successfully to:', i18n.language);
      console.log('Settings: Testing translation - "settings.title":', i18n.t('settings.title'));
    }).catch((error) => {
      console.error('Settings: Failed to change i18n language:', error);
    });
  }, [settingsStore, i18n]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: SettingsData) => {
      console.log('Saving settings to store...', { ...data, signature: data.signature ? 'BASE64_IMAGE' : '' });
      // Save to settings store instead of API
      settingsStore.setSettings({
        hotelName: data.hotelName,
        hotelAddress: data.hotelAddress,
        hotelCity: data.hotelCity,
        hotelPhone: data.hotelPhone,
        hotelEmail: data.hotelEmail,
        timeZone: data.timeZone,
        emailNotifications: data.emailNotifications,
        bookingAlerts: data.bookingAlerts,
        paymentNotifications: data.paymentNotifications,
        theme: data.theme as any,
        language: data.language,
        signature: data.signature,
      });
      return { success: true };
    },
    onSuccess: () => {
      console.log('Settings saved successfully to store');
      
      // Apply theme immediately after saving
      console.log('Settings (save): Applying theme:', settings.theme);
      settingsStore.applyTheme();
      
      // Change i18n language immediately
      console.log('Settings (save): Changing i18n language to:', settings.language);
      console.log('Settings (save): Current i18n language:', i18n.language);
      
      i18n.changeLanguage(settings.language).then(() => {
        console.log('Settings (save): i18n language changed successfully to:', i18n.language);
        console.log('Settings (save): Testing translation - "settings.title":', i18n.t('settings.title'));
      }).catch((error) => {
        console.error('Settings (save): Failed to change i18n language:', error);
      });
      
      console.log('Settings saved successfully');
      alert('Settings saved successfully');
      setHasChanges(false);
    },
    onError: (error: any) => {
      console.error('Settings save error:', error);
      console.error('Settings save failed');
      alert('Settings save failed');
    },
  });

  const handleChange = (field: keyof SettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Apply theme immediately when theme is changed
    if (field === 'theme') {
      console.log('Settings (dropdown): Applying theme immediately:', value);
      // Create a temporary settings object with the new theme
      const tempSettings = { ...settings, theme: value };
      settingsStore.setSettings({ theme: value as any });
      settingsStore.applyTheme();
    }
    
    // Update i18n language immediately when language is changed
    if (field === 'language') {
      console.log('Settings (dropdown): Changing i18n language to:', value);
      console.log('Settings (dropdown): Current i18n language:', i18n.language);
      console.log('Settings (dropdown): Available i18n languages:', i18n.languages);
      
      i18n.changeLanguage(value).then(() => {
        console.log('Settings (dropdown): i18n language changed successfully to:', i18n.language);
        console.log('Settings (dropdown): Testing translation - "settings.title":', i18n.t('settings.title'));
      }).catch((error) => {
        console.error('Settings (dropdown): Failed to change i18n language:', error);
      });
    }
  };

  const handleSave = () => {
    saveSettingsMutation.mutate(settings);
  };

  const handleCancel = () => {
    // Reset to current store values
    setSettings({
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
    setHasChanges(false);
    console.log('Changes discarded');
    alert(t('settings.changesDiscarded'));
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
                {t('settings.hotelAddress')}
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
                {t('settings.hotelCity')}
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
                {t('settings.hotelPhone')}
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
                {t('settings.hotelEmail')}
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
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('settings.invoiceSignature')}</h2>
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
                    {t('settings.editSignature')}
                  </Button>
                  <Button 
                    onClick={removeSignature}
                    variant="danger"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('settings.remove')}
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => setShowSignaturePad(true)}
                className="w-full bg-seafoam-500 hover:bg-seafoam-600"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {t('settings.drawSignature')}
              </Button>
            )}
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {t('settings.signatureAppearsOnInvoices')}
            </p>
          </div>
        </Card>
      </div>

      {/* Signature Drawing Modal */}
      {showSignaturePad && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 border dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('settings.drawYourSignature')}</h2>
            
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
                {t('settings.clear')}
              </Button>
              <Button
                onClick={() => setShowSignaturePad(false)}
                variant="secondary"
                className="flex-1 dark:border-slate-600 dark:text-slate-200"
              >
                {t('settings.cancel')}
              </Button>
              <Button
                onClick={saveSignature}
                className="flex-1 bg-seafoam-500 hover:bg-seafoam-600"
              >
                {t('settings.saveSignature')}
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
