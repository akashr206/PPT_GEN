"use client";

import React, { useState, useEffect, use, useCallback, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import api from "@/lib/api";
import { normalizeSlides } from "@/hooks/use-slide-editor";
import { useImageFetcher } from "@/hooks/use-image-fetcher";
import SlideViewer from "@/app/generate/[id]/view/components/SlideViewer";
import { Diamond } from "lucide-react";

export default function SharedPresentationViewer({ params }) {
    const unwrappedParams = use(params);
    const pptId = unwrappedParams.id;

    const [pptData, setPptData] = useState(null);
    const [editableSlides, setEditableSlides] = useState([]);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [isTouchDevice] = useState(() => {
        return (
            typeof window !== "undefined" &&
            ("ontouchstart" in window || navigator.maxTouchPoints > 0)
        );
    });

    useEffect(() => {
        const fetchSharedPPT = async () => {
            try {
                const data = await api.get(`/api/share/${pptId}`);
                setPptData(data.data);
                if (data.data.slides && Array.isArray(data.data.slides)) {
                    setEditableSlides(normalizeSlides(data.data.slides));
                }
            } catch (err) {
                console.error("Failed to fetch shared presentation:", err);
                setError(err.message || "Presentation not found or not shared.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSharedPPT();
    }, [pptId]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
    }, []);

    // --- Keyboard shortcuts for viewer ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;

            if (e.key === "ArrowRight") {
                setActiveSlideIndex((prev) => Math.min(prev + 1, editableSlides.length - 1));
            } else if (e.key === "ArrowLeft") {
                setActiveSlideIndex((prev) => Math.max(prev - 1, 0));
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [editableSlides.length]);

    // Use a simplified resolveSlideContent since we can't edit
    const { resolveSlideContent } = useImageFetcher({
        editableSlides,
        setEditableSlides: () => {},
        setPptData: () => {},
        activeSlideIndex,
        updateSlidesState: () => {},
    });

    const activeSlide = editableSlides?.[activeSlideIndex];

    const resolvedContent = useMemo(
        () => activeSlide ? resolveSlideContent(activeSlide, activeSlideIndex) : null,
        [activeSlide, activeSlideIndex, resolveSlideContent],
    );

    const theme = pptData?.theme || "sunset";
    const textSizes = pptData?.textSizes || { title: 2.8, subtitle: 2.0, heading: 1.8, description: 1.3 };

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center bg-background p-8">
                <div className="w-full max-w-[1000px] aspect-video bg-card border border-border shadow-md rounded-md p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-7 w-3/4 max-w-[450px]" />
                    </div>
                    <div className="space-y-2 my-4">
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-11/12" />
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border/20">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center bg-background p-8">
                <div className="max-w-md text-center space-y-4">
                    <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    // Handlers disabled in view-only mode
    const slideViewerHandlers = {
        onUpdateSlide: undefined,
        onUpdateBlock: undefined,
        onReplaceBlock: undefined,
        onDeleteBlock: undefined,
        onAddBlock: undefined,
        onSplitBlock: undefined,
        onUpdateItem: undefined,
        onDeleteItem: undefined,
        onAddItem: undefined,
        onEditImage: undefined,
        onSplitSlide: undefined,
        onDeleteSlide: undefined,
    };

    return (
        <div className="w-full h-screen flex flex-col bg-background/50 select-none overflow-hidden relative">
            {/* Simple Top Bar */}
            <div className="w-full h-12 relative bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 flex items-center justify-between px-6 z-20 shrink-0">
                <div className="font-semibold text-sm truncate max-w-sm">
                    {pptData?.title || "Shared Presentation"}
                </div>
                <div className="text-xs text-muted-foreground">
                    Slide {activeSlideIndex + 1} of {editableSlides.length}
                </div>
            </div>

            <div className="w-full flex-1 flex flex-row min-h-0 relative overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center p-2 min-h-0 overflow-y-auto">
                    <div className="flex-1 flex flex-col items-center justify-between md:justify-center w-full h-full p-2 sm:p-4 relative min-h-0">
                        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-0 gap-3">
                            <SlideViewer
                                editableSlides={editableSlides}
                                activeSlideIndex={activeSlideIndex}
                                setActiveSlideIndex={setActiveSlideIndex}
                                resolvedSlideContent={resolvedContent}
                                theme={theme}
                                isBusy={false}
                                isStreamGenerating={false}
                                isFullscreen={isFullscreen}
                                isTouchDevice={isTouchDevice}
                                textSizes={textSizes}
                                readOnly={true}
                                {...slideViewerHandlers}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
