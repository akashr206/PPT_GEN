import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const StatsRow = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;

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
    
    const effectiveN = n + textInflation;
    
    // Choose font sizes and gap based on number of columns
    let numSize = "text-[6cqw]";
    let descSize = "text-[1.8cqw]";
    let gapClass = "gap-[3cqw]";

    if (effectiveN >= 6) {
        numSize = "text-[3.2cqw]";
        descSize = "text-[1.1cqw]";
        gapClass = "gap-[1cqw]";
    } else if (effectiveN >= 3) {
        numSize = "text-[4.5cqw]";
        descSize = "text-[1.4cqw]";
        gapClass = "gap-[2cqw]";
    } 

    return (
        <div className={`flex flex-wrap items-stretch justify-center ${gapClass} max-w-[95cqw] mx-auto my-[3cqw] text-center h-full`}>
            {content.map((ele, i) => (
                <div 
                    key={i} 
                    className="flex flex-col items-center relative group/item"
                    style={{ width: `${Math.floor(88 / n)}cqw` }}
                >
                    <EditableElement
                        as="div"
                        className={`font-bold theme-heading ${numSize} leading-none mb-[0.6cqw]`}
                        value={ele.header}
                        onChange={(val) => onUpdateItem?.(i, "header", val)}
                        readOnly={!onUpdateItem}
                        placeholder="Stat"
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

export default StatsRow;
