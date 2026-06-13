import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const ClosingQA = ({ title, subtitle, presenter, onUpdateSlide }) => {
    return (
        <div className="grid grid-cols-12 items-center h-full min-h-[30em] py-[3em] px-[5em] gap-[4em]">
            {/* Left Graphic Element */}
            <div className="col-span-5 flex justify-center items-center">
                <div className="relative w-[22cqw] h-[22em] flex items-center justify-center bg-gradient-to-br from-[var(--theme-secondary)] to-transparent rounded-[3em] border-[0.25em] theme-border">
                    {/* Small visual accent bubbles */}
                    <div className="absolute -top-[1.5em] -right-[1.5em] w-[6em] h-[6em] rounded-[1.5em] theme-bg-primary flex items-center justify-center shadow-lg">
                        <span className="text-[3em] font-bold text-[var(--theme-bg)]">?</span>
                    </div>
                    <div className="absolute -bottom-[1em] -left-[1em] w-[5em] h-[5em] rounded-[1.2em] theme-bg-secondary flex items-center justify-center border-[0.15em] theme-border">
                        <span className="text-[2.2em] font-bold theme-text-primary">!</span>
                    </div>
                    
                    {/* Center big "?" */}
                    <span className="text-[10em] font-bold theme-text-primary select-none opacity-80">?</span>
                </div>
            </div>

            {/* Right Text Content */}
            <div className="col-span-7 flex flex-col justify-center text-left">
                <EditableElement
                    as="h1"
                    className="text-[6em] font-bold theme-heading leading-tight mb-[2em]"
                    value={title || "Questions?"}
                    onChange={(val) => onUpdateSlide?.("title", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Questions?"
                />
                
                <div className="w-[12cqw] h-[0.4em] theme-bg-primary rounded-[99em] mb-[2.5em]" />
                
                <EditableElement
                    as="p"
                    className="text-[2.2em] theme-text-muted max-w-[45cqw] mb-[3em] leading-relaxed"
                    value={subtitle || "Please feel free to ask anything about the presentation."}
                    onChange={(val) => onUpdateSlide?.("subtitle", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Any questions?"
                />

                {presenter && (
                    <div className="flex items-center gap-[1.5em] text-[1.6em] theme-text-muted">
                        <span className="opacity-60 text-[1.4em]">Presenter:</span>
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
