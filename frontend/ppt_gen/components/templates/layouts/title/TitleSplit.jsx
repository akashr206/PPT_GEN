import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const TitleSplit = ({ title, subtitle, presenter, onUpdateSlide }) => {
    return (
        <div className="flex items-stretch justify-between h-full min-h-[30em] gap-[4em]">
            {/* Left accent block with solid primary color */}
            <div className="w-[48%] theme-bg-primary rounded-[1.4em] p-[4em] flex flex-col justify-center relative overflow-hidden">
                <EditableElement
                    as="h1"
                    className={`font-bold leading-tight w-full ${(() => {
                        const len = title?.length || 0;
                        if (len > 35) return "text-[2.8em]";
                        if (len > 22) return "text-[3.8em]";
                        return "text-[5em]";
                    })()}`}
                    style={{ color: "var(--theme-bg)" }}
                    value={title}
                    onChange={(val) => onUpdateSlide?.("title", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Slide Title"
                />
                
                <div 
                    className="w-[8em] h-[0.4em] rounded-full mt-[3em]"
                    style={{ backgroundColor: "var(--theme-bg)", opacity: 0.5 }}
                />
            </div>
            
            {/* Right block with description and metadata */}
            <div className="w-[48%] flex flex-col justify-center pl-[1em]">
                <EditableElement
                    as="p"
                    className="text-[2.1em] theme-text-muted mb-[3.5em] leading-relaxed"
                    value={subtitle || ""}
                    onChange={(val) => onUpdateSlide?.("subtitle", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Add subtitle..."
                />
                
                <div className="w-[6em] h-[0.3em] theme-bg-accent rounded-full mb-[3.5em]" />
                
                <div className="flex flex-col gap-[0.8em] mt-auto">
                    {presenter && (
                        <EditableElement
                            as="div"
                            className="text-[1.8em] font-bold theme-text-primary"
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
