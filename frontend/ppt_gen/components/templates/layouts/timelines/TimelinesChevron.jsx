import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import AnimatedItem from "../../AnimatedItem";

const TimelinesChevron = ({ content, onUpdateItem, onDeleteItem, onAddItem, readOnly }) => {
    const items = content || [];
    const itemCount = items.length;
    // Overlap should be exactly 15% of each item's width.
    // In terms of parent container width, this is 15 / itemCount.
    const overlapPercent = itemCount > 0 ? (15 / itemCount) : 0;

    return (
        <div className="w-full relative flex flex-col justify-center min-h-[25cqw]">
            {items.length === 0 && !readOnly && onAddItem && (
                <button
                    onClick={() => onAddItem(0, "before")}
                    className="flex items-center justify-center gap-[0.5cqw] w-full py-[2cqw] text-[1.2cqw] text-muted-foreground/50 hover:text-primary hover:bg-primary/5 rounded-[1cqw] border border-dashed border-border/40 hover:border-primary/30 transition-all cursor-pointer"
                >
                    <Plus className="w-[1.5cqw] h-[1.5cqw]" />
                    Add First Timeline Node
                </button>
            )}

            <div className="w-full flex flex-row items-stretch justify-center relative z-10">
                {items.map((item, i) => {
                    const isEven = i % 2 === 0;
                    const isFirst = i === 0;

                    return (
                        <AnimatedItem
                            key={i}
                            index={i}
                            className="group/item relative flex-1 flex flex-col items-center min-w-0"
                            style={!isFirst ? { marginLeft: `-${overlapPercent}%` } : undefined}
                        >
                            {/* Actions menu */}
                            {!readOnly && (onAddItem || onDeleteItem) && (
                                <div className="absolute top-[0.25cqw] right-[0.25cqw] opacity-0 group-hover/item:opacity-100 data-[menu-open=true]:opacity-100 transition-opacity z-20">
                                    <ItemActionsMenu
                                        onAddBefore={onAddItem ? () => onAddItem(i, "before") : undefined}
                                        onAddAfter={onAddItem ? () => onAddItem(i, "after") : undefined}
                                        onDelete={onDeleteItem ? () => onDeleteItem(i) : undefined}
                                    />
                                </div>
                            )}

                            {/* Top part: Odd items description + line */}
                            <div className="h-[12.5cqw] w-full flex flex-col justify-end items-center pb-[0.5cqw] min-w-0 shrink">
                                {!isEven ? (
                                    <>
                                        <div className="px-[1.5cqw] text-center w-full min-w-0">
                                            <EditableElement
                                                as="p"
                                                className="text-[1.2cqw] leading-relaxed theme-text-muted w-full"
                                                value={item.description}
                                                onChange={(val) => onUpdateItem(i, "description", val)}
                                                readOnly={readOnly}
                                                placeholder="Milestone description"
                                            />
                                        </div>
                                        <div className="flex flex-col items-center mt-[0.5cqw] shrink-0">
                                            <svg className="w-[0.2cqw] h-[3cqw] overflow-visible" style={{ color: "var(--theme-primary)", opacity: 0.4 }} stroke="currentColor" strokeWidth="2" strokeDasharray="3,3">
                                                <line x1="0" y1="0" x2="0" y2="100%" />
                                            </svg>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full" />
                                )}
                            </div>

                            {/* Middle part: Chevron SVG shape and Title Text */}
                            <div className="relative h-[5cqw] w-full flex items-center justify-center min-w-0 select-none">
                                {/* SVG Chevron Background */}
                                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                                    <path
                                        d={isFirst 
                                            ? "M 0 0 L 85 0 L 100 20 L 85 40 L 0 40 Z" 
                                            : "M 0 0 L 85 0 L 100 20 L 85 40 L 0 40 L 15 20 Z"
                                        }
                                        fill={isEven ? "var(--theme-primary)" : "var(--theme-secondary)"}
                                        className="transition-colors duration-300"
                                    />
                                </svg>
                                
                                {/* Centered Title Overlay */}
                                <div 
                                    className={`relative w-full text-center min-w-0 select-text z-10 ${isFirst ? "pr-[4%]" : "pl-[16%] pr-[4%]"}`}
                                    style={{ color: isEven ? "var(--theme-bg)" : "var(--theme-fg)" }}
                                >
                                    <EditableElement
                                        as="h3"
                                        className="font-bold text-[1.4cqw] leading-tight text-center px-[0.5cqw] w-full border-none outline-none select-text"
                                        value={item.header}
                                        onChange={(val) => onUpdateItem(i, "header", val)}
                                        readOnly={readOnly}
                                        placeholder="Stage Title"
                                    />
                                </div>
                            </div>

                            {/* Bottom part: Even items line + description */}
                            <div className="h-[12.5cqw] w-full flex flex-col justify-start items-center pt-[0.5cqw] min-w-0 shrink">
                                {isEven ? (
                                    <>
                                        <div className="flex flex-col items-center mb-[0.5cqw] shrink-0">
                                            <svg className="w-[0.2cqw] h-[3cqw] overflow-visible" style={{ color: "var(--theme-primary)", opacity: 0.4 }} stroke="currentColor" strokeWidth="2" strokeDasharray="3,3">
                                                <line x1="0" y1="0" x2="0" y2="100%" />
                                            </svg>
                                        </div>
                                        <div className="px-[1.5cqw] text-center w-full min-w-0">
                                            <EditableElement
                                                as="p"
                                                className="text-[1.2cqw] leading-relaxed theme-text-muted w-full"
                                                value={item.description}
                                                onChange={(val) => onUpdateItem(i, "description", val)}
                                                readOnly={readOnly}
                                                placeholder="Milestone description"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full" />
                                )}
                            </div>
                        </AnimatedItem>
                    );
                })}
            </div>
        </div>
    );
};

export default TimelinesChevron;
