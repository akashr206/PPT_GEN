import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const StatsGrid = ({ content, onUpdateItem, readOnly }) => {
    const items = content || [];
    
    return (
        <div className="w-full flex flex-row flex-wrap gap-x-[4cqw] gap-y-[4cqw]">
            {items.map((item, i) => (
                <div key={i} className="flex-1 min-w-[40%] flex flex-col gap-[0.5cqw]">
                    <EditableElement
                        as="h2"
                        className="font-black text-[6cqw] leading-none theme-text-primary tracking-tighter"
                        value={item.header}
                        onChange={(val) => onUpdateItem(i, "header", val)}
                        readOnly={readOnly}
                        placeholder="50M+"
                    />
                    <EditableElement
                        as="p"
                        className="text-[1.3cqw] font-medium leading-tight theme-text-primary uppercase tracking-widest opacity-70 mt-[1cqw]"
                        value={item.description}
                        onChange={(val) => onUpdateItem(i, "description", val)}
                        readOnly={readOnly}
                        placeholder="Metric description"
                    />
                </div>
            ))}
        </div>
    );
};

export default StatsGrid;
