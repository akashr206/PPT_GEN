import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import AnimatedItem from "../../AnimatedItem";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const BulletsSimple = ({
    content,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    readOnly,
}) => {
    const items = content || [];
    const useTwoColumns = items.length > 4;

    return (
        <div
            className={`w-full flex ${useTwoColumns ? "flex-row flex-wrap gap-x-[4cqw] gap-y-0" : "flex-col gap-[0cqw]"}`}
        >
            {/* Add before first item when empty */}
            {!readOnly && onAddItem && items.length === 0 && (
                <button
                    onClick={() => onAddItem(0, "before")}
                    className="flex items-center justify-center gap-[0.5cqw] w-full py-[1cqw] text-[1.2cqw] text-muted-foreground/50 hover:text-primary hover:bg-primary/5 rounded-[0.5cqw] border border-dashed border-transparent hover:border-primary/30 transition-all cursor-pointer"
                >
                    <Plus className="w-[1.2cqw] h-[1.2cqw]" />
                    Add First Point
                </button>
            )}

            {items.map((item, i) => (
                <AnimatedItem
                    key={i}
                    index={i}
                    className={`flex gap-[1cqw] group/item relative pl-[1cqw] ${useTwoColumns ? "w-[calc(50%-2cqw)]" : "w-full"}`}
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
                    <div className="w-[1cqw] h-[1cqw] rounded-full theme-bg-primary shrink-0 mt-[0.5cqw]" />
                    <div className="flex flex-col min-w-0 pb-[1cqw]">
                        <EditableElement
                            as="h3"
                            className="theme-font-heading font-semibold text-[1.8cqw] leading-snug theme-text-primary"
                            value={item.header}
                            onChange={(val) => onUpdateItem(i, "header", val)}
                            readOnly={readOnly}
                            placeholder="Bullet Point Title"
                        />
                        <EditableElement
                            as="p"
                            className="text-[1.3cqw] leading-relaxed theme-text-muted mt-[0.5cqw]"
                            value={item.description}
                            onChange={(val) =>
                                onUpdateItem(i, "description", val)
                            }
                            readOnly={readOnly}
                            placeholder="Detailed description for this bullet point goes here."
                        />
                    </div>
                </AnimatedItem>
            ))}
        </div>
    );
};

export default BulletsSimple;
