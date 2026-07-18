import React, { useState, useRef, useEffect } from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { FontSizeControl } from "@/components/ui/FontSizeControl";
import {
    Trash2,
    AlignLeft,
    AlignCenter,
    AlignRight,
    MoreHorizontal,
    Type,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ALIGNMENTS = [
    { value: "left", icon: AlignLeft, label: "Left" },
    { value: "center", icon: AlignCenter, label: "Center" },
    { value: "right", icon: AlignRight, label: "Right" },
];

const HeaderBlock = ({ block, onUpdateBlock, onDeleteBlock, readOnly }) => {
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

    let alignClass = "text-left";
    let itemsAlign = "items-start";
    if (block.align === "center") {
        alignClass = "text-center mx-auto";
        itemsAlign = "items-center";
    } else if (block.align === "right") {
        alignClass = "text-right ml-auto";
        itemsAlign = "items-end";
    }

    const titleSize = block.titleFontSize || 2.8;
    const subSize = block.subtitleFontSize || 2.0;

    return (
        <div
            className={`relative flex flex-col w-full shrink-0 group/block transition-all ${itemsAlign} ${alignClass} ${menuOpen ? "outline outline-1 outline-gray-400/80" : ""} ${!readOnly ? "hover:outline hover:outline-1 hover:outline-gray-400/80" : ""}`}
        >
            <EditableElement
                as="h1"
                className="theme-heading font-bold leading-tight w-full text-wrap"
                style={{ fontSize: `${titleSize}cqw` }}
                value={block.title}
                onChange={(val) => onUpdateBlock?.("title", val)}
                readOnly={readOnly}
                placeholder="Slide Title"
            />
            {block.subtitle !== undefined && (
                <EditableElement
                    as="p"
                    className="theme-text-muted leading-normal"
                    style={{ fontSize: `${subSize}cqw` }}
                    value={block.subtitle || ""}
                    onChange={(val) => onUpdateBlock?.("subtitle", val)}
                    readOnly={readOnly}
                    placeholder="Add subtitle..."
                />
            )}

            {!readOnly && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <button
                                className={`flex items-center justify-center p-1 sm:p-1.5 rounded-xs theme-menu-button transition-opacity cursor-pointer
                                    ${menuOpen ? "opacity-100" : "opacity-0 group-hover/block:opacity-100"}`}
                                title="Block options"
                            >
                                <MoreHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            side="top"
                            align="center"
                            sideOffset={6}
                            className="bg-background border border-border rounded-md shadow-xl overflow-visible z-30 flex items-center p-0 min-w-max"
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <div className="px-1 sm:px-1.5 py-1">
                                <div className="flex gap-1 sm:gap-1.5">
                                    {ALIGNMENTS.map(
                                        ({ value, icon: Icon, label }) => (
                                            <button
                                                key={value}
                                                onClick={() =>
                                                    onUpdateBlock?.(
                                                        "align",
                                                        value,
                                                    )
                                                }
                                                title={label}
                                                className={`flex-1 flex items-center justify-center p-1 sm:p-1.5 rounded transition-colors cursor-pointer
                                                ${
                                                    block.align === value ||
                                                    (!block.align &&
                                                        value === "left")
                                                        ? "bg-primary/15 text-primary"
                                                        : "hover:bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="w-px h-5 sm:h-6 bg-border mx-0.5 sm:mx-1"></div>

                            <div className="flex flex-col px-1 sm:px-1.5 py-0.5 sm:py-1 gap-1">
                                <FontSizeControl
                                    label="Title:"
                                    valueCqw={titleSize}
                                    onChangeCqw={(v) =>
                                        onUpdateBlock?.("titleFontSize", v)
                                    }
                                    min={1}
                                    max={8}
                                />
                                {block.subtitle !== undefined && (
                                    <FontSizeControl
                                        label="Sub:"
                                        valueCqw={subSize}
                                        onChangeCqw={(v) =>
                                            onUpdateBlock?.(
                                                "subtitleFontSize",
                                                v,
                                            )
                                        }
                                        min={0.5}
                                        max={5}
                                    />
                                )}
                            </div>

                            <div className="w-px h-5 sm:h-6 bg-border mx-0.5 sm:mx-1"></div>
                            <div className="px-1 sm:px-1.5 py-1">
                                <button
                                    onClick={() =>
                                        onUpdateBlock?.(
                                            "subtitle",
                                            block.subtitle !== undefined
                                                ? undefined
                                                : "New Subtitle",
                                        )
                                    }
                                    className="flex items-center justify-center gap-1 w-full hover:bg-muted transition-colors cursor-pointer p-1 sm:p-1.5 rounded text-foreground"
                                    title={
                                        block.subtitle !== undefined
                                            ? "Remove Subtitle"
                                            : "Add Subtitle"
                                    }
                                >
                                    <Type className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                </button>
                            </div>

                            {onDeleteBlock && (
                                <>
                                    <div className="w-px h-5 sm:h-6 bg-border mx-0.5 sm:mx-1"></div>
                                    <div className="px-1 sm:px-1.5 py-1">
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onDeleteBlock();
                                            }}
                                            className="flex items-center gap-1 w-full text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer p-1 sm:p-1.5 rounded"
                                            title="Delete Header"
                                        >
                                            <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
};

export default HeaderBlock;
