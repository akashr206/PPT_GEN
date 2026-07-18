import React, { useState } from "react";
import SlideLayout from "./layouts/SlideLayout";
import {
    LayoutTemplate,
    PanelLeft,
    PanelRight,
    PanelTop,
    PanelBottom,
    MoreHorizontal,
    Trash2,
    AlignVerticalJustifyStart,
    AlignVerticalJustifyCenter,
    AlignVerticalJustifyEnd,
    Columns
} from "lucide-react";

import metadata from "./metadata.json";

const VERTICAL_ALIGNMENTS = [
    { value: "top", icon: AlignVerticalJustifyStart, label: "Align Top" },
    { value: "center", icon: AlignVerticalJustifyCenter, label: "Align Center" },
    { value: "bottom", icon: AlignVerticalJustifyEnd, label: "Align Bottom" }
];
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import "./themes.css"

const ContentBlock = ({
    block,
    blockId,
    onUpdateBlock,
    onDeleteBlock,
    onSplitBlock,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    theme,
    onEditImage,
    readOnly,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showColsDropdown, setShowColsDropdown] = useState(false);


    let alignClass = "items-start";
    if (block.align === "center") alignClass = "items-center";
    if (block.align === "right") alignClass = "items-end";

    let justifyClass = "justify-center";
    if (block.verticalAlign === "start") justifyClass = "justify-start";
    else if (block.verticalAlign === "bottom") justifyClass = "justify-end";

    // For BSP, we don't rely on block.width, it's flexBasis controlled by parent.
    // We just take full width/height of our container.
    const flexBasis = "100%";

    const handleLayoutSelect = (cat, type) => {
        if (onUpdateBlock) {
            onUpdateBlock(blockId, "layout", { category: cat, type });
        }
    };

    const handleOpenLayoutPicker = () => {
        setIsOpen(false);
        window.dispatchEvent(
            new CustomEvent("trigger-open-block-layout-picker", {
                detail: {
                    blockId,
                    currentCategory: block.layout?.category,
                    currentType: block.layout?.type,
                    blockData: block,
                    onSelect: handleLayoutSelect,
                },
            })
        );
    };



    return (
        <div
            style={{ width: "100%", minHeight: "100%", height: "fit-content" }}
            className={`relative flex flex-col ${justifyClass} ${alignClass} group/block transition-colors ${
                !readOnly
                    ? isOpen
                        ? "outline outline-gray-400/80 bg-gray-500/5"
                        : "hover:outline  hover:outline-gray-400/80 hover:bg-gray-500/5"
                    : ""
            }`}
        >
            <SlideLayout
                layoutCategory={block.layout?.category}
                layoutType={block.layout?.type}
                content={block.items || []}
                columns={block.columns}
                onUpdateItem={
                    onUpdateItem
                        ? (i, f, v) => onUpdateItem(blockId, i, f, v)
                        : undefined
                }
                onDeleteItem={
                    onDeleteItem ? (i) => onDeleteItem(blockId, i) : undefined
                }
                onAddItem={
                    onAddItem ? (i, d) => onAddItem(blockId, i, d) : undefined
                }
                onEditImage={
                    onEditImage
                        ? (ctx) => onEditImage({ ...ctx, blockId })
                        : undefined
                }
                theme={theme}
                readOnly={readOnly}
            />

            {!readOnly && (
                <TooltipProvider>
                    <div
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 transition-opacity z-50 ${isOpen ? "opacity-100" : "opacity-0 group-hover/block:opacity-100"}`}
                    >
                        <DropdownMenu open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setShowColsDropdown(false); }}>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="p-[0.2cqw] rounded-xs transition-colors cursor-pointer flex items-center justify-center theme-menu-button"
                                >
                                    <MoreHorizontal className="w-[1.2cqw] h-[1.2cqw] max-sm:w-4 max-sm:h-4" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="center"
                                className="flex items-center w-max gap-[0.3cqw] p-[0.2cqw] rounded-[4px] bg-card z-50 overflow-visible"
                                sideOffset={6}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={handleOpenLayoutPicker}
                                            className="p-[0.2cqw] hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer flex items-center gap-1"
                                        >
                                            <LayoutTemplate className="w-[1cqw] h-[1cqw] max-sm:w-4 max-sm:h-4" />
                                            <span className="text-[0.8cqw] text-muted-foreground max-sm:hidden">
                                                {block.layout?.type || "Layout"}
                                            </span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Change Layout: {block.layout?.type || "—"}</TooltipContent>
                                </Tooltip>

                                {onSplitBlock && (
                                    <>
                                        <div className="w-px h-[1.2cqw] bg-border mx-[0.1cqw]" />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        onSplitBlock(blockId, "left");
                                                    }}
                                                    className="p-[0.2cqw] hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                                                >
                                                    <PanelLeft className="w-[1cqw] h-[1cqw] max-sm:w-4 max-sm:h-4" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Split Left</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        onSplitBlock(blockId, "right");
                                                    }}
                                                    className="p-[0.2cqw] hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                                                >
                                                    <PanelRight className="w-[1cqw] h-[1cqw] max-sm:w-4 max-sm:h-4" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Split Right</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        onSplitBlock(blockId, "top");
                                                    }}
                                                    className="p-[0.2cqw] hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                                                >
                                                    <PanelTop className="w-[1cqw] h-[1cqw] max-sm:w-4 max-sm:h-4" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Split Top</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        onSplitBlock(blockId, "bottom");
                                                    }}
                                                    className="p-[0.2cqw] hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                                                >
                                                    <PanelBottom className="w-[1cqw] h-[1cqw] max-sm:w-4 max-sm:h-4" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Split Bottom</TooltipContent>
                                        </Tooltip>
                                    </>
                                )}

                                <>
                                    <div className="w-px h-[1.2cqw] bg-border mx-[0.1cqw]" />
                                    {VERTICAL_ALIGNMENTS.map(({ value, icon: Icon, label }) => (
                                        <Tooltip key={value}>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        if (onUpdateBlock) {
                                                            onUpdateBlock(blockId, "verticalAlign", value);
                                                        }
                                                    }}
                                                    className={`p-[0.2cqw] rounded transition-colors cursor-pointer
                                                        ${
                                                            (block.verticalAlign === value || (!block.verticalAlign && value === "top"))
                                                                ? "bg-primary/15 text-primary"
                                                                : "hover:bg-muted text-muted-foreground"
                                                        }`}
                                                >
                                                    <Icon className="w-[1cqw] h-[1cqw] max-sm:w-4 max-sm:h-4" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>{label}</TooltipContent>
                                        </Tooltip>
                                    ))}
                                </>

                                {(() => {
                                    const catMeta = metadata.layoutCategories[block.layout?.category];
                                    const typeMeta = catMeta?.types?.find(t => t.id === block.layout?.type);
                                    if (typeMeta?.supportsColumns) {
                                        return (
                                            <>
                                                <div className="w-px h-[1.2cqw] bg-border mx-[0.1cqw]" />
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setShowColsDropdown(!showColsDropdown);
                                                            }}
                                                            className="p-[0.2cqw] rounded hover:bg-muted text-muted-foreground transition-colors cursor-pointer relative"
                                                        >
                                                            <div className="flex items-center gap-[0.2cqw]">
                                                                <Columns className="w-[1cqw] h-[1cqw] max-sm:w-4 max-sm:h-4" />
                                                                <span className="text-[0.7cqw] leading-none">{block.columns || 2}</span>
                                                            </div>
                                                            {/* Dropdown for Columns */}
                                                            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-[0.5cqw] ${showColsDropdown ? "flex" : "hidden"} flex-row gap-1 bg-card border shadow-lg rounded p-1 z-50`}>
                                                                {[1, 2, 3, 4, 5, 6].map(col => (
                                                                    <div
                                                                        key={col}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            if (onUpdateBlock) onUpdateBlock(blockId, "columns", col);
                                                                            setShowColsDropdown(false);
                                                                        }}
                                                                        className={`px-2 py-1 text-[0.8cqw] text-center hover:bg-muted rounded cursor-pointer ${
                                                                            (block.columns || 2) === col ? "bg-primary/10 text-primary" : ""
                                                                        }`}
                                                                    >
                                                                        {col}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Columns: {block.columns || 2}</TooltipContent>
                                                </Tooltip>
                                            </>
                                        );
                                    }
                                    return null;
                                })()}

                                {onDeleteBlock && (
                                    <>
                                        <div className="w-px h-[1.2cqw] bg-border mx-[0.1cqw]" />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        onDeleteBlock(blockId);
                                                    }}
                                                    className="p-[0.2cqw] hover:bg-destructive/20 text-destructive rounded transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-[1cqw] h-[1cqw] max-sm:w-4 max-sm:h-4" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Delete Block</TooltipContent>
                                        </Tooltip>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </TooltipProvider>
            )}
        </div>
    );
};

export default ContentBlock;
