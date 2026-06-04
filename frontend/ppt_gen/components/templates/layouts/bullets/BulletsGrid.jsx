import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const BulletsGrid = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    const rows = Math.ceil(n / 2);

    let gapClass = "gap-[2.5cqw]";
    let bulletSize = "w-[1.3cqw] h-[1.3cqw] mt-[0.7cqw]";
    let headerSize = "text-[2.2cqw]";
    let descSize = "text-[1.6cqw]";
    let marginClass = "mb-[0.4cqw]";

    if (rows >= 5) {
        gapClass = "gap-[0.6cqw] gap-x-[3cqw]";
        bulletSize = "w-[0.8cqw] h-[0.8cqw] mt-[0.5cqw]";
        headerSize = "text-[1.5cqw]";
        descSize = "text-[1.1cqw]";
        marginClass = "mb-[0.1cqw]";
    } else if (rows >= 4) {
        gapClass = "gap-[1.0cqw] gap-x-[3cqw]";
        bulletSize = "w-[1.0cqw] h-[1.0cqw] mt-[0.6cqw]";
        headerSize = "text-[1.8cqw]";
        descSize = "text-[1.3cqw]";
        marginClass = "mb-[0.2cqw]";
    } else if (rows >= 3) {
        gapClass = "gap-[1.6cqw] gap-x-[3cqw]";
        bulletSize = "w-[1.2cqw] h-[1.2cqw] mt-[0.6cqw]";
        headerSize = "text-[2.0cqw]";
        descSize = "text-[1.4cqw]";
        marginClass = "mb-[0.3cqw]";
    }

    return (
        <div className={`grid grid-cols-2 ${gapClass} max-w-[95cqw] mx-auto my-[1.5cqw] items-start`}>
            {content.map((ele, i) => (
                <div key={i} className="flex gap-[1.2cqw]">
                    <div className={`${bulletSize} shrink-0 theme-bg-primary`} />
                    <div className="relative group/item flex-1 pr-[1.5cqw]">
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
    );
};

export default BulletsGrid;
