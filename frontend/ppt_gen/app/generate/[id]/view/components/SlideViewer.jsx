"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Diamond, Loader2, Sparkles } from "lucide-react";
import Slide from "@/components/templates/Slide";
import SlideFloatingControls from "@/components/generate/SlideFloatingControls";
import { PresentationContext } from "@/contexts/presentation-context";
import { useSettingsStore } from "@/hooks/use-settings-store";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import "../../../../../components/templates/themes.css";
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
    resolveSlideContent,
    theme,
    isBusy,
    isStreamGenerating,
    isEditingWithAI = false,
    isFullscreen,
    isTouchDevice,
    onUpdateSlide,
    onUpdateBlock,
    onReplaceBlock,
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
    textSizes,
    readOnly = false,
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

    const prevIndexRef = useRef(activeSlideIndex);
    const direction = activeSlideIndex >= prevIndexRef.current ? 1 : -1;

    useEffect(() => {
        prevIndexRef.current = activeSlideIndex;
    }, [activeSlideIndex]);

    const slideVariants = {
        enter: (dir) => ({
            x: isFullscreen && animationsEnabled ? (dir > 0 ? 20 : -20) : 0,
            opacity: isFullscreen && animationsEnabled ? 0 : 1,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir) => ({
            x: isFullscreen && animationsEnabled ? (dir < 0 ? 20 : -20) : 0,
            opacity: isFullscreen && animationsEnabled ? 0 : 1,
        }),
    };

    const controls = useAnimation();

    useEffect(() => {
        controls.start({
            x: `-${activeSlideIndex * 100}%`,
            transition: { type: "spring", stiffness: 280, damping: 30, mass: 0.8 },
        });
    }, [activeSlideIndex, controls]);

    const handleDragEnd = useCallback(
        (event, info) => {
            if (isBusy || slideCount <= 1) return;
            const swipeThreshold = 40;
            const velocityThreshold = 150;

            if (
                info.offset.x < -swipeThreshold ||
                info.velocity.x < -velocityThreshold
            ) {
                if (activeSlideIndex < slideCount - 1) {
                    const newIndex = activeSlideIndex + 1;
                    controls.start({ x: `-${newIndex * 100}%` });
                    setActiveSlideIndex(newIndex);
                }
            } else if (
                info.offset.x > swipeThreshold ||
                info.velocity.x > velocityThreshold
            ) {
                if (activeSlideIndex > 0) {
                    const newIndex = activeSlideIndex - 1;
                    controls.start({ x: `-${newIndex * 100}%` });
                    setActiveSlideIndex(newIndex);
                }
            }
        },
        [activeSlideIndex, slideCount, isBusy, setActiveSlideIndex, controls],
    );

    const getSlideContent = useCallback(
        (slide, idx) => {
            if (idx === activeSlideIndex && resolvedSlideContent) {
                return resolvedSlideContent;
            }
            if (typeof resolveSlideContent === "function") {
                return resolveSlideContent(slide, idx);
            }
            return slide?.slide_content || slide;
        },
        [activeSlideIndex, resolvedSlideContent, resolveSlideContent],
    );

    return (
        <div
            ref={presentationRef}
            data-theme={theme || resolvedSlideContent?.theme}
            className={`w-full relative group flex items-center justify-center ${isFullscreen ? "max-w-none! bg-black w-screen h-screen" : ""}`}
            style={
                isFullscreen
                    ? undefined
                    : {
                          maxWidth:
                              "min(1024px, 100%, calc(1.778 * (100dvh - 240px)))",
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
                    className="absolute z-20 h-8 w-8 md:h-10 md:w-10 rounded-full bg-background/80 hover:bg-background border border-border text-foreground flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0! shadow-sm backdrop-blur-sm cursor-pointer left-1 md:-left-12"
                    title="Previous Slide (Left Arrow)"
                >
                    <ChevronLeft size={20} className="mr-0.5" />
                </button>
            )}

            {/* Slide canvas */}
            <div
                data-theme={theme || resolvedSlideContent?.theme}
                className={`w-full relative overflow-hidden theme-container select-none ${
                    isFullscreen
                        ? "max-h-screen max-w-[calc(100vh*16/9)]"
                        : "shadow-xl rounded-lg max-md:rounded-md overflow-hidden ring-1 ring-border/20"
                }`}
            >
                {editableSlides && editableSlides.length > 0 ? (
                    <PresentationContext.Provider
                        value={{ isPresenting: isFullscreen }}
                    >
                        {isTouchDevice ? (
                            <motion.div
                                drag={!isBusy && slideCount > 1 ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={{
                                    top: 0,
                                    bottom: 0,
                                    left: activeSlideIndex === slideCount - 1 ? 0 : 1,
                                    right: activeSlideIndex === 0 ? 0 : 1,
                                }}
                                dragTransition={{ bounceStiffness: 280, bounceDamping: 30 }}
                                onDragEnd={handleDragEnd}
                                className="w-full h-full relative touch-pan-y cursor-grab active:cursor-grabbing"
                            >
                                <motion.div
                                    animate={controls}
                                    transition={{
                                        type: "spring",
                                        stiffness: 280,
                                        damping: 30,
                                        mass: 0.8,
                                    }}
                                    className="flex w-full h-full relative"
                                >
                                {editableSlides.map((slide, idx) => (
                                    <div
                                        key={idx}
                                        className="w-full h-full shrink-0 relative"
                                    >
                                        {(readOnly || idx !== activeSlideIndex) && (
                                            <div
                                                className="absolute inset-0 z-10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }}
                                            />
                                        )}
                                        <Slide
                                            slide_content={{
                                                ...getSlideContent(slide, idx),
                                                theme,
                                            }}
                                            textSizes={textSizes}
                                            onUpdateSlide={
                                                isFullscreen || readOnly || idx !== activeSlideIndex
                                                    ? undefined
                                                    : onUpdateSlide
                                            }
                                            onUpdateBlock={
                                                isFullscreen || readOnly || idx !== activeSlideIndex
                                                    ? undefined
                                                    : onUpdateBlock
                                            }
                                            onReplaceBlock={
                                                isFullscreen || readOnly || idx !== activeSlideIndex
                                                    ? undefined
                                                    : onReplaceBlock
                                            }
                                            onDeleteBlock={
                                                isFullscreen || readOnly || idx !== activeSlideIndex
                                                    ? undefined
                                                    : onDeleteBlock
                                            }
                                            onAddBlock={
                                                isFullscreen || readOnly || idx !== activeSlideIndex
                                                    ? undefined
                                                    : onAddBlock
                                            }
                                            onSplitBlock={
                                                isFullscreen || readOnly || idx !== activeSlideIndex
                                                    ? undefined
                                                    : onSplitBlock
                                            }
                                            onUpdateItem={
                                                isFullscreen || readOnly || idx !== activeSlideIndex
                                                    ? undefined
                                                    : onUpdateItem
                                            }
                                            onDeleteItem={
                                                isFullscreen || readOnly || idx !== activeSlideIndex
                                                    ? undefined
                                                    : onDeleteItem
                                            }
                                            onAddItem={
                                                isFullscreen || readOnly || idx !== activeSlideIndex
                                                    ? undefined
                                                    : onAddItem
                                            }
                                            onEditImage={
                                                isFullscreen || readOnly || idx !== activeSlideIndex
                                                    ? undefined
                                                    : onEditImage
                                            }
                                            onSplitSlide={
                                                isFullscreen || readOnly || idx !== activeSlideIndex
                                                    ? undefined
                                                    : onSplitSlide
                                            }
                                            slideIndex={idx}
                                        />
                                    </div>
                                ))}
                                </motion.div>
                            </motion.div>
                        ) : (
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={activeSlideIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="w-full h-full relative"
                                >
                                    {readOnly && (
                                        <div
                                            className="absolute inset-0 z-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                            }}
                                        />
                                    )}
                                    {isEditingWithAI && (
                                        <div className="absolute inset-0 z-30 bg-background/35 backdrop-blur-[2px] rounded-md flex flex-col items-center justify-center gap-2 border-2 border-primary/50 animate-pulse pointer-events-none">
                                            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background/95 border border-primary/30 shadow-lg text-xs font-semibold text-foreground">
                                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                                <span>AI is redesigning this slide</span>
                                            </div>
                                        </div>
                                    )}
                                    <Slide
                                        slide_content={{
                                            ...getSlideContent(activeSlide, activeSlideIndex),
                                            theme,
                                        }}
                                        textSizes={textSizes}
                                        onUpdateSlide={
                                            isFullscreen || readOnly ? undefined : onUpdateSlide
                                        }
                                        onUpdateBlock={
                                            isFullscreen || readOnly ? undefined : onUpdateBlock
                                        }
                                        onReplaceBlock={
                                            isFullscreen || readOnly
                                                ? undefined
                                                : onReplaceBlock
                                        }
                                        onDeleteBlock={
                                            isFullscreen || readOnly ? undefined : onDeleteBlock
                                        }
                                        onAddBlock={
                                            isFullscreen || readOnly ? undefined : onAddBlock
                                        }
                                        onSplitBlock={
                                            isFullscreen || readOnly ? undefined : onSplitBlock
                                        }
                                        onUpdateItem={
                                            isFullscreen || readOnly ? undefined : onUpdateItem
                                        }
                                        onDeleteItem={
                                            isFullscreen || readOnly ? undefined : onDeleteItem
                                        }
                                        onAddItem={
                                            isFullscreen || readOnly ? undefined : onAddItem
                                        }
                                        onEditImage={
                                            isFullscreen || readOnly ? undefined : onEditImage
                                        }
                                        onSplitSlide={
                                            isFullscreen || readOnly ? undefined : onSplitSlide
                                        }
                                        slideIndex={activeSlideIndex}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </PresentationContext.Provider>
                ) : isStreamGenerating ? (
                    <div className="w-full aspect-video bg-background flex flex-col items-center justify-center  gap-4 p-8 text-center rounded-md border">
                        <div className="sweep-glow"></div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm  text-accent-foreground/90 flex items-center gap-2 justify-center font-semibold">
                                Generating presentation{" "}
                                <Diamond className="animate-spin-pause text-primary w-4 h-4" />
                            </p>
                            <p className="text-xs text-accent-foreground/60 max-w-sm">
                                Our AI is thinking and preparing your slides.
                                This will take a few moments.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full aspect-video bg-background flex flex-col items-center justify-center text-neutral-500 rounded-md ">
                        <p className="text-sm">No slides available</p>
                    </div>
                )}
            </div>

            {/* Floating controls */}
            {!isFullscreen && activeSlide && !readOnly && (
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
                    className="absolute z-20 h-8 w-8 md:h-10 md:w-10 rounded-full bg-background/80 hover:bg-background border border-border text-foreground flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0! shadow-sm backdrop-blur-sm cursor-pointer right-1 md:-right-12"
                    title="Next Slide (Right Arrow)"
                >
                    <ChevronRight size={20} className="ml-0.5" />
                </button>
            )}
        </div>
    );
});

export default SlideViewer;
