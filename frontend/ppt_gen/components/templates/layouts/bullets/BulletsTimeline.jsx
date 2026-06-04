import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const BulletsTimeline = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    
    const isTwoCol = n > 4;
    const itemsPerCol = isTwoCol ? Math.ceil(n / 2) : n;
    
    let gapClass = "gap-[2.5cqw]";
    let nodeSize = "w-[1.8cqw] h-[1.8cqw] left-[-3.8cqw] top-[0.6cqw] border-[0.3cqw]";
    let headerSize = "text-[2.3cqw]";
    let descSize = "text-[1.6cqw]";
    let marginClass = "mb-[0.3cqw]";
    let lineLeft = "left-[1.0cqw]";
    let lineTopBottom = "top-[1.5cqw] bottom-[1.5cqw] w-[0.2cqw]";

    if (itemsPerCol >= 6) {
        gapClass = "gap-[0.5cqw]";
        nodeSize = "w-[1.2cqw] h-[1.2cqw] left-[-2.6cqw] top-[0.5cqw] border-[0.2cqw]";
        headerSize = "text-[1.5cqw]";
        descSize = "text-[1.1cqw]";
        marginClass = "mb-[0.1cqw]";
        lineLeft = "left-[0.8cqw]";
        lineTopBottom = "top-[1.2cqw] bottom-[1.2cqw] w-[0.15cqw]";
    } else if (itemsPerCol >= 5) {
        gapClass = "gap-[0.8cqw]";
        nodeSize = "w-[1.4cqw] h-[1.4cqw] left-[-3cqw] top-[0.5cqw] border-[0.25cqw]";
        headerSize = "text-[1.7cqw]";
        descSize = "text-[1.3cqw]";
        marginClass = "mb-[0.2cqw]";
        lineLeft = "left-[0.9cqw]";
        lineTopBottom = "top-[1.3cqw] bottom-[1.3cqw] w-[0.18cqw]";
    } else if (itemsPerCol >= 4) {
        gapClass = "gap-[1.2cqw]";
        nodeSize = "w-[1.6cqw] h-[1.6cqw] left-[-3.4cqw] top-[0.5cqw] border-[0.25cqw]";
        headerSize = "text-[2.0cqw]";
        descSize = "text-[1.4cqw]";
        marginClass = "mb-[0.25cqw]";
        lineLeft = "left-[1.3cqw]";
        lineTopBottom = "top-[1.4cqw] bottom-[1.4cqw] w-[0.2cqw]";
    }

    const renderColumn = (items, startIdx) => {
        return (
            <div className="relative pl-[4cqw] w-full">
                {/* Connecting line (maps to 'rect' in PPT) */}
                <div className={`absolute ${lineLeft} ${lineTopBottom} theme-bg-primary opacity-30`} />

                <div className={`flex flex-col ${gapClass}`}>
                    {items.map((ele, idx) => {
                        const globalIdx = startIdx + idx;
                        return (
                            <div key={globalIdx} className="relative flex flex-col items-start w-full group/item">
                                {/* Circle node bullet (maps to 'ellipse' in PPT) */}
                                <div className={`absolute ${nodeSize} rounded-full theme-bg-primary theme-border`} />
                                
                                <div className="w-full relative pr-[2cqw]">
                                    <EditableElement
                                        as="h2"
                                        className={`font-bold theme-heading ${headerSize} ${marginClass}`}
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

export default BulletsTimeline;
