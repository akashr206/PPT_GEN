import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const CardsLeftAccent = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    const gridCols = n === 3 ? "grid-cols-3" : (n >= 4 ? "grid-cols-2" : "grid-cols-1");
    const rows = n === 3 ? 1 : (n >= 4 ? Math.ceil(n / 2) : n);
    
    let gapClass = "gap-[2.5cqw]";
    let padClass = "p-[2.0cqw]";
    let marginSize = "my-[2.0cqw] ml-[2.0cqw]";
    let plSize = "pl-[2.0cqw]";
    let barWidth = "w-[0.8cqw]";
    let headerSize = "text-[2.2cqw]";
    let descSize = "text-[1.6cqw]";
    let marginClass = "mb-[0.4cqw]";

    if (rows >= 5) {
        gapClass = "gap-[0.6cqw] gap-x-[3cqw]";
        padClass = "p-[1.0cqw]";
        marginSize = "my-[1.0cqw] ml-[1.0cqw]";
        plSize = "pl-[1.0cqw]";
        barWidth = "w-[0.4cqw]";
        headerSize = "text-[1.5cqw]";
        descSize = "text-[1.1cqw]";
        marginClass = "mb-[0.1cqw]";
    } else if (rows >= 4) {
        gapClass = "gap-[1.0cqw] gap-x-[3cqw]";
        padClass = "p-[1.4cqw]";
        marginSize = "my-[1.4cqw] ml-[1.4cqw]";
        plSize = "pl-[1.4cqw]";
        barWidth = "w-[0.6cqw]";
        headerSize = "text-[1.8cqw]";
        descSize = "text-[1.3cqw]";
        marginClass = "mb-[0.2cqw]";
    } else if (rows >= 3) {
        gapClass = "gap-[1.6cqw] gap-x-[3cqw]";
        padClass = "p-[1.8cqw]";
        marginSize = "my-[1.8cqw] ml-[1.8cqw]";
        plSize = "pl-[1.8cqw]";
        barWidth = "w-[0.7cqw]";
        headerSize = "text-[2.0cqw]";
        descSize = "text-[1.4cqw]";
        marginClass = "mb-[0.3cqw]";
    }

    return (
        <div className={`grid ${gridCols} ${gapClass} max-w-[95cqw] mx-auto my-[1.5cqw] items-stretch`}>
            {content.map((ele, i) => (
                <div 
                    key={i} 
                    className="relative flex rounded-[0.8cqw] border theme-border group/item"
                    style={{ backgroundColor: "var(--theme-card-bg)" }}
                >
                    {/* Floating left accent bar (maps to 'roundRect' in PPT) */}
                    <div 
                        className={`${barWidth} ${marginSize} rounded-full shrink-0`} 
                        style={{ backgroundColor: "var(--theme-primary)" }}
                    />
                    
                    {/* Content container */}
                    <div className={`${padClass} ${plSize} flex flex-col grow pr-[2.5cqw]`}>
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

export default CardsLeftAccent;
