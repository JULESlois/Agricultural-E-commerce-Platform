import { create } from 'zustand';
import type { User } from '@/types';

interface UserState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoggedIn: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  isLoggedIn: () => !!get().currentUser,
}));
