"use client";

import React, { useEffect, useRef } from "react";
import Slide from "@/components/templates/Slide";

export default function SlideThumbnails({
    editableSlides,
    activeSlideIndex,
    setActiveSlideIndex,
    isBusy,
    theme,
    resolveSlideContent,
}) {
    const previewScrollRef = useRef(null);

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

    return (
        <div
            ref={previewScrollRef}
            className="mt-3 w-full max-w-[1000px] shrink-0 overflow-x-auto flex gap-4 py-2 px-1 scrollbar-thin scrollbar-thumb-muted justify-start"
        >
            {editableSlides.map((slide, idx) => (
                <button
                    key={idx}
                    onClick={() => !isBusy && setActiveSlideIndex(idx)}
                    disabled={isBusy}
                    className={`relative flex w-[120px] aspect-video rounded-md overflow-hidden border-2 text-left shrink-0 transition-all ${
                        activeSlideIndex === idx
                            ? "border-primary ring-2 ring-primary/20 shadow-md"
                            : "border-border hover:border-muted-foreground/30 opacity-70 hover:opacity-100"
                    } ${isBusy ? "cursor-not-allowed opacity-50" : ""}`}
                >
                    <div className="w-full h-full pointer-events-none select-none">
                        <Slide
                            slide_content={{
                                ...resolveSlideContent(slide, idx),
                                theme: theme,
                            }}
                        />
                    </div>
                    <div className="absolute bottom-1 right-1.5 bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md">
                        {idx + 1}
                    </div>
                </button>
            ))}
        </div>
    );
}
