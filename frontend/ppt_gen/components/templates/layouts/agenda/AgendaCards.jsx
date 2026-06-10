import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const AgendaCards = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;

    // Grid columns configuration based on item count
    const gridCols = n === 3 ? "grid-cols-3" : (n >= 4 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2");
    
    // Adjust layout density based on text length to prevent vertical overflows
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
    
    const rows = Math.ceil(n / (n === 3 ? 3 : 2));
    const effectiveRows = rows + textInflation;
    
    let gapClass = "gap-[2.0cqw]";
    let padClass = "p-[1.8cqw]";
    let headerSize = "text-[2.0cqw]";
    let descSize = "text-[1.4cqw]";
    let numSize = "text-[3.2cqw]";
    
    if (effectiveRows >= 4) {
        gapClass = "gap-[1.0cqw]";
        padClass = "p-[1.2cqw]";
        headerSize = "text-[1.4cqw]";
        descSize = "text-[1.0cqw]";
        numSize = "text-[2.2cqw]";
    } else if (effectiveRows >= 3) {
        gapClass = "gap-[1.5cqw]";
        padClass = "p-[1.5cqw]";
        headerSize = "text-[1.7cqw]";
        descSize = "text-[1.2cqw]";
        numSize = "text-[2.7cqw]";
    }

    return (
        <div className={`grid ${gridCols} ${gapClass} max-w-[95cqw] mx-auto my-[1.5cqw] items-stretch`}>
            {content.map((ele, i) => (
                <div 
                    key={i} 
                    className="relative flex flex-col rounded-[1.2cqw] border shadow-md group/item overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                    style={{ 
                        backgroundColor: "var(--theme-card-bg)",
                        borderColor: "var(--theme-card-border)"
                    }}
                >
                    {/* Top Accent Bar */}
                    <div 
                        className="h-[0.4cqw] w-full"
                        style={{ backgroundColor: "var(--theme-primary)" }}
                    />
                    
                    {/* Content container */}
                    <div className={`${padClass} flex flex-col grow relative pt-[2.5cqw]`}>
                        {/* Huge background number */}
                        <div 
                            className={`absolute right-[1.5cqw] top-[1.0cqw] font-black opacity-[0.08] leading-none select-none ${numSize}`}
                            style={{ color: "var(--theme-primary)" }}
                        >
                            {String(i + 1).padStart(2, "0")}
                        </div>

                        {/* Smaller display number */}
                        <div 
                            className="text-[1.2cqw] font-bold uppercase tracking-wider mb-[1.0cqw] select-none"
                            style={{ color: "var(--theme-primary)" }}
                        >
                            Chapter {String(i + 1).padStart(2, "0")}
                        </div>

                        {/* Title */}
                        <EditableElement
                            as="h3"
                            className={`font-bold theme-heading ${headerSize} leading-tight mb-[0.5cqw] pr-[4cqw]`}
                            value={ele.header}
                            onChange={(val) => onUpdateItem?.(i, "header", val)}
                            readOnly={!onUpdateItem}
                            placeholder="Chapter Title"
                        />

                        {/* Description */}
                        <EditableElement
                            as="p"
                            className={`${descSize} theme-text-muted leading-relaxed w-full text-wrap`}
                            value={ele.description}
                            onChange={(val) => onUpdateItem?.(i, "description", val)}
                            readOnly={!onUpdateItem}
                            placeholder="Add brief details about this chapter..."
                        />

                        {/* Actions Menu */}
                        {onDeleteItem && (
                            <div className="absolute -top-[1.2cqw] left-1/2 -translate-x-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
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

export default AgendaCards;
