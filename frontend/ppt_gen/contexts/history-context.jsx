"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import api from "@/lib/api";

const HistoryContext = createContext();

const MOCK_HISTORY = []; // Kept empty or unused as we use the real API

export function HistoryProvider({ children }) {
    const { status } = useSession();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchHistory = async (forceLoading = false) => {
        if (status !== "authenticated") {
            if (isMounted.current) setIsLoading(false);
            return;
        }

        if (forceLoading || history.length === 0) {
            if (isMounted.current) setIsLoading(true);
        }

        try {
            const res = await api.get("/api/ppt/");
            if (isMounted.current && res && res.data) {
                setHistory(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch history:", err);
            toast.error(err.message || "Failed to load presentations");
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [status]);

    const deletePresentation = async (id) => {
        toast.info("Deleting presentation");

        try {
            await api.delete(`/api/ppt/${id}`);
            setHistory((prev) => prev.filter((p) => p.id !== id));
            toast.success("Presentation deleted");
            return true;
        } catch (err) {
            console.error("Failed to delete presentation:", err);
            toast.error(err.message || "Failed to delete presentation");
            return false;
        }
    };

    return (
        <HistoryContext.Provider
            value={{
                history,
                isLoading,
                deletePresentation,
                refreshHistory: fetchHistory,
            }}
        >
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
