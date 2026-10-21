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
    Columns,
    Copy,
    ClipboardPaste,
} from "lucide-react";

import metadata from "./metadata.json";

const VERTICAL_ALIGNMENTS = [
    { value: "top", icon: AlignVerticalJustifyStart, label: "Align Top" },
    {
        value: "center",
        icon: AlignVerticalJustifyCenter,
        label: "Align Center",
    },
    { value: "bottom", icon: AlignVerticalJustifyEnd, label: "Align Bottom" },
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
import "./themes.css";

function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const ContentBlock = ({
    block,
    blockId,
    onUpdateBlock,
    onReplaceBlock,
    onDeleteBlock,
    onSplitBlock,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    theme,
    onEditImage,
    readOnly,
    textSizes,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showColsDropdown, setShowColsDropdown] = useState(false);

    let alignClass = "items-start";
    if (block.align === "center") alignClass = "items-center";
    if (block.align === "right") alignClass = "items-end";

    let justifyClass = "justify-center";
    if (block.verticalAlign === "top") justifyClass = "justify-start";
    else if (block.verticalAlign === "bottom") justifyClass = "justify-end";
    block.name =
        capitalizeFirstLetter(block?.layout?.category) +
        " " +
        capitalizeFirstLetter(block?.layout?.type || "Layout");
    const handleLayoutSelect = (cat, type) => {
        if (onUpdateBlock) {
            onUpdateBlock(blockId, "layout", { category: cat, type });
        }
    };

    const handleOpenLayoutPicker = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
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
            }),
        );
    };
    React.useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (
                e.target.tagName === "INPUT" ||
                e.target.tagName === "TEXTAREA" ||
                e.target.isContentEditable
            )
                return;
            if ((e.ctrlKey || e.metaKey) && e.key === "c") {
                e.preventDefault();
                localStorage.setItem("ppt_copied_block", JSON.stringify(block));
                // Optional: dispatch a toast event or call a toast directly if imported
                window.dispatchEvent(
                    new CustomEvent("sonner-toast", {
                        detail: { type: "success", message: "Block copied!" },
                    }),
                );
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "v") {
                const copiedData = localStorage.getItem("ppt_copied_block");
                if (copiedData) {
                    try {
                        const parsedBlock = JSON.parse(copiedData);

                        // Check if block is considered empty
                        const isDefaultItem =
                            block.items?.length === 1 &&
                            block.items[0]?.header === "New Point";
                        const isEmpty =
                            !block.layout ||
                            isDefaultItem ||
                            block.items?.length === 0;

                        if (isEmpty) {
                            e.preventDefault();
                            if (onReplaceBlock) {
                                onReplaceBlock(blockId, parsedBlock);
                                window.dispatchEvent(
                                    new CustomEvent("sonner-toast", {
                                        detail: {
                                            type: "success",
                                            message: "Block pasted!",
                                        },
                                    }),
                                );
                                setIsOpen(false);
                            }
                        } else {
                            e.preventDefault();
                            if (onSplitBlock) {
                                onSplitBlock(blockId, "horizontal", parsedBlock);
                                window.dispatchEvent(
                                    new CustomEvent("sonner-toast", {
                                        detail: {
                                            type: "success",
                                            message: "Block pasted alongside existing content!",
                                        },
                                    }),
                                );
                                setIsOpen(false);
                            }
                        }
                    } catch (error) {
                        console.error(
                            "Failed to parse copied block data",
                            error,
                        );
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, block]);

    const handleCopyBlock = (e) => {
        e.stopPropagation();
        localStorage.setItem("ppt_copied_block", JSON.stringify(block));
        setIsOpen(false);
        import("sonner").then(({ toast }) => toast.success("Block copied!"));
    };

    return (
        <div
            onClick={(e) => {
                // Do not trigger selection if clicking on an interactive element
                // console.log(e.target?.id);
                if (
                    e.target.closest(
                        'input, textarea, button, a, [contenteditable="true"]',
                    )
                ) {
                    return;
                }
                if (!readOnly && !isOpen) {
                    setIsOpen(true);
                }
            }}
            style={{ width: "100%", minHeight: "100%", height: "fit-content" }}
            className={`relative flex flex-col p-[1cqw] ${justifyClass} ${alignClass} group/block transition-colors ${
                !readOnly
                    ? isOpen
                        ? "outline-1 outline-(--theme-primary) bg-gray-500/5"
                        : "hover:outline hover:outline-gray-400/80 hover:bg-gray-500/5"
                    : ""
            }`}
        >
            <SlideLayout
                layoutCategory={block.layout?.category}
                layoutType={block.layout?.type}
                content={block.items || []}
                columns={block.columns}
                block={block}
                onUpdateBlock={
                    onUpdateBlock
                        ? (field, value) => onUpdateBlock(blockId, field, value)
                        : undefined
                }
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
                textSizes={textSizes}
            />

            {!readOnly && (
                <TooltipProvider>
                    <div
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 transition-opacity z-50 ${isOpen ? "opacity-100" : "opacity-0 group-hover/block:opacity-100"}`}
                    >
                        <DropdownMenu
                            open={isOpen}
                            onOpenChange={(open) => {
                                setIsOpen(open);
                                if (!open) setShowColsDropdown(false);
                            }}
                        >
                            <DropdownMenuTrigger asChild>
                                <button className="p-1 sm:p-1.5 rounded transition-colors cursor-pointer flex items-center justify-center theme-menu-button">
                                    <MoreHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="center"
                                side="top"
                                className="flex items-center w-max gap-px sm:gap-0.5 p-0.5 sm:p-1 rounded-md bg-card z-50 overflow-visible shadow-md border"
                                sideOffset={6}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={handleOpenLayoutPicker}
                                            className="p-1 sm:p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer flex items-center gap-1"
                                        >
                                            <LayoutTemplate className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            <span className="text-[10px] sm:text-xs text-muted-foreground max-sm:hidden">
                                                {block.name || "Layout"}
                                            </span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Change Layout:{" "}
                                        {block.layout?.type || "—"}
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={handleCopyBlock}
                                            className="p-1 sm:p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer flex items-center gap-1"
                                        >
                                            <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Copy Block</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const copiedData =
                                                    localStorage.getItem(
                                                        "ppt_copied_block",
                                                    );
                                                if (!copiedData) {
                                                    import("sonner").then(
                                                        ({ toast }) =>
                                                            toast.error(
                                                                "No block in clipboard!",
                                                            ),
                                                    );
                                                    return;
                                                }
                                                const isDefaultItem =
                                                    block.items?.length === 1 &&
                                                    block.items[0]?.header ===
                                                        "New Point";
                                                const isEmpty =
                                                    !block.layout ||
                                                    isDefaultItem ||
                                                    block.items?.length === 0;

                                                if (!isEmpty) {
                                                    try {
                                                        const parsedBlock = JSON.parse(copiedData);
                                                        if (onSplitBlock) {
                                                            onSplitBlock(blockId, "horizontal", parsedBlock);
                                                            import("sonner").then(({ toast }) => toast.success("Block pasted alongside existing content!"));
                                                            setIsOpen(false);
                                                        }
                                                    } catch (err) {
                                                        console.error("Paste error:", err);
                                                    }
                                                    return;
                                                }
                                                try {
                                                    const parsedBlock =
                                                        JSON.parse(copiedData);
                                                    if (onReplaceBlock) {
                                                        onReplaceBlock(
                                                            blockId,
                                                            parsedBlock,
                                                        );
                                                        import("sonner").then(
                                                            ({ toast }) =>
                                                                toast.success(
                                                                    "Block pasted!",
                                                                ),
                                                        );
                                                        setIsOpen(false);
                                                    }
                                                } catch (err) {
                                                    console.error(
                                                        "Paste error:",
                                                        err,
                                                    );
                                                }
                                            }}
                                            className="p-1 sm:p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer flex items-center gap-1"
                                        >
                                            <ClipboardPaste className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Paste Block</TooltipContent>
                                </Tooltip>

                                {onSplitBlock && (
                                    <>
                                        <div className="w-px h-4 sm:h-5 bg-border mx-0.5 sm:mx-1" />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        onSplitBlock(
                                                            blockId,
                                                            "left",
                                                        );
                                                    }}
                                                    className="p-1 sm:p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                                                >
                                                    <PanelLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Split Left
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        onSplitBlock(
                                                            blockId,
                                                            "right",
                                                        );
                                                    }}
                                                    className="p-1 sm:p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                                                >
                                                    <PanelRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Split Right
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        onSplitBlock(
                                                            blockId,
                                                            "top",
                                                        );
                                                    }}
                                                    className="p-1 sm:p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                                                >
                                                    <PanelTop className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Split Top
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        onSplitBlock(
                                                            blockId,
                                                            "bottom",
                                                        );
                                                    }}
                                                    className="p-1 sm:p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                                                >
                                                    <PanelBottom className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Split Bottom
                                            </TooltipContent>
                                        </Tooltip>
                                    </>
                                )}

                                <>
                                    <div className="w-px h-4 sm:h-5 bg-border mx-0.5 sm:mx-1" />
                                    {VERTICAL_ALIGNMENTS.map(
                                        ({ value, icon: Icon, label }) => (
                                            <Tooltip key={value}>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => {
                                                            if (onUpdateBlock) {
                                                                onUpdateBlock(
                                                                    blockId,
                                                                    "verticalAlign",
                                                                    value,
                                                                );
                                                            }
                                                        }}
                                                        className={`p-1 sm:p-1.5 rounded transition-colors cursor-pointer
                                                        ${
                                                            block.verticalAlign ===
                                                                value ||
                                                            (!block.verticalAlign &&
                                                                value === "top")
                                                                ? "bg-primary/15 text-primary"
                                                                : "hover:bg-muted text-muted-foreground"
                                                        }`}
                                                    >
                                                        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {label}
                                                </TooltipContent>
                                            </Tooltip>
                                        ),
                                    )}
                                </>

                                {(() => {
                                    const catMeta =
                                        metadata.layoutCategories[
                                            block.layout?.category
                                        ];
                                    const typeMeta = catMeta?.types?.find(
                                        (t) => t.id === block.layout?.type,
                                    );
                                    if (typeMeta?.supportsColumns) {
                                        return (
                                            <>
                                                <div className="w-px h-4 sm:h-5 bg-border mx-0.5 sm:mx-1" />
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setShowColsDropdown(
                                                                    !showColsDropdown,
                                                                );
                                                            }}
                                                            className="p-1 sm:p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors cursor-pointer relative"
                                                        >
                                                            <div className="flex items-center gap-1">
                                                                <Columns className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                                <span className="text-[10px] sm:text-xs leading-none">
                                                                    {block.columns ||
                                                                        2}
                                                                </span>
                                                            </div>
                                                            {/* Dropdown for Columns */}
                                                            <div
                                                                className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 sm:mt-2 ${showColsDropdown ? "flex" : "hidden"} flex-row gap-1 bg-card border shadow-lg rounded p-1 z-50`}
                                                            >
                                                                {[
                                                                    1, 2, 3, 4,
                                                                    5, 6,
                                                                ].map((col) => (
                                                                    <div
                                                                        key={
                                                                            col
                                                                        }
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            if (
                                                                                onUpdateBlock
                                                                            )
                                                                                onUpdateBlock(
                                                                                    blockId,
                                                                                    "columns",
                                                                                    col,
                                                                                );
                                                                            setShowColsDropdown(
                                                                                false,
                                                                            );
                                                                        }}
                                                                        className={`px-2 py-1 text-[10px] sm:text-xs text-center hover:bg-muted rounded cursor-pointer ${
                                                                            (block.columns ||
                                                                                2) ===
                                                                            col
                                                                                ? "bg-primary/10 text-primary"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        {col}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Columns:{" "}
                                                        {block.columns || 2}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </>
                                        );
                                    }
                                    return null;
                                })()}

                                {onDeleteBlock && (
                                    <>
                                        <div className="w-px h-4 sm:h-5 bg-border mx-0.5 sm:mx-1" />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        onDeleteBlock(blockId);
                                                    }}
                                                    className="p-1 sm:p-1.5 hover:bg-destructive/20 text-destructive rounded transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Delete Block
                                            </TooltipContent>
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
