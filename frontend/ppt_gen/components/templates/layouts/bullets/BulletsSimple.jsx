import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const BulletsSimple = ({ content, onUpdateItem, readOnly }) => {
    const items = content || [];
    
    // Automatically switch to 2 columns if there are many items
    const useTwoColumns = items.length > 4;

    return (
        <div className={`w-full flex ${useTwoColumns ? "flex-row flex-wrap gap-x-[4cqw] gap-y-[2cqw]" : "flex-col gap-[2cqw]"}`}>
            {items.map((item, i) => (
                <div key={i} className={`flex flex-row items-start gap-[1.5cqw] ${useTwoColumns ? "w-[calc(50%-2cqw)]" : "w-full"}`}>
                    <div className="w-[1cqw] h-[1cqw] rounded-full theme-bullet-bg mt-[0.8cqw] shrink-0" />
                    <div className="flex flex-col gap-[0.5cqw] flex-1">
                        <EditableElement
                            as="h3"
                            className="theme-font-heading font-bold text-[1.8cqw] leading-tight theme-text-primary"
                            value={item.header}
                            onChange={(val) => onUpdateItem(i, "header", val)}
                            readOnly={readOnly}
                            placeholder="Bullet header"
                        />
                        <EditableElement
                            as="p"
                            className="text-[1.3cqw] leading-relaxed theme-text-muted"
                            value={item.description}
                            onChange={(val) => onUpdateItem(i, "description", val)}
                            readOnly={readOnly}
                            placeholder="Bullet description details"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BulletsSimple;
