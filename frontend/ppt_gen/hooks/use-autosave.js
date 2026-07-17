import { useEffect, useRef, useCallback } from "react";
import api from "@/lib/api";

const AUTOSAVE_DELAY_MS = 1500; // debounce: save 1.5s after last edit

/**
 * Debounced auto-save hook.
 * Watches editableSlides and saves to the backend PATCH /api/ppt/:pptId
 * whenever the slides change, after a debounce delay.
 *
 * Does NOT save during stream generation or initial load.
 *
 * @param {object} opts
 * @param {string} opts.pptId
 * @param {Array}  opts.editableSlides
 * @param {string} opts.initialDataRef - ref whose .current holds the initial JSON snapshot
 * @param {boolean} opts.isBusy - skip save while streaming/exporting
 */
export function useAutosave({ pptId, editableSlides, initialDataRef, isBusy }) {
    const timerRef = useRef(null);
    const isSavingRef = useRef(false);

    const save = useCallback(async (slides) => {
        if (!pptId || isSavingRef.current) return;
        isSavingRef.current = true;
        try {
            await api.patch(`/api/ppt/${pptId}`, { slides });
            console.log("[Autosave] Slides saved.");
        } catch (err) {
            console.error("[Autosave] Failed to save slides:", err);
        } finally {
            isSavingRef.current = false;
        }
    }, [pptId]);

    useEffect(() => {
        // Don't save if stream is running, if slides are empty, or pptId missing
        if (isBusy || !pptId || !editableSlides || editableSlides.length === 0) return;

        // Don't save if data hasn't changed from the initial load
        const currentSnapshot = JSON.stringify(editableSlides);
        if (initialDataRef.current) {
            try {
                const initial = JSON.parse(initialDataRef.current);
                const initialSlides = initial?.slides ?? initial;
                if (JSON.stringify(initialSlides) === currentSnapshot) return;
            } catch { /* ignore parse errors */ }
        }

        // Debounce: clear any pending save and schedule a new one
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            save(editableSlides);
        }, AUTOSAVE_DELAY_MS);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [editableSlides, isBusy, pptId, save, initialDataRef]);
}
