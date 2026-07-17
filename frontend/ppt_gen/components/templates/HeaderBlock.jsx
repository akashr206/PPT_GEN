import React, { useState, useRef, useEffect } from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import {
    Trash2,
    AlignLeft,
    AlignCenter,
    AlignRight,
    MoreHorizontal,
} from "lucide-react";

const ALIGNMENTS = [
    { value: "left", icon: AlignLeft, label: "Left" },
    { value: "center", icon: AlignCenter, label: "Center" },
    { value: "right", icon: AlignRight, label: "Right" },
];

const HeaderBlock = ({ block, onUpdateBlock, onDeleteBlock, readOnly }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
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
        <div
            className={`relative flex flex-col gap-[0.5cqw] w-full shrink-0 group/block transition-all ${itemsAlign} ${alignClass} ${menuOpen ? "outline outline-1 outline-gray-400/80" : ""} ${!readOnly ? "hover:outline hover:outline-1 hover:outline-gray-400/80" : ""}`}
        >
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

            {/* 3-dots menu — shown on hover when not readOnly */}
            {!readOnly && (
                <div
                    ref={menuRef}
                    className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
                >
                    {/* Trigger button */}
                    <button
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setMenuOpen((v) => !v);
                        }}
                        className={`flex items-center justify-center p-[0.3cqw] rounded-xs bg-background/80 border border-border/50 shadow-sm backdrop-blur-sm transition-opacity cursor-pointer
                            ${menuOpen ? "opacity-100" : "opacity-0 group-hover/block:opacity-100"}`}
                        title="Block options"
                    >
                        <MoreHorizontal className="w-[1.4cqw] h-[1.4cqw] text-foreground" />
                    </button>

                    {/* Dropdown panel */}
                    {menuOpen && (
                        <div
                            className="absolute right-0 top-[calc(100%+0.3cqw)] min-w-[10cqw] bg-background border border-border rounded-[0.6cqw] shadow-xl overflow-hidden z-30 flex items-center"
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            {/* Alignment section */}
                            <div className="px-[0.5cqw] pt-[0.3cqw] pb-[0.3cqw]">
                                <div className="flex gap-[0.4cqw]">
                                    {ALIGNMENTS.map(
                                        ({ value, icon: Icon, label }) => (
                                            <button
                                                key={value}
                                                onClick={() => {
                                                    onUpdateBlock?.(
                                                        "align",
                                                        value,
                                                    );
                                                    setMenuOpen(false);
                                                }}
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

                            {onDeleteBlock && (
                                <>
                                <div className="w-[0.2cqw] h-[2cqw] bg-accent"></div>
                                    <div className="px-[0.5cqw] py-[0.3cqw]">
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onDeleteBlock();
                                            }}
                                            className="flex items-center gap-[0.6cqw] w-full text-[1.1cqw] text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer p-[0.5cqw] rounded-sm"
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
