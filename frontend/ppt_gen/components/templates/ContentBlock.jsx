import React, { useState } from "react";
import SlideLayout from "./layouts/SlideLayout";
import { MoreHorizontal, LayoutTemplate, Trash2, Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { layout_map } from "./layouts/layout_map";

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

    // Build nested layout options based on layout_map
    const categories = Object.keys(layout_map || {});

    // For horizontal flex/width sizing
    const flexBasis = block.width === 100 ? "100%" : block.width ? `calc(${block.width}% - 0.5cqw)` : "100%";

    return (
        <div
            style={{ width: flexBasis }}
            className={`relative flex flex-col min-h-0 ${alignClass} group/block transition-colors p-[1cqw] ${
                !readOnly ? (isOpen ? "outline outline-1 outline-gray-400/80 bg-gray-500/5" : "hover:outline hover:outline-1 hover:outline-gray-400/80 hover:bg-gray-500/5") : ""
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
                <>
                    {/* Top Center 3-Dots Menu */}
                    <div className={`absolute -top-[1.5cqw] left-1/2 -translate-x-1/2 transition-opacity z-30 ${isOpen ? "opacity-100" : "opacity-0 group-hover/block:opacity-100"}`}>
                        <DropdownMenu onOpenChange={setIsOpen}>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="p-[0.3cqw] bg-background text-foreground border border-border rounded-md shadow-sm hover:bg-muted"
                                    title="Block Options"
                                >
                                    <MoreHorizontal className="w-[1.2cqw] h-[1.2cqw]" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-56 z-50">
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <LayoutTemplate className="mr-2 h-4 w-4" />
                                        <span>Change Layout</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-48 max-h-[60vh] overflow-y-auto">
                                        {categories.map((cat) => (
                                            <DropdownMenuSub key={cat}>
                                                <DropdownMenuSubTrigger className="capitalize">
                                                    {cat}
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuRadioGroup
                                                        value={
                                                            block.layout?.category === cat
                                                                ? block.layout?.type
                                                                : ""
                                                        }
                                                        onValueChange={(val) => {
                                                            if (onUpdateBlock) {
                                                                onUpdateBlock(blockIndex, "layout", {
                                                                    category: cat,
                                                                    type: val,
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        {Object.keys(layout_map[cat]).map((type) => (
                                                            <DropdownMenuRadioItem key={type} value={type} className="capitalize">
                                                                {type}
                                                            </DropdownMenuRadioItem>
                                                        ))}
                                                    </DropdownMenuRadioGroup>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuSub>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                    onClick={() => onDeleteBlock && onDeleteBlock(blockIndex)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete Block</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Bottom Center Add Item Button */}
                    {onAddItem && (
                        <div className="absolute -bottom-[1.5cqw] left-1/2 -translate-x-1/2 opacity-0 group-hover/block:opacity-100 transition-opacity z-20">
                            <button
                                onClick={() => onAddItem(blockIndex, (block.items || []).length - 1, "after")}
                                className="p-[0.5cqw] bg-primary/10 text-primary rounded-full hover:bg-primary/20 backdrop-blur-sm shadow-sm cursor-pointer"
                                title="Add Item"
                            >
                                <Plus className="w-[1.2cqw] h-[1.2cqw]" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ContentBlock;
