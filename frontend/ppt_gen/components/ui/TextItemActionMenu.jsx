import React, { useState, useRef, useEffect } from "react";
import {
    Trash2,
    MoreHorizontal,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Plus,
    ArrowUp,
    ArrowDown
} from "lucide-react";
import { FontSizeControl } from "@/components/ui/FontSizeControl";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    return (
        <TooltipProvider>
            <div
                ref={menuRef}
                className={`absolute right-0 z-20 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"}`}
            >
                {!menuOpen ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(true);
                        }}
                        className="p-[0.3cqw] rounded-xs theme-menu-button cursor-pointer flex items-center justify-center"
                    >
                        <MoreHorizontal className="w-[1cqw] h-[1cqw] max-sm:w-3 max-sm:h-3" />
                    </button>
                ) : (
                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        className="flex items-center w-max gap-[0.5cqw] p-[0.3cqw] rounded-[0.4cqw] bg-background/95 border border-border/50 shadow-md backdrop-blur-sm pointer-events-auto origin-right"
                    >
                        {/* ALIGNMENT */}
                        <div className="flex items-center gap-[0.2cqw]">
                            {ALIGNMENTS.map(({ value, icon: Icon, label }) => (
                                <Tooltip key={value}>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUpdateItem("align", value);
                                            }}
                                            className={`p-[0.3cqw] rounded transition-colors cursor-pointer
                            ${
                                align === value || (!align && value === "left")
                                    ? "bg-primary/15 text-primary"
                                    : "hover:bg-muted text-muted-foreground"
                            }`}
                                        >
                                            <Icon className="w-[1.4cqw] h-[1.4cqw] max-sm:w-3 max-sm:h-3" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>{label}</TooltipContent>
                                </Tooltip>
                            ))}
                        </div>

                        {/* FONT SIZES */}
                        {(hasHeader || hasDesc) && (
                            <>
                                <div className="w-px h-[1.2cqw] bg-border mx-[0.1cqw]" />
                                <div className="flex items-center gap-[0.4cqw]">
                                    {hasHeader && (
                                        <FontSizeControl
                                            label="Head:"
                                            valueCqw={headerSize || 2.2}
                                            onChangeCqw={(v) =>
                                                onUpdateItem("headerFontSize", v)
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
                                <div className="w-px h-[1.2cqw] bg-border mx-[0.1cqw]" />
                                <div className="flex items-center gap-[0.2cqw]">
                                    {onAddBefore && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onAddBefore();
                                                    }}
                                                    className="flex items-center gap-[0.1cqw] p-[0.3cqw] text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer"
                                                >
                                                    <ArrowUp className="w-[1.2cqw] h-[1.2cqw] max-sm:w-3 max-sm:h-3" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Add Item Before</TooltipContent>
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
                                                    className="flex items-center gap-[0.1cqw] p-[0.3cqw] text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer"
                                                >
                                                    <ArrowDown className="w-[1.2cqw] h-[1.2cqw] max-sm:w-3 max-sm:h-3" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Add Item After</TooltipContent>
                                        </Tooltip>
                                    )}
                                    {onDelete && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete();
                                                    }}
                                                    className="p-[0.3cqw] hover:bg-destructive/20 text-destructive rounded transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-[1.2cqw] h-[1.2cqw] max-sm:w-3 max-sm:h-3" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Delete Item</TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
}
