import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { TextItemActionMenu } from "@/components/ui/TextItemActionMenu";
import AnimatedItem from "../../AnimatedItem";

const LargeText = ({ content, onUpdateItem, onDeleteItem, onAddItem, readOnly }) => {
    const items = content || [];
    
    return (
        <div className="w-full flex flex-col gap-[2.5cqw]">
            {items.map((item, i) => {
                let alignClass = "text-left items-start";
                if (item.align === "center") alignClass = "text-center items-center mx-auto";
                else if (item.align === "right") alignClass = "text-right items-end ml-auto";

                return (
                    <AnimatedItem key={i} index={i} className={`relative group/item flex flex-col gap-[1cqw] w-full ${alignClass}`}>
                        <EditableElement
                            as="h3"
                            className="theme-font-heading font-bold text-[2.2cqw] leading-tight theme-text-primary w-full"
                            style={{ fontSize: item.headerFontSize ? `${item.headerFontSize}cqw` : undefined }}
                            value={item.header}
                            onChange={(val) => onUpdateItem(i, "header", val)}
                            readOnly={readOnly}
                            placeholder="Heading..."
                        />
                        <EditableElement
                            as="p"
                            className="text-[1.5cqw] leading-relaxed theme-text-muted w-full"
                            style={{ fontSize: item.descriptionFontSize ? `${item.descriptionFontSize}cqw` : undefined }}
                            value={item.description}
                            onChange={(val) => onUpdateItem(i, "description", val)}
                            readOnly={readOnly}
                            placeholder="Enter text..."
                        />
                        {!readOnly && (
                            <TextItemActionMenu
                                align={item.align || "left"}
                                headerSize={item.headerFontSize || 2.2}
                                descSize={item.descriptionFontSize || 1.5}
                                hasHeader={true}
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

export default LargeText;
