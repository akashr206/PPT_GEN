import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const TimelineAlternating = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    
    let gapClass = "gap-[2.5cqw]";
    let nodeSize = "w-[1.6cqw] h-[1.6cqw] border-[0.3cqw]";
    let pointSize = "w-[1.0cqw] h-[1.0cqw]";
    let headerSize = "text-[2.2cqw]";
    let descSize = "text-[1.5cqw]";
    let marginClass = "mb-[0.3cqw]";
    let padClass = "pr-[3.5cqw]";
    let padClassRight = "pl-[3.5cqw]";

    if (n >= 7) {
        gapClass = "gap-[0.5cqw]";
        nodeSize = "w-[1.0cqw] h-[1.0cqw] border-[0.2cqw]";
        pointSize = "w-[0.6cqw] h-[0.6cqw]";
        headerSize = "text-[1.4cqw]";
        descSize = "text-[1.1cqw]";
        marginClass = "mb-[0.1cqw]";
        padClass = "pr-[2.0cqw]";
        padClassRight = "pl-[2.0cqw]";
    } else if (n >= 5) {
        gapClass = "gap-[1.0cqw]";
        nodeSize = "w-[1.2cqw] h-[1.2cqw] border-[0.2cqw]";
        pointSize = "w-[0.7cqw] h-[0.7cqw]";
        headerSize = "text-[1.7cqw]";
        descSize = "text-[1.3cqw]";
        marginClass = "mb-[0.2cqw]";
        padClass = "pr-[2.5cqw]";
        padClassRight = "pl-[2.5cqw]";
    } else if (n >= 3) {
        gapClass = "gap-[1.5cqw]";
        nodeSize = "w-[1.4cqw] h-[1.4cqw] border-[0.25cqw]";
        pointSize = "w-[0.8cqw] h-[0.8cqw]";
        headerSize = "text-[1.9cqw]";
        descSize = "text-[1.4cqw]";
        marginClass = "mb-[0.3cqw]";
        padClass = "pr-[3.0cqw]";
        padClassRight = "pl-[3.0cqw]";
    }

    return (
        <div className="relative max-w-[95cqw] mx-auto my-[2cqw] min-h-[30cqw]">
            <div className="absolute left-1/2 top-[1.5cqw] bottom-[1.5cqw] w-[0.2cqw] -translate-x-1/2 theme-bg-primary opacity-30" />

            <div className={`flex flex-col ${gapClass}`}>
                {content.map((ele, i) => {
                    const isLeft = i % 2 === 0;
                    return (
                        <div key={i} className="relative flex items-center w-full">
                            <div className={`absolute left-1/2 -translate-x-1/2 ${nodeSize} rounded-full theme-bg-primary theme-border z-10`} />

                            {isLeft ? (
                                <>
                                    {/* Horizontal connector line from node to point */}
                                    <div className="absolute left-[45%] right-1/2 h-[0.2cqw] top-1/2 -translate-y-1/2 theme-bg-primary opacity-30 z-0" />
                                    {/* Point at the end of the line */}
                                    <div className={`absolute left-[45%] -translate-x-1/2 ${pointSize} rounded-full theme-bg-accent z-10 top-1/2 -translate-y-1/2`} />
                                    
                                    <div className={`w-[45%] text-right ${padClass} ml-0 mr-auto flex flex-col items-end relative group/item`}>
                                        <EditableElement
                                            as="h2"
                                            className={`font-bold theme-heading ${headerSize} ${marginClass} leading-tight`}
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
                        <div className="absolute -top-[1.2cqw] -right-[1.2cqw] opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                            <ItemActionsMenu
                                onAddBefore={() => onAddItem?.(i, "before")}
                                onAddAfter={() => onAddItem?.(i, "after")}
                                onDelete={() => onDeleteItem(i)}
                            />
                        </div>
                    )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Horizontal connector line from node to point */}
                                    <div className="absolute left-1/2 right-[45%] h-[0.2cqw] top-1/2 -translate-y-1/2 theme-bg-primary opacity-30 z-0" />
                                    {/* Point at the end of the line */}
                                    <div className={`absolute left-[55%] -translate-x-1/2 ${pointSize} rounded-full theme-bg-accent z-10 top-1/2 -translate-y-1/2`} />
                                    
                                    <div className={`w-[45%] text-left ${padClassRight} ml-auto mr-0 flex flex-col items-start relative group/item`}>
                                        <EditableElement
                                            as="h2"
                                            className={`font-bold theme-heading ${headerSize} ${marginClass} leading-tight`}
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
                        <div className="absolute -top-[1.2cqw] -right-[1.2cqw] opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                            <ItemActionsMenu
                                onAddBefore={() => onAddItem?.(i, "before")}
                                onAddAfter={() => onAddItem?.(i, "after")}
                                onDelete={() => onDeleteItem(i)}
                            />
                        </div>
                    )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TimelineAlternating;

