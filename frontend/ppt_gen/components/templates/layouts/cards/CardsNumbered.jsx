import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const CardsNumbered = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    const gridCols = n === 3 ? "grid-cols-3" : (n >= 4 ? "grid-cols-2" : "grid-cols-1");
    const rows = n === 3 ? 1 : (n >= 4 ? Math.ceil(n / 2) : n);
    
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
    
    const effectiveRows = rows + textInflation;
    
    let gapClass = "gap-[2.0cqw] gap-x-[3cqw]";
    let padClass = "p-[1.6cqw]";
    let numSize = "w-[3.0cqw] h-[3.0cqw] text-[1.4cqw]";
    let headerSize = "text-[2.2cqw]";
    let descSize = "text-[1.6cqw]";
    let marginClass = "mb-[0.4cqw]";

    if (effectiveRows >= 5) {
        gapClass = "gap-[0.5cqw] gap-x-[2.5cqw]";
        padClass = "p-[0.8cqw]";
        numSize = "w-[2.0cqw] h-[2.0cqw] text-[0.9cqw]";
        headerSize = "text-[1.4cqw]";
        descSize = "text-[1.1cqw]";
        marginClass = "mb-[0.2cqw]";
    } else if (effectiveRows >= 4) {
        gapClass = "gap-[0.8cqw] gap-x-[2.5cqw]";
        padClass = "p-[1.2cqw]";
        numSize = "w-[2.4cqw] h-[2.4cqw] text-[1.1cqw]";
        headerSize = "text-[1.7cqw]";
        descSize = "text-[1.3cqw]";
        marginClass = "mb-[0.2cqw]";
    } else if (effectiveRows >= 3) {
        gapClass = "gap-[1.2cqw] gap-x-[3cqw]";
        padClass = "p-[1.4cqw]";
        numSize = "w-[2.8cqw] h-[2.8cqw] text-[1.3cqw]";
        headerSize = "text-[1.9cqw]";
        descSize = "text-[1.4cqw]";
        marginClass = "mb-[0.3cqw]";
    }

    return (
        <div className={`grid ${gridCols} ${gapClass} max-w-[95cqw] mx-auto my-[1cqw] items-stretch`}>
            {content.map((ele, i) => (
                <div 
                    key={i} 
                    className={`${padClass} border rounded-[1cqw] theme-border flex flex-col relative group/item`}
                    style={{ backgroundColor: "var(--theme-card-bg)" }}
                >
                    <div className="flex items-center gap-[1.2cqw] mb-[0.5cqw] pr-[2cqw]">
                        <div className={`${numSize} rounded-full theme-bg-primary flex font-bold justify-center items-center shrink-0`}>
                            <span>{i + 1}</span>
                        </div>
                        <EditableElement
                            as="h2"
                            className={`font-bold theme-heading ${headerSize} leading-tight`}
                            value={ele.header}
                            onChange={(val) => onUpdateItem?.(i, "header", val)}
                            readOnly={!onUpdateItem}
                            placeholder="Header"
                        />
                    </div>
                    <EditableElement
                        as="p"
                        className={`${descSize} theme-text-muted w-full text-wrap`}
                        value={ele.description}
                        onChange={(val) => onUpdateItem?.(i, "description", val)}
                        readOnly={!onUpdateItem}
                        placeholder="Description..."
                    />
                    {onDeleteItem && (
                        <div className="absolute -top-[1.2cqw] left-1/2 -translate-x-1/2 cqw opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
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

export default CardsNumbered;
