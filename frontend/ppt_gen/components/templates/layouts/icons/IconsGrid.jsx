import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { EditableIcon } from "@/components/ui/EditableIcon";
import AnimatedItem from "../../AnimatedItem";

const IconsGrid = ({ content, onUpdateItem, readOnly }) => {
    const items = content || [];
    
    return (
        <div className="w-full flex flex-row flex-wrap gap-[3cqw]">
            {items.map((item, i) => (
                <AnimatedItem key={i} index={i} className="flex-1 min-w-[30%] flex flex-col items-center gap-[1cqw] p-[2cqw] text-center">
                    <EditableIcon
                        iconName={item.icon}
                        onChange={(val) => onUpdateItem(i, "icon", val)}
                        readOnly={readOnly}
                        contextText={item.header}
                        iconClassName="w-[2.5cqw] h-[2.5cqw] theme-text-primary"
                        className="flex items-center justify-center shrink-0 mb-[1cqw]"
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
                </AnimatedItem>
            ))}
        </div>
    );
};

export default IconsGrid;
