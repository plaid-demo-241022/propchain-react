import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  firebaseUser:    null,
  profile:         null,
  isAuthenticated: false,
  isLoading:       true,

  setFirebaseUser: (user) => set({ firebaseUser: user, isAuthenticated: !!user }),
  setProfile:      (profile) => set({ profile }),
  setLoading:      (loading) => set({ isLoading: loading }),
  logout: () => set({ firebaseUser: null, profile: null, isAuthenticated: false, isLoading: false }),
}));
