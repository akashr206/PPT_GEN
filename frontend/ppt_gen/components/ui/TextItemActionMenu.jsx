import React, { useState } from "react";
import {
    Trash2,
    MoreHorizontal,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { FontSizeControl } from "@/components/ui/FontSizeControl";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ALIGNMENTS = [
    { value: "left", icon: AlignLeft, label: "Left Align" },
    { value: "center", icon: AlignCenter, label: "Center Align" },
    { value: "right", icon: AlignRight, label: "Right Align" },
    { value: "justify", icon: AlignJustify, label: "Justify" },
];

export function TextItemActionMenu({
    onAddBefore,
    onAddAfter,
    onDelete,
    onUpdateItem,
    align,
    headerSize,
    descSize,
    hasHeader = false,
    hasDesc = false,
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <TooltipProvider>
            <div
                className={`absolute right-0 z-20 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"}`}
            >
                <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="p-1 sm:p-1.5 rounded-xs theme-menu-button cursor-pointer flex items-center justify-center"
                        >
                            <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent
                        side="top"
                        align="end"
                        sideOffset={6}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="flex items-center w-max gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-md bg-background/95 border border-border/50 shadow-md backdrop-blur-sm pointer-events-auto origin-right z-50"
                    >
                        {/* ALIGNMENT */}
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            {ALIGNMENTS.map(({ value, icon: Icon, label }) => (
                                <Tooltip key={value}>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUpdateItem("align", value);
                                            }}
                                            className={`p-1 sm:p-1.5 rounded transition-colors cursor-pointer
                            ${
                                align === value || (!align && value === "left")
                                    ? "bg-primary/15 text-primary"
                                    : "hover:bg-muted text-muted-foreground"
                            }`}
                                        >
                                            <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>{label}</TooltipContent>
                                </Tooltip>
                            ))}
                        </div>

                        {/* FONT SIZES */}
                        {(hasHeader || hasDesc) && (
                            <>
                                <div className="w-px h-4 sm:h-5 bg-border mx-0.5 sm:mx-1" />
                                <div className="flex items-center gap-1 sm:gap-2">
                                    {hasHeader && (
                                        <FontSizeControl
                                            label="Head:"
                                            valueCqw={headerSize || 2.2}
                                            onChangeCqw={(v) =>
                                                onUpdateItem(
                                                    "headerFontSize",
                                                    v,
                                                )
                                            }
                                            min={1}
                                            max={8}
                                        />
                                    )}
                                    {hasDesc && (
                                        <FontSizeControl
                                            valueCqw={descSize || 1.5}
                                            onChangeCqw={(v) =>
                                                onUpdateItem(
                                                    "descriptionFontSize",
                                                    v,
                                                )
                                            }
                                            min={0.5}
                                            max={5}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {/* ACTIONS */}
                        {(onAddBefore || onAddAfter || onDelete) && (
                            <>
                                <div className="w-px h-4 sm:h-5 bg-border mx-0.5 sm:mx-1" />
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                    {onAddBefore && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onAddBefore();
                                                    }}
                                                    className="flex items-center gap-0.5 p-1 sm:p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer"
                                                >
                                                    <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Add Item Before
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                    {onAddAfter && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onAddAfter();
                                                    }}
                                                    className="flex items-center gap-0.5 p-1 sm:p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer"
                                                >
                                                    <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Add Item After
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                    {onDelete && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete();
                                                        setMenuOpen(false);
                                                    }}
                                                    className="p-1 sm:p-1.5 hover:bg-destructive/20 text-destructive rounded transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Delete Item
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </TooltipProvider>
    );
}
