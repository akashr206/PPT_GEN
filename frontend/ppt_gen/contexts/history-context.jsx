"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { create } from "zustand";
import api from "@/lib/api";

// Create the Zustand store for history state management
export const useHistoryStore = create((set, get) => ({
    history: [],
    isLoading: false,
    hasFetched: false,

    fetchHistory: async (status, force = false) => {
        if (status !== "authenticated") {
            set({ isLoading: false });
            return;
        }

        const { history, hasFetched } = get();
        if (hasFetched && !force) {
            return;
        }

        if (force || history.length === 0) {
            set({ isLoading: true });
        }

        try {
            const res = await api.get("/api/ppt/");
            if (res && res.data) {
                set({ history: res.data, hasFetched: true });
            }
        } catch (err) {
            console.error("Failed to fetch history:", err);
            toast.error("Failed to load presentations");
        } finally {
            set({ isLoading: false });
        }
    },

    deletePresentation: async (id) => {
        toast.info("Deleting presentation");
        try {
            await api.delete(`/api/ppt/${id}`);
            set((state) => ({
                history: state.history.filter((p) => p.id !== id)
            }));
            toast.success("Presentation deleted");
            return true;
        } catch (err) {
            console.error("Failed to delete presentation:", err);
            toast.error("Failed to delete presentation");
            return false;
        }
    },

    // Add or update a presentation in the history list
    addOrUpdatePresentation: (ppt) => {
        if (!ppt || !ppt.id) return;
        set((state) => {
            const index = state.history.findIndex((p) => p.id === ppt.id);
            const updatedHistory = [...state.history];
            
            const formattedPpt = {
                id: ppt.id,
                title: ppt.title || "Untitled Presentation",
                theme: ppt.theme || "sunset",
                slides_count: ppt.slides_count || ppt.slides?.length || 0,
                created_at: ppt.created_at || new Date().toISOString(),
                first_slide: ppt.first_slide || ppt.slides?.[0] || null,
                user_id: ppt.user_id,
                status: ppt.status || "SUCCESS"
            };

            if (index !== -1) {
                updatedHistory[index] = { ...updatedHistory[index], ...formattedPpt };
            } else {
                updatedHistory.unshift(formattedPpt);
            }

            return { history: updatedHistory };
        });
    },

    // Instantly update the first slide, title, or theme of a presentation in the list
    updateFirstSlide: (pptId, firstSlide, title, theme) => {
        if (!pptId) return;
        set((state) => ({
            history: state.history.map((p) => {
                if (p.id === pptId) {
                    const updated = { ...p };
                    if (firstSlide !== undefined) updated.first_slide = firstSlide;
                    if (title !== undefined) updated.title = title;
                    if (theme !== undefined) updated.theme = theme;
                    return updated;
                }
                return p;
            })
        }));
    }
}));

// Provide HistoryProvider wrapper for backward compatibility with Layout
export function HistoryProvider({ children }) {
    const { status } = useSession();
    const fetchHistory = useHistoryStore((state) => state.fetchHistory);

    useEffect(() => {
        fetchHistory(status);
    }, [status, fetchHistory]);

    return <>{children}</>;
}

// Custom hook to consume the Zustand state with backward compatibility
export function useHistory() {
    const history = useHistoryStore((state) => state.history);
    const isLoading = useHistoryStore((state) => state.isLoading);
    const deletePresentation = useHistoryStore((state) => state.deletePresentation);
    const fetchHistory = useHistoryStore((state) => state.fetchHistory);
    const { status } = useSession();

    return {
        history,
        isLoading,
        deletePresentation,
        refreshHistory: (forceLoading = false) => fetchHistory(status, forceLoading),
    };
}
