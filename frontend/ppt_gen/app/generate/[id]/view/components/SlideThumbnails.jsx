"use client";

import React, { useEffect, useRef, useState } from "react";
import Slide from "@/components/templates/Slide";
import { GripVertical, ArrowLeft, ArrowRight, Trash2, Plus } from "lucide-react";

export default function SlideThumbnails({
    editableSlides,
    activeSlideIndex,
    setActiveSlideIndex,
    isBusy,
    theme,
    resolveSlideContent,
    handleAddSlide,
    handleDeleteSlide,
    handleMoveSlide,
}) {
    const previewScrollRef = useRef(null);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [draggedOverIndex, setDraggedOverIndex] = useState(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice(
            typeof window !== "undefined" &&
            ("ontouchstart" in window || navigator.maxTouchPoints > 0)
        );
    }, []);

    useEffect(() => {
        const el = previewScrollRef.current;
        if (!el) return;

        let animationFrameId = null;
        let targetScrollLeft = el.scrollLeft;

        const interpolateScroll = () => {
            const current = el.scrollLeft;
            const diff = targetScrollLeft - current;

            if (Math.abs(diff) < 0.5) {
                el.scrollLeft = targetScrollLeft;
                animationFrameId = null;
            } else {
                el.scrollLeft = current + diff * 0.15;
                animationFrameId = requestAnimationFrame(interpolateScroll);
            }
        };

        const handleWheel = (e) => {
            const delta =
                Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (delta !== 0) {
                e.preventDefault();
                const maxScrollLeft = el.scrollWidth - el.clientWidth;
                targetScrollLeft = Math.max(
                    0,
                    Math.min(targetScrollLeft + delta, maxScrollLeft),
                );

                if (animationFrameId === null) {
                    animationFrameId = requestAnimationFrame(interpolateScroll);
                }
            }
        };

        const handleScroll = () => {
            if (animationFrameId === null) {
                targetScrollLeft = el.scrollLeft;
            }
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        el.addEventListener("scroll", handleScroll);

        return () => {
            el.removeEventListener("wheel", handleWheel);
            el.removeEventListener("scroll", handleScroll);
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    const handleDragStart = (e, idx) => {
        setDraggingIndex(idx);
        e.dataTransfer.setData("text/plain", idx.toString());
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, idx) => {
        e.preventDefault();
        if (draggingIndex !== idx && draggedOverIndex !== idx) {
            setDraggedOverIndex(idx);
        }
    };

    const handleDragLeave = (e, idx) => {
        if (draggedOverIndex === idx) {
            setDraggedOverIndex(null);
        }
    };

    const handleDragEnd = () => {
        setDraggingIndex(null);
        setDraggedOverIndex(null);
    };

    const handleDrop = (e, targetIdx) => {
        e.preventDefault();
        const sourceIdxStr = e.dataTransfer.getData("text/plain");
        const sourceIdx = parseInt(sourceIdxStr, 10);

        setDraggingIndex(null);
        setDraggedOverIndex(null);

        if (!isNaN(sourceIdx) && sourceIdx !== targetIdx) {
            handleMoveSlide(sourceIdx, targetIdx);
        }
    };

    return (
        <div
            ref={previewScrollRef}
            className="mt-3 w-full max-w-[1000px] shrink-0 overflow-x-auto flex gap-4 py-2 px-1 scrollbar-thin scrollbar-thumb-muted justify-start items-center"
        >
            {editableSlides.map((slide, idx) => (
                <div
                    key={idx}
                    onClick={() => !isBusy && setActiveSlideIndex(idx)}
                    draggable={!isBusy}
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragLeave={(e) => handleDragLeave(e, idx)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, idx)}
                    className={`relative flex w-[120px] aspect-video rounded-md overflow-hidden border-2 text-left shrink-0 transition-all cursor-pointer group/thumb select-none ${
                        activeSlideIndex === idx
                            ? "border-primary ring-2 ring-primary/20 shadow-md opacity-100"
                            : "border-border hover:border-muted-foreground/30 opacity-70 hover:opacity-100"
                    } ${isBusy ? "cursor-not-allowed opacity-50" : ""} ${
                        draggedOverIndex === idx ? "border-amber-400 scale-[1.03] shadow-lg ring-2 ring-amber-400/20" : ""
                    } ${
                        draggingIndex === idx ? "opacity-30 border-dashed" : ""
                    }`}
                >
                    <div className="w-full h-full pointer-events-none select-none">
                        <Slide
                            slide_content={{
                                ...resolveSlideContent(slide, idx),
                                theme: theme,
                            }}
                        />
                    </div>
                    
                    {/* Index Badge */}
                    <div className="absolute bottom-1 right-1.5 bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md z-20">
                        {idx + 1}
                    </div>

                    {/* Hover/Touch Control Panel Overlay */}
                    {!isBusy && (
                        <div className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center gap-1 transition-opacity duration-200 z-10 ${
                            isTouchDevice
                                ? activeSlideIndex === idx
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none"
                                : "opacity-0 group-hover/thumb:opacity-100"
                        }`}>
                            {/* Grip Drag Handle (only show on non-touch devices since dragging is touch-native or different) */}
                            {!isTouchDevice && (
                                <div
                                    className="h-6 w-6 rounded bg-black/50 hover:bg-black/75 text-white flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors"
                                    title="Drag to reorder"
                                >
                                    <GripVertical size={11} />
                                </div>
                            )}

                            {/* Move Left Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveSlide(idx, idx - 1);
                                }}
                                disabled={idx === 0}
                                className="h-6 w-6 rounded bg-black/50 hover:bg-black/75 disabled:opacity-30 disabled:hover:bg-black/50 text-white flex items-center justify-center cursor-pointer transition-colors disabled:cursor-not-allowed"
                                title="Move Left"
                            >
                                <ArrowLeft size={11} />
                            </button>

                            {/* Move Right Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveSlide(idx, idx + 1);
                                }}
                                disabled={idx === editableSlides.length - 1}
                                className="h-6 w-6 rounded bg-black/50 hover:bg-black/75 disabled:opacity-30 disabled:hover:bg-black/50 text-white flex items-center justify-center cursor-pointer transition-colors disabled:cursor-not-allowed"
                                title="Move Right"
                            >
                                <ArrowRight size={11} />
                            </button>

                            {/* Delete Slide Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSlide(idx);
                                }}
                                disabled={editableSlides.length <= 1}
                                className="h-6 w-6 rounded bg-red-600/80 hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-red-600/80 text-white flex items-center justify-center cursor-pointer transition-colors disabled:cursor-not-allowed"
                                title="Delete Slide"
                            >
                                <Trash2 size={11} />
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* Add Slide Card at the end */}
            {!isBusy && (
                <button
                    onClick={() => handleAddSlide()}
                    className="flex w-[120px] aspect-video rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 bg-secondary/10 hover:bg-secondary/30 text-muted-foreground hover:text-primary flex-col items-center justify-center gap-1 shrink-0 transition-all cursor-pointer group/add select-none"
                    title="Add new slide"
                >
                    <Plus size={16} className="transition-transform group-hover/add:scale-110 duration-200" />
                    <span className="text-[10px] font-semibold tracking-wide">Add Slide</span>
                </button>
            )}
        </div>
    );
}
