import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Image as ImageIcon } from "lucide-react";
import ItemImage from "../../ItemImage";
import AnimatedItem from "../../AnimatedItem";

const CardsImage = ({ content, columns, onUpdateItem, onEditImage, readOnly }) => {
    const items = content || [];
    const actualCols = Math.min(columns || 2, Math.max(1, items.length));
    
    return (
        <div className="w-full flex flex-row flex-wrap gap-[2cqw]">
            {items.map((item, i) => (
                <AnimatedItem 
                    key={i} 
                    index={i} 
                    className="flex-1 min-w-[15cqw] flex flex-col rounded-[1cqw] theme-bg-card border theme-border-card shadow-sm overflow-hidden"
                    style={{ flexBasis: `calc((100% - ${(actualCols - 1) * 2}cqw) / ${actualCols})` }}
                >
                    <div className="w-full h-[12cqw] shrink-0 relative">
                        <ItemImage
                            imageUrl={item.image}
                            imagePrompt={item.imageDescription || item.header}
                            imageLoading={item.imageLoading}
                            onEditImage={!readOnly && onEditImage ? () => onEditImage({ type: "item", itemIndex: i }) : undefined}
                            readOnly={readOnly}
                            focusPoint={item.imageFocus}
                            onUpdateFocus={(val) => onUpdateItem && onUpdateItem(i, "imageFocus", val)}
                        />
                    </div>
                    <div className="flex flex-col gap-[1cqw] p-[2cqw]">
                        <EditableElement
                            as="h3"
                            className="theme-font-heading font-bold text-[1.8cqw] leading-tight theme-text-primary"
                            value={item.header}
                            onChange={(val) => onUpdateItem(i, "header", val)}
                            readOnly={readOnly}
                            placeholder="Card Title"
                        />
                        <EditableElement
                            as="p"
                            className="text-[1.3cqw] leading-relaxed theme-text-muted"
                            value={item.description}
                            onChange={(val) => onUpdateItem(i, "description", val)}
                            readOnly={readOnly}
                            placeholder="Card description text goes here. Keep it concise."
                        />
                    </div>
                </AnimatedItem>
            ))}
        </div>
    );
};

export default CardsImage;
