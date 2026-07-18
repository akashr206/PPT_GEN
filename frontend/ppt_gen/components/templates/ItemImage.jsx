import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon } from "lucide-react";

const isRealImageUrl = (url) =>
    url &&
    (url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("data:") ||
        url.startsWith("/") ||
        url.startsWith("blob:"));

import FocusPointSelector from "./FocusPointSelector";

const ItemImage = ({ imageUrl, imagePrompt, imageLoading, onEditImage, readOnly, focusPoint = "center", onUpdateFocus }) => {
    const [localFocus, setLocalFocus] = React.useState(focusPoint);

    React.useEffect(() => {
        setLocalFocus(focusPoint);
    }, [focusPoint]);

    const resolvedUrl = isRealImageUrl(imageUrl) ? imageUrl : null;
    const isLoading = imageLoading;

    return (
        <div 
            className={`relative w-full h-full theme-bg-alt overflow-hidden flex items-center justify-center ${!readOnly && onEditImage ? "cursor-pointer group/itemimage hover:opacity-95" : ""}`}
            onClick={!readOnly && onEditImage ? onEditImage : undefined}
        >
            {isLoading ? (
                <Skeleton className="w-full h-full skeleton-sweep absolute inset-0" />
            ) : resolvedUrl ? (
                <img 
                    src={resolvedUrl} 
                    className="w-full h-full object-cover" 
                    style={{ objectPosition: localFocus }}
                    alt={imagePrompt || "Item"} 
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/10 text-muted-foreground absolute inset-0">
                    <ImageIcon size={24} className="opacity-40 mb-1" />
                    <span className="text-[10px] font-medium opacity-50 px-2 text-center line-clamp-2 leading-tight">
                        {imagePrompt || "No Image"}
                    </span>
                </div>
            )}
            
            {/* Hover Edit & Focus Overlay */}
            {!readOnly && (onEditImage || onUpdateFocus) && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/itemimage:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    {onEditImage && (
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditImage();
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-background/90 hover:bg-background text-foreground rounded-full shadow-md border border-border transition-transform scale-90 group-hover/itemimage:scale-100 cursor-pointer"
                        >
                            <ImageIcon size={14} />
                            <span className="text-xs font-medium">Edit</span>
                        </div>
                    )}
                    {onUpdateFocus && (
                        <FocusPointSelector 
                            value={focusPoint} 
                            imageUrl={resolvedUrl}
                            onChange={onUpdateFocus} 
                            onLiveChange={(val) => setLocalFocus(val)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ItemImage;
