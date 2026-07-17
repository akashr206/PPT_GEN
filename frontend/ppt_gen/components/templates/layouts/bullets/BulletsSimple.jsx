import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const BulletsSimple = ({ content, onUpdateItem, onDeleteItem, onAddItem, readOnly }) => {
    const items = content || [];
    const useTwoColumns = items.length > 4;

    return (
        <div className={`w-full flex ${useTwoColumns ? "flex-row flex-wrap gap-x-[4cqw] gap-y-[0cqw]" : "flex-col gap-[0cqw]"}`}>
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
                <div
                    key={i}
                    className={`group/item relative ${useTwoColumns ? "w-[calc(50%-2cqw)]" : "w-full"}`}
                >
                    {/* Item Actions Menu (top right on hover) */}
                    {!readOnly && (onAddItem || onDeleteItem) && (
                        <div className="absolute top-[0.5cqw] right-[0.5cqw] opacity-0 group-hover/item:opacity-100 data-[menu-open=true]:opacity-100 transition-opacity z-10">
                            <ItemActionsMenu
                                onAddBefore={onAddItem ? () => onAddItem(i, "before") : undefined}
                                onAddAfter={onAddItem ? () => onAddItem(i, "after") : undefined}
                                onDelete={onDeleteItem ? () => onDeleteItem(i) : undefined}
                            />
                        </div>
                    )}

                    <div className="flex flex-row items-start gap-[1.5cqw] py-[1cqw] px-[0.5cqw] rounded-[0.5cqw] hover:bg-white/5 transition-colors">
                        <div className="w-[1cqw] h-[1cqw] rounded-full theme-bullet-bg mt-[0.8cqw] shrink-0" />
                        <div className="flex flex-col gap-[0.5cqw] flex-1 min-w-0 pr-[2cqw]">
                            <EditableElement
                                as="h3"
                                className="theme-font-heading font-bold text-[1.8cqw] leading-tight theme-text-primary"
                                value={item.header}
                                onChange={(val) => onUpdateItem(i, "header", val)}
                                readOnly={readOnly}
                                placeholder="Bullet header"
                            />
                            <EditableElement
                                as="p"
                                className="text-[1.3cqw] leading-relaxed theme-text-muted"
                                value={item.description}
                                onChange={(val) => onUpdateItem(i, "description", val)}
                                readOnly={readOnly}
                                placeholder="Bullet description details"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BulletsSimple;
