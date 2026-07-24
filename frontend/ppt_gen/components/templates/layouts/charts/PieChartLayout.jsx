"use client";
import React, { useState, useMemo } from "react";
import ChartDataSidebar from "./ChartDataSidebar";
import { Edit2 } from "lucide-react";
import AnimatedItem from "../../AnimatedItem";

const PIE_COLORS = [
    "var(--theme-primary)",
    "color-mix(in srgb, var(--theme-primary) 85%, transparent)",
    "color-mix(in srgb, var(--theme-primary) 65%, transparent)",
    "color-mix(in srgb, var(--theme-primary) 45%, transparent)",
    "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
];

const PieChartLayout = ({
    content,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    readOnly,
    block,
    onUpdateBlock,
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window !== "undefined" && window.__chartSidebarOpenForId === block?.id) {
            window.__chartSidebarOpenForId = null;
            return true;
        }
        return false;
    });
    const items = content || [];

    // Parse values and calculate total
    const parsedItems = useMemo(() => {
        return items.map(item => ({
            label: item.header || "Label",
            value: Number(item.chartValue) || Number(item.description) || 0,
        }));
    }, [items]);

    const totalValue = useMemo(() => {
        return parsedItems.reduce((acc, curr) => acc + curr.value, 0) || 1; // Prevent div by 0
    }, [parsedItems]);

    // Calculate pie slices
    const pieSlices = useMemo(() => {
        let currentAngle = -Math.PI / 2; // Start at top
        let transparencyMultipleFactor = Math.min(100 / parsedItems.length, 20);
        return parsedItems.map((item, i) => {
            const fraction = item.value / totalValue;
            const angle = fraction * 2 * Math.PI;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;

            // Large arc flag is needed if angle > 180 deg
            const largeArcFlag = angle > Math.PI ? 1 : 0;
            
            // Calculate coordinates (center is 0,0, radius is 100)
            const r = 100;
            const x1 = r * Math.cos(startAngle);
            const y1 = r * Math.sin(startAngle);
            const x2 = r * Math.cos(endAngle);
            const y2 = r * Math.sin(endAngle);

            // Path for the slice
            let path;
            if (fraction >= 0.999) {
                path = `M 0 -100 A 100 100 0 1 1 0 100 A 100 100 0 1 1 0 -100 Z`;
            } else {
                path = `M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            }

            // Calculate label position (middle of the slice)
            const midAngle = startAngle + angle / 2;
            const labelRadius = 120; // Outside the pie
            const labelX = labelRadius * Math.cos(midAngle);
            const labelY = labelRadius * Math.sin(midAngle);
            const percentage = Math.round(fraction * 100);

            return {
                id: i,
                path,
                color: `color-mix(in srgb, var(--theme-primary) ${100 - i*transparencyMultipleFactor}%, transparent)`,
                item,
                labelX,
                labelY,
                percentage,
                label: item.label,
            };
        });
    }, [parsedItems, totalValue]);

    const showPercentages = block?.layout?.showPercentages ?? false;
    const showLegends = block?.layout?.showLegends ?? false;

    const openSidebar = (e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent("trigger-close-chart-sidebar"));
        window.dispatchEvent(new CustomEvent("trigger-chart-sidebar-open"));
        setIsSidebarOpen(true);
    };

    return (
        <div className="w-full flex flex-col relative group/chart max-h-[30cqw]">
            {!readOnly && (
                <div className="absolute top-0 right-0 z-10 opacity-0 group-hover/chart:opacity-100 transition-opacity">
                    <button
                        onClick={openSidebar}
                        className="flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-md border rounded-md shadow-sm hover:bg-muted text-xs font-medium text-foreground cursor-pointer"
                    >
                        <Edit2 className="w-3 h-3" />
                        Edit Data
                    </button>
                </div>
            )}
            
            {!readOnly && (
                <ChartDataSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    items={block?.items || items}
                    onUpdateItem={onUpdateItem}
                    onAddItem={onAddItem}
                    onDeleteItem={onDeleteItem}
                    readOnly={readOnly}
                    block={block}
                    onUpdateBlock={onUpdateBlock}
                    showPercentageToggle={true}
                    showPercentages={showPercentages}
                    onTogglePercentages={onUpdateBlock ? (val) => {
                        onUpdateBlock("layout", { ...block.layout, showPercentages: val });
                    } : undefined}
                    showLegendToggle={true}
                    showLegends={showLegends}
                    onToggleLegends={onUpdateBlock ? (val) => {
                        onUpdateBlock("layout", { ...block.layout, showLegends: val });
                    } : undefined}
                    legendLabel={block?.layout?.legendLabel}
                    onUpdateLegendLabel={onUpdateBlock ? (val) => {
                        onUpdateBlock("layout", { ...block.layout, legendLabel: val });
                    } : undefined}
                />
            )}

            <div className="w-full flex-1 flex flex-col items-center justify-center pt-[2cqw] relative gap-[2cqw] min-h-0">
                {showLegends && (
                    <div className="flex flex-row justify-center w-full px-[2cqw]">
                        <div className="flex items-center gap-[1cqw]">
                            <svg viewBox="0 0 100 100" className="w-[1.5cqw] h-[1.5cqw] shrink-0 drop-shadow-sm">
                                <rect x="5" y="5" width="90" height="90" rx="20" fill="var(--theme-primary)" stroke="var(--theme-card-border)" strokeWidth="5" />
                            </svg>
                            <span className="text-[1.3cqw] font-medium theme-accent">
                                {block?.layout?.legendLabel || "Values"}
                            </span>
                        </div>
                    </div>
                )}
                <AnimatedItem index={0} className="w-full h-[30cqw] flex items-center justify-center">
                    <svg viewBox="-150 -150 300 300" className="h-full w-auto aspect-square overflow-visible">
                        {pieSlices.map((slice, i) => (
                            <g key={`slice-${i}`}>
                                <path
                                    d={slice.path}
                                    fill={slice.color}
                                    stroke="var(--theme-bg-primary)"
                                    strokeWidth="2"
                                />
                                {showPercentages && slice.percentage > 4 && (
                                    <text
                                        x={slice.labelX}
                                        y={slice.labelY}
                                        fill="var(--theme-accent)"
                                        fontSize="14"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        className="pointer-events-none drop-shadow-sm"
                                    >
                                        {slice.percentage}%
                                    </text>
                                )}
                            </g>
                        ))}
                    </svg>
                </AnimatedItem>

                <div className="flex flex-row flex-wrap justify-center gap-x-[3cqw] gap-y-[1.5cqw] w-full px-[2cqw]">
                    {pieSlices.map((slice, i) => (
                        <AnimatedItem key={i} index={i + 1} className="flex items-center gap-[1cqw]">
                            <svg viewBox="0 0 100 100" className="w-[1.5cqw] h-[1.5cqw] shrink-0 drop-shadow-sm">
                                <rect x="5" y="5" width="90" height="90" rx="20" fill={slice.color} stroke="var(--theme-card-border)" strokeWidth="5" />
                            </svg>
                            <span className="text-[1.3cqw] font-medium theme-accent truncate max-w-[15cqw]">
                                {slice.label}
                            </span>
                        </AnimatedItem>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PieChartLayout;
