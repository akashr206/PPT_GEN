import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus } from "lucide-react";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import AnimatedItem from "../../AnimatedItem";

const TimelinesVertical = ({ content, onUpdateItem, onDeleteItem, onAddItem, readOnly }) => {
    const items = content || [];

    return (
        <div className="w-full relative flex flex-col items-center min-h-[30cqw]">
            {/* Central vertical timeline line */}
            {items.length > 0 && (
                <div 
                    className="absolute left-1/2 top-[4cqw] bottom-[4cqw] w-[0.2cqw] -translate-x-1/2 z-0"
                    style={{ pointerEvents: "none", backgroundColor: "var(--theme-primary)", opacity: 0.4 }}
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

            {items.map((item, i) => {
                const isEven = i % 2 === 0;

                return (
                    <AnimatedItem
                        key={i}
                        index={i}
                        className="group/item relative grid grid-cols-[1fr_12cqw_1fr] items-center w-full min-h-[8cqw] z-10"
                    >
                        {/* Even index: Content on the Left */}
                        {isEven ? (
                            <div className="flex flex-col items-end text-right pr-[2cqw] relative">
                                {!readOnly && (onAddItem || onDeleteItem) && (
                                    <div className="absolute top-[0.5cqw] left-[0.5cqw] opacity-0 group-hover/item:opacity-100 data-[menu-open=true]:opacity-100 transition-opacity z-20">
                                        <ItemActionsMenu
                                            onAddBefore={onAddItem ? () => onAddItem(i, "before") : undefined}
                                            onAddAfter={onAddItem ? () => onAddItem(i, "after") : undefined}
                                            onDelete={onDeleteItem ? () => onDeleteItem(i) : undefined}
                                        />
                                    </div>
                                )}
                                <EditableElement
                                    as="h3"
                                    className="theme-font-heading font-bold theme-text-heading-size leading-tight theme-text-primary px-[1cqw]"
                                    value={item.header}
                                    onChange={(val) => onUpdateItem(i, "header", val)}
                                    readOnly={readOnly}
                                    placeholder="Milestone Title"
                                />
                                <EditableElement
                                    as="p"
                                    className="theme-text-description-size leading-relaxed theme-text-muted mt-[0.5cqw] px-[1cqw]"
                                    value={item.description}
                                    onChange={(val) => onUpdateItem(i, "description", val)}
                                    readOnly={readOnly}
                                    placeholder="Milestone details and description."
                                />
                            </div>
                        ) : (
                            <div /> /* Spacer column for odd items */
                        )}

                        {/* Connector line and Marker */}
                        <div className="flex flex-row items-center justify-center shrink-0 z-10 w-[12cqw]">
                            {isEven ? (
                                <div className="w-[4.8cqw] h-[0.2cqw] shrink-0" style={{ backgroundColor: "var(--theme-primary)", opacity: 0.4 }} />
                            ) : (
                                <div className="w-[4.8cqw]" />
                            )}
                            <div 
                                className="w-[2.4cqw] h-[2.4cqw] rounded-full border-[0.3cqw] shrink-0 z-10 bg-theme-bg" 
                                style={{ borderColor: "var(--theme-primary)", backgroundColor: "var(--theme-bg)" }} 
                            />
                            {!isEven ? (
                                <div className="w-[4.8cqw] h-[0.2cqw] shrink-0" style={{ backgroundColor: "var(--theme-primary)", opacity: 0.4 }} />
                            ) : (
                                <div className="w-[4.8cqw]" />
                            )}
                        </div>

                        {/* Odd index: Content on the Right */}
                        {!isEven ? (
                            <div className="flex flex-col items-start text-left pl-[2cqw] relative">
                                {!readOnly && (onAddItem || onDeleteItem) && (
                                    <div className="absolute top-[0.5cqw] right-[0.5cqw] opacity-0 group-hover/item:opacity-100 data-[menu-open=true]:opacity-100 transition-opacity z-20">
                                        <ItemActionsMenu
                                            onAddBefore={onAddItem ? () => onAddItem(i, "before") : undefined}
                                            onAddAfter={onAddItem ? () => onAddItem(i, "after") : undefined}
                                            onDelete={onDeleteItem ? () => onDeleteItem(i) : undefined}
                                        />
                                    </div>
                                )}
                                <EditableElement
                                    as="h3"
                                    className="theme-font-heading font-bold theme-text-heading-size leading-tight theme-text-primary px-[1cqw]"
                                    value={item.header}
                                    onChange={(val) => onUpdateItem(i, "header", val)}
                                    readOnly={readOnly}
                                    placeholder="Milestone Title"
                                />
                                <EditableElement
                                    as="p"
                                    className="theme-text-description-size leading-relaxed theme-text-muted mt-[0.5cqw] px-[1cqw]"
                                    value={item.description}
                                    onChange={(val) => onUpdateItem(i, "description", val)}
                                    readOnly={readOnly}
                                    placeholder="Milestone details and description."
                                />
                            </div>
                        ) : (
                            <div /> /* Spacer column for even items */
                        )}
                    </AnimatedItem>
                );
            })}
        </div>
    );
};

export default TimelinesVertical;
