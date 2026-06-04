import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const TimelineHorizontal = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    
    let padClass = "p-[1.0cqw]";
    let headerSize = "text-[2.0cqw]";
    let descSize = "text-[1.4cqw]";
    let marginClass = "mb-[0.3cqw]";
    let lineTop = "top-[1.3cqw]";
    let nodeSize = "w-[1.6cqw] h-[1.6cqw]";
    
    if (n >= 6) {
        padClass = "p-[0.5cqw]";
        headerSize = "text-[1.3cqw]";
        descSize = "text-[1.0cqw]";
        marginClass = "mb-[0.1cqw]";
        lineTop = "top-[0.9cqw]";
        nodeSize = "w-[1.0cqw] h-[1.0cqw]";
    } else if (n >= 4) {
        padClass = "p-[0.8cqw]";
        headerSize = "text-[1.6cqw]";
        descSize = "text-[1.2cqw]";
        marginClass = "mb-[0.2cqw]";
        lineTop = "top-[1.1cqw]";
        nodeSize = "w-[1.3cqw] h-[1.3cqw]";
    }

    return (
        <div className="absolute max-w-[95cqw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className={`absolute left-[5%] right-[5%] ${lineTop} h-[0.2cqw] theme-bg-primary opacity-30`} />

            <div className="flex justify-between items-start">
                {content.map((ele, i) => (
                    <div 
                        key={i} 
                        className="flex flex-col items-center text-center"
                        style={{ width: `${Math.floor(90 / n)}cqw` }}
                    >
                        {/* Circle Node */}
                        <div className={`${nodeSize} rounded-full theme-bg-primary theme-border z-10 mb-[1.5cqw]`} />
                        
                        {/* Text */}
                        <div className={`${padClass} relative group/item w-full`}>
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineHorizontal;
