import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import {
    AlignLeft,
    AlignRight,
    LayoutGrid,
    AlignJustify,
    FileText,
    List,
    ListOrdered,
} from "lucide-react";

const ImageSplit = ({
    content,
    image,
    imageDescription,
    imageLoading,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    imageAlign,
    itemListStyle,
    onUpdateSlide,
    onEditImage,
}) => {
    // Generate a placeholder image if none provided
    const imgUrl = image || "https://picsum.photos/seed/split/1200/1600";

    const n = content.length;
    const align = imageAlign || "left";
    const style = itemListStyle || "cards";

    let containerMargin = "my-[0cqw]";
    let itemGap = "gap-[2cqw]";
    let cardPadding = "p-[2cqw]";
    let headerSize = "text-[1.8cqw]";
    let descSize = "text-[1.4cqw]";
    let headerMb = "mb-[0.5cqw]";

    if (n >= 5) {
        itemGap = "gap-[0.8cqw]";
        cardPadding = "p-[1cqw]";
        headerSize = "text-[1.3cqw]";
        descSize = "text-[1.0cqw]";
        headerMb = "mb-[0.1cqw]";
    } else if (n === 4) {
        itemGap = "gap-[1.2cqw]";
        cardPadding = "p-[1.4cqw]";
        headerSize = "text-[1.5cqw]";
        descSize = "text-[1.15cqw]";
        headerMb = "mb-[0.3cqw]";
    } else if (n === 3) {
        itemGap = "gap-[1.6cqw]";
        cardPadding = "p-[1.8cqw]";
        headerSize = "text-[1.7cqw]";
        descSize = "text-[1.3cqw]";
        headerMb = "mb-[0.4cqw]";
    } else if (n === 1) {
        itemGap = "gap-[3cqw]";
        cardPadding = "p-[3cqw]";
        headerSize = "text-[2.2cqw]";
        descSize = "text-[1.6cqw]";
        headerMb = "mb-[0.8cqw]";
    }

    let cardClass = "";
    if (style === "cards") {
        cardClass =
            "border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] rounded-[0.4cqw]";
    } else if (style === "plain") {
        cardClass =
            "border-b border-[var(--theme-card-border)] last:border-b-0 rounded-[0.2cqw]";
    } else if (style === "accent") {
        cardClass =
            "border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] rounded-[0.4cqw] overflow-hidden";
    } else if (style === "bullets" || style === "numbered") {
        cardClass = "rounded-[0.4cqw] border border-transparent";
    }

    return (
        <div
            className={`relative flex ${align === "right" ? "flex-row-reverse" : "flex-row"} w-full h-full gap-[4cqw] items-center max-w-[95cqw] mx-auto ${containerMargin} ${onUpdateSlide ? "hover:outline hover:outline-[0.2cqw] hover:outline-blue-500/40 hover:outline-offset-[0.4cqw] group/layout" : ""}`}
        >
            {/* Floating Premium Editor Dock */}
            {onUpdateSlide && (
                <div className="absolute -top-[20px] left-1/2 -translate-x-1/2 opacity-0 group-hover/layout:opacity-100 z-30 flex items-center gap-2 bg-background border border-border rounded-md p-1">
                    {/* Image Position Toggles */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => onUpdateSlide("imageAlign", "left")}
                            className={`p-1.5 rounded-sm hover:bg-accent cursor-pointer ${align === "left" ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                            title="Image on Left"
                        >
                            <AlignLeft size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => onUpdateSlide("imageAlign", "right")}
                            className={`p-1.5 rounded-sm hover:bg-accent cursor-pointer ${align === "right" ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                            title="Image on Right"
                        >
                            <AlignRight size={14} />
                        </button>
                    </div>

                    <div className="h-4 w-[1px] bg-border/80" />

                    {/* Listing Style Toggles */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() =>
                                onUpdateSlide("itemListStyle", "cards")
                            }
                            className={`p-1.5 rounded-sm hover:bg-accent cursor-pointer ${style === "cards" ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                            title="Cards Design"
                        >
                            <LayoutGrid size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                onUpdateSlide("itemListStyle", "plain")
                            }
                            className={`p-1.5 rounded-sm hover:bg-accent cursor-pointer ${style === "plain" ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                            title="Plain List Design"
                        >
                            <AlignJustify size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                onUpdateSlide("itemListStyle", "accent")
                            }
                            className={`p-1.5 rounded-sm hover:bg-accent cursor-pointer ${style === "accent" ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                            title="Left Accent Cards"
                        >
                            <FileText size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                onUpdateSlide("itemListStyle", "bullets")
                            }
                            className={`p-1.5 rounded-sm hover:bg-accent cursor-pointer ${style === "bullets" ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                            title="Bulleted List"
                        >
                            <List size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                onUpdateSlide("itemListStyle", "numbered")
                            }
                            className={`p-1.5 rounded-sm hover:bg-accent cursor-pointer ${style === "numbered" ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                            title="Numbered List"
                        >
                            <ListOrdered size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Image Side */}
            <div
                onClick={() => onEditImage?.({
                    type: "slide",
                    currentQuery: imageDescription || (image && !image.startsWith("http") ? image : ""),
                    currentUrl: image
                })}
                className={`w-[35cqw] h-[35cqw] relative rounded-[0.4cqw] overflow-hidden shrink-0 theme-border group/img-split ${onEditImage ? "hover:outline hover:outline-[0.1cqw] hover:outline-blue-500/80 hover:outline-offset-[0.1cqw] cursor-pointer" : ""}`}
            >
                {imageLoading ? (
                    <div className="w-full h-full skeleton-sweep" />
                ) : (
                    <>
                        <img
                            src={imgUrl}
                            className="w-full h-full object-contain"
                            alt="Slide visual"
                        />
                        {onEditImage && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img-split:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-[1.2cqw] font-semibold text-white bg-black/60 px-[1cqw] py-[0.5cqw] rounded-md border border-white/20">Edit Image</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className={`flex-1 flex flex-col justify-center ${itemGap}`}>
                {content.map((ele, i) => (
                    <div
                        key={i}
                        className={`flex flex-row relative group/item ${cardPadding} ${cardClass} items-start ${onUpdateItem ? "hover:outline hover:outline-[0.2cqw] hover:outline-blue-500/70 hover:outline-offset-[0.1cqw]" : ""}`}
                    >
                        {style === "accent" && (
                            <div className="absolute left-0 top-0 bottom-0 w-[0.4cqw] bg-[var(--theme-primary)]" />
                        )}
                        {style === "bullets" && (
                            <div className="w-[1.2cqw] h-[1.2cqw] rounded-full bg-[var(--theme-bullet)] mt-[0.6cqw] mr-[1.5cqw] shrink-0" />
                        )}
                        {style === "numbered" && (
                            <span className="font-heading font-black text-[2cqw] text-[var(--theme-primary)] leading-none mr-[1.5cqw] mt-[0.2cqw] shrink-0 tabular-nums">
                                {(i + 1).toString().padStart(2, "0")}
                            </span>
                        )}

                        <div className="flex-1 flex flex-col min-w-0">
                            <EditableElement
                                as="h3"
                                className={`font-bold theme-heading ${headerSize} ${headerMb} leading-tight`}
                                value={ele.header}
                                onChange={(val) =>
                                    onUpdateItem?.(i, "header", val)
                                }
                                readOnly={!onUpdateItem}
                                placeholder="Header"
                            />
                            <EditableElement
                                as="p"
                                className={`${descSize} theme-text-muted text-balance`}
                                value={ele.description}
                                onChange={(val) =>
                                    onUpdateItem?.(i, "description", val)
                                }
                                readOnly={!onUpdateItem}
                                placeholder="Description..."
                            />
                        </div>

                        {onDeleteItem && (
                            <div className="absolute -top-[1cqw] left-1/2 -translate-x-1/2 cqw opacity-0 group-hover/item:opacity-100 z-20">
                                <ItemActionsMenu
                                    onAddBefore={() => onAddItem?.(i, "before")}
                                    onAddAfter={() => onAddItem?.(i, "after")}
                                    onDelete={() => onDeleteItem(i)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageSplit;
