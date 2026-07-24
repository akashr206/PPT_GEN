import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import AnimatedItem from "../../AnimatedItem";

const CodeBlock = ({ content, onUpdateItem, onDeleteItem, onAddItem, readOnly }) => {
    const items = content || [];

    return (
        <div className="w-full flex-1 flex flex-col justify-start gap-[1.5cqw]">
            {items.length === 0 && !readOnly && onAddItem && (
                <button
                    onClick={() => onAddItem(0, "before")}
                    className="flex items-center justify-center gap-[0.5cqw] w-full py-[2cqw] text-[1.2cqw] text-muted-foreground/50 hover:text-primary hover:bg-primary/5 rounded-[0.5cqw] border border-dashed border-border/40 hover:border-primary/30 transition-all cursor-pointer"
                >
                    <Plus className="w-[1.5cqw] h-[1.5cqw]" />
                    Add Code Block
                </button>
            )}
            
            {items.map((item, index) => (
                <AnimatedItem
                    key={index}
                    index={index}
                    as="div"
                    className="group/item relative flex flex-col w-full rounded-[0.5cqw] overflow-hidden border theme-border-color shadow-sm shrink-0"
                >
                    {/* Item Actions Menu */}
                    {!readOnly && (onAddItem || onDeleteItem) && (
                        <div className="absolute top-[0.5cqw] right-[0.5cqw] opacity-0 group-hover/item:opacity-100 data-[menu-open=true]:opacity-100 transition-opacity z-10">
                            <ItemActionsMenu
                                onAddBefore={onAddItem ? () => onAddItem(index, "before") : undefined}
                                onAddAfter={onAddItem ? () => onAddItem(index, "after") : undefined}
                                onDelete={onDeleteItem ? () => onDeleteItem(index) : undefined}
                            />
                        </div>
                    )}

                    {/* Header (Filename / Language) */}
                    <div className="w-full px-[1.5cqw] py-[0.8cqw] theme-bg-card border-b theme-border-color flex items-center shrink-0">
                        <EditableElement
                            value={item.header}
                            onChange={(val) => onUpdateItem && onUpdateItem(index, 'header', val)}
                            placeholder="filename.js"
                            readOnly={readOnly}
                            className="text-[1.1cqw] font-medium theme-text-muted font-mono w-full"
                        />
                    </div>
                    
                    {/* Code Content */}
                    <div className="w-full p-[1.5cqw] theme-bg-alt flex flex-col shrink-0">
                        <EditableElement
                            value={item.description}
                            onChange={(val) => onUpdateItem && onUpdateItem(index, 'description', val)}
                            placeholder="// Enter your code here"
                            readOnly={readOnly}
                            className="text-[1.2cqw] theme-text-primary font-mono whitespace-pre-wrap leading-relaxed w-full"
                        />
                    </div>
                </AnimatedItem>
            ))}
        </div>
    );
};

export default CodeBlock;
