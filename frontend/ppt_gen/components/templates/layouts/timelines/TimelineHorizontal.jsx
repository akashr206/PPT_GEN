import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const TimelineHorizontal = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;

    // Adjust layout density based on text length to prevent overflows
    const maxChars = content.reduce((max, ele) => {
        const len = (ele.header?.length || 0) + (ele.description?.length || 0);
        return len > max ? len : max;
    }, 0);
    
    let textInflation = 0;
    if (maxChars > 220) {
        textInflation = 2;
    } else if (maxChars > 120) {
        textInflation = 1;
    }
    
    const effectiveN = n + textInflation;
    
    let padClass = "p-[1.0cqw]";
    let headerSize = "text-[1.8cqw]";
    let descSize = "text-[1.3cqw]";
    let marginClass = "mb-[0.3cqw]";
    let nodeSize = "w-[1.6cqw] h-[1.6cqw]";
    
    if (effectiveN >= 6) {
        padClass = "p-[0.5cqw]";
        headerSize = "text-[1.2cqw]";
        descSize = "text-[1.0cqw]";
        marginClass = "mb-[0.1cqw]";
        nodeSize = "w-[1.0cqw] h-[1.0cqw]";
    } else if (effectiveN >= 4) {
        padClass = "p-[0.8cqw]";
        headerSize = "text-[1.5cqw]";
        descSize = "text-[1.1cqw]";
        marginClass = "mb-[0.2cqw]";
        nodeSize = "w-[1.3cqw] h-[1.3cqw]";
    }

    const dx = 100 / n;
    const dip = 25;
    
    const yNode = (i) => i % 2 === 0 ? 50 - dip : 50 + dip;

    let pathD = "";
    if (n > 1) {
        pathD = `M ${0.5 * dx} ${yNode(0)}`;
        for (let i = 0; i < n - 1; i++) {
            const xStart = (i + 0.5) * dx;
            const yStart = yNode(i);
            const xEnd = (i + 1.5) * dx;
            const yEnd = yNode(i + 1);
            
            const cpX = xStart + dx * 0.5;
            
            pathD += ` C ${cpX} ${yStart}, ${cpX} ${yEnd}, ${xEnd} ${yEnd}`;
        }
    }

    return (
        <div className="absolute max-w-[95cqw] w-[90cqw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ height: "35cqw" }}>
            {n > 1 && (
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-0"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path
                        d={pathD}
                        fill="none"
                        stroke="var(--theme-primary)"
                        strokeWidth="0.4"
                        className="opacity-40"
                    />
                </svg>
            )}

            {content.map((ele, i) => {
                const isTop = i % 2 === 0;
                return (
                    <div 
                        key={i} 
                        className="absolute flex flex-col items-center text-center group/item"
                        style={{ 
                            left: `${(i + 0.5) * dx}%`, 
                            top: `${yNode(i)}%`, 
                            transform: 'translate(-50%, -50%)',
                            width: `${Math.floor(90 / n)}cqw`
                        }}
                    >
                        {/* Text Container - Absolute positioned above or below the node depending on alternating pattern */}
                        <div 
                            className={`absolute w-full flex flex-col items-center ${padClass}`}
                            style={{ 
                                [isTop ? "bottom" : "top"]: "100%",
                                [isTop ? "paddingBottom" : "paddingTop"]: "1.5cqw" 
                            }}
                        >
                            <EditableElement
                                as="h2"
                                className={`font-bold theme-heading ${headerSize} ${marginClass} leading-tight w-full`}
                                value={ele.header}
                                onChange={(val) => onUpdateItem?.(i, "header", val)}
                                readOnly={!onUpdateItem}
                                placeholder="Header"
                            />
                            <EditableElement
                                as="p"
                                className={`${descSize} theme-text-muted w-full text-wrap`}
                                value={ele.description}
                                onChange={(val) => onUpdateItem?.(i, "description", val)}
                                readOnly={!onUpdateItem}
                                placeholder="Description..."
                            />
                            
                            {onDeleteItem && (
                                <div className={`absolute ${isTop ? "-top-[1.2cqw]" : "-bottom-[1.2cqw]"} left-1/2 -translate-x-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity z-20`}>
                                    <ItemActionsMenu
                                        onAddBefore={() => onAddItem?.(i, "before")}
                                        onAddAfter={() => onAddItem?.(i, "after")}
                                        onDelete={() => onDeleteItem(i)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Circle Node */}
                        <div className={`${nodeSize} rounded-full theme-bg-primary theme-border z-10 flex items-center justify-center shadow-lg relative`}>
                            <div className="w-[40%] h-[40%] rounded-full" style={{ backgroundColor: "var(--theme-bg)" }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TimelineHorizontal;
