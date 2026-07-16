import React, { useRef, useState, useEffect } from "react";
import { GripVertical, GripHorizontal } from "lucide-react";

const BlockResizer = ({ leftBlockIndex, rightBlockIndex, onResize, onResizeEnd, initialLeftWidth, initialRightWidth, direction = "horizontal" }) => {
    const [isDragging, setIsDragging] = useState(false);
    const resizerRef = useRef(null);
    const startPosRef = useRef(0);
    const startLeftWidthRef = useRef(0);
    const startRightWidthRef = useRef(0);
    const containerSizeRef = useRef(0);

    const isVertical = direction === "vertical";

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const delta = isVertical ? (e.clientY - startPosRef.current) : (e.clientX - startPosRef.current);
            const deltaPercent = (delta / containerSizeRef.current) * 100;

            const newLeftWidth = Math.max(15, Math.min(85, startLeftWidthRef.current + deltaPercent));
            const newRightWidth = Math.max(15, startRightWidthRef.current - (newLeftWidth - startLeftWidthRef.current));

            if (onResize) {
                // Adjust both adjacent blocks
                onResize(leftBlockIndex, newLeftWidth, rightBlockIndex, newRightWidth);
            }
        };

        const handleMouseUp = (e) => {
            setIsDragging(false);
            document.body.style.cursor = "default";
            
            if (onResizeEnd) {
                // Calculate final values before unmounting/ending drag
                const delta = isVertical ? (e.clientY - startPosRef.current) : (e.clientX - startPosRef.current);
                const deltaPercent = (delta / containerSizeRef.current) * 100;
                const newLeftWidth = Math.max(15, Math.min(85, startLeftWidthRef.current + deltaPercent));
                const newRightWidth = Math.max(15, startRightWidthRef.current - (newLeftWidth - startLeftWidthRef.current));
                
                onResizeEnd(leftBlockIndex, newLeftWidth, rightBlockIndex, newRightWidth);
            }
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = isVertical ? "row-resize" : "col-resize";
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, leftBlockIndex, rightBlockIndex, onResize, onResizeEnd, isVertical]);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        startPosRef.current = isVertical ? e.clientY : e.clientX;
        startLeftWidthRef.current = initialLeftWidth || 50;
        startRightWidthRef.current = initialRightWidth || 50;
        
        // Use the parent flex container size
        if (resizerRef.current && resizerRef.current.parentElement) {
            const rect = resizerRef.current.parentElement.getBoundingClientRect();
            containerSizeRef.current = isVertical ? rect.height : rect.width;
        } else {
            containerSizeRef.current = isVertical ? window.innerHeight : window.innerWidth; // Fallback
        }
    };

    if (isVertical) {
        return (
            <div
                ref={resizerRef}
                className={`h-[1cqw] group/resizer flex justify-center items-center cursor-row-resize shrink-0 z-40 transition-colors ${isDragging ? 'bg-primary/20' : 'hover:bg-muted'}`}
                onMouseDown={handleMouseDown}
            >
                <div className={`w-[4cqw] h-[0.4cqw] rounded-full transition-colors flex items-center justify-center ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground group-hover/resizer:bg-primary/50 group-hover/resizer:text-primary'}`}>
                    <GripHorizontal className="w-[1cqw] h-[1cqw] opacity-0 group-hover/resizer:opacity-100" />
                </div>
            </div>
        );
    }

    return (
        <div
            ref={resizerRef}
            className={`w-[1cqw] group/resizer flex justify-center items-center cursor-col-resize shrink-0 z-40 transition-colors ${isDragging ? 'bg-primary/20' : 'hover:bg-muted'}`}
            onMouseDown={handleMouseDown}
        >
            <div className={`h-[4cqw] w-[0.4cqw] rounded-full transition-colors flex items-center justify-center ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground group-hover/resizer:bg-primary/50 group-hover/resizer:text-primary'}`}>
                 <GripVertical className="w-[1cqw] h-[1cqw] opacity-0 group-hover/resizer:opacity-100" />
            </div>
        </div>
    );
};

export default BlockResizer;
