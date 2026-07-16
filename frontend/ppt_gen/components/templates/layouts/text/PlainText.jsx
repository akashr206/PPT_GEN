import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const PlainText = ({ content, onUpdateItem, readOnly }) => {
    const items = content || [];
    
    return (
        <div className="w-full flex flex-col gap-[1.5cqw]">
            {items.map((item, i) => (
                <EditableElement
                    key={i}
                    as="p"
                    className="text-[1.5cqw] leading-relaxed theme-text-muted"
                    value={item.description || item.header}
                    onChange={(val) => onUpdateItem(i, "description", val)}
                    readOnly={readOnly}
                    placeholder="Enter text..."
                />
            ))}
        </div>
    );
};

export default PlainText;
