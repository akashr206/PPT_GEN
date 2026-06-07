import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const BulletsBig = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;

    const isTwoCol = n >= 4;
    const itemWidth = isTwoCol ? "w-[42cqw]" : (n === 3 ? "w-[28cqw]" : "w-[80cqw]");
    
    const rows = isTwoCol ? Math.ceil(n / 2) : (n === 3 ? 1 : n);

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

    let gapClass = "gap-[2cqw]";
    let numSize = "w-[3.5cqw] h-[3.5cqw] text-[1.5cqw]";
    let headerSize = "text-[2.5cqw]";
    let descSize = "text-[1.75cqw]";
    
    if (effectiveRows >= 5) {
        gapClass = "gap-[0.6cqw]";
        numSize = "w-[2.2cqw] h-[2.2cqw] text-[1.0cqw]";
        headerSize = "text-[1.5cqw]";
        descSize = "text-[1.1cqw]";
    } else if (effectiveRows >= 4) {
        gapClass = "gap-[1.0cqw]";
        numSize = "w-[2.6cqw] h-[2.6cqw] text-[1.2cqw]";
        headerSize = "text-[1.8cqw]";
        descSize = "text-[1.3cqw]";
    } else if (effectiveRows >= 3) {
        gapClass = "gap-[1.4cqw]";
        numSize = "w-[3.0cqw] h-[3.0cqw] text-[1.4cqw]";
        headerSize = "text-[2.1cqw]";
        descSize = "text-[1.5cqw]";
    }

    return (
        <div className={`flex flex-wrap justify-center ${gapClass} max-w-[95cqw] mx-auto my-[1.5cqw] h-full`}>
            {content.map((ele, i) => (
                <div
                    className={`flex items-start ${itemWidth} gap-[1cqw]`}
                    key={i}
                >
                    <div className={`${numSize} mt-[0.2cqw] rounded-full flex font-bold theme-bg-primary justify-center items-center shrink-0`}>
                        <span>{i + 1}</span>
                    </div>

                    <div className="relative group/item flex-1">
                        <EditableElement
                            as="h2"
                            className={`font-bold theme-heading ${headerSize}`}
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
                        <div className="absolute -top-[1.2cqw] left-1/2 -translate-x-1/2 cqw opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
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
    );
};

export default BulletsBig;
