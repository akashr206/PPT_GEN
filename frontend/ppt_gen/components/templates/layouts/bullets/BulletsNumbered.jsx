import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const BulletsNumbered = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    
    const cols = n >= 5 ? 3 : n === 3 ? 3 : n === 1 ? 1 : 2;
    const itemsPerCol = Math.ceil(n / cols);

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
    
    const effectiveItemsPerCol = itemsPerCol + textInflation;
    
    let gapVal = 2.5;
    let numSize = "text-[4.5em]";
    let barWidth = "w-[0.6em]";
    let headerSize = "text-[2.2em]";
    let descSize = "text-[1.6em]";
    let marginClass = "mb-[0.3em]";

    if (effectiveItemsPerCol >= 6) {
        gapVal = 0.5;
        numSize = "text-[2.8em]";
        barWidth = "w-[0.3em]";
        headerSize = "text-[1.5em]";
        descSize = "text-[1.1em]";
        marginClass = "mb-[0.1em]";
    } else if (effectiveItemsPerCol >= 5) {
        gapVal = 0.8;
        numSize = "text-[3.2em]";
        barWidth = "w-[0.4em]";
        headerSize = "text-[1.7em]";
        descSize = "text-[1.3em]";
        marginClass = "mb-[0.2em]";
    } else if (effectiveItemsPerCol >= 4) {
        gapVal = 1.2;
        numSize = "text-[3.8em]";
        barWidth = "w-[0.5em]";
        headerSize = "text-[2.0em]";
        descSize = "text-[1.4em]";
        marginClass = "mb-[0.25em]";
    }

    const gapClass = `gap-[${gapVal}em]`;

    const getFlexBasis = () => {
        if (n === 1) return "100%";
        if (cols === 2) {
            return `calc(50% - ${gapVal / 2}em)`;
        }
        return `calc(33.333% - ${(gapVal * 2) / 3}em)`;
    };

    return (
        <div className="max-w-[95cqw] mx-auto my-[1.5em] w-full">
            <div className={`flex flex-wrap justify-center ${gapClass} items-stretch`}>
                {content.map((ele, idx) => {
                    const displayNum = String(idx + 1).padStart(2, '0');
                    return (
                        <div key={idx} className="flex items-stretch gap-[1em]" style={{ flex: `0 1 ${getFlexBasis()}` }}>
                            {/* Giant Index Number */}
                            <div className={`${numSize} font-bold theme-text-accent tracking-tighter shrink-0 flex items-center justify-center min-w-[3em]`}>
                                {displayNum}
                            </div>
                            
                            {/* Thick Accent Line (maps to 'rect') */}
                            <div 
                                className={`${barWidth} rounded-full shrink-0`}
                                style={{ backgroundColor: "var(--theme-primary)" }}
                            />
                            
                            {/* Content */}
                            <div className="flex flex-col justify-center grow relative group/item pr-[2.5em]">
                                <EditableElement
                                    as="h2"
                                    className={`font-bold theme-heading ${headerSize} ${marginClass} leading-tight`}
                                    value={ele.header}
                                    onChange={(val) => onUpdateItem?.(idx, "header", val)}
                                    readOnly={!onUpdateItem}
                                    placeholder="Header"
                                />
                                <EditableElement
                                    as="p"
                                    className={`${descSize} theme-text-muted w-full text-wrap`}
                                    value={ele.description}
                                    onChange={(val) => onUpdateItem?.(idx, "description", val)}
                                    readOnly={!onUpdateItem}
                                    placeholder="Description..."
                                />
                                {onDeleteItem && (
                                    <div className="absolute -top-[1.2em] left-1/2 -translate-x-1/2 cqw opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                                        <ItemActionsMenu
                                            onAddBefore={() => onAddItem?.(idx, "before")}
                                            onAddAfter={() => onAddItem?.(idx, "after")}
                                            onDelete={() => onDeleteItem(idx)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BulletsNumbered;
