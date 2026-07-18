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

const MacroImage = ({ imageUrl, imagePrompt, imageLoading, onEditImage, readOnly, focusPoint = "center", onUpdateFocus }) => {
    const [localFocus, setLocalFocus] = React.useState(focusPoint);

    React.useEffect(() => {
        setLocalFocus(focusPoint);
    }, [focusPoint]);

    // Treat as loading if: explicitly loading, no url, or url is just a plain text query
    const resolvedUrl = isRealImageUrl(imageUrl) ? imageUrl : null;
    const isLoading = imageLoading || !resolvedUrl;

    return (
        <div className="relative w-full h-full bg-muted/20 group/macroimage overflow-hidden flex items-center justify-center">
            {isLoading ? (
                <Skeleton className="w-full h-full skeleton-sweep absolute inset-0" />
            ) : (
                <img 
                    src={resolvedUrl} 
                    className="w-full h-full object-cover" 
                    style={{ objectPosition: localFocus }}
                    alt="Slide" 
                />
            )}
            
            {/* Hover Edit & Focus Overlay */}
            {!readOnly && (onEditImage || onUpdateFocus) && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/macroimage:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    {onEditImage && (
                        <button
                            onClick={() => onEditImage({ type: "slide", currentQuery: imagePrompt })}
                            className="flex items-center gap-2 px-4 py-2 bg-background/90 hover:bg-background text-foreground rounded-full shadow-lg border border-border transition-transform hover:scale-105 cursor-pointer"
                        >
                            <ImageIcon size={18} />
                            <span className="text-sm font-medium">Edit Image</span>
                        </button>
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

export default MacroImage;
