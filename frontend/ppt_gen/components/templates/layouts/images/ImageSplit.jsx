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

    let containerMargin = "my-[0em]";
    let itemGap = "gap-[2em]";
    let cardPadding = "p-[2em]";
    let headerSize = "text-[1.8em]";
    let descSize = "text-[1.4em]";
    let headerMb = "mb-[0.5em]";

    if (n >= 5) {
        itemGap = "gap-[0.8em]";
        cardPadding = "p-[1em]";
        headerSize = "text-[1.3em]";
        descSize = "text-[1.0em]";
        headerMb = "mb-[0.1em]";
    } else if (n === 4) {
        itemGap = "gap-[1.2em]";
        cardPadding = "p-[1.4em]";
        headerSize = "text-[1.5em]";
        descSize = "text-[1.15em]";
        headerMb = "mb-[0.3em]";
    } else if (n === 3) {
        itemGap = "gap-[1.6em]";
        cardPadding = "p-[1.8em]";
        headerSize = "text-[1.7em]";
        descSize = "text-[1.3em]";
        headerMb = "mb-[0.4em]";
    } else if (n === 1) {
        itemGap = "gap-[3em]";
        cardPadding = "p-[3em]";
        headerSize = "text-[2.2em]";
        descSize = "text-[1.6em]";
        headerMb = "mb-[0.8em]";
    }

    let cardClass = "";
    if (style === "cards") {
        cardClass =
            "border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] rounded-[0.4em]";
    } else if (style === "plain") {
        cardClass =
            "border-b border-[var(--theme-card-border)] last:border-b-0 rounded-[0.2em]";
    } else if (style === "accent") {
        cardClass =
            "border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] rounded-[0.4em] overflow-hidden";
    } else if (style === "bullets" || style === "numbered") {
        cardClass = "rounded-[0.4em] border border-transparent";
    }

    return (
        <div
            className={`relative flex ${align === "right" ? "flex-row-reverse" : "flex-row"} w-full h-full gap-[4em] items-center max-w-[95cqw] mx-auto ${containerMargin} ${onUpdateSlide ? "hover:outline hover:outline-[0.2em] hover:outline-blue-500/40 hover:outline-offset-[0.4em] group/layout" : ""}`}
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
                className={`w-[35cqw] h-[35em] relative rounded-[0.4em] overflow-hidden shrink-0 theme-border group/img-split ${onEditImage ? "hover:outline hover:outline-[0.1em] hover:outline-blue-500/80 hover:outline-offset-[0.1em] cursor-pointer" : ""}`}
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
                                <span className="text-[1.2em] font-semibold text-white bg-black/60 px-[1em] py-[0.5em] rounded-md border border-white/20">Edit Image</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className={`flex-1 flex flex-col justify-center ${itemGap}`}>
                {content.map((ele, i) => (
                    <div
                        key={i}
                        className={`flex flex-row relative group/item ${cardPadding} ${cardClass} items-start ${onUpdateItem ? "hover:outline hover:outline-[0.2em] hover:outline-blue-500/70 hover:outline-offset-[0.1em]" : ""}`}
                    >
                        {style === "accent" && (
                            <div className="absolute left-0 top-0 bottom-0 w-[0.4em] bg-[var(--theme-primary)]" />
                        )}
                        {style === "bullets" && (
                            <div className="w-[1.2em] h-[1.2em] rounded-full bg-[var(--theme-bullet)] mt-[0.6em] mr-[1.5em] shrink-0" />
                        )}
                        {style === "numbered" && (
                            <span className="font-heading font-black text-[2em] text-[var(--theme-primary)] leading-none mr-[1.5em] mt-[0.2em] shrink-0 tabular-nums">
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
                            <div className="absolute -top-[1em] left-1/2 -translate-x-1/2 cqw opacity-0 group-hover/item:opacity-100 z-20">
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
