import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import AnimatedItem from "../../AnimatedItem";

const CardsNumbered = ({
    content,
    columns,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    readOnly,
}) => {
    const items = content || [];
    const actualCols = Math.min(columns || 2, Math.max(1, items.length));

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
                    className="group/item relative flex-1 min-w-[15cqw]"
                    style={{
                        flexBasis: `calc((100% - ${(actualCols - 1) * 2}cqw) / ${actualCols})`,
                    }}
                >
                    <div className="flex flex-col gap-[1cqw] p-[1.2cqw] rounded-[1cqw] theme-bg-card border theme-border-card shadow-sm h-full relative overflow-hidden">
                        {/* Top bar with stylized number badge */}
                        <div className="flex items-center gap-[0.8cqw] shrink-0">
                            <div className="flex items-center justify-center w-[3.5cqw] h-[3.5cqw] rounded-full theme-bg-alt theme-text-accent font-bold text-[1.3cqw] theme-font-heading border theme-border-card shrink-0">
                                <span>
                                    {(i + 1).toString().padStart(2, "0")}
                                </span>
                            </div>
                            <EditableElement
                                as="h3"
                                className="theme-font-heading font-bold theme-text-heading-size leading-tight theme-text-primary pr-[1.5cqw]"
                                value={item.header}
                                onChange={(val) =>
                                    onUpdateItem(i, "header", val)
                                }
                                readOnly={readOnly}
                                placeholder="Numbered Card Title"
                            />
                        </div>

                        {/* Item Actions Menu (top right on hover) */}
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

                        <div className="flex flex-col gap-[0.8cqw] h-full">
                            <EditableElement
                                as="p"
                                className="theme-text-description-size leading-relaxed theme-text-muted"
                                value={item.description}
                                onChange={(val) =>
                                    onUpdateItem(i, "description", val)
                                }
                                readOnly={readOnly}
                                placeholder="Numbered card description text"
                            />
                        </div>
                    </div>
                </AnimatedItem>
            ))}
        </div>
    );
};

export default CardsNumbered;
