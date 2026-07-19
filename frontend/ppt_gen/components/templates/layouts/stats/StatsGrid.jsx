import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import AnimatedItem from "../../AnimatedItem";

const StatsGrid = ({ content, columns, onUpdateItem, onDeleteItem, onAddItem, readOnly }) => {
    const items = content || [];
    const actualCols = Math.min(columns || 2, Math.max(1, items.length));
    
    return (
        <div className="w-full flex flex-row flex-wrap gap-x-[4cqw] gap-y-[4cqw]">
            {items.length === 0 && !readOnly && onAddItem && (
                <button
                    onClick={() => onAddItem(0, "before")}
                    className="flex items-center justify-center gap-[0.5cqw] w-full py-[2cqw] text-[1.2cqw] text-muted-foreground/50 hover:text-primary hover:bg-primary/5 rounded-[1cqw] border border-dashed border-border/40 hover:border-primary/30 transition-all cursor-pointer"
                >
                    <Plus className="w-[1.5cqw] h-[1.5cqw]" />
                    Add First Metric
                </button>
            )}

            {items.map((item, i) => (
                <AnimatedItem 
                    key={i} 
                    index={i} 
                    className="group/item relative flex-1 min-w-[10cqw] flex flex-col gap-[0.5cqw] p-[1cqw] rounded-[1cqw] hover:bg-white/5 transition-colors"
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

                    <EditableElement
                        as="h2"
                        className="font-black text-[6cqw] leading-none theme-text-primary tracking-tighter"
                        value={item.header}
                        onChange={(val) => onUpdateItem(i, "header", val)}
                        readOnly={readOnly}
                        placeholder="50M+"
                    />
                    <EditableElement
                        as="p"
                        className="theme-text-description-size font-medium leading-tight theme-accent uppercase tracking-widest opacity-70 mt-[1cqw]"
                        value={item.description}
                        onChange={(val) => onUpdateItem(i, "description", val)}
                        readOnly={readOnly}
                        placeholder="Metric description"
                    />
                </AnimatedItem>
            ))}
        </div>
    );
};

export default StatsGrid;
