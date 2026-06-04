import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const TimelineVertical = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    const isTwoCol = n > 4;
    const itemsPerCol = isTwoCol ? Math.ceil(n / 2) : n;
    
    let gapClass = "gap-[2.5cqw]";
    let numSize = "text-[4.5cqw]";
    let barWidth = "w-[0.6cqw]";
    let headerSize = "text-[2.2cqw]";
    let descSize = "text-[1.6cqw]";
    let marginClass = "mb-[0.3cqw]";

    if (itemsPerCol >= 6) {
        gapClass = "gap-[0.5cqw]";
        numSize = "text-[2.8cqw]";
        barWidth = "w-[0.3cqw]";
        headerSize = "text-[1.5cqw]";
        descSize = "text-[1.1cqw]";
        marginClass = "mb-[0.1cqw]";
    } else if (itemsPerCol >= 5) {
        gapClass = "gap-[0.8cqw]";
        numSize = "text-[3.2cqw]";
        barWidth = "w-[0.4cqw]";
        headerSize = "text-[1.7cqw]";
        descSize = "text-[1.3cqw]";
        marginClass = "mb-[0.2cqw]";
    } else if (itemsPerCol >= 4) {
        gapClass = "gap-[1.2cqw]";
        numSize = "text-[3.8cqw]";
        barWidth = "w-[0.5cqw]";
        headerSize = "text-[2.0cqw]";
        descSize = "text-[1.4cqw]";
        marginClass = "mb-[0.25cqw]";
    }

    const renderColumn = (items, startIdx) => {
        return (
            <div className={`flex flex-col ${gapClass} w-full`}>
                {items.map((ele, idx) => {
                    const globalIdx = startIdx + idx;
                    const displayNum = String(globalIdx + 1).padStart(2, '0');
                    return (
                        <div key={globalIdx} className="flex items-stretch gap-[1.5cqw] w-full">
                            {/* Giant Index Number */}
                            <div className={`${numSize} font-bold theme-text-accent tracking-tighter shrink-0 flex items-center justify-center min-w-[7cqw]`}>
                                {displayNum}
                            </div>
                            
                            {/* Thick Accent Line (maps to 'rect') */}
                            <div 
                                className={`${barWidth} rounded-full shrink-0`}
                                style={{ backgroundColor: "var(--theme-primary)" }}
                            />
                            
                            {/* Content */}
                            <div className="flex flex-col justify-center grow relative group/item pr-[2.5cqw]">
                                <EditableElement
                                    as="h2"
                                    className={`font-bold theme-heading ${headerSize} ${marginClass} leading-tight`}
                                    value={ele.header}
                                    onChange={(val) => onUpdateItem?.(globalIdx, "header", val)}
                                    readOnly={!onUpdateItem}
                                    placeholder="Header"
                                />
                                <EditableElement
                                    as="p"
                                    className={`${descSize} theme-text-muted w-full text-wrap`}
                                    value={ele.description}
                                    onChange={(val) => onUpdateItem?.(globalIdx, "description", val)}
                                    readOnly={!onUpdateItem}
                                    placeholder="Description..."
                                />
                                {onDeleteItem && (
                        <div className="absolute -top-[1.2cqw] -right-[1.2cqw] opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                            <ItemActionsMenu
                                onAddBefore={() => onAddItem?.(globalIdx, "before")}
                                onAddAfter={() => onAddItem?.(globalIdx, "after")}
                                onDelete={() => onDeleteItem(globalIdx)}
                            />
                        </div>
                    )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (isTwoCol) {
        const col1 = content.slice(0, itemsPerCol);
        const col2 = content.slice(itemsPerCol);
        return (
            <div className="flex gap-[4cqw] max-w-[95cqw] mx-auto my-[1.5cqw] items-start justify-between">
                {renderColumn(col1, 0)}
                {renderColumn(col2, itemsPerCol)}
            </div>
        );
    }

    return (
        <div className="max-w-[85cqw] mx-auto my-[2cqw]">
            {renderColumn(content, 0)}
        </div>
    );
};

export default TimelineVertical;
