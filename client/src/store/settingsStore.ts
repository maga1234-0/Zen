import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'Light' | 'Dark' | 'System';
  language: string;
  hotelName: string;
  hotelAddress: string;
  hotelCity: string;
  hotelPhone: string;
  hotelEmail: string;
  timeZone: string;
  emailNotifications: boolean;
  bookingAlerts: boolean;
  paymentNotifications: boolean;
  signature: string;
  setSettings: (settings: Partial<SettingsState>) => void;
  applyTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'Dark',
      language: 'French',
      hotelName: 'Grand Hôtel Seafoam',
      hotelAddress: '123 Luxury Avenue',
      hotelCity: 'Paradise City, PC 12345',
      hotelPhone: '+1 (555) 123-4567',
      hotelEmail: 'info@grandhotel.com',
      timeZone: 'UTC-5 (Eastern Time)',
      emailNotifications: true,
      bookingAlerts: true,
      paymentNotifications: true,
      signature: '',
      setSettings: (settings) => {
        console.log('SettingsStore: Setting new settings:', settings);
        set(settings);
        // Apply theme immediately when changed
        if (settings.theme) {
          console.log('SettingsStore: Theme changed to:', settings.theme);
          get().applyTheme();
        }
      },
      applyTheme: () => {
        const { theme } = get();
        const root = document.documentElement;
        console.log('SettingsStore: Applying theme:', theme);
        
        if (theme === 'Dark') {
          root.classList.add('dark');
          console.log('SettingsStore: Added dark class to document');
        } else if (theme === 'Light') {
          root.classList.remove('dark');
          console.log('SettingsStore: Removed dark class from document');
        } else if (theme === 'System') {
          // Check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          console.log('SettingsStore: System prefers dark mode:', prefersDark);
          if (prefersDark) {
            root.classList.add('dark');
            console.log('SettingsStore: Added dark class to document (system preference)');
          } else {
            root.classList.remove('dark');
            console.log('SettingsStore: Removed dark class from document (system preference)');
          }
        }
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);
