import { create } from "zustand";

interface IAuthStore {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useTokenStore = create<IAuthStore>((set) => ({
  accessToken: null,
  setAccessToken: (token: string) => set({ accessToken: token }),
  logout: () => set({ accessToken: null }),
}));
