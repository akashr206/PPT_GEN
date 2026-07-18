import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { EditableIcon } from "@/components/ui/EditableIcon";
import { Plus } from "lucide-react";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import AnimatedItem from "../../AnimatedItem";

const IconsList = ({ content, columns, onUpdateItem, onDeleteItem, onAddItem, readOnly }) => {
    const items = content || [];
    const actualCols = Math.min(columns || 1, Math.max(1, items.length));

    return (
        <div className="w-full flex flex-row flex-wrap gap-x-[4cqw] gap-y-[0cqw]">
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
                    className="group/item relative flex-1 min-w-[25cqw]"
                    style={{ flexBasis: `calc((100% - ${(actualCols - 1) * 4}cqw) / ${actualCols})` }}
                >
                    <div className="w-full flex flex-row items-center gap-[2.5cqw] py-[1.5cqw] px-[0.5cqw] rounded-[0.5cqw] hover:bg-white/5 transition-colors">
                        <EditableIcon
                            iconName={item.icon}
                            onChange={(val) => onUpdateItem(i, "icon", val)}
                            readOnly={readOnly}
                            contextText={item.header}
                            iconClassName="w-[2.5cqw] h-[2.5cqw] theme-text-primary"
                            className="flex items-center justify-center shrink-0 mb-[1cqw]"
                        />
                        <div className="flex flex-col gap-[0.5cqw] flex-1 min-w-0 pr-[2cqw]">
                            <EditableElement
                                as="h3"
                                className="theme-font-heading font-bold text-[1.8cqw] leading-tight theme-text-primary"
                                value={item.header}
                                onChange={(val) => onUpdateItem(i, "header", val)}
                                readOnly={readOnly}
                                placeholder="Icon Header"
                            />
                            <EditableElement
                                as="p"
                                className="text-[1.3cqw] leading-relaxed theme-text-muted"
                                value={item.description}
                                onChange={(val) => onUpdateItem(i, "description", val)}
                                readOnly={readOnly}
                                placeholder="Brief description for this icon point."
                            />
                        </div>
                    </div>

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
                </AnimatedItem>
            ))}
        </div>
    );
};

export default IconsList;
