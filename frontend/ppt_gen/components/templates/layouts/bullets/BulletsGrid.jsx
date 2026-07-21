import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import AnimatedItem from "../../AnimatedItem";

const BulletsGrid = ({ content, columns, onUpdateItem, onDeleteItem, onAddItem, readOnly }) => {
    const items = content || [];
    const actualCols = Math.min(columns || 2, Math.max(1, items.length));

    return (
        <div className="w-full flex flex-row flex-wrap gap-x-[2cqw] gap-y-[0cqw]">
            {items.length === 0 && !readOnly && onAddItem && (
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
                    className="group/item relative flex-1 min-w-[12cqw]"
                    style={{ flexBasis: `calc((100% - ${(actualCols - 1) * 4}cqw) / ${actualCols})` }}
                >
                    {/* Item Actions Menu */}
                    {!readOnly && (onAddItem || onDeleteItem) && (
                        <div className="absolute top-[0.5cqw] right-[0.5cqw] opacity-0 group-hover/item:opacity-100 data-[menu-open=true]:opacity-100 transition-opacity z-10">
                            <ItemActionsMenu
                                onAddBefore={onAddItem ? () => onAddItem(i, "before") : undefined}
                                onAddAfter={onAddItem ? () => onAddItem(i, "after") : undefined}
                                onDelete={onDeleteItem ? () => onDeleteItem(i) : undefined}
                            />
                        </div>
                    )}

                    <div className="flex flex-row py-[1.5cqw] px-[0.5cqw] gap-[1.5cqw] rounded-[0.5cqw] hover:bg-white/5 transition-colors">
                        <div className="w-[0.4cqw] theme-bullet-bg shrink-0 rounded-full" />
                        <div className="flex flex-col gap-[1cqw] flex-1 min-w-0 pr-[2cqw]">
                            <EditableElement
                                as="h3"
                                className="theme-font-heading font-bold theme-text-heading-size leading-tight theme-text-primary"
                                value={item.header}
                                onChange={(val) => onUpdateItem(i, "header", val)}
                                readOnly={readOnly}
                                placeholder="Grid header"
                            />
                            <EditableElement
                                as="p"
                                className="theme-text-description-size leading-relaxed theme-text-muted"
                                value={item.description}
                                onChange={(val) => onUpdateItem(i, "description", val)}
                                readOnly={readOnly}
                                placeholder="Grid description details"
                            />
                        </div>
                    </div>
                </AnimatedItem>
            ))}
        </div>
    );
};

export default BulletsGrid;
