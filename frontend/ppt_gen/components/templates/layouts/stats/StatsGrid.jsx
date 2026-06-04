import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const StatsGrid = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    const gridCols =
        n === 3 ? "grid-cols-3" : n >= 4 ? "grid-cols-2" : "grid-cols-1";
    const rows = n === 3 ? 1 : n >= 4 ? Math.ceil(n / 2) : n;

    let gapClass = "gap-[3cqw]";
    let numSize = "text-[6cqw]";
    let descSize = "text-[1.8cqw]";
    if (rows >= 5) {
        gapClass = "gap-[0.8cqw] gap-x-[3cqw]";
        numSize = "text-[3.0cqw]";
        descSize = "text-[1.1cqw]";
    } else if (rows >= 4) {
        gapClass = "gap-[1.2cqw] gap-x-[3cqw]";
        numSize = "text-[3.3cqw]";
        descSize = "text-[1.3cqw]";
    } else if (rows >= 3) {
        gapClass = "gap-[1.8cqw] gap-x-[4cqw]";
        numSize = "text-[5.0cqw]";
        descSize = "text-[1.5cqw]";
    }

    return (
        <div
            className={`grid ${gridCols} ${gapClass} max-w-[95cqw] mx-auto my-[2cqw] items-start text-center`}
        >
            {content.map((ele, i) => (
                <div key={i} className="flex flex-col items-center relative group/item">
                    {/* Big Hero Number / Stat */}
                    <EditableElement
                        as="div"
                        className={`font-bold theme-heading ${numSize} leading-none mb-[0.5cqw]`}
                        value={ele.header}
                        onChange={(val) => onUpdateItem?.(i, "header", val)}
                        readOnly={!onUpdateItem}
                        placeholder="Stat"
                    />
                    {/* Stat description */}
                    <EditableElement
                        as="p"
                        className={`${descSize} theme-text-muted max-w-[85%] text-wrap`}
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

export default StatsGrid;
