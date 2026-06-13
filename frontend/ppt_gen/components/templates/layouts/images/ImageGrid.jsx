import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const ImageGrid = ({ content, onUpdateItem, onDeleteItem, onAddItem, onEditImage }) => {
    const n = content.length;
    
    let gridCols = "grid-cols-3";
    let gapClass = "gap-[2.5em]";
    let imgHeight = "h-[22em]";
    let headerSize = "text-[1.6em]";
    let descSize = "text-[1.2em]";
    let padClass = "p-[1.0em]";
    let marginClass = "mb-[0.4em]";
    let lineClamp = "line-clamp-4";
    let containerClass = `grid ${gridCols} ${gapClass} max-w-[95cqw] mx-auto my-[1.5em]`;

    if (n === 1) {
        gridCols = "grid-cols-1";
        imgHeight = "h-[34em]";
        headerSize = "text-[2.0em]";
        descSize = "text-[1.4em]";
        padClass = "p-[1.4em]";
        marginClass = "mb-[0.5em]";
        lineClamp = "line-clamp-4";
        containerClass = "grid grid-cols-1 max-w-[48cqw] mx-auto my-[1.5em]";
    } else if (n === 2) {
        gridCols = "grid-cols-2";
        imgHeight = "h-[28em]";
        headerSize = "text-[1.8em]";
        descSize = "text-[1.3em]";
        padClass = "p-[1.2em]";
        marginClass = "mb-[0.4em]";
        lineClamp = "line-clamp-4";
        containerClass = "grid grid-cols-2 gap-[3em] max-w-[85cqw] mx-auto my-[1.5em]";
    } else if (n === 3) {
        gridCols = "grid-cols-3";
        imgHeight = "h-[22em]";
        headerSize = "text-[1.5em]";
        descSize = "text-[1.1em]";
        padClass = "p-[1.0em]";
        marginClass = "mb-[0.4em]";
        lineClamp = "line-clamp-4";
        containerClass = `grid ${gridCols} ${gapClass} max-w-[95cqw] mx-auto my-[1.5em]`;
    } else if (n === 4) {
        gridCols = "grid-cols-2";
        gapClass = "gap-[1.5em] gap-y-[2em]";
        imgHeight = "h-[14em]";
        headerSize = "text-[1.4em]";
        descSize = "text-[1.0em]";
        padClass = "p-[0.8em]";
        marginClass = "mb-[0.3em]";
        lineClamp = "line-clamp-2";
        containerClass = `grid ${gridCols} ${gapClass} max-w-[78cqw] mx-auto my-[1.0em]`;
    } else if (n === 5) {
        gridCols = "grid-cols-3";
        gapClass = "gap-[1.5em] gap-y-[2em]";
        imgHeight = "h-[12em]";
        headerSize = "text-[1.2em]";
        descSize = "text-[0.9em]";
        padClass = "p-[0.7em]";
        marginClass = "mb-[0.2em]";
        lineClamp = "line-clamp-2";
        containerClass = `grid ${gridCols} ${gapClass} max-w-[92cqw] mx-auto my-[1.0em]`;
    } else if (n >= 6) {
        gridCols = "grid-cols-3";
        gapClass = "gap-[1.5em] gap-y-[2em]";
        imgHeight = "h-[12em]";
        headerSize = "text-[1.2em]";
        descSize = "text-[0.9em]";
        padClass = "p-[0.7em]";
        marginClass = "mb-[0.2em]";
        lineClamp = "line-clamp-2";
        containerClass = `grid ${gridCols} ${gapClass} max-w-[95cqw] mx-auto my-[1.0em]`;
    }

    return (
        <div className={containerClass + " h-full"}>
            {content.map((ele, i) => {
                const imgUrl = ele.image || `https://picsum.photos/seed/${i + 10}/800/600`;
                
                return (
                    <div key={i} className="flex flex-col relative group/item rounded-[1.5em] theme-border border overflow-hidden ">
                        <div 
                            onClick={() => onEditImage?.({
                                type: "item",
                                itemIndex: i,
                                currentQuery: ele.imageDescription || (ele.image && !ele.image.startsWith("http") ? ele.image : ""),
                                currentUrl: ele.image
                            })}
                            className={`w-full ${imgHeight} relative overflow-hidden bg-muted group/grid-img ${onEditImage ? "cursor-pointer hover:opacity-95" : ""}`}
                        >
                            {ele.imageLoading ? (
                                <div className="w-full h-full skeleton-sweep" />
                            ) : (
                                <>
                                    <img src={imgUrl} className="w-full h-full object-cover" alt="Item visual" />
                                    {onEditImage && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/grid-img:opacity-100 flex items-center justify-center transition-opacity z-10">
                                            <span className="text-[1.2em] font-semibold text-white bg-black/60 px-[1em] py-[0.5em] rounded-md border border-white/20">Edit Image</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        
                        <div className={`${padClass} flex flex-col grow`}>
                            <EditableElement
                                as="h3"
                                className={`font-bold theme-heading ${headerSize} ${marginClass} leading-tight`}
                                value={ele.header}
                                onChange={(val) => onUpdateItem?.(i, "header", val)}
                                readOnly={!onUpdateItem}
                                placeholder="Header"
                            />
                            
                            <EditableElement
                                as="p"
                                className={`${descSize} theme-text-muted text-balance ${lineClamp}`}
                                value={ele.description}
                                onChange={(val) => onUpdateItem?.(i, "description", val)}
                                readOnly={!onUpdateItem}
                                placeholder="Description..."
                            />
                        </div>
                        
                        {onDeleteItem && (
                            <div className="absolute top-[1em] left-1/2 -translate-x-1/2 opacity-0 group-hover/item:opacity-100 z-20 bg-background rounded-md">
                                <ItemActionsMenu
                                    onAddBefore={() => onAddItem?.(i, "before")}
                                    onAddAfter={() => onAddItem?.(i, "after")}
                                    onDelete={() => onDeleteItem(i)}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ImageGrid;
