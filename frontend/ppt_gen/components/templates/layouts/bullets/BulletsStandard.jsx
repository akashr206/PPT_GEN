import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const BulletsStandard = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    
    const gridCols = n > 4 ? "grid-cols-2" : "grid-cols-1";
    const itemsPerCol = n > 4 ? Math.ceil(n / 2) : n;
    
    let gapClass = "gap-[2cqw]";
    let bulletSize = "w-[1.2cqw] h-[1.2cqw] mt-[0.8cqw]";
    let headerSize = "text-[2.3cqw]";
    let descSize = "text-[1.6cqw]";
    let marginClass = "mb-[0.3cqw]";
    
    if (itemsPerCol >= 6) {
        gapClass = "gap-[0.5cqw]";
        bulletSize = "w-[0.8cqw] h-[0.8cqw] mt-[0.6cqw]";
        headerSize = "text-[1.5cqw]";
        descSize = "text-[1.1cqw]";
        marginClass = "mb-[0.1cqw]";
    } else if (itemsPerCol >= 5) {
        gapClass = "gap-[0.8cqw]";
        bulletSize = "w-[1.0cqw] h-[1.0cqw] mt-[0.7cqw]";
        headerSize = "text-[1.7cqw]";
        descSize = "text-[1.3cqw]";
        marginClass = "mb-[0.2cqw]";
    } else if (itemsPerCol >= 4) {
        gapClass = "gap-[1.2cqw]";
        bulletSize = "w-[1.1cqw] h-[1.1cqw] mt-[0.7cqw]";
        headerSize = "text-[2.0cqw]";
        descSize = "text-[1.4cqw]";
        marginClass = "mb-[0.25cqw]";
    }

    return (
        <div className="max-w-[90cqw] mx-auto my-[1cqw]">
            <div className={`grid ${gridCols} ${gapClass} gap-x-[4cqw] items-start`}>
                {content.map((ele, i) => (
                    <div key={i} className="flex items-start gap-[1.2cqw]">
                        <div className={`${bulletSize} rounded-full shrink-0 theme-bg-primary`} />
                        <div className="relative group/item flex-1 pr-[2cqw]">
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

export default BulletsStandard;
