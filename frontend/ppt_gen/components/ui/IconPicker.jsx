import React, { useState, useMemo } from "react";
import * as icons from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "./button";

const WEIGHTS = [
    { value: "thin", label: "Thin" },
    { value: "light", label: "Light" },
    { value: "regular", label: "Regular" },
    { value: "bold", label: "Bold" },
    { value: "fill", label: "Fill" },
    { value: "duotone", label: "Duotone" },
];

const getRecommendedIcons = (text) => {
    const fallbacks = [
        "Star",
        "CheckCircle",
        "Lightning",
        "TrendingUp",
        "Target",
        "Users",
    ];
    if (!text) return fallbacks;

    const keywords = text.toLowerCase().match(/\b\w{3,}\b/g) || [];

    if (keywords.length === 0) return fallbacks;

    const scored = Object.keys(icons)
        .map((name) => {
            let score = 0;
            const lowerName = name.toLowerCase();
            keywords.forEach((kw) => {
                if (lowerName === kw) score += 5;
                else if (lowerName.includes(kw)) score += 2;
            });
            return { name, score };
        })
        .filter((i) => i.score > 0)
        .sort((a, b) => b.score - a.score);

    const recs = scored.slice(0, 6).map((i) => i.name);

    fallbacks.forEach((fb) => {
        if (!recs.includes(fb) && recs.length < 6) {
            recs.push(fb);
        }
    });

    return recs.slice(0, 6);
};

export function IconPicker({
    open,
    onOpenChange,
    onSelectIcon,
    defaultWeight = "regular",
    contextText,
    recommendedIcons,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedWeight, setSelectedWeight] = useState(defaultWeight);

    // Sync weight when modal opens
    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedWeight(defaultWeight);
        }
    }, [open, defaultWeight]);

    const allIconNames = useMemo(() => {
        return Object.keys(icons).filter((name) => {
            if (
                name === "default" ||
                name === "IconContext" ||
                name === "IconBase" ||
                !/^[A-Z]/.test(name) ||
                name.startsWith("Lucide") ||
                name.endsWith("Icon") ||
                name.endsWith("Props")
            ) {
                return false;
            }

            const item = icons[name];
            if (!item) return false;

            // Strictly ensure the item is a valid React component (function or forwardRef object)
            if (typeof item === "function") return true;
            if (typeof item === "object" && item.$$typeof) return true;

            return false;
        });
    }, []);

    const recommendedIconNames = useMemo(() => {
        if (
            recommendedIcons &&
            Array.isArray(recommendedIcons) &&
            recommendedIcons.length > 0
        ) {
            return recommendedIcons;
        }
        return getRecommendedIcons(contextText);
    }, [recommendedIcons, contextText]);

    const [currentPage, setCurrentPage] = useState(1);
    const iconsPerPage = 42;

    const filteredIcons = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query) return allIconNames;
        return allIconNames.filter((name) =>
            name.toLowerCase().includes(query),
        );
    }, [searchQuery, allIconNames]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredIcons.length / iconsPerPage);
    const paginatedIcons = useMemo(() => {
        const startIndex = (currentPage - 1) * iconsPerPage;
        return filteredIcons.slice(startIndex, startIndex + iconsPerPage);
    }, [filteredIcons, currentPage, iconsPerPage]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-full max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0">
                <DialogHeader className="p-4 pb-2">
                    <DialogTitle>Choose an Icon</DialogTitle>
                </DialogHeader>

                <div className="px-4 pb-2 flex gap-2">
                    <input
                        type="text"
                        placeholder="Search icons"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 p-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            onOpenChange(false);
                            const event = new CustomEvent(
                                "trigger-open-library",
                                {
                                    detail: {
                                        tab: "icons",
                                        onSelectIcon: onSelectIcon,
                                    },
                                },
                            );
                            window.dispatchEvent(event);
                        }}
                        className="text-xs shrink-0 cursor-pointer font-semibold"
                    >
                        Custom Icon...
                    </Button>
                </div>

                <div className="px-4 pb-2 flex items-center justify-between border-b border-border/50">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Style
                    </span>
                    <div className="flex bg-muted/40 p-0.5 rounded-md border border-border/40 gap-px">
                        {WEIGHTS.map((w) => (
                            <button
                                key={w.value}
                                type="button"
                                onClick={() => setSelectedWeight(w.value)}
                                className={`px-2 py-0.5 text-[10px] font-semibold rounded-md cursor-pointer transition-all ${
                                    selectedWeight === w.value
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                }`}
                            >
                                {w.label}
                            </button>
                        ))}
                    </div>
                </div>

                {!searchQuery && (
                    <div className="px-4 py-2 border-b border-border/50 bg-muted/20">
                        <h4 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                            Recommended
                        </h4>
                        <div className="grid grid-cols-6 gap-3">
                            {recommendedIconNames.map((iconName) => {
                                const IconComponent = icons[iconName];
                                if (
                                    !IconComponent ||
                                    (typeof IconComponent !== "function" &&
                                        !(
                                            typeof IconComponent === "object" &&
                                            IconComponent.$$typeof
                                        ))
                                )
                                    return null;
                                return (
                                    <button
                                        key={`rec-${iconName}`}
                                        type="button"
                                        onClick={() => {
                                            onSelectIcon(
                                                `${iconName}:${selectedWeight}`,
                                            );
                                            onOpenChange(false);
                                        }}
                                        className="aspect-square flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground border border-border/50 transition-colors group bg-background shadow-sm"
                                        title={iconName}
                                    >
                                        <IconComponent
                                            weight={selectedWeight}
                                            className="w-5 h-5 text-primary"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex-1 min-h-[350px] w-full p-2 flex flex-col">
                    {filteredIcons.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            No icons found for &quot;{searchQuery}&quot;
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-6 gap-2 w-full content-start flex-1">
                                {paginatedIcons.map((iconName) => {
                                    const IconComponent = icons[iconName];
                                    if (
                                        !IconComponent ||
                                        (typeof IconComponent !== "function" &&
                                            !(
                                                typeof IconComponent ===
                                                    "object" &&
                                                IconComponent.$$typeof
                                            ))
                                    )
                                        return null;

                                    return (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => {
                                                onSelectIcon(
                                                    `${iconName}:${selectedWeight}`,
                                                );
                                                onOpenChange(false);
                                            }}
                                            className="aspect-square flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border transition-colors group"
                                            title={iconName}
                                        >
                                            <IconComponent
                                                weight={selectedWeight}
                                                className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                            {totalPages > 1 && (
                                <div className="flex items-center pt-2 justify-center border-t border-border/50 mt-2">
                                    <div className="border flex items-center p-px gap-[2px] rounded-full">
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(prev - 1, 1),
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            variant="ghost"
                                            className="rounded-full"
                                        >
                                            <CaretLeft />
                                        </Button>
                                        <span className="text-xs text-muted-foreground">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        prev + 1,
                                                        totalPages,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            variant="ghost"
                                            className="rounded-full"
                                        >
                                            <CaretRight />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
