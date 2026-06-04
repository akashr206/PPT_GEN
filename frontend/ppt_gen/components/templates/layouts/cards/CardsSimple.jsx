import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const CardsSimple = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    
    // Choose grid columns based on item count
    const gridCols = n === 3 ? "grid-cols-3" : (n >= 4 ? "grid-cols-2" : "grid-cols-1");
    const rows = n === 3 ? 1 : (n >= 4 ? Math.ceil(n / 2) : n);
    
    let gapClass = "gap-[2.5cqw]";
    let padClass = "p-[2.0cqw]";
    let headerSize = "text-[2.2cqw]";
    let descSize = "text-[1.6cqw]";
    let marginClass = "mb-[0.4cqw]";
    let radiusClass = "rounded-[1cqw]";

    if (rows >= 5) {
        gapClass = "gap-[0.6cqw] gap-x-[3cqw]";
        padClass = "p-[1.0cqw]";
        headerSize = "text-[1.5cqw]";
        descSize = "text-[1.1cqw]";
        marginClass = "mb-[0.1cqw]";
        radiusClass = "rounded-[0.5cqw]";
    } else if (rows >= 4) {
        gapClass = "gap-[1.0cqw] gap-x-[3cqw]";
        padClass = "p-[1.4cqw]";
        headerSize = "text-[1.8cqw]";
        descSize = "text-[1.3cqw]";
        marginClass = "mb-[0.2cqw]";
        radiusClass = "rounded-[0.7cqw]";
    } else if (rows >= 3) {
        gapClass = "gap-[1.6cqw] gap-x-[3cqw]";
        padClass = "p-[1.8cqw]";
        headerSize = "text-[2.0cqw]";
        descSize = "text-[1.4cqw]";
        marginClass = "mb-[0.3cqw]";
        radiusClass = "rounded-[0.8cqw]";
    }

    return (
        <div className={`grid ${gridCols} ${gapClass} max-w-[95cqw] mx-auto my-[1.5cqw] items-start`}>
            {content.map((ele, i) => (
                <div 
                    key={i} 
                    className={`${padClass} ${radiusClass} border theme-border flex flex-col relative group/item`}
                    style={{ backgroundColor: "var(--theme-card-bg)" }}
                >
                    <EditableElement
                        as="h2"
                        className={`font-bold theme-heading ${headerSize} ${marginClass} pr-[2cqw]`}
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
            ))}
        </div>
    );
};

export default CardsSimple;
