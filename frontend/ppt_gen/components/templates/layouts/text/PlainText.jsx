import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { TextItemActionMenu } from "@/components/ui/TextItemActionMenu";
import AnimatedItem from "../../AnimatedItem";

const PlainText = ({ content, onUpdateItem, onDeleteItem, onAddItem, readOnly }) => {
    const items = content || [];
    
    return (
        <div className="w-full flex flex-col gap-[1.5cqw]">
            {items.map((item, i) => {
                let alignClass = "text-left";
                if (item.align === "center") alignClass = "text-center mx-auto";
                else if (item.align === "right") alignClass = "text-right ml-auto";

                return (
                    <AnimatedItem key={i} index={i} className={`relative group/item flex w-full ${alignClass}`}>
                        <EditableElement
                            as="p"
                            className="text-[1.3cqw] leading-relaxed theme-text-muted w-full"
                            style={{ fontSize: item.descriptionFontSize ? `${item.descriptionFontSize}cqw` : undefined }}
                            value={item.description || item.header}
                            onChange={(val) => onUpdateItem(i, "description", val)}
                            readOnly={readOnly}
                            placeholder="Enter text..."
                        />
                        {!readOnly && (
                            <TextItemActionMenu
                                align={item.align || "left"}
                                descSize={item.descriptionFontSize || 1.5}
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
