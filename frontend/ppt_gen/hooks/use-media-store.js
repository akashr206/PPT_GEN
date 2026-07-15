import { create } from "zustand";
import api from "@/lib/api";

export const useMediaStore = create((set, get) => ({
    iconCache: {}, // { query: resultsArray }
    imageCache: {}, // { query: resultsArray }
    
    userIcons: [],
    userImages: [],
    hasFetchedUserIcons: false,
    hasFetchedUserImages: false,
    
    isLoadingIcons: false,
    isLoadingImages: false,

    searchIcons: async (query) => {
        const { iconCache } = get();
        if (iconCache[query]) {
            return iconCache[query];
        }

        set({ isLoadingIcons: true });
        try {
            const res = await api.get("/api/ppt/icons/search", {
                params: { keywords: query }
            });
            const data = res?.data || res || [];
            set((state) => ({
                iconCache: { ...state.iconCache, [query]: data }
            }));
            return data;
        } catch (error) {
            console.error("Failed to search icons:", error);
            return [];
        } finally {
            set({ isLoadingIcons: false });
        }
    },

    searchImages: async (query) => {
        const { imageCache } = get();
        if (imageCache[query]) {
            return imageCache[query];
        }

        set({ isLoadingImages: true });
        try {
            const res = await api.get("/api/ppt/images/search", {
                params: { q: query }
            });
            const data = res?.data || res || [];
            set((state) => ({
                imageCache: { ...state.imageCache, [query]: data }
            }));
            return data;
        } catch (error) {
            console.error("Failed to search images:", error);
            return [];
        } finally {
            set({ isLoadingImages: false });
        }
    },

    fetchUserIcons: async (force = false) => {
        const { hasFetchedUserIcons, userIcons } = get();
        if (hasFetchedUserIcons && !force) {
            return userIcons;
        }
        
        try {
            const res = await api.get("/api/library/icons");
            const data = res?.data || res || [];
            set({ userIcons: data, hasFetchedUserIcons: true });
            return data;
        } catch (error) {
            console.error("Failed to fetch user icons:", error);
            return [];
        }
    },

    fetchUserImages: async (force = false) => {
        const { hasFetchedUserImages, userImages } = get();
        if (hasFetchedUserImages && !force) {
            return userImages;
        }
        
        try {
            const res = await api.get("/api/library/images");
            const data = res?.data?.images || res?.data || res || [];
            set({ userImages: data, hasFetchedUserImages: true });
            return data;
        } catch (error) {
            console.error("Failed to fetch user images:", error);
            return [];
        }
    }
}));
