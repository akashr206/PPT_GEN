import React, { useRef, useEffect } from "react";
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
    onSplitSlide,
    slideIndex,
}) => {
    const categoryLower = slide_content.layout?.category?.toLowerCase() || "";
    const hasLayout = !!slide_content.layout?.category;
    const isTitleLayout =
        categoryLower === "title" ||
        categoryLower === "titles" ||
        categoryLower === "closing" ||
        categoryLower === "closings";

    const contentRef = useRef(null);

    const fitContentToSlide = () => {
        const contentEl = contentRef.current;
        if (!contentEl) return;

        // Reset to default scale before measuring
        contentEl.style.setProperty("--scale-factor", "1");

        const scrollHeight = contentEl.scrollHeight;
        const clientHeight = contentEl.clientHeight;

        if (scrollHeight > clientHeight) {
            const ratio = clientHeight / scrollHeight;
            const newScale = ratio * 0.95;

            if (newScale < 0.5) {
                // Clamp to minimum scale
                contentEl.style.setProperty("--scale-factor", "0.5");
                
                // Force sync reflow and measure again
                const finalScrollHeight = contentEl.scrollHeight;
                const finalClientHeight = contentEl.clientHeight;

                if (finalScrollHeight > finalClientHeight) {
                    // Trigger slide splitting!
                    if (onSplitSlide && slideIndex !== undefined) {
                        const items = contentEl.querySelectorAll(".group\\/item");
                        if (items.length > 1) {
                            const contentRect = contentEl.getBoundingClientRect();
                            const contentBottom = contentRect.bottom;
                            let firstOverflowingIndex = -1;

                            for (let i = 0; i < items.length; i++) {
                                const itemRect = items[i].getBoundingClientRect();
                                if (itemRect.bottom > contentBottom + 5) {
                                    firstOverflowingIndex = i;
                                    break;
                                }
                            }

                            if (firstOverflowingIndex === -1) {
                                firstOverflowingIndex = items.length - 1;
                            }

                            if (firstOverflowingIndex > 0) {
                                onSplitSlide(slideIndex, firstOverflowingIndex);
                            }
                        }
                    }
                }
            } else {
                contentEl.style.setProperty("--scale-factor", newScale.toString());
            }
        }
    };

    useEffect(() => {
        const contentEl = contentRef.current;
        if (!contentEl) return;

        // Run immediately to auto-fit on load / layout changes
        fitContentToSlide();

        let debounceTimeout;
        const handleInput = () => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                fitContentToSlide();
            }, 150); // 150ms debounce
        };

        contentEl.addEventListener("input", handleInput);

        return () => {
            contentEl.removeEventListener("input", handleInput);
            clearTimeout(debounceTimeout);
        };
    }, [slide_content, theme]);

    return (
        <div
            className="slide border flex flex-col theme-container group/slide"
            data-theme={theme || slide_content.theme}
        >
            {hasLayout ? (
                <div
                    ref={contentRef}
                    className="slide-content"
                >
                    {!isTitleLayout && (
                        <div className="flex flex-col gap-[0.5em] px-[4em] pt-[4em] mb-[2em] text-left w-full overflow-hidden shrink-0">
                            <EditableElement
                                as="h1"
                                className={`font-bold leading-tight truncate w-full ${(() => {
                                    const len = slide_content.title?.length || 0;
                                    if (len > 35) return "text-[2.6em]";
                                    if (len > 22) return "text-[3.4em]";
                                    return "text-[4.5em]";
                                })()}`}
                                value={slide_content.title}
                                onChange={(val) => onUpdateSlide?.("title", val)}
                                readOnly={!onUpdateSlide}
                                placeholder="Slide Title"
                            />
                            <EditableElement
                                as="p"
                                className="text-[2em] text-muted-foreground leading-normal"
                                value={slide_content.subtitle || ""}
                                onChange={(val) => onUpdateSlide?.("subtitle", val)}
                                readOnly={!onUpdateSlide}
                                placeholder="Add subtitle..."
                            />
                        </div>
                    )}
                    <div
                        className={`relative grow p-[4em] ${isTitleLayout ? "" : "pt-0 flex items-center justify-center"}`}
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
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground/30">
                    {/* Blank Slide until layout is received */}
                </div>
            )}
        </div>
    );
};

export default Slide;
