import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const ClosingThankYou = ({ title, subtitle, presenter, onUpdateSlide }) => {
    return (
        <div className="flex flex-col justify-center items-center text-center h-full min-h-[30em] py-[4em] px-[5em] relative">
            <div className="max-w-[70cqw] w-full flex flex-col justify-center items-center p-[3em] border-[0.2em] rounded-[2em] theme-border bg-gradient-to-br from-transparent to-[var(--theme-secondary)]/10">
                <EditableElement
                    as="h1"
                    className="text-[6.5em] font-bold theme-heading leading-tight mb-[1.8em] tracking-tight"
                    value={title || "Thank You!"}
                    onChange={(val) => onUpdateSlide?.("title", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Thank You!"
                />
                
                <div className="w-[18cqw] h-[0.4em] theme-bg-primary rounded-[99em] mb-[2.5em]" />
                
                <EditableElement
                    as="p"
                    className="text-[2.2em] theme-text-muted max-w-[55cqw] mb-[3.5em] leading-relaxed"
                    value={subtitle || "Questions & discussion are welcome"}
                    onChange={(val) => onUpdateSlide?.("subtitle", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Add concluding message..."
                />
                
                {presenter && (
                    <div className="flex items-center justify-center gap-[2em] text-[1.6em] theme-text-muted pt-[1.5em] w-[30cqw]">
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

export default ClosingThankYou;
