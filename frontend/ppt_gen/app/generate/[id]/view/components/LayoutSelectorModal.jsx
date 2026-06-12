"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Slide from "@/components/templates/Slide";
import metadata from "@/components/templates/metadata.json";

export default function LayoutSelectorModal({
    isOpen,
    isBusy,
    onClose,
    activeSlide,
    activeSlideIndex,
    theme,
    resolveSlideContent,
    onLayoutChange,
}) {
    const [shouldRenderLayouts, setShouldRenderLayouts] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setShouldRenderLayouts(true);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setShouldRenderLayouts((prev) => (prev ? false : prev));
        }
    }, [isOpen]);

    return (
        <Dialog
            open={isOpen && !isBusy}
            onOpenChange={isBusy ? undefined : onClose}
        >
            <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] flex flex-col bg-popover border-border text-popover-foreground rounded-xl p-6 shadow-2xl z-50">
                <DialogHeader className="shrink-0 mb-4">
                    <DialogTitle className="text-lg font-bold">
                        Select Slide Layout
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Choose a layout type to display your current slide
                        content.
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable grid area */}
                <div className="flex-1 overflow-y-auto pr-1">
                    {shouldRenderLayouts ? (
                        Object.entries(metadata.layoutCategories)
                            .filter(([catKey]) => {
                                const activeCat =
                                    activeSlide?.layout?.category?.toLowerCase() ||
                                    "";
                                const normCat = activeCat.replace(/s$/, "");

                                if (normCat === "title") {
                                    return catKey === "title";
                                }
                                if (normCat === "closing") {
                                    return catKey === "closing";
                                }
                                if (normCat === "agenda") {
                                    return catKey === "agenda";
                                }
                                return (
                                    catKey !== "title" &&
                                    catKey !== "closing" &&
                                    catKey !== "agenda"
                                );
                            })
                            .map(([catKey, category]) => (
                                <div key={catKey} className="mb-6">
                                    <h3 className="text-[11px] font-bold tracking-wider text-primary uppercase mb-3 border-b border-border/40 pb-1.5">
                                        {category.name}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                                        {category.types.map((type) => {
                                            const activeCat =
                                                activeSlide?.layout?.category ||
                                                "";
                                            const normalizeCat = (c) =>
                                                c
                                                    .toLowerCase()
                                                    .replace(/s$/, "");
                                            const isSelected =
                                                normalizeCat(activeCat) ===
                                                    normalizeCat(catKey) &&
                                                activeSlide?.layout?.type ===
                                                    type.id;

                                            // Fallback items in case the active slide has no items (e.g. Title slides)
                                            const previewItems = activeSlide
                                                ?.items?.length
                                                ? activeSlide.items
                                                : [
                                                      {
                                                          header: "Key Highlight 1",
                                                          description:
                                                              "This is a detailed description of the first key highlight item.",
                                                      },
                                                      {
                                                          header: "Key Highlight 2",
                                                          description:
                                                              "This is a detailed description of the second key highlight item.",
                                                      },
                                                      {
                                                          header: "Key Highlight 3",
                                                          description:
                                                              "This is a detailed description of the third key highlight item.",
                                                      },
                                                  ];

                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => {
                                                        onLayoutChange(
                                                            catKey,
                                                            type.id,
                                                        );
                                                        onClose();
                                                    }}
                                                    className={`flex flex-col text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer gap-2 bg-card ${
                                                        isSelected
                                                            ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/20 opacity-100"
                                                            : "border-border hover:border-muted-foreground/20 opacity-75 hover:opacity-100"
                                                    }`}
                                                >
                                                    <div className="w-full aspect-[16/9] rounded-md overflow-hidden border theme-border shadow-xs bg-background/50 relative pointer-events-none">
                                                        <Slide
                                                            slide_content={{
                                                                ...resolveSlideContent(
                                                                    activeSlide,
                                                                    activeSlideIndex,
                                                                ),
                                                                items: previewItems,
                                                                layout: {
                                                                    category:
                                                                        catKey,
                                                                    type: type.id,
                                                                },
                                                                theme: theme,
                                                            }}
                                                        />
                                                        {isSelected && (
                                                            <div className="absolute top-1.5 right-1.5 z-10 bg-blue-500 text-white rounded-full w-4 h-4 shadow-sm flex items-center justify-center animate-in fade-in zoom-in-75 duration-200">
                                                                <Check
                                                                    size={10}
                                                                    strokeWidth={
                                                                        3
                                                                    }
                                                                    className="text-white"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-0.5 px-0.5 mt-0.5">
                                                        <span className="font-semibold text-foreground text-[11px] leading-tight">
                                                            {type.name}
                                                        </span>
                                                        <span className="text-[9px] text-muted-foreground leading-normal line-clamp-2">
                                                            {type.description}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[300px] gap-3 py-12">
                            <Loader2 className="animate-spin text-primary w-6 h-6" />
                            <span className="text-xs text-muted-foreground font-medium">
                                Loading layout options
                            </span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
