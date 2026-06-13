import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const CardsNumbered = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
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
    
    let gapVal = 2.0;
    let padClass = "p-[1.6em]";
    let numSize = "w-[3.0em] h-[3.0em] text-[1.4em]";
    let headerSize = "text-[2.2em]";
    let descSize = "text-[1.6em]";
    let marginClass = "mb-[0.4em]";

    if (effectiveRows >= 5) {
        gapVal = 0.5;
        padClass = "p-[0.8em]";
        numSize = "w-[2.0em] h-[2.0em] text-[0.9em]";
        headerSize = "text-[1.4em]";
        descSize = "text-[1.1em]";
        marginClass = "mb-[0.2em]";
    } else if (effectiveRows >= 4) {
        gapVal = 0.8;
        padClass = "p-[1.2em]";
        numSize = "w-[2.4em] h-[2.4em] text-[1.1em]";
        headerSize = "text-[1.7em]";
        descSize = "text-[1.3em]";
        marginClass = "mb-[0.2em]";
    } else if (effectiveRows >= 3) {
        gapVal = 1.2;
        padClass = "p-[1.4em]";
        numSize = "w-[2.8em] h-[2.8em] text-[1.3em]";
        headerSize = "text-[1.9em]";
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
        <div className="max-w-[95cqw] mx-auto my-[1em] w-full">
            <div className={`flex flex-wrap justify-center ${gapClass} items-stretch`}>
                {content.map((ele, i) => (
                    <div 
                        key={i} 
                        className={`${padClass} border rounded-[1em] theme-border flex flex-col relative group/item`}
                        style={{ backgroundColor: "var(--theme-card-bg)", flex: `0 1 ${getFlexBasis()}` }}
                    >
                        <div className="flex items-center gap-[1.2em] mb-[0.5em] pr-[2em]">
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
        </div>
    );
};

export default CardsNumbered;
