import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const TitleMain = ({ title, subtitle, presenter, company, date, onUpdateSlide }) => {
    return (
        <div className="flex flex-col justify-center items-center text-center h-full min-h-[30cqw] py-[3cqw] px-[4cqw] relative">
            {company && (
                <EditableElement
                    as="div"
                    className="theme-badge mb-[2.5cqw] px-[1.5cqw] py-[0.5cqw] rounded-full text-[1.4cqw] font-semibold"
                    value={company}
                    onChange={(val) => onUpdateSlide?.("company", val)}
                    readOnly={!onUpdateSlide}
                    placeholder="Company Name"
                />
            )}
            
            <EditableElement
                as="h1"
                className="text-[5.8cqw] font-bold theme-heading leading-tight max-w-[85cqw] mb-[2.5cqw]"
                value={title}
                onChange={(val) => onUpdateSlide?.("title", val)}
                readOnly={!onUpdateSlide}
                placeholder="Slide Title"
            />
            
            <div className="w-[14cqw] h-[0.4cqw] theme-bg-primary rounded-full mb-[3cqw]" />
            
            <EditableElement
                as="p"
                className="text-[2.2cqw] theme-text-muted max-w-[75cqw] mb-[4cqw] leading-relaxed"
                value={subtitle || ""}
                onChange={(val) => onUpdateSlide?.("subtitle", val)}
                readOnly={!onUpdateSlide}
                placeholder="Add subtitle..."
            />
            
            {(presenter || date) && (
                <div className="flex items-center gap-[2cqw] text-[1.6cqw] theme-text-muted mt-auto pt-[2cqw]">
                    {presenter && (
                        <EditableElement
                            as="span"
                            className="font-bold theme-text-primary"
                            value={presenter}
                            onChange={(val) => onUpdateSlide?.("presenter", val)}
                            readOnly={!onUpdateSlide}
                            placeholder="Presenter"
                        />
                    )}
                    {presenter && date && <span className="opacity-40">|</span>}
                    {date && (
                        <EditableElement
                            as="span"
                            value={date}
                            onChange={(val) => onUpdateSlide?.("date", val)}
                            readOnly={!onUpdateSlide}
                            placeholder="Date"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default TitleMain;
