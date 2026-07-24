import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ChartDataEditor from "./ChartDataEditor";
import { X, BarChart2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ChartDataSidebar = ({ isOpen, onClose, ...editorProps }) => {
    const { showPercentageToggle, showPercentages, onTogglePercentages, showLegendToggle, showLegends, onToggleLegends, legendLabel, onUpdateLegendLabel, ...restEditorProps } = editorProps;
    const [portalRoot, setPortalRoot] = useState(null);

    useEffect(() => {
        setPortalRoot(document.getElementById("sidebar-portal-root"));
        
        const handleCloseEvent = () => onClose();
        window.addEventListener("trigger-close-chart-sidebar", handleCloseEvent);
        return () => window.removeEventListener("trigger-close-chart-sidebar", handleCloseEvent);
    }, [onClose]);

    if (!isOpen) return null;

    const sidebarContent = (
        <>
            {/* Mobile Backdrop */}
            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }} 
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden pointer-events-auto" 
            />
            
            {/* Sidebar */}
            <div 
                onClick={(e) => e.stopPropagation()}
                className="fixed inset-y-0 right-0 lg:relative lg:inset-auto w-[340px] sm:w-[380px] lg:w-[420px] border-l border-border bg-card flex flex-col shrink-0 animate-in slide-in-from-right duration-200 z-50 shadow-2xl lg:shadow-none pt-12 lg:pt-0 pointer-events-auto"
            >
                <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/10">
                    <div className="flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-primary" />
                        <div className="flex flex-col">
                            <h3 className="font-bold text-sm text-foreground">Edit Chart Data</h3>
                            <span className="text-[10px] text-muted-foreground">Modify labels and values</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                        Close
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 bg-muted/10 flex flex-col gap-4">
                    {showPercentageToggle && (
                        <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg shadow-sm">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-semibold text-foreground">Show Percentages</span>
                                <span className="text-[10px] text-muted-foreground">Display % labels on the pie chart</span>
                            </div>
                            <Switch 
                                checked={showPercentages} 
                                onCheckedChange={onTogglePercentages} 
                            />
                        </div>
                    )}
                    {showLegendToggle && (
                        <div className="flex flex-col gap-3 p-3 bg-card border border-border rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-semibold text-foreground">Show Legends</span>
                                    <span className="text-[10px] text-muted-foreground">Display legend on top</span>
                                </div>
                                <Switch 
                                    checked={showLegends} 
                                    onCheckedChange={onToggleLegends} 
                                />
                            </div>
                            {showLegends && onUpdateLegendLabel && (
                                <div className="flex flex-col gap-1.5 mt-1 border-t border-border pt-3">
                                    <span className="text-xs font-medium text-foreground">Legend Name</span>
                                    <Input 
                                        value={legendLabel || ""}
                                        onChange={(e) => onUpdateLegendLabel(e.target.value)}
                                        placeholder="e.g. Values, Sales"
                                        className="h-8 text-xs"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {restEditorProps.block && restEditorProps.onUpdateBlock && (
                        <div className="flex flex-col gap-1 p-3 bg-card border border-border rounded-lg shadow-sm">
                            <span className="text-sm font-semibold text-foreground">Chart Type</span>
                            <Select
                                value={restEditorProps.block.layout?.type || "bar"}
                                onValueChange={(val) => {
                                    window.__chartSidebarOpenForId = restEditorProps.block.id;
                                    restEditorProps.onUpdateBlock("layout", {
                                        ...restEditorProps.block.layout,
                                        type: val
                                    });
                                }}
                            >
                                <SelectTrigger className="w-full mt-2">
                                    <SelectValue placeholder="Select chart type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bar">Bar Chart</SelectItem>
                                    <SelectItem value="line">Line Chart</SelectItem>
                                    <SelectItem value="area">Area Chart</SelectItem>
                                    <SelectItem value="pie">Pie Chart</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {/* We pass a fixed cqw scale style so the editor doesn't rely on the slide's scale */}
                    <div style={{ '--cqw': '4px', fontSize: '16px' }} className="w-full">
                        <ChartDataEditor 
                            {...restEditorProps} 
                            onMoveItem={restEditorProps.onUpdateBlock ? (dragIndex, hoverIndex) => {
                                const newItems = [...(restEditorProps.block?.items || restEditorProps.items)];
                                const draggedItem = newItems[dragIndex];
                                newItems.splice(dragIndex, 1);
                                newItems.splice(hoverIndex, 0, draggedItem);
                                restEditorProps.onUpdateBlock("items", newItems);
                            } : undefined}
                        />
                    </div>
                </div>
            </div>
        </>
    );

    if (portalRoot) {
        return createPortal(sidebarContent, portalRoot);
    }

    // Fallback if portal root is missing
    return (
        <div className="fixed inset-0 z-[100] pointer-events-none top-14" style={{ position: 'fixed' }}>
            {sidebarContent}
        </div>
    );
};

export default ChartDataSidebar;
