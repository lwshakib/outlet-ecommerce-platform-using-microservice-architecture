import { create } from 'zustand';
import type { User, Company } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const getInitialUser = () => {
  try {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  setUser: (user) => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    set({ user, isAuthenticated: !!user });
  },
  setToken: (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ token, isAuthenticated: !!token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false, token: null });
  },
}));

interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  setCompanies: (companies: Company[]) => void;
  setSelectedCompany: (company: Company | null) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [],
  selectedCompany: null,
  setCompanies: (companies) => set({ companies }),
  setSelectedCompany: (company) => set({ selectedCompany: company }),
}));
