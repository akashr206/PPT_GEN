import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const TitleSection = ({ title, subtitle, company, onUpdateSlide }) => {
    return (
        <div className="w-full h-full min-h-[30cqw] theme-bg-primary rounded-[1.5cqw] p-[5cqw] flex flex-col justify-center relative overflow-hidden">
            {company && (
                <div 
                    className="absolute top-[4cqw] right-[4cqw] py-[0.5cqw] px-[1.5cqw] rounded-full text-[1.3cqw] font-semibold tracking-wider uppercase"
                    style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-primary)" }}
                >
                    <EditableElement
                        as="span"
                        className="w-max text-center block"
                        value={company}
                        onChange={(val) => onUpdateSlide?.("company", val)}
                        readOnly={!onUpdateSlide}
                        placeholder="Company"
                    />
                </div>
            )}
            
            <EditableElement
                as="h1"
                className="text-[5.5cqw] font-bold leading-tight mb-[2.5cqw] max-w-[85%]"
                style={{ color: "var(--theme-bg)" }}
                value={title}
                onChange={(val) => onUpdateSlide?.("title", val)}
                readOnly={!onUpdateSlide}
                placeholder="Slide Title"
            />
            
            <div 
                className="w-[12cqw] h-[0.3cqw] rounded-full mb-[3cqw]"
                style={{ backgroundColor: "var(--theme-bg)", opacity: 0.3 }}
            />
            
            <EditableElement
                as="p"
                className="text-[2.0cqw] opacity-80 max-w-[80%] leading-relaxed"
                style={{ color: "var(--theme-bg)" }}
                value={subtitle || ""}
                onChange={(val) => onUpdateSlide?.("subtitle", val)}
                readOnly={!onUpdateSlide}
                placeholder="Add subtitle..."
            />
        </div>
    );
};

export default TitleSection;
