import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const AgendaList = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;

    // Adjust sizes based on density to avoid vertical overflows
    let headerSize = "text-[1.8em]";
    let descSize = "text-[1.2em]";
    let padClass = "p-[1.4em] px-[2.0em]";
    let gapClass = "gap-[1.2em]";
    let badgeSize = "w-[5.2em] h-[5.2em]";
    let badgeTextSize = "text-[1.6em]";

    if (n >= 9) {
        headerSize = "text-[1.05em]";
        descSize = "text-[0.75em]";
        padClass = "p-[0.35em] px-[0.95em]";
        gapClass = "gap-[0.25em]";
        badgeSize = "w-[2.8em] h-[2.8em]";
        badgeTextSize = "text-[1.0em]";
    } else if (n >= 7) {
        headerSize = "text-[1.2em]";
        descSize = "text-[0.9em]";
        padClass = "p-[0.5em] px-[1.1em]";
        gapClass = "gap-[0.45em]";
        badgeSize = "w-[3.8em] h-[3.8em]";
        badgeTextSize = "text-[1.2em]";
    } else if (n >= 6) {
        headerSize = "text-[1.4em]";
        descSize = "text-[1.0em]";
        padClass = "p-[0.8em] px-[1.2em]";
        gapClass = "gap-[0.5em]";
        badgeSize = "w-[4.4em] h-[4.4em]";
        badgeTextSize = "text-[1.4em]";
    } else if (n >= 5) {
        headerSize = "text-[1.6em]";
        descSize = "text-[1.1em]";
        padClass = "p-[1.0em] px-[1.5em]";
        gapClass = "gap-[0.8em]";
        badgeSize = "w-[4.8em] h-[4.8em]";
        badgeTextSize = "text-[1.5em]";
    }

    return (
        <div className="relative max-w-[90cqw] mx-auto py-[1em] flex flex-col justify-center h-full w-full">
            

            {/* List Items */}
            <div className={`flex flex-col relative  ${gapClass}`}>
                {content.map((ele, i) => (
                    <div 
                        key={i}
                        className="flex items-center gap-[2em] relative group/item"
                    >
                        {/* Circular Chapter Index Badge */}
                        <div 
                            className={`${badgeSize} rounded-full flex items-center justify-center shrink-0 border-[0.2em]`}
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
                            className={`flex flex-col grow rounded-[1.0em] border ${padClass} pr-[4em]`}
                            style={{ 
                                backgroundColor: "var(--theme-card-bg)",
                                borderColor: "var(--theme-card-border)"
                            }}
                        >
                            <EditableElement
                                as="h3"
                                className={`font-bold theme-heading ${headerSize} leading-tight mb-[0.2em]`}
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
                            <div className="absolute -top-[1em] right-[1em] opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
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
