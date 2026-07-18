"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import api from "@/lib/api";
import { normalizeSlides } from "./use-slide-editor";
import { useHistoryStore } from "@/contexts/history-context";

/**
 * Manages PPT data fetching from the API and the SSE streaming connection
 * during live generation. Isolated so that stream/fetch state changes don't
 * cascade re-renders into the slide viewer or image-fetcher.
 *
 * @param {object} opts
 * @param {string} opts.pptId
 * @param {function} opts.setPptData
 * @param {function} opts.setEditableSlides
 * @param {function} opts.setActiveSlideIndex
 * @returns {{ isLoading, isStreamGenerating, initialDataRef }}
 */
export function usePptData({ pptId, setPptData, setEditableSlides, setActiveSlideIndex }) {
    const router = useRouter();
    const { data: session, status: authStatus } = useSession();
    const searchParams = useSearchParams();

    const isGeneratingParam = searchParams?.get("generating") === "true";

    // Detect page reload to prevent triggering a new stream on reload
    const [isReloaded] = useState(() => {
        if (typeof window === "undefined") return false;
        const entries = window.performance?.getEntriesByType?.("navigation");
        return entries && entries.length > 0 && entries[0].type === "reload";
    });

    const [isStreamGenerating, setIsStreamGenerating] = useState(
        isGeneratingParam && !isReloaded,
    );

    // Snapshot URL generation params once so the SSE effect doesn't depend on
    // the live (potentially unstable) searchParams object reference.
    const streamParamsRef = useRef(null);
    if (!streamParamsRef.current && isGeneratingParam) {
        streamParamsRef.current = {
            prompt: searchParams?.get("prompt") || "",
            tone: searchParams?.get("tone") || "",
            slidesCount: searchParams?.get("slidesCount") || "",
            layoutStyle: searchParams?.get("layoutStyle") || "",
        };
    }

    const [isLoading, setIsLoading] = useState(true);
    const initialDataRef = useRef(null);

    // Redirect on reload during generation
    useEffect(() => {
        if (isReloaded && isGeneratingParam) {
            router.replace("/generate");
        }
    }, [isReloaded, isGeneratingParam, router]);

    // Warn user before closing tab during generation
    useEffect(() => {
        if (!isStreamGenerating) return;
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "Reloading will abort the generation. Are you sure you want to leave?";
            return e.returnValue;
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isStreamGenerating]);

    // Fetch PPT from DB on mount
    useEffect(() => {
        if (authStatus === "loading") return;
        if (authStatus === "unauthenticated") {
            router.push("/");
            return;
        }
        if (!pptId) return;

        if (isStreamGenerating) {
            setPptData({ id: pptId, title: "Generating", slides: [] });
            setIsLoading(false);
            return;
        }

        let active = true;
        const fetchPPT = async () => {
            setIsLoading((prev) => (prev !== true ? true : prev));
            try {
                const res = await api.get(`/api/ppt/${pptId}`);
                if (!active) return;
                if (res?.data && res.data.length > 0) {
                    const presentation = res.data[0];
                    setPptData(presentation);
                    initialDataRef.current = JSON.stringify(presentation);
                    useHistoryStore.getState().addOrUpdatePresentation(presentation);
                } else {
                    toast.error("Presentation not found");
                }
            } catch (err) {
                console.error("Failed to fetch presentation:", err);
                if (active) toast.error("Failed to load presentation");
            } finally {
                if (active) setIsLoading(false);
            }
        };

        fetchPPT();
        return () => { active = false; };
    }, [pptId, authStatus, router, isStreamGenerating]);

    // SSE streaming during generation
    useEffect(() => {
        if (!pptId || !isStreamGenerating || !session?.accessToken) return;

        let active = true;
        const abortController = new AbortController();

        const clearQueryParams = () => {
            const url = new URL(window.location.href);
            url.searchParams.delete("generating");
            url.searchParams.delete("prompt");
            url.searchParams.delete("tone");
            url.searchParams.delete("slidesCount");
            url.searchParams.delete("layoutStyle");
            router.replace(url.pathname + url.search, { shallow: true });
        };

        const handleComplete = () => {
            if (!active) return;
            console.log("[Stream] Complete event received.");
            setIsStreamGenerating(false);
            clearQueryParams();

            const refetch = async () => {
                try {
                    const res = await api.get(`/api/ppt/${pptId}`);
                    if (res?.data && res.data.length > 0) {
                        const presentation = res.data[0];
                        setPptData(presentation);
                        const normalized = normalizeSlides(presentation.slides || []);
                        setEditableSlides(normalized);
                        initialDataRef.current = JSON.stringify(presentation);
                        useHistoryStore.getState().addOrUpdatePresentation(presentation);
                    }
                } catch (err) {
                    console.error("[Stream] Failed refetching on complete:", err);
                }
            };
            refetch();
        };

        const handleError = () => {
            if (!active) return;
            toast.error("Generation failed. Please try again or check prompt.");
            setIsStreamGenerating(false);
            clearQueryParams();
        };

        const startStream = async () => {
            const token = session.accessToken;
            const params = streamParamsRef.current || {};
            const promptParam = params.prompt || "";
            const slidesCountParam = params.slidesCount || "";
            const layoutStyleParam = params.layoutStyle || "";

            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
            const streamUrl =
                `${backendUrl.replace(/\/$/, "")}/api/ppt/stream/${pptId}?` +
                `prompt=${encodeURIComponent(promptParam)}` +
                `&tone=${encodeURIComponent("Suitable tone")}` +
                `&slidesCount=${encodeURIComponent(slidesCountParam)}` +
                `&layoutStyle=${encodeURIComponent(layoutStyleParam)}`;

            console.log(`[Stream] Establishing fetch stream connection to: ${streamUrl}`);

            try {
                const response = await fetch(streamUrl, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                    signal: abortController.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let buffer = "";

                while (active) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop();

                    for (const line of lines) {
                        const cleanLine = line.trim();
                        if (!cleanLine) continue;

                        if (cleanLine.startsWith("event: complete")) {
                            handleComplete();
                            break;
                        } else if (cleanLine.startsWith("event: error")) {
                            handleError();
                            break;
                        } else if (cleanLine.startsWith("data: ")) {
                            try {
                                const data = JSON.parse(cleanLine.slice(6));
                                if (data.slides && Array.isArray(data.slides)) {
                                    const normalized = normalizeSlides(data.slides);
                                    setEditableSlides(normalized);
                                    setPptData((prev) => ({ 
                                        ...prev, 
                                        slides: normalized,
                                        theme: data.theme || prev.theme 
                                    }));
                                    if (normalized.length > 0) {
                                        setActiveSlideIndex(normalized.length - 1);
                                    }
                                }
                            } catch (e) {
                                console.error("[Stream] Error parsing SSE chunk:", e);
                            }
                        }
                    }
                }
            } catch (err) {
                if (active && err.name !== "AbortError") {
                    console.error("[Stream] SSE connection error:", err);
                    handleError();
                }
            }
        };

        startStream();
        return () => {
            active = false;
            abortController.abort();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pptId, isStreamGenerating, session?.accessToken]);

    return { isLoading, isStreamGenerating, initialDataRef };
}
