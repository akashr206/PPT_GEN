import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const CardsBasic = ({ content, onUpdateItem, readOnly }) => {
    const items = content || [];
    
    return (
        <div className="w-full flex flex-row flex-wrap gap-[2cqw]">
            {items.map((item, i) => (
                <div key={i} className="flex-1 min-w-[30%] flex flex-col gap-[1.5cqw] p-[3cqw] rounded-[1cqw] theme-bg-card border theme-border-card shadow-sm">
                    <EditableElement
                        as="h3"
                        className="theme-font-heading font-bold text-[1.8cqw] leading-tight theme-text-primary text-center"
                        value={item.header}
                        onChange={(val) => onUpdateItem(i, "header", val)}
                        readOnly={readOnly}
                        placeholder="Card Title"
                    />
                    <EditableElement
                        as="p"
                        className="text-[1.3cqw] leading-relaxed theme-text-muted text-center"
                        value={item.description}
                        onChange={(val) => onUpdateItem(i, "description", val)}
                        readOnly={readOnly}
                        placeholder="Card description text"
                    />
                </div>
            ))}
        </div>
    );
};

export default CardsBasic;
