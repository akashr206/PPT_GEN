import React, { useRef, useState, useEffect } from "react";
import { GripVertical, GripHorizontal } from "lucide-react";

const BlockResizer = ({ onResize, onResizeEnd, initialSplitRatio = 50, direction = "horizontal", isContentBlock = false }) => {
    const [isDragging, setIsDragging] = useState(false);
    const resizerRef = useRef(null);
    const startPosRef = useRef(0);
    const startRatioRef = useRef(0);
    const containerSizeRef = useRef(0);

    const isVertical = direction === "vertical";

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const delta = isVertical ? (e.clientY - startPosRef.current) : (e.clientX - startPosRef.current);
            const deltaPercent = (delta / containerSizeRef.current) * 100;

            const newRatio = Math.max(10, Math.min(90, startRatioRef.current + deltaPercent));

            if (onResize) onResize(newRatio);
        };

        const handleMouseUp = (e) => {
            setIsDragging(false);
            document.body.style.cursor = "";
            
            if (onResizeEnd) {
                const delta = isVertical ? (e.clientY - startPosRef.current) : (e.clientX - startPosRef.current);
                const deltaPercent = (delta / containerSizeRef.current) * 100;
                const newRatio = Math.max(10, Math.min(90, startRatioRef.current + deltaPercent));
                
                onResizeEnd(newRatio);
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
            document.body.style.cursor = "";
        };
    }, [isDragging, onResize, onResizeEnd, isVertical]);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        startPosRef.current = isVertical ? e.clientY : e.clientX;
        startRatioRef.current = initialSplitRatio;
        
        if (resizerRef.current && resizerRef.current.parentElement) {
            const rect = resizerRef.current.parentElement.getBoundingClientRect();
            containerSizeRef.current = isVertical ? rect.height : rect.width;
        } else {
            containerSizeRef.current = isVertical ? window.innerHeight : window.innerWidth;
        }
    };

    if (isVertical) {
        return (
            <div
                ref={resizerRef}
                className={`h-[0.5cqw] group/resizer flex justify-center items-center cursor-row-resize shrink-0 z-40 transition-colors ${isDragging ? "bg-blue-500/20" : ""}`}
                onMouseDown={handleMouseDown}
            >
                <div
                    className={`w-[4cqw] h-[0.2cqw] rounded-full transition-colors flex items-center justify-center ${isDragging ? "bg-primary text-primary-foreground" : "bg-muted-foreground/30 text-muted-foreground group-hover/resizer:bg-primary/50 group-hover/resizer:text-primary"}`}
                >
                    <GripHorizontal className="w-[0.5cqw] h-[0.5cqw] opacity-0 group-hover/resizer:opacity-100" />
                </div>
            </div>
        );
    }

    return (
        <div
            ref={resizerRef}  
            className={`w-[0.5cqw] group/resizer flex justify-center items-center cursor-col-resize shrink-0 z-40 transition-colors ${isDragging ? 'bg-blue-500/20' : ''}`}
            onMouseDown={handleMouseDown}
        >
            <div className={`h-[4cqw] w-[0.2cqw] rounded-full transition-colors flex items-center justify-center ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-muted-foreground group-hover/resizer:bg-blue-500/50 group-hover/resizer:text-primary'}`}>
                 <GripVertical className="w-[0.5cqw] h-[0.5cqw] opacity-0 group-hover/resizer:opacity-100" />
            </div>
        </div>
    );
};

export default BlockResizer;
