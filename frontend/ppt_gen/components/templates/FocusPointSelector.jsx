import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Crosshair } from "lucide-react";

export const FocusPointSelector = ({ value = "center", imageUrl, onChange, onLiveChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [localCoords, setLocalCoords] = useState({ x: 50, y: 50 });
    
    const triggerRef = useRef(null);
    const popoverRef = useRef(null);
    const previewRef = useRef(null);

    // Sync local coordinates with the value prop when not dragging
    useEffect(() => {
        if (!isDragging) {
            let pctX = 50;
            let pctY = 50;
            if (value) {
                if (value.includes("%")) {
                    const parts = value.split(" ");
                    if (parts.length === 2) {
                        pctX = parseFloat(parts[0]) || 50;
                        pctY = parseFloat(parts[1]) || 50;
                    }
                } else {
                    if (value.includes("left")) pctX = 0;
                    else if (value.includes("right")) pctX = 100;
                    
                    if (value.includes("top")) pctY = 0;
                    else if (value.includes("bottom")) pctY = 100;
                }
            }
            setLocalCoords({ x: pctX, y: pctY });
        }
    }, [value, isDragging]);

    // Position popover relative to the trigger button
    const updatePopoverPosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const popoverHeight = 160;
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;

            let top = rect.bottom + window.scrollY + 8;
            if (spaceAbove > popoverHeight && spaceBelow < popoverHeight) {
                top = rect.top + window.scrollY - popoverHeight - 8;
            }

            setCoords({
                top,
                left: rect.left + rect.width / 2 + window.scrollX,
            });
        }
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        if (!isOpen) {
            updatePopoverPosition();
        }
        setIsOpen(!isOpen);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                popoverRef.current &&
                !popoverRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Draggable math helpers
    const getClampedCoords = (clientX, clientY) => {
        if (!previewRef.current) return { x: 50, y: 50 };
        const rect = previewRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
        return { x, y };
    };

    const handleDragMove = (e) => {
        const { x, y } = getClampedCoords(e.clientX, e.clientY);
        setLocalCoords({ x, y });
        if (onLiveChange) {
            onLiveChange(`${Math.round(x)}% ${Math.round(y)}%`);
        }
    };

    const handleDragEnd = (e) => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleDragMove);
        document.removeEventListener("mouseup", handleDragEnd);

        const { x, y } = getClampedCoords(e.clientX, e.clientY);
        const finalVal = `${Math.round(x)}% ${Math.round(y)}%`;
        if (onChange) {
            onChange(finalVal);
        }
    };

    const handleDragStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);

        const { x, y } = getClampedCoords(e.clientX, e.clientY);
        setLocalCoords({ x, y });
        if (onLiveChange) {
            onLiveChange(`${Math.round(x)}% ${Math.round(y)}%`);
        }

        document.addEventListener("mousemove", handleDragMove);
        document.addEventListener("mouseup", handleDragEnd);
    };

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleDragMove);
            document.removeEventListener("mouseup", handleDragEnd);
        };
    }, []);

    return (
        <div className="relative inline-block">
            <button
                ref={triggerRef}
                onClick={handleToggle}
                className={`p-2 rounded-full shadow-lg border border-border cursor-pointer transition-all hover:scale-105 ${
                    isOpen ? "bg-primary text-primary-foreground" : "bg-background/90 hover:bg-background text-foreground"
                }`}
                title="Adjust Focus Point"
            >
                <Crosshair size={18} />
            </button>

            {isOpen && createPortal(
                <div 
                    ref={popoverRef}
                    style={{ 
                        position: "absolute", 
                        top: `${coords.top}px`, 
                        left: `${coords.left}px`,
                        transform: "translateX(-50%)",
                        zIndex: 9999
                    }}
                    className="w-40 p-2.5 bg-popover border border-border rounded-md shadow-2xl animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-[10px] font-bold text-muted-foreground text-center select-none">
                        Drag target to focus
                    </div>
                    
                    {/* Visual Preview Container */}
                    <div 
                        ref={previewRef}
                        className="relative w-full aspect-video bg-muted border border-border rounded-sm overflow-hidden cursor-crosshair select-none"
                        onMouseDown={handleDragStart}
                    >
                        {imageUrl ? (
                            <img 
                                src={imageUrl} 
                                alt="Focus preview" 
                                className="w-full h-full object-cover pointer-events-none" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500 text-[10px]">
                                No Image
                            </div>
                        )}

                        {/* Focus point indicator */}
                        <div 
                            style={{ 
                                left: `${localCoords.x}%`, 
                                top: `${localCoords.y}%`,
                                transform: "translate(-50%, -50%)"
                            }}
                            className="absolute pointer-events-none flex items-center justify-center"
                        >
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-black/30 flex items-center justify-center animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-[9px] text-muted-foreground text-center font-mono select-none">
                        {Math.round(localCoords.x)}% {Math.round(localCoords.y)}%
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default FocusPointSelector;
