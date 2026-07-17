import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { EditableIcon } from "@/components/ui/EditableIcon";

const IconsList = ({ content, onUpdateItem, readOnly }) => {
    const items = content || [];
    
    return (
        <div className="w-full flex flex-col gap-[3cqw]">
            {items.map((item, i) => (
                <div key={i} className="w-full flex flex-row items-center gap-[2.5cqw]">
                    <EditableIcon
                        iconName={item.icon}
                        onChange={(val) => onUpdateItem(i, "icon", val)}
                        readOnly={readOnly}
                        contextText={item.header}
                        iconClassName="w-[2.5cqw] h-[2.5cqw] theme-text-primary"
                        className="flex items-center justify-center shrink-0 mb-[1cqw]"
                    />
                    <div className="flex flex-col gap-[0.5cqw] flex-1">
                        <EditableElement
                            as="h3"
                            className="theme-font-heading font-bold text-[1.8cqw] leading-tight theme-text-primary"
                            value={item.header}
                            onChange={(val) => onUpdateItem(i, "header", val)}
                            readOnly={readOnly}
                            placeholder="Icon Header"
                        />
                        <EditableElement
                            as="p"
                            className="text-[1.3cqw] leading-relaxed theme-text-muted"
                            value={item.description}
                            onChange={(val) => onUpdateItem(i, "description", val)}
                            readOnly={readOnly}
                            placeholder="Brief description for this icon point."
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default IconsList;
