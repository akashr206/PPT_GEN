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
    let gapClass = "gap-[2cqw]";
    let dotSize = "w-[1cqw] h-[1cqw] mt-[0.8cqw]";
    let rightHeaderSize = "text-[2.2cqw]";
    let rightDescSize = "text-[1.5cqw]";
    let heroNumSize = "text-[7cqw]";
    let heroDescSize = "text-[2cqw]";
    let heroPadClass = "p-[3cqw]";
    let cardWidthClass = "w-[42cqw]";
    let containerClass = "flex gap-[4cqw] max-w-[95cqw] mx-auto my-[2cqw] items-stretch justify-between";

    if (m === 0) {
        heroNumSize = maxChars > 220 ? "text-[7.5cqw]" : (maxChars > 120 ? "text-[8.5cqw]" : "text-[10cqw]");
        heroDescSize = maxChars > 220 ? "text-[2.0cqw]" : (maxChars > 120 ? "text-[2.4cqw]" : "text-[2.8cqw]");
        heroPadClass = maxChars > 220 ? "p-[3cqw]" : (maxChars > 120 ? "p-[4cqw]" : "p-[5cqw]");
        cardWidthClass = "w-full max-w-[75cqw] mx-auto";
        containerClass = "flex max-w-[95cqw] mx-auto my-[2cqw] justify-center items-center";
    } else if (effectiveM >= 6) {
        gapClass = "gap-[0.5cqw]";
        dotSize = "w-[0.7cqw] h-[0.7cqw] mt-[0.5cqw]";
        rightHeaderSize = "text-[1.5cqw]";
        rightDescSize = "text-[1.1cqw]";
        heroNumSize = "text-[5.5cqw]";
        heroDescSize = "text-[1.5cqw]";
        heroPadClass = "p-[1.8cqw]";
    } else if (effectiveM >= 4) {
        gapClass = "gap-[1.2cqw]";
        dotSize = "w-[0.9cqw] h-[0.9cqw] mt-[0.6cqw]";
        rightHeaderSize = "text-[1.8cqw]";
        rightDescSize = "text-[1.3cqw]";
        heroNumSize = "text-[6.3cqw]";
        heroDescSize = "text-[1.8cqw]";
        heroPadClass = "p-[2.2cqw]";
    }

    return (
        <div className={containerClass}>
            <div
                className={`rounded-[1.2cqw] flex flex-col justify-center text-center shrink-0 relative group/item ${cardWidthClass} ${heroPadClass}`}
                style={{ backgroundColor: "var(--theme-secondary)" }}
            >
                <EditableElement
                    as="div"
                    className={`${heroNumSize} font-bold theme-heading leading-none mb-[1cqw]`}
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
                    <div className="absolute -top-[1.2cqw] left-1/2 -translate-x-1/2 cqw opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
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
                <div className="flex flex-col justify-center gap-[2cqw] w-full">
                    <div className={`flex flex-col ${gapClass}`}>
                        {secondaryItems.map((ele, i) => (
                            <div key={i} className="flex gap-[1.2cqw] items-start">
                                {/* Dot indicator (maps to standard 'ellipse' in PPT) */}
                                <div
                                    className={`${dotSize} rounded-full shrink-0 theme-bg-primary`}
                                />
                                <div className="relative group/item flex-1 pr-[2cqw]">
                                    <EditableElement
                                        as="h3"
                                        className={`font-bold theme-heading ${rightHeaderSize} mb-[0.2cqw]`}
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
                                        <div className="absolute -top-[1.2cqw] left-1/2 -translate-x-1/2 cqw opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
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
