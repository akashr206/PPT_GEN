import React from "react";
import { Plus, ChevronUp, ChevronDown } from "lucide-react";
import AnimatedItem from "../../AnimatedItem";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const ChartDataEditor = ({
    items,
    onUpdateItem,
    onAddItem,
    onDeleteItem,
    onMoveItem,
    readOnly,
}) => {
    return (
        <div className="w-full flex flex-col gap-2 bg-card rounded-xl border border-border shadow-sm p-4 ">
            <div className="flex w-full px-2 pb-2 border-b border-border mb-2">
                <div className="flex-1 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Label</div>
                <div className="flex-1 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Value</div>
                <div className="w-8"></div>
            </div>
            {items.map((item, i) => (
                <AnimatedItem
                    key={i}
                    index={i}
                    as="div"
                    className="flex gap-3 group/item relative p-2 w-full items-center bg-muted/30 rounded-lg hover:bg-muted/80 transition-colors"
                >
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                        {!readOnly && onMoveItem && (
                            <div className="flex flex-col gap-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onMoveItem(i, i - 1)}
                                    disabled={i === 0}
                                    className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ChevronUp className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => onMoveItem(i, i + 1)}
                                    disabled={i === items.length - 1}
                                    className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        <input
                            type="text"
                            className="text-foreground text-sm w-full font-medium bg-transparent border border-transparent focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded px-1.5 py-1 outline-none transition-all"
                            value={item.header || ""}
                            onChange={(e) => onUpdateItem(i, "header", e.target.value)}
                            readOnly={readOnly}
                            placeholder="Data Label"
                        />
                    </div>
                    <div className="flex-1 min-w-0 border-l border-border pl-3">
                        <input
                            type="text"
                            className="text-foreground text-sm w-full font-mono bg-transparent border border-transparent focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded px-1.5 py-1 outline-none transition-all"
                            value={item.chartValue !== undefined ? String(item.chartValue) : (item.description || "")}
                            onChange={(e) => onUpdateItem(i, "chartValue", e.target.value)}
                            readOnly={readOnly}
                            placeholder="Numeric Value"
                        />
                    </div>
                    
                    {!readOnly && (onAddItem || onDeleteItem) && (
                        <div className="w-8 flex justify-end opacity-0 group-hover/item:opacity-100 data-[menu-open=true]:opacity-100 transition-opacity z-10">
                            <ItemActionsMenu
                                onAddBefore={
                                    onAddItem ? () => onAddItem(i, "before") : undefined
                                }
                                onAddAfter={
                                    onAddItem ? () => onAddItem(i, "after") : undefined
                                }
                                onDelete={
                                    onDeleteItem ? () => onDeleteItem(i) : undefined
                                }
                            />
                        </div>
                    )}
                </AnimatedItem>
            ))}
            
            {items.length === 0 && !readOnly && onAddItem && (
                <button
                    onClick={() => onAddItem(0, "before")}
                    className="flex items-center justify-center gap-2 w-full py-4 text-sm text-muted-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg border border-dashed border-border/60 hover:border-primary/40 transition-all cursor-pointer mt-2"
                >
                    <Plus className="w-4 h-4" />
                    Add First Data Point
                </button>
            )}
        </div>
    );
};

export default ChartDataEditor;
