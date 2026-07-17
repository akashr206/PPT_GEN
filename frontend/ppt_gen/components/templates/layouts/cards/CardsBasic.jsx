import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import AnimatedItem from "../../AnimatedItem";

const CardsBasic = ({ content, onUpdateItem, onDeleteItem, onAddItem, readOnly }) => {
    const items = content || [];

    return (
        <div className="w-full flex flex-row flex-wrap gap-[2cqw]">
            {items.length === 0 && !readOnly && onAddItem && (
                <button
                    onClick={() => onAddItem(0, "before")}
                    className="flex items-center justify-center gap-[0.5cqw] w-full py-[2cqw] text-[1.2cqw] text-muted-foreground/50 hover:text-primary hover:bg-primary/5 rounded-[1cqw] border border-dashed border-border/40 hover:border-primary/30 transition-all cursor-pointer"
                >
                    <Plus className="w-[1.5cqw] h-[1.5cqw]" />
                    Add First Card
                </button>
            )}

            {items.map((item, i) => (
                <AnimatedItem
                    key={i}
                    index={i}
                    className="group/item relative flex-1 min-w-[18cqw]"
                >
                    <div className="flex flex-col gap-[1cqw] p-[1cqw] rounded-[1cqw] theme-bg-card border theme-border-card shadow-sm h-full">
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
                        
                        <EditableElement
                            as="h3"
                            className="theme-font-heading font-bold text-[1.8cqw] leading-tight theme-text-primary text-center px-[1.5cqw]"
                            value={item.header}
                            onChange={(val) => onUpdateItem(i, "header", val)}
                            readOnly={readOnly}
                            placeholder="Card Title"
                        />
                        <EditableElement
                            as="p"
                            className="text-[1.3cqw] leading-relaxed theme-text-muted text-center"
                            value={item.description}
                            onChange={(val) => onUpdateItem(i, "description", val)}
                            readOnly={readOnly}
                            placeholder="Card description text"
                        />
                    </div>
                </AnimatedItem>
            ))}
        </div>
    );
};

export default CardsBasic;
