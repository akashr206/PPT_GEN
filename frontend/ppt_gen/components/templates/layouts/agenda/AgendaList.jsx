import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const AgendaList = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;

    // Adjust sizes based on density to avoid vertical overflows
    const headerSize = n >= 6 ? "text-[1.4cqw]" : n >= 5 ? "text-[1.6cqw]" : "text-[1.8cqw]";
    const descSize = n >= 6 ? "text-[1.0cqw]" : n >= 5 ? "text-[1.1cqw]" : "text-[1.2cqw]";
    const padClass = n >= 6 ? "p-[0.8cqw] px-[1.2cqw]" : n >= 5 ? "p-[1.0cqw] px-[1.5cqw]" : "p-[1.4cqw] px-[2.0cqw]";
    const gapClass = n >= 6 ? "gap-[0.5cqw]" : n >= 5 ? "gap-[0.8cqw]" : "gap-[1.2cqw]";

    return (
        <div className="relative max-w-[90cqw] mx-auto py-[1cqw] flex flex-col justify-center h-full">
            

            {/* List Items */}
            <div className={`flex flex-col relative  ${gapClass}`}>
                {content.map((ele, i) => (
                    <div 
                        key={i}
                        className="flex items-center gap-[2cqw] relative group/item"
                    >
                        {/* Circular Chapter Index Badge */}
                        <div 
                            className="w-[5.2cqw] h-[5.2cqw] rounded-full flex items-center justify-center shrink-0 border-[0.2cqw]"
                            style={{ 
                                backgroundColor: "var(--theme-card-bg)",
                                borderColor: "var(--theme-primary)",
                                color: "var(--theme-primary)"
                            }}
                        >
                            <span className="text-[1.6cqw] font-black leading-none">
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
