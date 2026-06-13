import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const CardsFilled = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
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
    let padClass = "p-[2.0em]";
    let headerSize = "text-[2.2em]";
    let descSize = "text-[1.6em]";
    let marginClass = "mb-[0.4em]";

    if (effectiveRows >= 5) {
        gapVal = 0.6;
        padClass = "p-[1.0em]";
        headerSize = "text-[1.5em]";
        descSize = "text-[1.1em]";
        marginClass = "mb-[0.1em]";
    } else if (effectiveRows >= 4) {
        gapVal = 1.0;
        padClass = "p-[1.4em]";
        headerSize = "text-[1.8em]";
        descSize = "text-[1.3em]";
        marginClass = "mb-[0.2em]";
    } else if (effectiveRows >= 3) {
        gapVal = 1.6;
        padClass = "p-[1.8em]";
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
            <div className={`flex flex-wrap justify-center ${gapClass} items-stretch`}>
                {content.map((ele, i) => (
                    <div 
                        key={i} 
                        className={`${padClass} rounded-[1em] flex flex-col relative group/item`}
                        style={{ backgroundColor: "var(--theme-secondary)", flex: `0 1 ${getFlexBasis()}` }}
                    >
                        <EditableElement
                            as="h2"
                            className={`font-bold theme-heading ${headerSize} ${marginClass} pr-[2em]`}
                            style={{ color: "var(--theme-primary)" }}
                            value={ele.header}
                            onChange={(val) => onUpdateItem?.(i, "header", val)}
                            readOnly={!onUpdateItem}
                            placeholder="Header"
                        />
                        <EditableElement
                            as="p"
                            className={`${descSize} w-full text-wrap`}
                            style={{ color: "var(--theme-fg)" }}
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

export default CardsFilled;
