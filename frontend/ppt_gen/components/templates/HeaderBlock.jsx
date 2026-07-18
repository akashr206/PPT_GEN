import React, { useState, useRef, useEffect } from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { FontSizeControl } from "@/components/ui/FontSizeControl";
import {
    Trash2,
    AlignLeft,
    AlignCenter,
    AlignRight,
    MoreHorizontal,
    Type
} from "lucide-react";

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
                <div
                    ref={menuRef}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
                >
                    <button
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setMenuOpen((v) => !v);
                        }}
                        className={`flex items-center justify-center p-[0.3cqw] rounded-xs theme-menu-button transition-opacity cursor-pointer
                            ${menuOpen ? "opacity-100" : "opacity-0 group-hover/block:opacity-100"}`}
                        title="Block options"
                    >
                        <MoreHorizontal className="w-[1.4cqw] h-[1.4cqw]" />
                    </button>

                    {menuOpen && (
                        <div
                            className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+0.3cqw)] bg-background border border-border rounded-[0.6cqw] shadow-xl overflow-hidden z-30 flex items-center"
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <div className="px-[0.5cqw] pt-[0.3cqw] pb-[0.3cqw]">
                                <div className="flex gap-[0.4cqw]">
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
                                                className={`flex-1 flex items-center justify-center p-[0.5cqw] rounded-[0.4cqw] transition-colors cursor-pointer
                                                ${
                                                    block.align === value ||
                                                    (!block.align &&
                                                        value === "left")
                                                        ? "bg-primary/15 text-primary"
                                                        : "hover:bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                <Icon className="w-[1.3cqw] h-[1.3cqw]" />
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="w-[0.1cqw] h-[2cqw] bg-border mx-[0.2cqw]"></div>

                            <div className="flex flex-col px-[0.5cqw] py-[0.2cqw] gap-[0.2cqw]">
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

                            <div className="w-[0.1cqw] h-[2cqw] bg-border mx-[0.2cqw]"></div>
                            <div className="px-[0.5cqw] py-[0.3cqw]">
                                <button
                                    onClick={() =>
                                        onUpdateBlock?.(
                                            "subtitle",
                                            block.subtitle !== undefined
                                                ? undefined
                                                : "New Subtitle",
                                        )
                                    }
                                    className="flex items-center justify-center gap-[0.6cqw] w-full text-[1.1cqw] hover:bg-muted transition-colors cursor-pointer p-[0.5cqw] rounded-[0.4cqw] text-foreground"
                                    title={
                                        block.subtitle !== undefined
                                            ? "Remove Subtitle"
                                            : "Add Subtitle"
                                    }
                                >
                                    <Type className="w-[1.3cqw] h-[1.3cqw]" />
                                </button>
                            </div>

                            {onDeleteBlock && (
                                <>
                                    <div className="w-[0.1cqw] h-[2cqw] bg-border mx-[0.2cqw]"></div>
                                    <div className="px-[0.5cqw] py-[0.3cqw]">
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onDeleteBlock();
                                            }}
                                            className="flex items-center gap-[0.6cqw] w-full text-[1.1cqw] text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer p-[0.5cqw] rounded-[0.4cqw]"
                                            title="Delete Header"
                                        >
                                            <Trash2 className="w-[1.3cqw] h-[1.3cqw]" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HeaderBlock;
