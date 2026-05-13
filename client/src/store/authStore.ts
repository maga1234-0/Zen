import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        console.log('setAuth called with:', { user, token: token ? 'token present' : 'no token' });
        set({ user, token });
      },
      logout: () => {
        console.log('Auth store logout called');
        set({ user: null, token: null });
        // Also clear localStorage directly to ensure immediate effect
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
