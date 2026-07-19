import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import AnimatedItem from "../../AnimatedItem";
import ItemImage from "../../ItemImage";

const ImagesSingle = ({
    content,
    onUpdateItem,
    onEditImage,
    readOnly,
}) => {
    // Single image layout uses only the first item in the array
    const item = content && content.length > 0 ? content[0] : null;

    if (!item) {
        return (
            <div className="w-full h-full min-h-[25cqw] flex items-center justify-center theme-bg-alt rounded-[1cqw] border theme-border-card border-dashed">
                <span className="text-[1.5cqw] theme-text-muted opacity-50">Empty Single Image Layout</span>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatedItem
                index={0}
                className="w-full !h-full flex-1 flex flex-col group/item relative rounded-[1cqw] overflow-hidden border-0 !p-0"
            >
                <div className="w-full h-full flex-1 relative overflow-hidden">
                    <ItemImage
                        imageUrl={item.image}
                        imagePrompt={item.imageDescription}
                        imageLoading={item.imageLoading}
                        onEditImage={!readOnly && onEditImage ? () => onEditImage({ type: "item", itemIndex: 0, currentQuery: item.imageDescription || item.header }) : undefined}
                        readOnly={readOnly}
                        focusPoint={item.imageFocus}
                        onUpdateFocus={(val) => onUpdateItem && onUpdateItem(0, "imageFocus", val)}
                        objectFit={item.imageFit || "cover"}
                        onToggleFit={!readOnly && onUpdateItem ? (val) => onUpdateItem(0, "imageFit", val) : undefined}
                    />
                </div>
            </AnimatedItem>
        </div>
    );
};

export default ImagesSingle;
