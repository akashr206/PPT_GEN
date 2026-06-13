import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const StatsCallout = ({ content, hero, onUpdateItem, onDeleteItem, onAddItem }) => {
    // Determine the hero item and secondary items based on whether hero is provided as a separate field
    const heroItem = hero || (content && content[0]);
    const secondaryItems = hero ? content : (content && content.slice(1)) || [];
    const m = secondaryItems.length;

    if (!heroItem) return null;

    // Adjust layout density based on text length to prevent vertical overflows
    const maxChars = content.reduce((max, ele) => {
        const len = (ele.header?.length || 0) + (ele.description?.length || 0);
        return len > max ? len : max;
    }, 0);
    
    let textInflation = 0;
    if (maxChars > 220) {
        textInflation = 2;
    } else if (maxChars > 120) {
        textInflation = 1;
    }
    
    const effectiveM = m === 0 ? 0 : m + textInflation;

    // Dynamic sizing based on secondary items count
    let gapClass = "gap-[2em]";
    let dotSize = "w-[1em] h-[1em] mt-[0.8em]";
    let rightHeaderSize = "text-[2.2em]";
    let rightDescSize = "text-[1.5em]";
    let heroNumSize = "text-[7em]";
    let heroDescSize = "text-[2em]";
    let heroPadClass = "p-[3em]";
    let cardWidthClass = "w-[42cqw]";
    let containerClass = "flex gap-[4em] h-full max-w-[95cqw] mx-auto my-[2em] items-stretch justify-between";

    if (m === 0) {
        heroNumSize = maxChars > 220 ? "text-[7.5em]" : (maxChars > 120 ? "text-[8.5em]" : "text-[10em]");
        heroDescSize = maxChars > 220 ? "text-[2.0em]" : (maxChars > 120 ? "text-[2.4em]" : "text-[2.8em]");
        heroPadClass = maxChars > 220 ? "p-[3em]" : (maxChars > 120 ? "p-[4em]" : "p-[5em]");
        cardWidthClass = "w-full max-w-[75cqw] mx-auto";
        containerClass = "flex max-w-[95cqw] mx-auto my-[2em] justify-center items-center";
    } else if (effectiveM >= 6) {
        gapClass = "gap-[0.5em]";
        dotSize = "w-[0.7em] h-[0.7em] mt-[0.5em]";
        rightHeaderSize = "text-[1.5em]";
        rightDescSize = "text-[1.1em]";
        heroNumSize = "text-[5.5em]";
        heroDescSize = "text-[1.5em]";
        heroPadClass = "p-[1.8em]";
    } else if (effectiveM >= 4) {
        gapClass = "gap-[1.2em]";
        dotSize = "w-[0.9em] h-[0.9em] mt-[0.6em]";
        rightHeaderSize = "text-[1.8em]";
        rightDescSize = "text-[1.3em]";
        heroNumSize = "text-[6.3em]";
        heroDescSize = "text-[1.8em]";
        heroPadClass = "p-[2.2em]";
    }

    return (
        <div className={containerClass}>
            <div
                className={`rounded-[1.2em] flex flex-col justify-center text-center shrink-0 relative group/item ${cardWidthClass} ${heroPadClass}`}
                style={{ backgroundColor: "var(--theme-secondary)" }}
            >
                <EditableElement
                    as="div"
                    className={`${heroNumSize} font-bold theme-heading leading-none mb-[1em]`}
                    style={{ color: "var(--theme-primary)" }}
                    value={heroItem.header}
                    onChange={(val) => onUpdateItem?.(0, "header", val)}
                    readOnly={!onUpdateItem}
                    placeholder="Hero Stat"
                />
                <EditableElement
                    as="p"
                    className={`${heroDescSize} font-medium leading-snug w-full text-wrap`}
                    style={{ color: "var(--theme-fg)" }}
                    value={heroItem.description}
                    onChange={(val) => onUpdateItem?.(0, "description", val)}
                    readOnly={!onUpdateItem}
                    placeholder="Description..."
                />
                {onDeleteItem && (
                    <div className="absolute -top-[1.2em] left-1/2 -translate-x-1/2 cqw opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                        <ItemActionsMenu
                            onAddBefore={() => onAddItem?.(0, "before")}
                            onAddAfter={() => onAddItem?.(0, "after")}
                            onDelete={() => onDeleteItem(0)}
                        />
                    </div>
                )}
            </div>

            {/* Right Hand side: Detailed bullet items list */}
            {m > 0 && (
                <div className="flex flex-col justify-center gap-[2em] w-full">
                    <div className={`flex flex-col ${gapClass}`}>
                        {secondaryItems.map((ele, i) => (
                            <div key={i} className="flex gap-[1.2em] items-start">
                                {/* Dot indicator (maps to standard 'ellipse' in PPT) */}
                                <div
                                    className={`${dotSize} rounded-full shrink-0 theme-bg-primary`}
                                />
                                <div className="relative group/item flex-1 pr-[2em]">
                                    <EditableElement
                                        as="h3"
                                        className={`font-bold theme-heading ${rightHeaderSize} mb-[0.2em]`}
                                        value={ele.header}
                                        onChange={(val) =>
                                            onUpdateItem?.(i + 1, "header", val)
                                        }
                                        readOnly={!onUpdateItem}
                                        placeholder="Header"
                                    />
                                    <EditableElement
                                        as="p"
                                        className={`${rightDescSize} theme-text-muted w-full text-wrap`}
                                        value={ele.description}
                                        onChange={(val) =>
                                            onUpdateItem?.(
                                                i + 1,
                                                "description",
                                                val,
                                            )
                                        }
                                        readOnly={!onUpdateItem}
                                        placeholder="Description..."
                                    />
                                    {onDeleteItem && (
                                        <div className="absolute -top-[1.2em] left-1/2 -translate-x-1/2 cqw opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                                            <ItemActionsMenu
                                                onAddBefore={() =>
                                                    onAddItem?.(i + 1, "before")
                                                }
                                                onAddAfter={() =>
                                                    onAddItem?.(i + 1, "after")
                                                }
                                                onDelete={() => onDeleteItem(i + 1)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatsCallout;
