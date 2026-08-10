import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IActiveProfileStore {
  activeProfileId: string | null;
  setActiveProfileId: (id: string) => void;
  clearActiveProfileId: () => void;
}

export const useActiveProfileStore = create<IActiveProfileStore>()(
  persist(
    (set) => ({
      activeProfileId: null,
      setActiveProfileId: (id: string) => set({ activeProfileId: id }),
      clearActiveProfileId: () => set({ activeProfileId: null }),
    }),
    { name: "cerithe-active-profile" },
  ),
);
