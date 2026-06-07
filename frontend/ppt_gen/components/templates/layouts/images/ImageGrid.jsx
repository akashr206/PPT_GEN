import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const ImageGrid = ({ content, onUpdateItem, onDeleteItem, onAddItem, onEditImage }) => {
    const n = content.length;
    
    let gridCols = "grid-cols-3";
    let gapClass = "gap-[3cqw]";
    let imgHeight = "h-[15cqw]";
    let headerSize = "text-[1.8cqw]";
    let descSize = "text-[1.3cqw]";

    if (n >= 5) {
        gridCols = "grid-cols-3";
        gapClass = "gap-[2cqw]";
        imgHeight = "h-[12cqw]";
        headerSize = "text-[1.4cqw]";
        descSize = "text-[1.1cqw]";
    } else if (n === 4) {
        gridCols = "grid-cols-2";
        gapClass = "gap-[3cqw]";
        imgHeight = "h-[10cqw]";
        headerSize = "text-[2cqw]";
        descSize = "text-[1.4cqw]";
    } else if (n === 2) {
        gridCols = "grid-cols-2";
        gapClass = "gap-[4cqw]";
        imgHeight = "h-[22cqw]";
        headerSize = "text-[2cqw]";
        descSize = "text-[1.5cqw]";
    }

    return (
        <div className={`grid ${gridCols} ${gapClass} max-w-[95cqw] mx-auto my-[2cqw] items-start`}>
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
                        
                        <div className="p-[2cqw] flex flex-col">
                            <EditableElement
                                as="h3"
                                className={`font-bold theme-heading ${headerSize} mb-[0.8cqw] leading-tight`}
                                value={ele.header}
                                onChange={(val) => onUpdateItem?.(i, "header", val)}
                                readOnly={!onUpdateItem}
                                placeholder="Header"
                            />
                            
                            <EditableElement
                                as="p"
                                className={`${descSize} theme-text-muted text-balance`}
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
