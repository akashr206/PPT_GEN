"use client";

import React, { useRef, useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SlideLayout from "../templates/layouts/SlideLayout";
import metadata from "../templates/metadata.json";

// Helper for fallback preview items when block has no items
const getMockItems = (category) => {
    switch (category) {
        case "bullets":
            return [
                { header: "Primary Milestone", description: "This is the primary objective details." },
                { header: "Secondary Step", description: "This describes the secondary milestone step." },
            ];
        case "cards":
            return [
                { header: "Basic Feature", description: "Details about this feature capability." },
                { header: "Premium Highlight", description: "More information about this premium highlight." },
            ];
        case "icons":
            return [
                { header: "Feature 1", description: "Description for feature 1.", icon: "Settings" },
                { header: "Feature 2", description: "Description for feature 2.", icon: "Lightbulb" },
            ];
        case "stats":
            return [
                { header: "99%", description: "Success Rate" },
                { header: "150ms", description: "Latency Speed" },
            ];
        case "timelines":
            return [
                { header: "Phase 1: Design", description: "Initial draft mockup." },
                { header: "Phase 2: Alpha Release", description: "Core feature completion." },
                { header: "Phase 3: Launch", description: "Deployment and public release." },
            ];
        case "text":
        default:
            return [
                { header: "Text Header", description: "Long paragraph description goes here." }
            ];
    }
};

const SlideMiniPreview = ({ category, type, content, theme }) => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(0.2);

    useEffect(() => {
        if (!containerRef.current) return;
        const updateScale = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.getBoundingClientRect().width;
            setScale(width / 960);
        };
        updateScale();
        
        // Setup resize observer
        const observer = new ResizeObserver(updateScale);
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={containerRef}
            className="w-full aspect-video rounded border border-border/20 overflow-hidden relative bg-card shrink-0 select-none"
        >
            <div 
                style={{
                    width: "960px",
                    height: "540px",
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    pointerEvents: "none",
                    containerType: "inline-size"
                }}
                data-theme={theme}
                className="theme-container p-[3cqw] absolute inset-0 flex flex-col justify-center"
            >
                <SlideLayout
                    layoutCategory={category}
                    layoutType={type}
                    content={content}
                    readOnly={true}
                    theme={theme}
                />
            </div>
        </div>
    );
};

// All layouts grouped by category extracted from metadata
const ALL_SECTIONS = Object.entries(metadata.layoutCategories).map(([key, value]) => ({
    id: key,
    name: value.name,
    layouts: value.types.map((type) => ({
        id: type.id,
        name: type.name,
        desc: type.description,
    })),
}));

