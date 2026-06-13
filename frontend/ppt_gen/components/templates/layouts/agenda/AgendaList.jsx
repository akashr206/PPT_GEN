import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const AgendaList = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;

    // Adjust sizes based on density to avoid vertical overflows
    let headerSize = "text-[1.8cqw]";
    let descSize = "text-[1.2cqw]";
    let padClass = "p-[1.4cqw] px-[2.0cqw]";
    let gapClass = "gap-[1.2cqw]";
    let badgeSize = "w-[5.2cqw] h-[5.2cqw]";
    let badgeTextSize = "text-[1.6cqw]";

    if (n >= 9) {
        headerSize = "text-[1.05cqw]";
        descSize = "text-[0.75cqw]";
        padClass = "p-[0.35cqw] px-[0.95cqw]";
        gapClass = "gap-[0.25cqw]";
        badgeSize = "w-[2.8cqw] h-[2.8cqw]";
        badgeTextSize = "text-[1.0cqw]";
    } else if (n >= 7) {
        headerSize = "text-[1.2cqw]";
        descSize = "text-[0.9cqw]";
        padClass = "p-[0.5cqw] px-[1.1cqw]";
        gapClass = "gap-[0.45cqw]";
        badgeSize = "w-[3.8cqw] h-[3.8cqw]";
        badgeTextSize = "text-[1.2cqw]";
    } else if (n >= 6) {
        headerSize = "text-[1.4cqw]";
        descSize = "text-[1.0cqw]";
        padClass = "p-[0.8cqw] px-[1.2cqw]";
        gapClass = "gap-[0.5cqw]";
        badgeSize = "w-[4.4cqw] h-[4.4cqw]";
        badgeTextSize = "text-[1.4cqw]";
    } else if (n >= 5) {
        headerSize = "text-[1.6cqw]";
        descSize = "text-[1.1cqw]";
        padClass = "p-[1.0cqw] px-[1.5cqw]";
        gapClass = "gap-[0.8cqw]";
        badgeSize = "w-[4.8cqw] h-[4.8cqw]";
        badgeTextSize = "text-[1.5cqw]";
    }

    return (
        <div className="relative max-w-[90cqw] mx-auto py-[1cqw] flex flex-col justify-center h-full w-full">
            

            {/* List Items */}
            <div className={`flex flex-col relative  ${gapClass}`}>
                {content.map((ele, i) => (
                    <div 
                        key={i}
                        className="flex items-center gap-[2cqw] relative group/item"
                    >
                        {/* Circular Chapter Index Badge */}
                        <div 
                            className={`${badgeSize} rounded-full flex items-center justify-center shrink-0 border-[0.2cqw]`}
                            style={{ 
                                backgroundColor: "var(--theme-card-bg)",
                                borderColor: "var(--theme-primary)",
                                color: "var(--theme-primary)"
                            }}
                        >
                            <span className={`${badgeTextSize} font-black leading-none`}>
                                {i + 1}
                            </span>
                        </div>

                        {/* Text Container Card */}
                        <div 
                            className={`flex flex-col grow rounded-[1.0cqw] border ${padClass} pr-[4cqw]`}
                            style={{ 
                                backgroundColor: "var(--theme-card-bg)",
                                borderColor: "var(--theme-card-border)"
                            }}
                        >
                            <EditableElement
                                as="h3"
                                className={`font-bold theme-heading ${headerSize} leading-tight mb-[0.2cqw]`}
                                value={ele.header}
                                onChange={(val) => onUpdateItem?.(i, "header", val)}
                                readOnly={!onUpdateItem}
                                placeholder="Section Title"
                            />
                            <EditableElement
                                as="p"
                                className={`${descSize} theme-text-muted leading-relaxed text-wrap`}
                                value={ele.description}
                                onChange={(val) => onUpdateItem?.(i, "description", val)}
                                readOnly={!onUpdateItem}
                                placeholder="Brief chapter outline or subtopics..."
                            />
                        </div>

                        {/* Actions Menu */}
                        {onDeleteItem && (
                            <div className="absolute -top-[1cqw] right-[1cqw] opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
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
        </div>
    );
};

export default AgendaList;
