import React from "react";
import SlideLayout from "./layouts/SlideLayout";
import { EditableElement } from "@/components/ui/EditableElement";
import "./global-slide.css";
import "./themes.css";

const Slide = ({
    slide_content,
    onUpdateSlide,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    theme,
    onEditImage,
}) => {
    const categoryLower = slide_content.layout?.category?.toLowerCase() || "";
    const hasLayout = !!slide_content.layout?.category;
    const isTitleLayout =
        categoryLower === "title" ||
        categoryLower === "titles" ||
        categoryLower === "closing" ||
        categoryLower === "closings";

    return (
        <div
            className="slide border flex flex-col theme-container group/slide"
            data-theme={theme || slide_content.theme}
        >
            {hasLayout ? (
                <>
                    {!isTitleLayout && (
                        <div className="flex flex-col gap-[0.5cqw] px-[4cqw] pt-[4cqw] mb-[2cqw] text-left w-full overflow-hidden shrink-0">
                            <EditableElement
                                as="h1"
                                className={`font-bold leading-tight truncate w-full ${(() => {
                                    const len = slide_content.title?.length || 0;
                                    if (len > 35) return "text-[2.6cqw]";
                                    if (len > 22) return "text-[3.4cqw]";
                                    return "text-[4.5cqw]";
                                })()}`}
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
                    <div
                        className={`relative grow p-[4cqw] ${isTitleLayout ? "" : "pt-0 flex items-center justify-center"}`}
                    >
                        <SlideLayout
                            layoutCategory={slide_content.layout?.category}
                            layoutType={slide_content.layout?.type || "main"}
                            content={slide_content.items || []}
                            hero={slide_content.hero}
                            image={slide_content.image}
                            imageDescription={slide_content.imageDescription}
                            imageLoading={slide_content.imageLoading}
                            title={slide_content.title}
                            subtitle={slide_content.subtitle}
                            presenter={slide_content.presenter}
                            company={slide_content.company}
                            date={slide_content.date}
                            imageAlign={slide_content.imageAlign}
                            itemListStyle={slide_content.itemListStyle}
                            onUpdateSlide={onUpdateSlide}
                            onUpdateItem={onUpdateItem}
                            onDeleteItem={onDeleteItem}
                            onAddItem={onAddItem}
                            onEditImage={onEditImage}
                        />
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground/30">
                    {/* Blank Slide until layout is received */}
                </div>
            )}
        </div>
    );
};

export default Slide;
