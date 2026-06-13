import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const AgendaSplit = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;

    // Adjust layout density based on item count to avoid overflows
    let headerSize = "text-[1.7em]";
    let descSize = "text-[1.2em]";
    let gapClass = "gap-[2em]";
    let paddingClass = "py-[0.5em]";
    let indexSize = "text-[2.2em]";
    let dotSize = "w-[0.6em] h-[0.6em]";

    if (n >= 10) {
        headerSize = "text-[1.0em]";
        descSize = "text-[0.8em]";
        gapClass = "gap-[0.4em]";
        paddingClass = "py-[0.1em]";
        indexSize = "text-[1.4em]";
        dotSize = "w-[0.4em] h-[0.4em]";
    } else if (n >= 8) {
        headerSize = "text-[1.15em]";
        descSize = "text-[0.9em]";
        gapClass = "gap-[0.6em]";
        paddingClass = "py-[0.25em]";
        indexSize = "text-[1.7em]";
        dotSize = "w-[0.5em] h-[0.5em]";
    } else if (n >= 6) {
        headerSize = "text-[1.3em]";
        descSize = "text-[1.0em]";
        gapClass = "gap-[1em]";
        paddingClass = "py-[0.4em]";
        indexSize = "text-[2.0em]";
        dotSize = "w-[0.6em] h-[0.6em]";
    } else if (n >= 5) {
        headerSize = "text-[1.5em]";
        descSize = "text-[1.1em]";
        gapClass = "gap-[1.5em]";
        paddingClass = "py-[0.45em]";
        indexSize = "text-[2.1em]";
        dotSize = "w-[0.6em] h-[0.6em]";
    }

    return (
        <div className="flex w-full items-stretch justify-between h-full min-h-[30em] gap-[3.5em] max-w-[95cqw] mx-auto py-[1em]">
            {/* Left Accent Panel */}
            <div 
                className="w-[30%] rounded-[1.2em] p-[3em] flex flex-col justify-between relative overflow-hidden shadow-lg border"
                style={{ 
                    backgroundColor: "var(--theme-secondary)",
                    borderColor: "var(--theme-card-border)"
                }}
            >
                {/* Decorative SVG pattern in the background of left panel */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none select-none">
                    <svg width="100%" height="100%">
                        <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                            <rect width="20" height="20" fill="none" />
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--theme-fg)" strokeWidth="1" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div 
                            className="w-[3em] h-[0.3em] rounded-full mb-[2em]" 
                            style={{ backgroundColor: "var(--theme-primary)" }}
                        />
                        <h2 
                            className="text-[3em] font-extrabold uppercase tracking-widest leading-none theme-heading"
                        >
                            Agenda
                        </h2>
                        <p className="text-[1.2em] theme-text-muted mt-[0.5em]">
                            Presentation Outline & Key Chapters
                        </p>
                    </div>

                    <div className="text-[1.0em] theme-text-muted mt-auto">
                        <span className="font-bold text-foreground">{n}</span> {n === 1 ? "Section" : "Sections"} total
                    </div>
                </div>
            </div>

            {/* Right List of Topics */}
            <div className={`w-[66%] flex flex-col justify-center ${gapClass}`}>
                {content.map((ele, i) => (
                    <div 
                        key={i}
                        className={`flex items-start gap-[2em] relative group/item ${paddingClass}`}
                    >
                        {/* Number Index */}
                        <div 
                            className={`${indexSize} font-black leading-none shrink-0`}
                            style={{ color: "var(--theme-primary)" }}
                        >
                            {String(i + 1).padStart(2, "0")}
                        </div>

                        {/* Divider Dot / Line */}
                        <div className="flex flex-col items-center self-stretch py-[0.3em] shrink-0">
                            <div 
                                className={`${dotSize} rounded-full`} 
                                style={{ backgroundColor: "var(--theme-primary)" }}
                            />
                            {i < n - 1 && (
                                <div 
                                    className="w-[0.1em] grow my-[0.5em]" 
                                    style={{ backgroundColor: "var(--theme-card-border)" }}
                                />
                            )}
                        </div>

                        {/* Title and Description */}
                        <div className="flex flex-col grow pr-[3em]">
                            <EditableElement
                                as="h3"
                                className={`font-bold theme-heading ${headerSize} leading-tight mb-[0.2em]`}
                                value={ele.header}
                                onChange={(val) => onUpdateItem?.(i, "header", val)}
                                readOnly={!onUpdateItem}
                                placeholder="Topic Header"
                            />
                            <EditableElement
                                as="p"
                                className={`${descSize} theme-text-muted leading-relaxed text-balance`}
                                value={ele.description}
                                onChange={(val) => onUpdateItem?.(i, "description", val)}
                                readOnly={!onUpdateItem}
                                placeholder="Details..."
                            />
                        </div>

                        {/* Actions Menu */}
                        {onDeleteItem && (
                            <div className="absolute -top-[1em] right-[1em] opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                                <ItemActionsMenu
                                    onAddBefore={() => onAddItem?.(i, "before")}
                                    onAddAfter={() => onAddItem?.(i, "after")}
                                    onDelete={() => onDeleteItem(i)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgendaSplit;
