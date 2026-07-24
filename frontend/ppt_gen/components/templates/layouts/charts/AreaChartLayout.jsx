"use client";
import React, { useState, useMemo } from "react";
import ChartDataSidebar from "./ChartDataSidebar";
import { Edit2 } from "lucide-react";
import AnimatedItem from "../../AnimatedItem";

const AreaChartLayout = ({
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

    // Parse values and find maximum for scaling
    const parsedItems = useMemo(() => {
        return items.map(item => ({
            label: item.header || "Label",
            value: Number(item.chartValue) || Number(item.description) || 0,
        }));
    }, [items]);

    const maxValue = useMemo(() => {
        const max = Math.max(...parsedItems.map(d => d.value), 0);
        return max > 0 ? max * 1.1 : 10;
    }, [parsedItems]);

    // SVG Layout Configuration
    const svgWidth = 800;
    const svgHeight = 600;
    const padding = { top: 40, right: 40, bottom: 100, left: 80 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    // Grid lines
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(pct => {
        const val = maxValue * pct;
        return {
            val,
            y: padding.top + chartHeight - (pct * chartHeight)
        };
    });

    // Calculate points
    const points = useMemo(() => {
        const xStep = chartWidth / Math.max(parsedItems.length, 1);
        return parsedItems.map((item, i) => {
            const y = padding.top + chartHeight - ((item.value / maxValue) * chartHeight);
            const x = padding.left + (i * xStep) + (xStep / 2);
            return { x, y, label: item.label, value: item.value };
        });
    }, [parsedItems, maxValue, chartWidth, chartHeight, padding.left, padding.top]);

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    let areaPath = "";
    if (points.length > 0) {
        areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;
    }

    const openSidebar = (e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent("trigger-close-chart-sidebar"));
        window.dispatchEvent(new CustomEvent("trigger-chart-sidebar-open"));
        setIsSidebarOpen(true)
    };

    const showLegends = block?.layout?.showLegends ?? false;
    const transparencyMultipleFactor = 0;

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

            <div className="w-full flex-1 flex flex-col items-center justify-center pt-[2cqw] relative min-h-0 gap-[1.5cqw]">
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
                
                <AnimatedItem index={0} className="w-full h-[35cqw] flex items-center justify-center">
                    <svg
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        className="h-full w-auto max-w-full overflow-visible"
                    >
                        <defs>
                            <linearGradient
                                id="areaGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="var(--theme-primary)"
                                    stopOpacity="0.4"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="var(--theme-primary)"
                                    stopOpacity="0.0"
                                />
                            </linearGradient>
                        </defs>

                        {/* Grid Lines & Y-Axis Labels */}
                        {gridLines.map((line, i) => (
                            <g key={`grid-${i}`}>
                                <line
                                    x1={padding.left}
                                    y1={line.y}
                                    x2={svgWidth - padding.right}
                                    y2={line.y}
                                    stroke="var(--theme-card-border)"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={padding.left - 15}
                                    y={line.y}
                                    fill="var(--theme-accent)"
                                    fontSize="24"
                                    textAnchor="end"
                                    dominantBaseline="middle"
                                >
                                    {line.val >= 1000
                                        ? (line.val / 1000).toFixed(1) + "k"
                                        : Math.round(line.val)}
                                </text>
                            </g>
                        ))}

                        {/* Area Fill */}
                        {areaPath && (
                            <path d={areaPath} fill="url(#areaGradient)" />
                        )}

                        {/* Connecting Line */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke="var(--theme-primary)"
                            strokeWidth="4"
                            strokeLinejoin="round"
                        />

                        {/* Points & X-Axis Labels */}
                        {points.map((p, i) => (
                            <g key={`point-${i}`}>
                                <circle 
                                    cx={p.x} 
                                    cy={p.y} 
                                    r="6" 
                                    fill="var(--theme-primary)"
                                    stroke="var(--theme-bg-card)"
                                    strokeWidth="2"
                                />
                                <text
                                    x={p.x}
                                    y={svgHeight - padding.bottom + 25}
                                    fill="var(--theme-accent)"
                                    fontSize="20"
                                    textAnchor="end"
                                    transform={`rotate(-45 ${p.x} ${svgHeight - padding.bottom + 25})`}
                                >
                                    {p.label}
                                </text>
                            </g>
                        ))}
                    </svg>
                </AnimatedItem>
            </div>
        </div>
    );
};

export default AreaChartLayout;
