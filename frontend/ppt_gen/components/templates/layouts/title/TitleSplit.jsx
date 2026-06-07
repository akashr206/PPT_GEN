import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const TitleSplit = ({ title, subtitle, presenter, onUpdateSlide }) => {
    return (
        <div className="flex items-stretch justify-between h-full min-h-[30cqw] gap-[4cqw]">
            {/* Left accent block with solid primary color */}
            <div className="w-[48%] theme-bg-primary rounded-[1.4cqw] p-[4cqw] flex flex-col justify-center relative overflow-hidden">
                <EditableElement
                    as="h1"
                    className={`font-bold leading-tight w-full ${(() => {
                        const len = title?.length || 0;
                        if (len > 35) return "text-[2.8cqw]";
                        if (len > 22) return "text-[3.8cqw]";
                        return "text-[5cqw]";
                    })()}`}
                    style={{ color: "var(--theme-bg)" }}
                    value={title}
                    onChange={(val) => onUpdateSlide?.("title", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Slide Title"
                />
                
                <div 
                    className="w-[8cqw] h-[0.4cqw] rounded-full mt-[3cqw]"
                    style={{ backgroundColor: "var(--theme-bg)", opacity: 0.5 }}
                />
            </div>
            
            {/* Right block with description and metadata */}
            <div className="w-[48%] flex flex-col justify-center pl-[1cqw]">
                <EditableElement
                    as="p"
                    className="text-[2.1cqw] theme-text-muted mb-[3.5cqw] leading-relaxed"
                    value={subtitle || ""}
                    onChange={(val) => onUpdateSlide?.("subtitle", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Add subtitle..."
                />
                
                <div className="w-[6cqw] h-[0.3cqw] theme-bg-accent rounded-full mb-[3.5cqw]" />
                
                <div className="flex flex-col gap-[0.8cqw] mt-auto">
                    {presenter && (
                        <EditableElement
                            as="div"
                            className="text-[1.8cqw] font-bold theme-text-primary"
                            value={presenter}
                            onChange={(val) => onUpdateSlide?.("presenter", val)}
                            readOnly={!onUpdateSlide}
                            placeholder="Presenter"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TitleSplit;
