import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const StatsHighlight = ({ content, onUpdateItem, readOnly }) => {
    const items = content || [];
    
    // We only use the first item for a highlight
    const item = items[0] || {};
    
    return (
        <div className="w-full flex flex-col items-center justify-center p-[4cqw] text-center gap-[2cqw]">
            <EditableElement
                as="h1"
                className="font-black text-[12cqw] leading-none theme-text-primary tracking-tighter"
                value={item.header}
                onChange={(val) => onUpdateItem(0, "header", val)}
                readOnly={readOnly}
                placeholder="99%"
            />
            <div className="w-[10cqw] h-[0.5cqw] bg-[--theme-card-border] rounded-full" />
            <EditableElement
                as="p"
                className="text-[2cqw] font-medium leading-relaxed theme-text-muted max-w-[80%]"
                value={item.description}
                onChange={(val) => onUpdateItem(0, "description", val)}
                readOnly={readOnly}
                placeholder="Highlight an incredibly important metric or breakthrough figure here."
            />
        </div>
    );
};

export default StatsHighlight;
