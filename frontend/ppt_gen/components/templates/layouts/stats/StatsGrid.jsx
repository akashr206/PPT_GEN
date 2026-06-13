import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const StatsGrid = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    const gridCols =
        n === 3 ? "grid-cols-3" : n >= 4 ? "grid-cols-2" : "grid-cols-1";
    const rows = n === 3 ? 1 : n >= 4 ? Math.ceil(n / 2) : n;

    // Adjust layout density based on text length to prevent overflows
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
    
    const effectiveRows = rows + textInflation;

    let gapClass = "gap-[3em]";
    let numSize = "text-[5.5em]";
    let descSize = "text-[1.6em]";

    if (effectiveRows >= 5) {
        gapClass = "gap-y-[0.8em] gap-x-[3em]";
        numSize = "text-[2.6em]";
        descSize = "text-[1.1em]";
    } else if (effectiveRows >= 4) {
        gapClass = "gap-y-[1.2em] gap-x-[3em]";
        numSize = "text-[3.0em]";
        descSize = "text-[1.2em]";
    } else if (effectiveRows >= 3) {
        gapClass = "gap-y-[1.6em] gap-x-[4em]";
        numSize = "text-[3.6em]";
        descSize = "text-[1.3em]";
    } else if (effectiveRows >= 2) {
        gapClass = "gap-y-[2em] gap-x-[4em]";
        numSize = "text-[4.2em]";
        descSize = "text-[1.4em]";
    }

    return (
        <div
            className={`grid ${gridCols} ${gapClass} max-w-[95cqw] h-full justify-center items-center text-center`}
        >
            {content.map((ele, i) => (
                <div key={i} className="flex flex-col items-center relative group/item">
                    {/* Big Hero Number / Stat */}
                    <EditableElement
                        as="div"
                        className={`font-bold theme-heading ${numSize} leading-none mb-[0.5em]`}
                        value={ele.header}
                        onChange={(val) => onUpdateItem?.(i, "header", val)}
                        readOnly={!onUpdateItem}
                        placeholder="Stat"
                    />
                    {/* Stat description */}
                    <EditableElement
                        as="p"
                        className={`${descSize} theme-text-muted max-w-[85%] text-wrap`}
                        value={ele.description}
                        onChange={(val) => onUpdateItem?.(i, "description", val)}
                        readOnly={!onUpdateItem}
                        placeholder="Description..."
                    />
                    {onDeleteItem && (
                        <div className="absolute -top-[1.2em] left-1/2 -translate-x-1/2 cqw opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                            <ItemActionsMenu
                                onAddBefore={() => onAddItem?.(i, "before")}
                                onAddAfter={() => onAddItem?.(i, "after")}
                                onDelete={() => onDeleteItem(i)}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StatsGrid;
