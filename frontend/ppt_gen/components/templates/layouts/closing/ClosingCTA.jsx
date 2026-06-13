import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const ClosingCTA = ({ title, subtitle, company, date, onUpdateSlide }) => {
    return (
        <div className="flex flex-col justify-center items-center text-center h-full min-h-[30em] py-[3.5em] px-[6em] relative">
            <div className="max-w-[75cqw] w-full flex flex-col justify-center items-center p-[4em] rounded-[2.5em] border-[0.2em] theme-border bg-[var(--theme-card-bg)] shadow-xl relative overflow-hidden">
                {/* Background accent glow */}
                <div className="absolute -top-[10em] -left-[10em] w-[25cqw] h-[25em] bg-[var(--theme-secondary)]/30 rounded-[99em] blur-[4em] pointer-events-none" />
                <div className="absolute -bottom-[10em] -right-[10em] w-[25cqw] h-[25em] bg-[var(--theme-primary)]/10 rounded-[99em] blur-[4em] pointer-events-none" />

                <EditableElement
                    as="h1"
                    className="text-[5.5em] font-bold theme-heading leading-tight mb-[2em] tracking-tight max-w-[65cqw] z-10"
                    value={title || "Ready to Take the Next Step?"}
                    onChange={(val) => onUpdateSlide?.("title", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Enter CTA Headline"
                />

                <EditableElement
                    as="p"
                    className="text-[2.0em] theme-text-muted max-w-[55cqw] mb-[3.5em] leading-relaxed z-10"
                    value={subtitle || "Join us and discover the power of intelligent presentation layouts."}
                    onChange={(val) => onUpdateSlide?.("subtitle", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Enter description here..."
                />

                <div className="flex flex-col items-center gap-[2em] z-10">
                    <EditableElement
                        as="div"
                        className="theme-bg-primary rounded-[1.2em] px-[4.5em] py-[1.2em] text-[1.8em] font-bold text-center cursor-pointer shadow-md hover:opacity-90 w-fit"
                        value={company || "Get Started"}
                        onChange={(val) => onUpdateSlide?.("company", val)}
                        readOnly={!onUpdateSlide}
                        placeholder="Button Text"
                    />

                    {date && (
                        <EditableElement
                            as="span"
                            className="text-[1.4em] theme-text-muted hover:underline"
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
