import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { EditableIcon } from "@/components/ui/EditableIcon";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const IconsGrid = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;
    
    // Switch between 1, 2, or 3 columns based on item count
    const gridCols =
        n >= 5 ? "grid-cols-3" : n === 3 ? "grid-cols-3" : n === 1 ? "grid-cols-1" : "grid-cols-2";
    
    const rows = Math.ceil(n / (gridCols === "grid-cols-3" ? 3 : gridCols === "grid-cols-2" ? 2 : 1));

    // Adjust layout density based on text length to prevent overflows
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

    let gapVal = 4;
    let iconSize = "w-[5em] h-[5em]";
    let headerSize = "text-[2em]";
    let descSize = "text-[1.4em]";

    if (effectiveRows >= 4) {
        gapVal = 1;
        iconSize = "w-[3em] h-[3em]";
        headerSize = "text-[1.5em]";
        descSize = "text-[1.1em]";
    } else if (effectiveRows >= 2) {
        gapVal = 2;
        iconSize = "w-[3.5em] h-[3.5em]";
        headerSize = "text-[1.7em]";
        descSize = "text-[1.2em]";
    }

    const getFlexBasis = () => {
        if (n === 1) return "100%";
        if (n === 2 || n === 4) {
            return `calc(50% - ${gapVal / 2}cqw)`;
        }
        return `calc(33.333% - ${(gapVal * 2) / 3}cqw)`;
    };

    return (
        <div className="flex flex-wrap justify-center max-w-[95cqw] mx-auto items-stretch text-center" style={{ gap: `${gapVal}cqw` }}>
            {content.map((ele, i) => (
                <div 
                    key={i} 
                    style={{ flex: `0 1 ${getFlexBasis()}` }}
                    className="flex flex-col items-center relative group/item p-[2em] rounded-[1.2em] theme-bg-secondary border border-transparent"
                >
                    
                        <EditableIcon
                            iconName={ele.icon || "Star"}
                            onChange={(newIcon) => onUpdateItem?.(i, "icon", newIcon)}
                            readOnly={!onUpdateItem}
                            contextText={`${ele.header || ""} ${ele.description || ""}`}
                            recommendedIcons={ele.recommendedIcons}
                            iconClassName={iconSize}
                        />
                    
                    <EditableElement
                        as="h3"
                        className={`font-bold theme-heading ${headerSize} leading-tight mb-[0.8em]`}
                        value={ele.header}
                        onChange={(val) => onUpdateItem?.(i, "header", val)}
                        readOnly={!onUpdateItem}
                        placeholder="Header"
                    />
                    
                    <EditableElement
                        as="p"
                        className={`${descSize} theme-text-muted text-balance`}
                        value={ele.description}
                        onChange={(val) => onUpdateItem?.(i, "description", val)}
                        readOnly={!onUpdateItem}
                        placeholder="Description..."
                    />
                    
                    {onDeleteItem && (
                        <div className="absolute -top-[1.2em] left-1/2 -translate-x-1/2 cqw opacity-0 group-hover/item:opacity-100 z-20">
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

export default IconsGrid;
