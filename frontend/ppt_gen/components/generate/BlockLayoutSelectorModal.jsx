"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";

// Compact SVG layout preview icons
const LAYOUT_ICONS = {
    "bullets/simple": (
        <svg viewBox="0 0 32 20" className="w-full h-full">
            {[3, 8, 13].map((y) => (
                <React.Fragment key={y}>
                    <circle cx="4" cy={y + 2} r="1.5" fill="currentColor" opacity="0.7" />
                    <rect x="8" y={y + 0.5} width="20" height="3" rx="1" fill="currentColor" opacity="0.4" />
                </React.Fragment>
            ))}
        </svg>
    ),
    "bullets/grid": (
        <svg viewBox="0 0 32 20" className="w-full h-full">
            {[[2, 2], [17, 2], [2, 11], [17, 11]].map(([x, y], i) => (
                <React.Fragment key={i}>
                    <circle cx={x + 1} cy={y + 2} r="1.2" fill="currentColor" opacity="0.7" />
                    <rect x={x + 4} y={y + 0.5} width="10" height="2.5" rx="1" fill="currentColor" opacity="0.4" />
                    <rect x={x + 4} y={y + 4.5} width="8" height="2" rx="1" fill="currentColor" opacity="0.25" />
                </React.Fragment>
            ))}
        </svg>
    ),
    "cards/basic": (
        <svg viewBox="0 0 32 20" className="w-full h-full">
            {[2, 12, 22].map((x) => (
                <rect key={x} x={x} y="2" width="8" height="16" rx="1.5" fill="currentColor" opacity="0.35" />
            ))}
        </svg>
    ),
    "cards/image": (
        <svg viewBox="0 0 32 20" className="w-full h-full">
            {[2, 12, 22].map((x) => (
                <React.Fragment key={x}>
                    <rect x={x} y="2" width="8" height="16" rx="1.5" fill="currentColor" opacity="0.2" />
                    <rect x={x} y="2" width="8" height="7" rx="1.5" fill="currentColor" opacity="0.5" />
                </React.Fragment>
            ))}
        </svg>
    ),
    "icons/list": (
        <svg viewBox="0 0 32 20" className="w-full h-full">
            {[2, 8, 14].map((y) => (
                <React.Fragment key={y}>
                    <rect x="2" y={y} width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
                    <rect x="8" y={y + 0.5} width="20" height="2.5" rx="1" fill="currentColor" opacity="0.35" />
                </React.Fragment>
            ))}
        </svg>
    ),
    "icons/grid": (
        <svg viewBox="0 0 32 20" className="w-full h-full">
            {[[2, 2], [17, 2], [2, 11], [17, 11]].map(([x, y], i) => (
                <React.Fragment key={i}>
                    <rect x={x} y={y} width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
                    <rect x={x + 5} y={y + 0.5} width="9" height="2.5" rx="1" fill="currentColor" opacity="0.35" />
                </React.Fragment>
            ))}
        </svg>
    ),
    "stats/highlight": (
        <svg viewBox="0 0 32 20" className="w-full h-full">
            {[2, 12, 22].map((x) => (
                <React.Fragment key={x}>
                    <rect x={x} y="4" width="8" height="5" rx="1" fill="currentColor" opacity="0.6" />
                    <rect x={x + 1} y="11" width="6" height="2.5" rx="1" fill="currentColor" opacity="0.3" />
                </React.Fragment>
            ))}
        </svg>
    ),
    "stats/grid": (
        <svg viewBox="0 0 32 20" className="w-full h-full">
            {[[2, 2], [17, 2], [2, 11], [17, 11]].map(([x, y], i) => (
                <React.Fragment key={i}>
                    <rect x={x} y={y} width="11" height="5" rx="1" fill="currentColor" opacity="0.55" />
                    <rect x={x + 1} y={y + 6} width="7" height="2" rx="1" fill="currentColor" opacity="0.3" />
                </React.Fragment>
            ))}
        </svg>
    ),
    "text/plain": (
        <svg viewBox="0 0 32 20" className="w-full h-full">
            {[3, 7, 11, 15].map((y) => (
                <rect key={y} x="2" y={y} width={y === 15 ? "14" : "28"} height="2.5" rx="1" fill="currentColor" opacity="0.4" />
            ))}
        </svg>
    ),
    "text/large": (
        <svg viewBox="0 0 32 20" className="w-full h-full">
            <rect x="2" y="4" width="28" height="5" rx="1" fill="currentColor" opacity="0.65" />
            <rect x="2" y="12" width="20" height="3" rx="1" fill="currentColor" opacity="0.35" />
        </svg>
    ),
};

