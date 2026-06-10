import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const ImageGrid = ({ content, onUpdateItem, onDeleteItem, onAddItem, onEditImage }) => {
    const n = content.length;
    
    let gridCols = "grid-cols-3";
    let gapClass = "gap-[2.5cqw]";
    let imgHeight = "h-[15cqw]";
    let headerSize = "text-[1.6cqw]";
    let descSize = "text-[1.2cqw]";
    let padClass = "p-[1.4cqw]";
    let marginClass = "mb-[0.6cqw]";
    let lineClamp = "line-clamp-4";
    let containerClass = `grid ${gridCols} ${gapClass} max-w-[95cqw] mx-auto my-[1.5cqw] items-start`;

    if (n === 1) {
        gridCols = "grid-cols-1";
        imgHeight = "h-[22cqw]";
        headerSize = "text-[2.0cqw]";
        descSize = "text-[1.4cqw]";
        padClass = "p-[1.8cqw]";
        marginClass = "mb-[0.6cqw]";
        lineClamp = "line-clamp-4";
        containerClass = "grid grid-cols-1 max-w-[45cqw] mx-auto my-[1.5cqw] items-start";
    } else if (n === 2) {
        gridCols = "grid-cols-2";
        imgHeight = "h-[18cqw]";
        headerSize = "text-[1.8cqw]";
        descSize = "text-[1.3cqw]";
        padClass = "p-[1.5cqw]";
        marginClass = "mb-[0.5cqw]";
        lineClamp = "line-clamp-4";
        containerClass = "grid grid-cols-2 gap-[3cqw] max-w-[80cqw] mx-auto my-[1.5cqw] items-start";
    } else if (n === 3) {
        gridCols = "grid-cols-3";
        imgHeight = "h-[14cqw]";
        headerSize = "text-[1.5cqw]";
        descSize = "text-[1.1cqw]";
        padClass = "p-[1.2cqw]";
        marginClass = "mb-[0.4cqw]";
        lineClamp = "line-clamp-4";
        containerClass = `grid ${gridCols} ${gapClass} max-w-[95cqw] mx-auto my-[1.5cqw] items-start`;
    } else if (n === 4) {
        gridCols = "grid-cols-2";
        gapClass = "gap-[1.5cqw] gap-y-[2cqw]";
        imgHeight = "h-[9.5cqw]";
        headerSize = "text-[1.4cqw]";
        descSize = "text-[1.0cqw]";
        padClass = "p-[1.0cqw]";
        marginClass = "mb-[0.3cqw]";
        lineClamp = "line-clamp-2";
        containerClass = `grid ${gridCols} ${gapClass} max-w-[75cqw] mx-auto my-[1.0cqw] items-start`;
    } else if (n === 5) {
        gridCols = "grid-cols-3";
        gapClass = "gap-[1.5cqw] gap-y-[2cqw]";
        imgHeight = "h-[8.5cqw]";
        headerSize = "text-[1.2cqw]";
        descSize = "text-[0.9cqw]";
        padClass = "p-[0.9cqw]";
        marginClass = "mb-[0.2cqw]";
        lineClamp = "line-clamp-2";
        containerClass = `grid ${gridCols} ${gapClass} max-w-[90cqw] mx-auto my-[1.0cqw] items-start`;
    } else if (n >= 6) {
        gridCols = "grid-cols-3";
        gapClass = "gap-[1.5cqw] gap-y-[2cqw]";
        imgHeight = "h-[8.5cqw]";
        headerSize = "text-[1.2cqw]";
        descSize = "text-[0.9cqw]";
        padClass = "p-[0.9cqw]";
        marginClass = "mb-[0.2cqw]";
        lineClamp = "line-clamp-2";
        containerClass = `grid ${gridCols} ${gapClass} max-w-[95cqw] mx-auto my-[1.0cqw] items-start`;
    }

    return (
        <div className={containerClass + " h-full"}>
            {content.map((ele, i) => {
                const imgUrl = ele.image || `https://picsum.photos/seed/${i + 10}/800/600`;
                
                return (
                    <div key={i} className="flex flex-col relative group/item rounded-[1.5cqw] theme-border border overflow-hidden ">
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
                                            <span className="text-[1.2cqw] font-semibold text-white bg-black/60 px-[1cqw] py-[0.5cqw] rounded-md border border-white/20">Edit Image</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        
                        <div className={`${padClass} flex flex-col`}>
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
                            <div className="absolute top-[1cqw] left-1/2 -translate-x-1/2 opacity-0 group-hover/item:opacity-100 z-20 bg-background rounded-md">
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
