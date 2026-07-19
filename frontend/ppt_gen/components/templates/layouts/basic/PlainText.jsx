import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { TextItemActionMenu } from "@/components/ui/TextItemActionMenu";
import AnimatedItem from "../../AnimatedItem";

const PlainText = ({ content, onUpdateItem, onDeleteItem, onAddItem, readOnly, textSizes }) => {
    const items = content || [];
    
    return (
        <div className="w-full flex flex-col gap-[1.5cqw]">
            {items.map((item, i) => {
                let alignClass = "text-left";
                if (item.align === "center") alignClass = "text-center mx-auto";
                else if (item.align === "right") alignClass = "text-right ml-auto";
                else if (item.align === "justify") alignClass = "text-justify w-full";

                return (
                    <AnimatedItem key={i} index={i} className={`relative group/item flex w-full ${alignClass}`}>
                        <EditableElement
                            as="p"
                            className="theme-text-description-size leading-relaxed theme-text-muted w-full"
                            style={{ fontSize: item.descriptionFontSize ? `${item.descriptionFontSize}cqw` : undefined }}
                            value={item.description || item.header}
                            onChange={(val) => onUpdateItem(i, "description", val)}
                            readOnly={readOnly}
                            placeholder="Enter text..."
                        />
                        {!readOnly && (
                            <TextItemActionMenu
                                align={item.align || "left"}
                                descSize={item.descriptionFontSize || textSizes?.description || 1.3}
                                hasDesc={true}
                                onUpdateItem={(field, val) => onUpdateItem(i, field, val)}
                                onAddBefore={onAddItem ? () => onAddItem(i, "before") : undefined}
                                onAddAfter={onAddItem ? () => onAddItem(i, "after") : undefined}
                                onDelete={onDeleteItem ? () => onDeleteItem(i) : undefined}
                            />
                        )}
                    </AnimatedItem>
                );
            })}
        </div>
    );
};

export default PlainText;
