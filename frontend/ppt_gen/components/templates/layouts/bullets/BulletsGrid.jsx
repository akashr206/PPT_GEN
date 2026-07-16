import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const BulletsGrid = ({ content, onUpdateItem, readOnly }) => {
    const items = content || [];
    
    return (
        <div className="w-full flex flex-row flex-wrap gap-x-[4cqw] gap-y-[3cqw]">
            {items.map((item, i) => (
                <div key={i} className="flex flex-row w-[calc(50%-2cqw)] gap-[1.5cqw]">
                    <div className="w-[0.4cqw] theme-bullet-bg shrink-0 rounded-full" />
                    <div className="flex flex-col gap-[1cqw] flex-1">
                        <EditableElement
                            as="h3"
                            className="theme-font-heading font-bold text-[1.8cqw] leading-tight theme-text-primary"
                            value={item.header}
                            onChange={(val) => onUpdateItem(i, "header", val)}
                            readOnly={readOnly}
                            placeholder="Grid header"
                        />
                        <EditableElement
                            as="p"
                            className="text-[1.3cqw] leading-relaxed theme-text-muted"
                            value={item.description}
                            onChange={(val) => onUpdateItem(i, "description", val)}
                            readOnly={readOnly}
                            placeholder="Grid description details"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BulletsGrid;
