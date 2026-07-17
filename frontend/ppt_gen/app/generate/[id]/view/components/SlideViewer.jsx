"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Slide from "@/components/templates/Slide";
import SlideFloatingControls from "@/components/generate/SlideFloatingControls";
import { PresentationContext } from "@/contexts/presentation-context";
import { useSettingsStore } from "@/hooks/use-settings-store";
import { motion, AnimatePresence } from "framer-motion";

const CURSOR_LEFT = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M12 19l-7-7 7-7' stroke='black' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><path d='M19 12H5M12 19l-7-7 7-7' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>") 16 16, w-resize`;
const CURSOR_RIGHT = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none'><path d='M5 12h14M12 5l7 7-7 7' stroke='black' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><path d='M5 12h14M12 5l7 7-7 7' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>") 16 16, e-resize`;

/**
 * The main slide canvas — prev/next nav, the active Slide component,
 * fullscreen click areas, and floating controls.
 *
 * Wrapped in React.memo so it only re-renders when its own props change.
 * This prevents image-fetching and sidebar state updates from causing
 * animation glitches in the active slide.
 */
const SlideViewer = React.memo(function SlideViewer({
    editableSlides,
    activeSlideIndex,
    setActiveSlideIndex,
    resolvedSlideContent,
    theme,
    isBusy,
    isStreamGenerating,
    isFullscreen,
    isTouchDevice,
    onUpdateSlide,
    onUpdateBlock,
    onDeleteBlock,
    onAddBlock,
    onSplitBlock,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    onEditImage,
    onSplitSlide,
    onDeleteSlide,
    onEditWithAI,
}) {
    const presentationRef = useRef(null);

    const handlePresent = useCallback(async () => {
        if (!presentationRef.current) return;
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await presentationRef.current.requestFullscreen();
            }
        } catch (err) {
            console.error("Error attempting to enable fullscreen:", err);
        }
    }, []);

    // Listen for toolbar-triggered present events
    useEffect(() => {
        const handlePresentEvent = () => {
            if (!isBusy) handlePresent();
        };
        window.addEventListener("trigger-present", handlePresentEvent);
        return () =>
            window.removeEventListener("trigger-present", handlePresentEvent);
    }, [isBusy, handlePresent]);

    const slideCount = editableSlides?.length ?? 0;
    const activeSlide = editableSlides?.[activeSlideIndex];

    const { animationsEnabled } = useSettingsStore();

    return (
        <div
            ref={presentationRef}
            className={`w-full relative group flex items-center justify-center ${isFullscreen ? "!max-w-none bg-black w-screen h-screen" : ""}`}
            style={
                isFullscreen
                    ? undefined
                    : {
                          maxWidth:
                              "min(1024px, 100%, calc(1.778 * (100vh - 240px)))",
                      }
            }
        >
            {/* Prev arrow */}
            {!isFullscreen && (
                <button
                    onClick={() =>
                        setActiveSlideIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={activeSlideIndex === 0 || isBusy}
                    className="absolute z-20 h-8 w-8 md:h-10 md:w-10 rounded-full bg-background/80 hover:bg-background border border-border text-foreground flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:!opacity-0 shadow-sm backdrop-blur-sm cursor-pointer -left-4 md:-left-12"
                    title="Previous Slide (Left Arrow)"
                >
                    <ChevronLeft size={20} className="mr-0.5" />
                </button>
            )}

            {/* Slide canvas */}
            <div
                className={`w-full relative overflow-hidden ${
                    isFullscreen
                        ? "max-h-screen max-w-[calc(100vh*16/9)] bg-background"
                        : "shadow-xl rounded-lg max-md:rounded-md overflow-hidden ring-1 ring-border/20"
                }`}
            >
                {activeSlide ? (
                    <PresentationContext.Provider value={{ isPresenting: isFullscreen }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSlideIndex}
                                initial={isFullscreen && animationsEnabled ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={isFullscreen && animationsEnabled ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full h-full"
                            >
                                <Slide
                                    slide_content={{ ...resolvedSlideContent, theme }}
                                    onUpdateSlide={isFullscreen ? undefined : onUpdateSlide}
                                    onUpdateBlock={isFullscreen ? undefined : onUpdateBlock}
                                    onDeleteBlock={isFullscreen ? undefined : onDeleteBlock}
                                    onAddBlock={isFullscreen ? undefined : onAddBlock}
                                    onSplitBlock={isFullscreen ? undefined : onSplitBlock}
                                    onUpdateItem={isFullscreen ? undefined : onUpdateItem}
                                    onDeleteItem={isFullscreen ? undefined : onDeleteItem}
                                    onAddItem={isFullscreen ? undefined : onAddItem}
                                    onEditImage={isFullscreen ? undefined : onEditImage}
                                    onSplitSlide={isFullscreen ? undefined : onSplitSlide}
                                    slideIndex={activeSlideIndex}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </PresentationContext.Provider>
                ) : isStreamGenerating ? (
                    <div className="w-full aspect-video bg-[#0d0d0d] flex flex-col items-center justify-center text-white gap-4 p-8 text-center rounded-md border border-neutral-800">
                        <Loader2 className="animate-spin text-primary w-8 h-8" />
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold text-neutral-200">
                                Generating presentation
                            </p>
                            <p className="text-xs text-neutral-500 max-w-sm">
                                Our AI is thinking and preparing your slides.
                                This will take a few moments.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full aspect-video bg-[#0d0d0d] flex flex-col items-center justify-center text-neutral-500 rounded-md border border-neutral-800">
                        <p className="text-sm">No slides available</p>
                    </div>
                )}
            </div>

            {/* Floating controls */}
            {!isFullscreen && activeSlide && (
                <SlideFloatingControls
                    isTouchDevice={isTouchDevice}
                    isBusy={isBusy}
                    canDelete={slideCount > 1}
                    onEditWithAI={onEditWithAI}
                    onDeleteSlide={() => onDeleteSlide(activeSlideIndex)}
                    onAddBlock={onAddBlock}
                />
            )}

            {/* Fullscreen click areas */}
            {isFullscreen && (
                <>
                    <div
                        onClick={() =>
                            setActiveSlideIndex((prev) => Math.max(prev - 1, 0))
                        }
                        className="absolute left-0 top-0 w-1/2 h-full z-30"
                        style={{
                            cursor:
                                activeSlideIndex === 0
                                    ? "default"
                                    : CURSOR_LEFT,
                        }}
                        title="Previous Slide"
                    />
                    <div
                        onClick={() =>
                            setActiveSlideIndex((prev) =>
                                Math.min(prev + 1, slideCount - 1),
                            )
                        }
                        className="absolute right-0 top-0 w-1/2 h-full z-30"
                        style={{
                            cursor:
                                activeSlideIndex === slideCount - 1
                                    ? "default"
                                    : CURSOR_RIGHT,
                        }}
                        title="Next Slide"
                    />
                </>
            )}

            {/* Next arrow */}
            {!isFullscreen && (
                <button
                    onClick={() =>
                        setActiveSlideIndex((prev) =>
                            Math.min(prev + 1, slideCount - 1),
                        )
                    }
                    disabled={activeSlideIndex === slideCount - 1 || isBusy}
                    className="absolute z-20 h-8 w-8 md:h-10 md:w-10 rounded-full bg-background/80 hover:bg-background border border-border text-foreground flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:!opacity-0 shadow-sm backdrop-blur-sm cursor-pointer -right-4 md:-right-12"
                    title="Next Slide (Right Arrow)"
                >
                    <ChevronRight size={20} className="ml-0.5" />
                </button>
            )}
        </div>
    );
});

export default SlideViewer;
