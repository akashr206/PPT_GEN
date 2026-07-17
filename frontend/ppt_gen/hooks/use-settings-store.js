import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
    persist(
        (set) => ({
            animationsEnabled: true,
            toggleAnimations: () =>
                set((state) => ({ animationsEnabled: !state.animationsEnabled })),
            setAnimationsEnabled: (val) => set({ animationsEnabled: val }),
        }),
        {
            name: "ppt-gen-settings",
        }
    )
);