// All layouts grouped by category — shown flat, no tabs needed
const ALL_SECTIONS = [
    {
        id: "bullets",
        name: "Bullet Points",
        layouts: [
            { id: "simple", name: "Simple List", desc: "Vertical list, auto-splits into 2 columns when >4 items." },
            { id: "grid", name: "Grid", desc: "2-column side-by-side for easy comparison." },
        ],
    },
    {
        id: "cards",
        name: "Card Layouts",
        layouts: [
            { id: "basic", name: "Basic Cards", desc: "Bordered cards to highlight each item." },
            { id: "image", name: "Image Cards", desc: "Cards with a header image slot." },
        ],
    },
    {
        id: "icons",
        name: "Icon Layouts",
        layouts: [
            { id: "list", name: "Icons List", desc: "Vertical list with icon symbols." },
            { id: "grid", name: "Icons Grid", desc: "Grid layout with prominent icons." },
        ],
    },
    {
        id: "stats",
        name: "Metrics & Stats",
        layouts: [
            { id: "highlight", name: "Stats Highlight", desc: "Large numbers with minimal labels." },
            { id: "grid", name: "Stats Grid", desc: "Dashboard-style metric boxes." },
        ],
    },
    {
        id: "text",
        name: "Text",
        layouts: [
            { id: "plain", name: "Paragraph", desc: "Standard body text block." },
            { id: "large", name: "Callout", desc: "Large, high-impact text." },
        ],
    },
];

export default function BlockLayoutSelectorModal({
    isOpen,
    onClose,
    currentCategory,
    currentType,
    onSelect,
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="bg-popover border-border text-popover-foreground rounded-lg p-6 shadow-2xl z-50 flex flex-col"
                style={{ maxWidth: "780px", width: "calc(100% - 2rem)", maxHeight: "90vh" }}
            >
                <DialogHeader className="shrink-0 mb-3">
                    <DialogTitle className="text-base font-bold">Change Block Layout</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Pick how your content items are displayed inside this block.
                    </DialogDescription>
                </DialogHeader>

                {/* All categories + layouts in a single scrollable view */}
                <div className="flex-1 overflow-y-auto -mx-1 px-1">
                    {ALL_SECTIONS.map((section) => (
                        <div key={section.id} className="mb-5 last:mb-0">
                            {/* Category label */}
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5 pl-0.5">
                                {section.name}
                            </h4>

                            {/* Layouts row — always horizontal */}
                            <div className="flex flex-row gap-3">
                                {section.layouts.map((layout) => {
                                    const key = `${section.id}/${layout.id}`;
                                    const isSelected =
                                        currentCategory === section.id && currentType === layout.id;

                                    return (
                                        <button
                                            key={layout.id}
                                            onClick={() => {
                                                onSelect(section.id, layout.id);
                                                onClose();
                                            }}
                                            className={`flex-1 flex flex-row items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group
                                                ${isSelected
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                                                }`}
                                        >
                                            {/* SVG Preview */}
                                            <div className="w-16 h-10 rounded border border-border/30 bg-muted/30 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <div className="w-full h-full text-muted-foreground">
                                                    {LAYOUT_ICONS[key] || <div className="w-full h-full bg-muted rounded" />}
                                                </div>
                                            </div>

                                            {/* Text */}
                                            <div className="flex flex-col gap-0.5 flex-1 min-w-0 text-left">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-semibold text-foreground truncate">
                                                        {layout.name}
                                                    </span>
                                                    {isSelected && (
                                                        <Check className="w-3 h-3 text-primary shrink-0" strokeWidth={3} />
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground leading-snug line-clamp-2">
                                                    {layout.desc}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
