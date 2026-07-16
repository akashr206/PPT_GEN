import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Trash2 } from "lucide-react";

const HeaderBlock = ({
    block,
    onUpdateBlock,
    onDeleteBlock,
    readOnly
}) => {
    // block align: "left" | "center" | "right"
    let alignClass = "text-left";
    let itemsAlign = "items-start";
    if (block.align === "center") {
        alignClass = "text-center mx-auto";
        itemsAlign = "items-center";
    } else if (block.align === "right") {
        alignClass = "text-right ml-auto";
        itemsAlign = "items-end";
    }

    return (
        <div className={`relative flex flex-col gap-[0.5cqw] w-full shrink-0 group/block transition-all ${itemsAlign} ${alignClass} ${!readOnly ? "hover:outline hover:outline-1 hover:outline-gray-400/80" : ""}`}>
            <EditableElement
                as="h1"
                className="theme-font-heading font-bold leading-tight text-[3.2cqw] w-full text-wrap"
                value={block.title}
                onChange={(val) => onUpdateBlock?.("title", val)}
                readOnly={readOnly}
                placeholder="Slide Title"
            />
            <EditableElement
                as="p"
                className="text-[2cqw] text-muted-foreground leading-normal"
                value={block.subtitle || ""}
                onChange={(val) => onUpdateBlock?.("subtitle", val)}
                readOnly={readOnly}
                placeholder="Add subtitle..."
            />
            
            {!readOnly && onDeleteBlock && (
                <div className="absolute -top-[1cqw] -right-[1cqw] opacity-0 group-hover/block:opacity-100 transition-opacity z-10">
                    <button
                        onClick={onDeleteBlock}
                        className="p-[0.5cqw] bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 backdrop-blur-sm"
                        title="Delete Header Block"
                    >
                        <Trash2 className="w-[1.2cqw] h-[1.2cqw]" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default HeaderBlock;
