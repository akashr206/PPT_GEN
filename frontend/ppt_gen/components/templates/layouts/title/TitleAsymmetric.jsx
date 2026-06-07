import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const TitleAsymmetric = ({ title, subtitle, presenter, onUpdateSlide }) => {
    return (
        <div className="grid grid-cols-12 items-stretch h-full min-h-[30cqw] py-[4cqw] px-[5cqw] gap-[3cqw] relative overflow-hidden">
            {/* Left Content Area (7 columns) */}
            <div className="col-span-7 flex flex-col justify-center text-left">
                <EditableElement
                    as="h1"
                    className={`font-bold theme-heading leading-tight mb-[2cqw] tracking-tight w-full ${(() => {
                        const len = title?.length || 0;
                        if (len > 35) return "text-[3cqw]";
                        if (len > 22) return "text-[4.2cqw]";
                        return "text-[5.5cqw]";
                    })()}`}
                    value={title}
                    onChange={(val) => onUpdateSlide?.("title", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Slide Title"
                />

                <EditableElement
                    as="p"
                    className="text-[2.0cqw] theme-text-muted max-w-[48cqw] mb-[3.5cqw] leading-relaxed"
                    value={subtitle || ""}
                    onChange={(val) => onUpdateSlide?.("subtitle", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Add subtitle..."
                />

                {presenter && (
                    <div className="flex items-center gap-[2cqw] text-[1.5cqw] theme-text-muted mt-[1cqw]">
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

            {/* Right Focal Area (5 columns) */}
            <div className="col-span-5 flex items-center justify-center">
                <div 
                    className="w-full h-full min-h-[20cqw] p-[3cqw] rounded-[2.5cqw] border-[0.2cqw] theme-border flex flex-col justify-between relative"
                    style={{ backgroundColor: "var(--theme-card-bg)" }}
                >
                    {/* Visual pattern grid of boxes using cqw dimensions */}
                    <div className="grid grid-cols-2 gap-[1.5cqw] w-full">
                        <div className="aspect-square rounded-[1.2cqw] border-[0.15cqw] theme-border bg-gradient-to-br from-[var(--theme-secondary)]/10 to-[var(--theme-secondary)]/30" />
                        <div className="aspect-square rounded-[1.2cqw] theme-bg-primary opacity-20" />
                        <div className="aspect-square rounded-[1.2cqw] theme-bg-secondary" />
                        <div className="aspect-square rounded-[1.2cqw] border-[0.15cqw] theme-border bg-gradient-to-br from-[var(--theme-secondary)]/20 to-transparent" />
                    </div>

                    <div className="text-[1.2cqw] theme-text-muted mt-[2cqw] text-center font-medium tracking-wide uppercase select-none opacity-60">
                        Presentation Opening
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TitleAsymmetric;
