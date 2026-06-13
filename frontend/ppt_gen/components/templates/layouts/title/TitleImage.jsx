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
        <div className="flex flex-row items-stretch justify-between h-[48.25em] gap-[3em] w-full">
            {/* Left Column: Image with outline */}
            <div 
                onClick={() => onEditImage?.({
                    type: "slide",
                    currentQuery: imageDescription || (image && !image.startsWith("http") ? image : ""),
                    currentUrl: image
                })}
                className={`w-[45%] h-full relative rounded-[1em] overflow-hidden theme-border border-[0.15em] bg-muted shrink-0 group/img ${onEditImage ? "cursor-pointer" : ""}`}
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
                                <span className="text-[1.2em] font-semibold text-white bg-black/60 px-[1em] py-[0.5em] rounded-md border border-white/20">
                                    Edit Title Image
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Right Column: Title info inside an outlined container */}
            <div className="flex-1 flex flex-col justify-center relative border-[0.1em] theme-border rounded-[1em] p-[3em] overflow-hidden">
                {/* SVG corner brackets for a modern, unique tech outline look */}
                <svg 
                    className="absolute top-[1.2em] left-[1.2em] w-[2em] h-[2em] text-primary/40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                >
                    <path d="M10 4H4v6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg 
                    className="absolute bottom-[1.2em] right-[1.2em] w-[2em] h-[2em] text-primary/40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                >
                    <path d="M14 20h6v-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                
                <div className="flex flex-col gap-[1em] z-10">
                    <EditableElement
                        as="h1"
                        className={`font-bold leading-tight theme-text-primary w-full ${(() => {
                            const len = title?.length || 0;
                            if (len > 35) return "text-[2.4em]";
                            if (len > 22) return "text-[3.2em]";
                            return "text-[4.2em]";
                        })()}`}
                        value={title}
                        onChange={(val) => onUpdateSlide?.("title", val)}
                        readOnly={!onUpdateSlide}
                        placeholder="Slide Title"
                    />

                    <EditableElement
                        as="p"
                        className="text-[1.8em] theme-text-muted leading-relaxed"
                        value={subtitle || ""}
                        onChange={(val) => onUpdateSlide?.("subtitle", val)}
                        readOnly={!onUpdateSlide}
                        placeholder="Add subtitle..."
                    />
                </div>

                <div className="flex flex-col mt-[2em] gap-[0.5em] z-10">
                    {presenter && (
                        <EditableElement
                            as="div"
                            className="text-[1.5em] font-bold theme-text-primary"
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
