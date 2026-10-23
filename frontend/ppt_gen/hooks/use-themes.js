import { useEffect } from "react";
import { create } from "zustand";
import api from "@/lib/api";
import { toast } from "sonner";

export const useThemeStore = create((set, get) => ({
    customThemes: [],
    isLoading: false,
    fetchPromise: null,

    fetchThemes: async (force = false) => {
        const { customThemes, fetchPromise } = get();
        
        // If already have data and not forcing, return immediately
        if (!force && customThemes.length > 0) return;
        
        // If a fetch is already in progress, just wait for it
        if (fetchPromise && !force) {
            set({ isLoading: true });
            await fetchPromise;
            set({ isLoading: false });
            return;
        }

        const promise = (async () => {
            try {
                const res = await api.get("/api/themes");
                let fetched = [];
                if (res?.success && res.data) {
                    fetched = res.data;
                } else if (Array.isArray(res)) {
                    fetched = res;
                } else if (res?.data) {
                    fetched = res.data;
                }
                set({ customThemes: fetched });
            } catch (err) {
                console.error("Failed to fetch custom themes:", err);
            }
        })();

        set({ isLoading: true, fetchPromise: promise });
        await promise;
        set({ isLoading: false, fetchPromise: null });
    },

    createTheme: async (themeData) => {
        const toastId = toast.loading("Saving theme...");
        try {
            const res = await api.post("/api/themes", themeData);
            toast.success("Theme saved successfully!", { id: toastId });
            await get().fetchThemes(true);
            return res?.data || res;
        } catch (err) {
            console.error("Failed to create theme:", err);
            toast.error("Failed to save theme", { id: toastId });
            throw err;
        }
    },

    updateTheme: async (id, themeData) => {
        const toastId = toast.loading("Updating theme...");
        try {
            const res = await api.patch(`/api/themes/${id}`, themeData);
            toast.success("Theme updated successfully!", { id: toastId });
            await get().fetchThemes(true);
            return res?.data || res;
        } catch (err) {
            console.error("Failed to update theme:", err);
            toast.error("Failed to update theme", { id: toastId });
            throw err;
        }
    },

    deleteTheme: async (id) => {
        const toastId = toast.loading("Deleting theme...");
        try {
            await api.delete(`/api/themes/${id}`);
            toast.success("Theme deleted successfully!", { id: toastId });
            await get().fetchThemes(true);
        } catch (err) {
            console.error("Failed to delete theme:", err);
            toast.error("Failed to delete theme", { id: toastId });
            throw err;
        }
    },

    extractThemeFromImage: async (imageBase64) => {
        const toastId = toast.loading("Analyzing template colors with AI...");
        try {
            const res = await api.post("/api/themes/extract-from-image", { image: imageBase64 });
            toast.success("Theme extracted from template!", { id: toastId });
            return res?.data || res;
        } catch (err) {
            console.error("Failed to extract theme from image:", err);
            toast.error(err?.message || "Failed to extract theme from image", { id: toastId });
            throw err;
        }
    }
}));

export function useThemes(options = { fetchOnMount: true }) {
    const store = useThemeStore();
    const fetchThemes = store.fetchThemes;
    
    useEffect(() => {
        if (options.fetchOnMount) {
            fetchThemes();
        }
    }, [fetchThemes, options.fetchOnMount]);

    return store;
}
