"use client";

import React from "react";
import Slide from "@/components/templates/Slide";

/**
 * Off-screen render frame for PDF and PPTX export.
 * Mounts hidden full-size slides (1280x720) positioned off-screen
 * so html2canvas / extractSlideData can capture them at full resolution.
 *
 * This is conditionally rendered only during export, so it never affects
 * the main slide viewer's render cycle.
 */
const HiddenRenderFrame = React.memo(function HiddenRenderFrame({
    mode, // "pdf" | "pptx"
    editableSlides,
    resolveSlideContent,
    theme,
}) {
    if (!editableSlides || editableSlides.length === 0) return null;

    const idPrefix = mode === "pdf" ? "pdf-slide" : "pptx-slide";

    return (
        <div
            style={{
                position: "absolute",
                left: "-9999px",
                top: "-9999px",
                width: "1280px",
                zIndex: -9999,
                pointerEvents: "none",
            }}
        >
            {editableSlides.map((slide, idx) => (
                <div
                    key={idx}
                    id={`${idPrefix}-${idx}`}
                    style={{ width: "1280px", height: "720px", overflow: "hidden" }}
                >
                    <Slide
                        slide_content={{
                            ...resolveSlideContent(slide, idx),
                            theme,
                        }}
                    />
                </div>
            ))}
        </div>
    );
});

export default HiddenRenderFrame;
