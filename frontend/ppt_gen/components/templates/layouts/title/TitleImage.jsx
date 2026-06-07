import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";

const TitleImage = ({
    title,
    subtitle,
    presenter,
    image,
    imageDescription,
    imageLoading,
    onUpdateSlide,
    onEditImage
}) => {
    const imgUrl = image || "https://picsum.photos/seed/title/1200/800";

    return (
        <div className="flex flex-row items-stretch justify-between h-full min-h-[30cqw] gap-[3cqw] w-full">
            {/* Left Column: Image with outline */}
            <div 
                onClick={() => onEditImage?.({
                    type: "slide",
                    currentQuery: imageDescription || (image && !image.startsWith("http") ? image : ""),
                    currentUrl: image
                })}
                className={`w-[45%] h-full relative rounded-[1cqw] overflow-hidden theme-border border-[0.15cqw] bg-muted shrink-0 group/img ${onEditImage ? "cursor-pointer" : ""}`}
            >
                {imageLoading ? (
                    <div className="w-full h-full skeleton-sweep" />
                ) : (
                    <>
                        <img
                            src={imgUrl}
                            className="w-full h-full object-cover"
                            alt="Title visual representation"
                        />
                        {onEditImage && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center">
                                <span className="text-[1.2cqw] font-semibold text-white bg-black/60 px-[1cqw] py-[0.5cqw] rounded-md border border-white/20">
                                    Edit Title Image
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Right Column: Title info inside an outlined container */}
            <div className="flex-1 flex flex-col justify-center relative border-[0.1cqw] theme-border rounded-[1cqw] p-[3cqw] overflow-hidden">
                {/* SVG corner brackets for a modern, unique tech outline look */}
                <svg 
                    className="absolute top-[1.2cqw] left-[1.2cqw] w-[2cqw] h-[2cqw] text-primary/40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                >
                    <path d="M10 4H4v6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg 
                    className="absolute bottom-[1.2cqw] right-[1.2cqw] w-[2cqw] h-[2cqw] text-primary/40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                >
                    <path d="M14 20h6v-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                
                <div className="flex flex-col gap-[1cqw] z-10">
                    <EditableElement
                        as="h1"
                        className="text-[4.2cqw] font-bold leading-tight theme-text-primary"
                        value={title}
                        onChange={(val) => onUpdateSlide?.("title", val)}
                        readOnly={!onUpdateSlide}
                        placeholder="Slide Title"
                    />

                    <EditableElement
                        as="p"
                        className="text-[1.8cqw] theme-text-muted leading-relaxed"
                        value={subtitle || ""}
                        onChange={(val) => onUpdateSlide?.("subtitle", val)}
                        readOnly={!onUpdateSlide}
                        placeholder="Add subtitle..."
                    />
                </div>

                <div className="flex flex-col mt-[2cqw] gap-[0.5cqw] z-10">
                    {presenter && (
                        <EditableElement
                            as="div"
                            className="text-[1.5cqw] font-bold theme-text-primary"
                            value={presenter}
                            onChange={(val) => onUpdateSlide?.("presenter", val)}
                            readOnly={!onUpdateSlide}
                            placeholder="Presenter"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TitleImage;
