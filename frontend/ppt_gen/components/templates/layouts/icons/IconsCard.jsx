import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { EditableIcon } from "@/components/ui/EditableIcon";
import AnimatedItem from "../../AnimatedItem";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const IconsCard = ({
    content,
    columns,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    readOnly,
}) => {
    const items = content || [];
    const requestedCols = columns || 2;
    const actualCols = Math.min(requestedCols, Math.max(1, items.length));

    return (
        <div className="w-full flex flex-row flex-wrap gap-[1cqw]">
            {items.map((item, i) => (
                <AnimatedItem
                    key={i}
                    index={i}
                    className="group/item relative flex-1 min-w-[10cqw] flex flex-col items-center gap-[0.8cqw] p-[1.5cqw] text-center theme-card"
                    style={{ flexBasis: `calc((100% - ${(actualCols - 1) * 1}cqw) / ${actualCols})` }}
                >
                    <EditableIcon
                        iconName={item.icon}
                        onChange={(val) => onUpdateItem(i, "icon", val)}
                        readOnly={readOnly}
                        contextText={item.header}
                        iconClassName="w-[3.5cqw] h-[3.5cqw] theme-text-primary"
                        className="flex items-center justify-center shrink-0"
                    />
                    <EditableElement
                        as="h3"
                        className="theme-font-heading font-bold text-[1.8cqw] leading-tight theme-text-primary"
                        value={item.header}
                        onChange={(val) => onUpdateItem(i, "header", val)}
                        readOnly={readOnly}
                        placeholder="Icon Feature"
                    />
                    <EditableElement
                        as="p"
                        className="text-[1.3cqw] leading-relaxed theme-text-muted"
                        value={item.description}
                        onChange={(val) => onUpdateItem(i, "description", val)}
                        readOnly={readOnly}
                        placeholder="Feature details and description."
                    />
                    {!readOnly && (onAddItem || onDeleteItem) && (
                        <div className="absolute top-[0.5cqw] right-[0.5cqw] opacity-0 group-hover/item:opacity-100 data-[menu-open=true]:opacity-100 transition-opacity z-10">
                            <ItemActionsMenu
                                onAddBefore={
                                    onAddItem
                                        ? () => onAddItem(i, "before")
                                        : undefined
                                }
                                onAddAfter={
                                    onAddItem
                                        ? () => onAddItem(i, "after")
                                        : undefined
                                }
                                onDelete={
                                    onDeleteItem
                                        ? () => onDeleteItem(i)
                                        : undefined
                                }
                            />
                        </div>
                    )}
                </AnimatedItem>
            ))}
        </div>
    );
};

export default IconsCard;
