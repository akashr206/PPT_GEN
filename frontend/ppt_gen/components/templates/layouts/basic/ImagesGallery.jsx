import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import AnimatedItem from "../../AnimatedItem";
import ItemImage from "../../ItemImage";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const ImagesGallery = ({
    content,
    columns,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    onEditImage,
    readOnly,
}) => {
    const items = content || [];
    const actualCols = Math.min(columns || 2, Math.max(1, items.length));
    
    return (
        <div className="w-full h-full max-h-[90cqw] flex flex-col relative overflow-hidden">
            {/* Add before first item when empty */}
            {!readOnly && onAddItem && items.length === 0 && (
                <button
                    onClick={() => onAddItem(0, "before")}
                    className="flex items-center justify-center gap-[0.5cqw] w-full py-[2cqw] text-[1.2cqw] text-muted-foreground/50 hover:text-primary hover:bg-primary/5 rounded-[0.5cqw] border border-dashed border-transparent hover:border-primary/30 transition-all cursor-pointer"
                >
                    <Plus className="w-[1.2cqw] h-[1.2cqw]" />
                    Add First Image
                </button>
            )}

            <div className="w-full flex flex-row flex-wrap gap-[2cqw]">
                {items.map((item, i) => (
                    <AnimatedItem
                        key={i}
                        index={i}
                        className="group/item relative flex-1 min-w-[15cqw]"
                        style={{ flexBasis: `calc((100% - ${(actualCols - 1) * 2}cqw) / ${actualCols})` }}
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
                        
                        <div className="w-full h-[22cqw] relative overflow-hidden rounded-[1cqw]">
                            <ItemImage
                                imageUrl={item.image}
                                imagePrompt={item.imageDescription}
                                imageLoading={item.imageLoading}
                                onEditImage={!readOnly && onEditImage ? () => onEditImage({ type: "item", itemIndex: i, currentQuery: item.imageDescription || item.header }) : undefined}
                                readOnly={readOnly}
                                focusPoint={item.imageFocus}
                                onUpdateFocus={(val) => onUpdateItem && onUpdateItem(i, "imageFocus", val)}
                                objectFit={item.imageFit || "cover"}
                                onToggleFit={!readOnly && onUpdateItem ? (val) => onUpdateItem(i, "imageFit", val) : undefined}
                            />
                        </div>
                    </AnimatedItem>
                ))}
            </div>
        </div>
    );
};

export default ImagesGallery;
