import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export function useThemes() {
    const [customThemes, setCustomThemes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchThemes = useCallback(async () => {
        setTimeout(() => setIsLoading(true), 0);
        try {
            const res = await api.get("/api/themes");
            if (res?.success && res.data) {
                setCustomThemes(res.data);
            } else if (Array.isArray(res)) {
                setCustomThemes(res);
            } else if (res?.data) {
                setCustomThemes(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch custom themes:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createTheme = async (themeData) => {
        const toastId = toast.loading("Saving theme...");
        try {
            const res = await api.post("/api/themes", themeData);
            toast.success("Theme saved successfully!", { id: toastId });
            await fetchThemes();
            return res?.data || res;
        } catch (err) {
            console.error("Failed to create theme:", err);
            toast.error("Failed to save theme", { id: toastId });
            throw err;
        }
    };

    const updateTheme = async (id, themeData) => {
        const toastId = toast.loading("Updating theme...");
        try {
            const res = await api.patch(`/api/themes/${id}`, themeData);
            toast.success("Theme updated successfully!", { id: toastId });
            await fetchThemes();
            return res?.data || res;
        } catch (err) {
            console.error("Failed to update theme:", err);
            toast.error("Failed to update theme", { id: toastId });
            throw err;
        }
    };

    const deleteTheme = async (id) => {
        const toastId = toast.loading("Deleting theme...");
        try {
            await api.delete(`/api/themes/${id}`);
            toast.success("Theme deleted successfully!", { id: toastId });
            await fetchThemes();
        } catch (err) {
            console.error("Failed to delete theme:", err);
            toast.error("Failed to delete theme", { id: toastId });
            throw err;
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchThemes();
    }, [fetchThemes]);

    return {
        customThemes,
        isLoading,
        fetchThemes,
        createTheme,
        updateTheme,
        deleteTheme,
    };
}
