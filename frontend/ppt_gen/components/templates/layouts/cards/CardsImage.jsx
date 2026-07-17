import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Image as ImageIcon } from "lucide-react";

const CardsImage = ({ content, onUpdateItem, readOnly }) => {
    const items = content || [];
    
    return (
        <div className="w-full flex flex-row flex-wrap gap-[2cqw]">
            {items.map((item, i) => (
                <div key={i} className="flex-1 min-w-[30%] flex flex-col rounded-[1cqw] theme-bg-card border theme-border-card shadow-sm overflow-hidden">
                    <div className="w-full h-[12cqw] theme-bg-alt flex items-center justify-center shrink-0">
                        {/* Placeholder for card image */}
                        <ImageIcon className="w-[3cqw] h-[3cqw] theme-text-muted opacity-30" />
                    </div>
                    <div className="flex flex-col gap-[1cqw] p-[2cqw]">
                        <EditableElement
                            as="h3"
                            className="theme-font-heading font-bold text-[1.6cqw] leading-tight theme-text-primary"
                            value={item.header}
                            onChange={(val) => onUpdateItem(i, "header", val)}
                            readOnly={readOnly}
                            placeholder="Card Title"
                        />
                        <EditableElement
                            as="p"
                            className="text-[1.2cqw] leading-relaxed theme-text-muted"
                            value={item.description}
                            onChange={(val) => onUpdateItem(i, "description", val)}
                            readOnly={readOnly}
                            placeholder="Card description text goes here. Keep it concise."
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardsImage;
