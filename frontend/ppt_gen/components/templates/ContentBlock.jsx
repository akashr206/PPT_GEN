import React, { useState } from "react";
import SlideLayout from "./layouts/SlideLayout";
import {
    MoreHorizontal,
    Trash2,
    LayoutTemplate,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ContentBlock = ({
    block,
    blockIndex,
    onUpdateBlock,
    onDeleteBlock,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    theme,
    onEditImage,
    readOnly,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    let alignClass = "items-start";
    if (block.align === "center") alignClass = "items-center";
    if (block.align === "right") alignClass = "items-end";

    const flexBasis =
        block.width === 100
            ? "100%"
            : block.width
              ? `calc(${block.width}% - 0.5cqw)`
              : "100%";

    const handleLayoutSelect = (cat, type) => {
        if (onUpdateBlock) {
            onUpdateBlock(blockIndex, "layout", { category: cat, type });
        }
    };

    const handleOpenLayoutPicker = () => {
        setIsOpen(false);
        window.dispatchEvent(
            new CustomEvent("trigger-open-block-layout-picker", {
                detail: {
                    blockIndex,
                    currentCategory: block.layout?.category,
                    currentType: block.layout?.type,
                    onSelect: handleLayoutSelect,
                },
            })
        );
    };

    return (
        <div
            style={{ width: flexBasis }}
            className={`relative flex flex-col h-fit ${alignClass} group/block transition-colors p-[1cqw] ${
                !readOnly
                    ? isOpen
                        ? "outline outline-1 outline-gray-400/80 bg-gray-500/5"
                        : "hover:outline hover:outline-1 hover:outline-gray-400/80 hover:bg-gray-500/5"
                    : ""
            }`}
        >
            <SlideLayout
                layoutCategory={block.layout?.category}
                layoutType={block.layout?.type}
                content={block.items || []}
                onUpdateItem={onUpdateItem ? (i, f, v) => onUpdateItem(blockIndex, i, f, v) : undefined}
                onDeleteItem={onDeleteItem ? (i) => onDeleteItem(blockIndex, i) : undefined}
                onAddItem={onAddItem ? (i, d) => onAddItem(blockIndex, i, d) : undefined}
                onEditImage={onEditImage}
                theme={theme}
                readOnly={readOnly}
            />

            {!readOnly && (
                <div className={`absolute left-1/2 -translate-x-1/2 transition-opacity z-30 ${isOpen ? "opacity-100" : "opacity-0 group-hover/block:opacity-100"}`}>
                    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="p-[0.3cqw] bg-background text-foreground border border-border rounded-xs shadow-sm hover:bg-muted cursor-pointer"
                                title="Block Options"
                            >
                                <MoreHorizontal className="w-[1.4cqw] h-[1.4cqw]" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="center" className="py-1 min-w-[160px] z-50 overflow-hidden" sideOffset={6}>
                            <button
                                onClick={handleOpenLayoutPicker}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer"
                            >
                                <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
                                Change Layout
                                <span className="ml-auto text-xs text-muted-foreground capitalize">
                                    {block.layout?.type || "—"}
                                </span>
                            </button>

                            <div className="h-px bg-border mx-2 my-1" />

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onDeleteBlock && onDeleteBlock(blockIndex);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Block
                            </button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
};

export default ContentBlock;
