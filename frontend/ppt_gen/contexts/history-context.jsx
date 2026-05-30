"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { toast } from "sonner";

const HistoryContext = createContext();

export function HistoryProvider({ children }) {
    const { status } = useSession();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = async (forceLoading = false) => {
        if (status !== "authenticated") {
            setIsLoading(false);
            return;
        }

        try {
            if (forceLoading || history.length === 0) {
                setIsLoading(true);
            }
            const res = await api.get("/api/ppt/history");
            if (res.data) {
                setHistory(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch history:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [status]);

    const deletePresentation = async (id) => {
        try {
            toast.info("Deleting presentation");
            const res = await api.delete(`/api/ppt/${id}`);
            if (res && res.success) {
                setHistory(prev => prev.filter(p => p.id !== id));
                toast.success("Presentation deleted");
                return true;
            } else {
                throw new Error("Failed to delete from database");
            }
        } catch (err) {
            console.error("Failed to delete presentation:", err);
            toast.error("Failed to delete presentation");
            return false;
        }
    };

    return (
        <HistoryContext.Provider value={{ 
            history, 
            isLoading, 
            deletePresentation, 
            refreshHistory: fetchHistory 
        }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error("useHistory must be used within a HistoryProvider");
    }
    return context;
}
