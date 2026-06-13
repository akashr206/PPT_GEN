import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const BulletsGrid = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    
    const cols = n >= 5 ? 3 : n === 3 ? 3 : n === 1 ? 1 : 2;
    const rows = Math.ceil(n / cols);

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

    let gapVal = 2.5;
    let bulletSize = "w-[1.3em] h-[1.3em] mt-[0.7em]";
    let headerSize = "text-[2.2em]";
    let descSize = "text-[1.6em]";
    let marginClass = "mb-[0.4em]";

    if (effectiveRows >= 5) {
        gapVal = 0.6;
        bulletSize = "w-[0.8em] h-[0.8em] mt-[0.5em]";
        headerSize = "text-[1.5em]";
        descSize = "text-[1.1em]";
        marginClass = "mb-[0.1em]";
    } else if (effectiveRows >= 4) {
        gapVal = 1.0;
        bulletSize = "w-[1.0em] h-[1.0em] mt-[0.6em]";
        headerSize = "text-[1.8em]";
        descSize = "text-[1.3em]";
        marginClass = "mb-[0.2em]";
    } else if (effectiveRows >= 3) {
        gapVal = 1.6;
        bulletSize = "w-[1.2em] h-[1.2em] mt-[0.6em]";
        headerSize = "text-[2.0em]";
        descSize = "text-[1.4em]";
        marginClass = "mb-[0.3em]";
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
            <div className={`flex flex-wrap justify-center ${gapClass} items-start`}>
                {content.map((ele, i) => (
                    <div key={i} className="flex gap-[1.2em]" style={{ flex: `0 1 ${getFlexBasis()}` }}>
                        <div className={`${bulletSize} shrink-0 theme-bg-primary`} />
                        <div className="relative group/item flex-1 pr-[1.5em]">
                            <EditableElement
                                as="h2"
                                className={`font-bold theme-heading ${headerSize} ${marginClass}`}
                                value={ele.header}
                                onChange={(val) => onUpdateItem?.(i, "header", val)}
                                readOnly={!onUpdateItem}
                                placeholder="Header"
                            />
                            <EditableElement
                                as="p"
                                className={`${descSize} theme-text-muted w-full text-wrap`}
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BulletsGrid;
