import { create } from "zustand";

interface IAuthStore {
  accessToken: string | null;
  // Passe a true une fois la tentative de refresh initiale (au montage de l'app) terminee,
  // succes ou echec confondus - permet a ProtectedRoute de distinguer "on ne sait pas encore"
  // de "on sait, et il n'y a pas de session".
  isBootstrapped: boolean;
  setAccessToken: (token: string) => void;
  setBootstrapped: () => void;
  logout: () => void;
}

export const useTokenStore = create<IAuthStore>((set) => ({
  accessToken: null,
  isBootstrapped: false,
  setAccessToken: (token: string) => set({ accessToken: token }),
  setBootstrapped: () => set({ isBootstrapped: true }),
  logout: () => set({ accessToken: null }),
}));
