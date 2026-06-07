import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const ClosingCTA = ({ title, subtitle, company, date, onUpdateSlide }) => {
    return (
        <div className="flex flex-col justify-center items-center text-center h-full min-h-[30cqw] py-[3.5cqw] px-[6cqw] relative">
            <div className="max-w-[75cqw] w-full flex flex-col justify-center items-center p-[4cqw] rounded-[2.5cqw] border-[0.2cqw] theme-border bg-[var(--theme-card-bg)] shadow-xl relative overflow-hidden">
                {/* Background accent glow */}
                <div className="absolute -top-[10cqw] -left-[10cqw] w-[25cqw] h-[25cqw] bg-[var(--theme-secondary)]/30 rounded-[99cqw] blur-[4cqw] pointer-events-none" />
                <div className="absolute -bottom-[10cqw] -right-[10cqw] w-[25cqw] h-[25cqw] bg-[var(--theme-primary)]/10 rounded-[99cqw] blur-[4cqw] pointer-events-none" />

                <EditableElement
                    as="h1"
                    className="text-[5.5cqw] font-bold theme-heading leading-tight mb-[2cqw] tracking-tight max-w-[65cqw] z-10"
                    value={title || "Ready to Take the Next Step?"}
                    onChange={(val) => onUpdateSlide?.("title", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Enter CTA Headline"
                />

                <EditableElement
                    as="p"
                    className="text-[2.0cqw] theme-text-muted max-w-[55cqw] mb-[3.5cqw] leading-relaxed z-10"
                    value={subtitle || "Join us and discover the power of intelligent presentation layouts."}
                    onChange={(val) => onUpdateSlide?.("subtitle", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Enter description here..."
                />

                <div className="flex flex-col items-center gap-[2cqw] z-10">
                    <EditableElement
                        as="div"
                        className="theme-bg-primary rounded-[1.2cqw] px-[4.5cqw] py-[1.2cqw] text-[1.8cqw] font-bold text-center cursor-pointer shadow-md hover:opacity-90 w-fit"
                        value={company || "Get Started"}
                        onChange={(val) => onUpdateSlide?.("company", val)}
                        readOnly={!onUpdateSlide}
                        placeholder="Button Text"
                    />

                    {date && (
                        <EditableElement
                            as="span"
                            className="text-[1.4cqw] theme-text-muted hover:underline"
                            value={date}
                            onChange={(val) => onUpdateSlide?.("date", val)}
                            readOnly={!onUpdateSlide}
                            placeholder="Optional subtext/date..."
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClosingCTA;
