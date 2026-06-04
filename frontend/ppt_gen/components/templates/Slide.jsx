import React from "react";
import SlideLayout from "./layouts/SlideLayout";
import { EditableElement } from "@/components/ui/EditableElement";
import "./global-slide.css";
import "./themes.css";

const Slide = ({ slide_content, onUpdateSlide, onUpdateItem, onDeleteItem, onAddItem }) => {
    const isTitleLayout = slide_content.layout?.category === "title";

    return (
        <div
            className="slide border flex flex-col rounded-md theme-container group/slide"
            data-theme={slide_content.theme}
        >
            {!isTitleLayout && (
                <div className="flex flex-col gap-[0.5cqw] px-[4cqw] pt-[4cqw] mb-[2cqw] text-left">
                    <EditableElement
                        as="h1"
                        className="font-bold text-[4.5cqw] leading-tight"
                        value={slide_content.title}
                        onChange={(val) => onUpdateSlide?.("title", val)}
                        readOnly={!onUpdateSlide}
                        placeholder="Slide Title"
                    />
                    <EditableElement
                        as="p"
                        className="text-[2cqw] text-muted-foreground leading-normal"
                        value={slide_content.subtitle || ""}
                        onChange={(val) => onUpdateSlide?.("subtitle", val)}
                        readOnly={!onUpdateSlide}
                        placeholder="Add subtitle..."
                    />
                </div>
            )}
            <div className="relative grow p-[4cqw]">
                <SlideLayout
                    layoutCategory={slide_content.layout?.category || "title"}
                    layoutType={slide_content.layout?.type || "main"}
                    content={slide_content.items || []}
                    hero={slide_content.hero}
                    title={slide_content.title}
                    subtitle={slide_content.subtitle}
                    presenter={slide_content.presenter}
                    company={slide_content.company}
                    date={slide_content.date}
                    onUpdateSlide={onUpdateSlide}
                    onUpdateItem={onUpdateItem}
                    onDeleteItem={onDeleteItem}
                    onAddItem={onAddItem}
                />
            </div>
        </div>
    );
};

export default Slide;