export default function BlockLayoutSelectorModal({
    isOpen,
    onClose,
    currentCategory,
    currentType,
    blockData,
    onSelect,
    theme = "default",
}) {
    const [isSidebar, setIsSidebar] = useState(false);
    const [localCategory, setLocalCategory] = useState(currentCategory);
    const [localType, setLocalType] = useState(currentType);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSections = React.useMemo(() => {
        if (!searchQuery.trim()) return ALL_SECTIONS;
        const lowerQuery = searchQuery.toLowerCase();

        return ALL_SECTIONS.map((section) => {
            const isSectionMatch = section.name.toLowerCase().includes(lowerQuery);
            const matchingLayouts = section.layouts.filter((layout) =>
                layout.name.toLowerCase().includes(lowerQuery) ||
                layout.desc.toLowerCase().includes(lowerQuery)
            );

            if (isSectionMatch) return section;
            if (matchingLayouts.length > 0) return { ...section, layouts: matchingLayouts };
            return null;
        }).filter(Boolean);
    }, [searchQuery]);

    useEffect(() => {
        if (isOpen) {
            setLocalCategory(currentCategory);
            setLocalType(currentType);
        }
    }, [isOpen, currentCategory, currentType]);

    useEffect(() => {
        const checkScreen = () => {
            setIsSidebar(window.innerWidth >= 1024); // lg breakpoint is 1024px
        };
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    if (!isOpen) return null;

    // RENDER AS SIDEBAR (Large Screens >= lg) - Docked layout next to slides
    if (isSidebar) {
        return (
            <div className="relative inset-auto w-[500px] border-l border-border bg-card flex flex-col shrink-0 animate-in slide-in-from-right duration-200 h-full z-40">
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-secondary/10">
                    <div className="flex flex-col gap-0.5">
                        <h3 className="font-bold text-sm text-foreground">Change Block Layout</h3>
                        <span className="text-[10px] text-muted-foreground leading-normal">
                            Click a layout to instantly preview it on the slide.
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-2.5 py-1 text-xs font-medium rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors border border-border/40"
                        title="Close layout selector"
                    >
                        Close
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-4 py-3 border-b border-border shrink-0 bg-background/50">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search layouts"
                            className="pl-8 h-8 text-xs bg-secondary/30"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Sidebar Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
                    {filteredSections.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <span className="text-xs">No layouts found.</span>
                        </div>
                    ) : (
                        filteredSections.map((section) => (
                        <div key={section.id} className="flex flex-col">
                            {/* Category Label */}
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 pl-0.5">
                                {section.name}
                            </h4>

                            {/* Layouts stack */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {section.layouts.map((layout) => {
                                    const isSelected =
                                        localCategory === section.id && localType === layout.id;

                                    const previewItems = (blockData?.items && blockData.items.length > 0)
                                        ? blockData.items
                                        : getMockItems(section.id);

                                    return (
                                        <div
                                            key={layout.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => {
                                                setLocalCategory(section.id);
                                                setLocalType(layout.id);
                                                onSelect(section.id, layout.id);
                                                // Do NOT call onClose() here in sidebar mode to enable live preview!
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    setLocalCategory(section.id);
                                                    setLocalType(layout.id);
                                                    onSelect(section.id, layout.id);
                                                }
                                            }}
                                            className={`w-full flex flex-col gap-2 p-2.5 rounded-lg border transition-all cursor-pointer group text-left
                                                ${isSelected
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                                                }`}
                                        >
                                            {/* Exact Live Slide Layout Preview */}
                                            <div className="w-full aspect-video rounded-md overflow-hidden relative border border-border/20 group-hover:scale-[1.01] transition-transform">
                                                <SlideMiniPreview
                                                    category={section.id}
                                                    type={layout.id}
                                                    content={previewItems}
                                                    theme={theme}
                                                />
                                            </div>

                                            {/* Text Description */}
                                            <div className="flex flex-col gap-0.5 px-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-semibold text-foreground">
                                                        {layout.name}
                                                    </span>
                                                    {isSelected && (
                                                        <Check className="w-3 h-3 text-primary shrink-0" strokeWidth={3} />
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground leading-normal">
                                                    {layout.desc}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )))}
                </div>
            </div>
        );
    }

    // RENDER AS DIALOG MODAL (Small Screens < lg)
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="bg-popover border-border text-popover-foreground rounded-lg p-6 shadow-2xl z-50 flex flex-col"
                style={{ maxWidth: "540px", width: "calc(100% - 2rem)", maxHeight: "90vh" }}
            >
                <DialogHeader className="shrink-0 mb-3">
                    <DialogTitle className="text-base font-bold">Change Block Layout</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Pick how your content items are displayed inside this block.
                    </DialogDescription>
                </DialogHeader>

                {/* Search Bar */}
                <div className="mb-4 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search layouts"
                            className="pl-9 h-9 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* All categories + layouts in a single scrollable view */}
                <div className="flex-1 overflow-y-auto -mx-1 px-1">
                    {filteredSections.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <span className="text-sm">No layouts found.</span>
                        </div>
                    ) : (
                        filteredSections.map((section) => (
                        <div key={section.id} className="mb-5 last:mb-0">
                            {/* Category label */}
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5 pl-0.5">
                                {section.name}
                            </h4>

                            {/* Layouts grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {section.layouts.map((layout) => {
                                    const isSelected =
                                        localCategory === section.id && localType === layout.id;

                                    const previewItems = (blockData?.items && blockData.items.length > 0)
                                        ? blockData.items
                                        : getMockItems(section.id);

                                    return (
                                        <div
                                            key={layout.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => {
                                                setLocalCategory(section.id);
                                                setLocalType(layout.id);
                                                onSelect(section.id, layout.id);
                                                onClose(); // Close on click for modal view
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    setLocalCategory(section.id);
                                                    setLocalType(layout.id);
                                                    onSelect(section.id, layout.id);
                                                    onClose();
                                                }
                                            }}
                                            className={`w-full flex flex-col items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer group text-left
                                                ${isSelected
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                                                }`}
                                        >
                                            {/* Exact Live Slide Layout Preview */}
                                            <div className="w-52 aspect-video shrink-0 group-hover:scale-[1.02] transition-transform">
                                                <SlideMiniPreview
                                                    category={section.id}
                                                    type={layout.id}
                                                    content={previewItems}
                                                    theme={theme}
                                                />
                                            </div>

                                            {/* Text */}
                                            <div className="flex flex-col gap-0.5 flex-1 min-w-0 px-1">
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
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
