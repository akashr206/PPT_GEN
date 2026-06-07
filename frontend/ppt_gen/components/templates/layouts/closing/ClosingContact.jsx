import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const ClosingContact = ({ title, subtitle, content = [], onUpdateSlide, onUpdateItem, onDeleteItem, onAddItem }) => {
    // If empty content, fallback to default mock contacts so the slide looks good out-of-the-box
    const items = content.length > 0 ? content : [
        { header: "Email", description: "hello@yourdomain.com" },
        { header: "Website", description: "www.yourwebsite.com" },
        { header: "Office", description: "123 Innovation Way, Tech City" }
    ];

    const n = items.length;
    const gridCols = n === 3 ? "grid-cols-3" : (n >= 4 ? "grid-cols-2" : "grid-cols-1");

    return (
        <div className="flex flex-col justify-center h-full min-h-[30cqw] py-[2.5cqw] px-[4cqw]">
            <div className="text-center mb-[2.5cqw] flex flex-col justify-center items-center">
                <EditableElement
                    as="h1"
                    className="text-[4.5cqw] font-bold theme-heading leading-tight mb-[1cqw]"
                    value={title || "Get In Touch"}
                    onChange={(val) => onUpdateSlide?.("title", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Get In Touch"
                />
                <EditableElement
                    as="p"
                    className="text-[1.8cqw] theme-text-muted max-w-[60cqw] leading-relaxed"
                    value={subtitle || "Let's build something great together. Reach out anytime."}
                    onChange={(val) => onUpdateSlide?.("subtitle", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Reach out anytime."
                />
            </div>

            <div className={`grid ${gridCols} gap-[2.5cqw] max-w-[90cqw] mx-auto items-stretch w-full`}>
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="p-[2cqw] rounded-[1.8cqw] flex flex-col justify-center items-center text-center relative group/item border-[0.15cqw] theme-border bg-gradient-to-b from-[var(--theme-secondary)]/10 to-[var(--theme-secondary)]/30"
                    >
                        <EditableElement
                            as="h3"
                            className="font-bold theme-heading text-[1.8cqw] mb-[0.8cqw] tracking-wide uppercase"
                            value={item.header}
                            onChange={(val) => onUpdateItem?.(i, "header", val)}
                            readOnly={!onUpdateItem}
                            placeholder="Channel"
                        />
                        <EditableElement
                            as="p"
                            className="text-[1.5cqw] theme-text-muted w-full text-wrap break-all"
                            value={item.description}
                            onChange={(val) => onUpdateItem?.(i, "description", val)}
                            readOnly={!onUpdateItem}
                            placeholder="info@website.com"
                        />
                        
                        {onDeleteItem && (
                            <div className="absolute -top-[1.2cqw] left-1/2 -translate-x-1/2 opacity-0 group-hover/item:opacity-100 z-20">
                                <ItemActionsMenu
                                    onAddBefore={() => onAddItem?.(i, "before")}
                                    onAddAfter={() => onAddItem?.(i, "after")}
                                    onDelete={() => onDeleteItem(i)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClosingContact;
