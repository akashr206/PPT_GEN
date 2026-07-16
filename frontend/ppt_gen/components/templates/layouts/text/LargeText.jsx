import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const LargeText = ({ content, onUpdateItem, readOnly }) => {
    const items = content || [];
    
    return (
        <div className="w-full flex flex-col gap-[2.5cqw]">
            {items.map((item, i) => (
                <div key={i} className="flex flex-col gap-[1cqw]">
                    <EditableElement
                        as="h3"
                        className="theme-font-heading font-bold text-[2.2cqw] leading-tight theme-text-primary"
                        value={item.header}
                        onChange={(val) => onUpdateItem(i, "header", val)}
                        readOnly={readOnly}
                        placeholder="Heading..."
                    />
                    <EditableElement
                        as="p"
                        className="text-[1.5cqw] leading-relaxed theme-text-muted"
                        value={item.description}
                        onChange={(val) => onUpdateItem(i, "description", val)}
                        readOnly={readOnly}
                        placeholder="Enter text..."
                    />
                </div>
            ))}
        </div>
    );
};

export default LargeText;
