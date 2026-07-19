import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import AnimatedItem from "../../AnimatedItem";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const BulletsAccent = ({
    content,
    columns,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    readOnly,
}) => {
    const items = content || [];
    const requestedCols = columns || 2;
    const actualCols = Math.min(requestedCols, Math.max(1, items.length));

    return (
        <div
            className="w-full flex flex-row flex-wrap gap-[3cqw]"
        >
            {/* Add before first item when empty */}
            {!readOnly && onAddItem && items.length === 0 && (
                <button
                    onClick={() => onAddItem(0, "before")}
                    className="flex items-center justify-center gap-[0.5cqw] w-full py-[2cqw] text-[1.2cqw] text-muted-foreground/50 hover:text-primary hover:bg-primary/5 rounded-[0.5cqw] border border-dashed border-transparent hover:border-primary/30 transition-all cursor-pointer"
                >
                    <Plus className="w-[1.2cqw] h-[1.2cqw]" />
                    Add First Point
                </button>
            )}

            {items.map((item, i) => (
                <AnimatedItem
                    key={i}
                    index={i}
                    className="flex flex-col p-[0.5cqw] group/item relative flex-1 min-w-[12cqw]"
                    style={{ flexBasis: `calc((100% - ${(actualCols - 1) * 3}cqw) / ${actualCols})` }}
                >
                    {/* Add/Delete controls */}
                    {!readOnly && (onAddItem || onDeleteItem) && (
                        <div className="absolute top-[0.5cqw] right-[0.5cqw] opacity-0 group-hover/item:opacity-100 data-[menu-open=true]:opacity-100 transition-opacity z-10">
                            <ItemActionsMenu
                                onAddBefore={
                                    onAddItem
                                        ? () => onAddItem(i, "before")
                                        : undefined
                                }
                                onAddAfter={
                                    onAddItem
                                        ? () => onAddItem(i, "after")
                                        : undefined
                                }
                                onDelete={
                                    onDeleteItem
                                        ? () => onDeleteItem(i)
                                        : undefined
                                }
                            />
                        </div>
                    )}
                    
                    {/* Accent Line */}
                    <div className="w-full h-[0.15cqw] theme-bg-primary rounded-full mb-[1cqw] shrink-0" />
                    
                    <div className="flex flex-col min-w-0 pb-[1cqw]">
                        <EditableElement
                            as="h3"
                            className="theme-font-heading font-semibold theme-text-heading-size leading-snug theme-text-primary"
                            value={item.header}
                            onChange={(val) => onUpdateItem(i, "header", val)}
                            readOnly={readOnly}
                            placeholder="Accent Point Title"
                        />
                        <EditableElement
                            as="p"
                            className="theme-text-description-size leading-relaxed theme-text-muted mt-[0.6cqw]"
                            value={item.description}
                            onChange={(val) =>
                                onUpdateItem(i, "description", val)
                            }
                            readOnly={readOnly}
                            placeholder="Detailed description for this accent point goes here."
                        />
                    </div>
                </AnimatedItem>
            ))}
        </div>
    );
};

export default BulletsAccent;
