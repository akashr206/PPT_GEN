import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import AnimatedItem from "../../AnimatedItem";

const TimelinesHorizontal = ({ content, onUpdateItem, onDeleteItem, onAddItem, readOnly }) => {
    const items = content || [];
    const halfItemWidthPercent = items.length > 0 ? (100 / (2 * items.length)) : 0;

    return (
        <div className="w-full relative flex flex-col justify-center min-h-[32cqw] py-[2cqw]">
            {/* Central horizontal timeline line */}
            {items.length > 0 && (
                <div 
                    className="absolute top-[50%] h-[0.2cqw] -translate-y-1/2 z-0"
                    style={{ 
                        left: `${halfItemWidthPercent}%`, 
                        right: `${halfItemWidthPercent}%`, 
                        pointerEvents: "none", 
                        backgroundColor: "var(--theme-primary)", 
                        opacity: 0.4 
                    }}
                />
            )}

            {items.length === 0 && !readOnly && onAddItem && (
                <button
                    onClick={() => onAddItem(0, "before")}
                    className="flex items-center justify-center gap-[0.5cqw] w-full py-[2cqw] text-[1.2cqw] text-muted-foreground/50 hover:text-primary hover:bg-primary/5 rounded-[1cqw] border border-dashed border-border/40 hover:border-primary/30 transition-all cursor-pointer"
                >
                    <Plus className="w-[1.5cqw] h-[1.5cqw]" />
                    Add First Timeline Node
                </button>
            )}

            <div className="w-full flex flex-row items-stretch justify-between relative z-10 gap-[1cqw]">
                {items.map((item, i) => {
                    const isEven = i % 2 === 0;

                    return (
                        <AnimatedItem
                            key={i}
                            index={i}
                            className="group/item relative flex-1 flex flex-col items-center h-[28cqw]"
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

                            {/* Even: Content on top */}
                            {isEven ? (
                                <div className="absolute top-0 left-0 right-0 h-[10.5cqw] flex flex-col justify-end items-center text-center min-w-0">
                                    <EditableElement
                                        as="h3"
                                        className="theme-font-heading font-bold text-[1.6cqw] leading-tight theme-text-primary px-[0.5cqw] w-full"
                                        value={item.header}
                                        onChange={(val) => onUpdateItem(i, "header", val)}
                                        readOnly={readOnly}
                                        placeholder="Milestone"
                                    />
                                    <EditableElement
                                        as="p"
                                        className="text-[1.2cqw] leading-relaxed theme-text-muted mt-[0.25cqw] px-[0.5cqw] w-full"
                                        value={item.description}
                                        onChange={(val) => onUpdateItem(i, "description", val)}
                                        readOnly={readOnly}
                                        placeholder="Description"
                                    />
                                </div>
                            ) : null}

                            {/* Vertical Connector Line */}
                            {isEven ? (
                                <div 
                                    className="w-[0.2cqw] h-[3.5cqw] absolute top-[50%] -translate-y-full z-0" 
                                    style={{ backgroundColor: "var(--theme-primary)", opacity: 0.4 }} 
                                />
                            ) : (
                                <div 
                                    className="w-[0.2cqw] h-[3.5cqw] absolute top-[50%] z-0" 
                                    style={{ backgroundColor: "var(--theme-primary)", opacity: 0.4 }} 
                                />
                            )}

                            {/* Dot Marker (Perfectly Centered) */}
                            <div 
                                className="w-[2.4cqw] h-[2.4cqw] rounded-full border-[0.3cqw] absolute top-[50%] -translate-y-1/2 z-10 bg-theme-bg" 
                                style={{ borderColor: "var(--theme-primary)", backgroundColor: "var(--theme-bg)" }} 
                            />

                            {/* Odd: Content on bottom */}
                            {!isEven ? (
                                <div className="absolute bottom-0 left-0 right-0 h-[10.5cqw] flex flex-col justify-start items-center text-center min-w-0">
                                    <EditableElement
                                        as="h3"
                                        className="theme-font-heading font-bold text-[1.6cqw] leading-tight theme-text-primary px-[0.5cqw] w-full"
                                        value={item.header}
                                        onChange={(val) => onUpdateItem(i, "header", val)}
                                        readOnly={readOnly}
                                        placeholder="Milestone"
                                    />
                                    <EditableElement
                                        as="p"
                                        className="text-[1.2cqw] leading-relaxed theme-text-muted mt-[0.25cqw] px-[0.5cqw] w-full"
                                        value={item.description}
                                        onChange={(val) => onUpdateItem(i, "description", val)}
                                        readOnly={readOnly}
                                        placeholder="Description"
                                    />
                                </div>
                            ) : null}
                        </AnimatedItem>
                    );
                })}
            </div>
        </div>
    );
};

export default TimelinesHorizontal;
