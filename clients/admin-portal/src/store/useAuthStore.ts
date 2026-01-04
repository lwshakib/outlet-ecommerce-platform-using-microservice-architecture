import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('adminUser') || 'null'),
  token: localStorage.getItem('adminToken'),
  isAuthenticated: !!localStorage.getItem('adminToken'),
  setAuth: (user, token) => {
    localStorage.setItem('adminUser', JSON.stringify(user));
    localStorage.setItem('adminToken', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
