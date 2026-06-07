import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const ClosingQA = ({ title, subtitle, presenter, onUpdateSlide }) => {
    return (
        <div className="grid grid-cols-12 items-center h-full min-h-[30cqw] py-[3cqw] px-[5cqw] gap-[4cqw]">
            {/* Left Graphic Element */}
            <div className="col-span-5 flex justify-center items-center">
                <div className="relative w-[22cqw] h-[22cqw] flex items-center justify-center bg-gradient-to-br from-[var(--theme-secondary)] to-transparent rounded-[3cqw] border-[0.25cqw] theme-border">
                    {/* Small visual accent bubbles */}
                    <div className="absolute -top-[1.5cqw] -right-[1.5cqw] w-[6cqw] h-[6cqw] rounded-[1.5cqw] theme-bg-primary flex items-center justify-center shadow-lg">
                        <span className="text-[3cqw] font-bold text-[var(--theme-bg)]">?</span>
                    </div>
                    <div className="absolute -bottom-[1cqw] -left-[1cqw] w-[5cqw] h-[5cqw] rounded-[1.2cqw] theme-bg-secondary flex items-center justify-center border-[0.15cqw] theme-border">
                        <span className="text-[2.2cqw] font-bold theme-text-primary">!</span>
                    </div>
                    
                    {/* Center big "?" */}
                    <span className="text-[10cqw] font-bold theme-text-primary select-none opacity-80">?</span>
                </div>
            </div>

            {/* Right Text Content */}
            <div className="col-span-7 flex flex-col justify-center text-left">
                <EditableElement
                    as="h1"
                    className="text-[6cqw] font-bold theme-heading leading-tight mb-[2cqw]"
                    value={title || "Questions?"}
                    onChange={(val) => onUpdateSlide?.("title", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Questions?"
                />
                
                <div className="w-[12cqw] h-[0.4cqw] theme-bg-primary rounded-[99cqw] mb-[2.5cqw]" />
                
                <EditableElement
                    as="p"
                    className="text-[2.2cqw] theme-text-muted max-w-[45cqw] mb-[3cqw] leading-relaxed"
                    value={subtitle || "Please feel free to ask anything about the presentation."}
                    onChange={(val) => onUpdateSlide?.("subtitle", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Any questions?"
                />

                {presenter && (
                    <div className="flex items-center gap-[1.5cqw] text-[1.6cqw] theme-text-muted">
                        <span className="opacity-60 text-[1.4cqw]">Presenter:</span>
                        <EditableElement
                            as="span"
                            className="font-bold theme-text-primary"
                            value={presenter}
                            onChange={(val) => onUpdateSlide?.("presenter", val)}
                            readOnly={!onUpdateSlide}
                            placeholder="Presenter"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClosingQA;
