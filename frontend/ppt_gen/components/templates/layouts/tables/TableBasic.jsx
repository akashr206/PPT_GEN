import React, { useRef, useEffect } from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { Plus, Trash2, ArrowLeftToLine, ArrowRightToLine, MoreHorizontal } from "lucide-react";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import AnimatedItem from "../../AnimatedItem";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_COLS = [
    { id: 'header', label: 'Column 1', width: 1 },
    { id: 'description', label: 'Column 2', width: 1 }
];

const TableBasic = ({ content, block, onUpdateBlock, onUpdateItem, onDeleteItem, onAddItem, readOnly }) => {
    const items = content || [];
    const tableColumns = block?.tableColumns || DEFAULT_COLS;
    const tableRef = useRef(null);
    const draggingRef = useRef(null);

    // Helper to update columns
    const updateColumns = (newCols) => {
        if (onUpdateBlock) {
            onUpdateBlock('tableColumns', newCols);
        }
    };

    const handleAddColumn = (index, position) => {
        const newCols = [...tableColumns];
        const newColId = 'col_' + Date.now();
        const newCol = { id: newColId, label: 'New Column', width: 1 };
        if (position === 'left') {
            newCols.splice(index, 0, newCol);
        } else {
            newCols.splice(index + 1, 0, newCol);
        }
        updateColumns(newCols);
    };

    const handleDeleteColumn = (index) => {
        if (tableColumns.length <= 1) return; // don't delete last col
        const newCols = tableColumns.filter((_, i) => i !== index);
        updateColumns(newCols);
    };

    const handleHeaderChange = (index, val) => {
        const newCols = [...tableColumns];
        newCols[index] = { ...newCols[index], label: val };
        updateColumns(newCols);
    };

    const handleCellChange = (rowIndex, colId, val) => {
        const item = items[rowIndex];
        
        // Handle legacy fallbacks
        if (colId === 'header' && !item.cells) {
            onUpdateItem(rowIndex, 'header', val);
            return;
        }
        if (colId === 'description' && !item.cells) {
            onUpdateItem(rowIndex, 'description', val);
            return;
        }

        const newCells = { 
            ...(item.cells || { header: item.header, description: item.description }), 
            [colId]: val 
        };
        onUpdateItem(rowIndex, 'cells', newCells);
    };

    const handleMouseDown = (e, index) => {
        e.preventDefault();
        if (readOnly) return;
        draggingRef.current = {
            index,
            startX: e.clientX,
            startWidths: tableColumns.map(c => c.width || 1),
            tableWidth: tableRef.current ? tableRef.current.getBoundingClientRect().width : 800
        };
        document.body.style.cursor = 'col-resize';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!draggingRef.current) return;
        const { index, startX, startWidths, tableWidth } = draggingRef.current;
        const deltaX = e.clientX - startX;
        
        const leftColStart = startWidths[index];
        const rightColStart = startWidths[index + 1];
        
        // Convert deltaX to fr units
        const totalFr = startWidths.reduce((a, b) => a + b, 0);
        const frDelta = (deltaX / tableWidth) * totalFr;

        let newLeftWidth = leftColStart + frDelta;
        let newRightWidth = rightColStart - frDelta;

        // Ensure minimum widths
        if (newLeftWidth < 0.2) {
            newRightWidth -= (0.2 - newLeftWidth);
            newLeftWidth = 0.2;
        }
        if (newRightWidth < 0.2) {
            newLeftWidth -= (0.2 - newRightWidth);
            newRightWidth = 0.2;
        }

        const newCols = [...tableColumns];
        newCols.forEach((col, i) => {
            newCols[i] = { ...col, width: startWidths[i] };
        });
        newCols[index].width = newLeftWidth;
        newCols[index + 1].width = newRightWidth;
        
        updateColumns(newCols);
    };

    const handleMouseUp = () => {
        draggingRef.current = null;
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        // Prevent the click event that fires after dragging to avoid opening the block menu
        const preventClick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            window.removeEventListener('click', preventClick, true);
        };
        window.addEventListener('click', preventClick, true);
        setTimeout(() => {
            window.removeEventListener('click', preventClick, true);
        }, 100);
    };

    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const gridTemplateColumns = tableColumns.map(c => `${c.width}fr`).join(" ");

    return (
        <div className="w-full flex-1 flex flex-col justify-start">
            <div
                ref={tableRef}
                className="w-full overflow-hidden rounded-[0.5cqw] border theme-border-color theme-bg-card shadow-sm flex flex-col relative"
            >
                {/* Header Row */}
                <div className="w-full theme-bg-muted flex flex-col relative group/header-row">
                    <div
                        className="w-full grid"
                        style={{ gridTemplateColumns }}
                    >
                        {tableColumns.map((col, cIdx) => (
                            <div
                                key={col.id}
                                className="relative group/col flex items-center p-[1cqw]"
                            >
                                {cIdx > 0 && (
                                    <>
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-[1px]"
                                            style={{
                                                backgroundColor:
                                                    "var(--theme-card-border)",
                                            }}
                                        />
                                        {!readOnly && (
                                            <div
                                                className="absolute left-[-4px] top-0 bottom-0 w-[8px] cursor-col-resize z-20 group-hover/header-row:bg-primary/20 opacity-0 hover:!opacity-100 transition-opacity"
                                                onMouseDown={(e) =>
                                                    handleMouseDown(e, cIdx - 1)
                                                }
                                            />
                                        )}
                                    </>
                                )}
                                <div className="flex-1 min-w-0 pr-[2cqw]">
                                    <EditableElement
                                        value={col.label}
                                        onChange={(val) =>
                                            handleHeaderChange(cIdx, val)
                                        }
                                        placeholder="Column Header"
                                        readOnly={readOnly}
                                        className="text-[1.2cqw] font-semibold theme-text-primary tracking-wider w-full"
                                    />
                                </div>
                                {!readOnly && onUpdateBlock && (
                                    <div className="absolute right-[0.2cqw] top-1/2 -translate-y-1/2 opacity-0 group-hover/col:opacity-100 transition-opacity z-10 flex items-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="theme-menu-button cursor-pointer ">
                                                    <MoreHorizontal className="w-[1.2cqw] h-[1.2cqw]" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                side="top"
                                                sideOffset={5}
                                                className="flex min-w-22 w-max bg-popover border-border text-popover-foreground rounded-[4px] shadow-2xl z-50 p-[3px] gap-[3px]"
                                            >
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() =>
                                                                    handleAddColumn(
                                                                        cIdx,
                                                                        "left",
                                                                    )
                                                                }
                                                                className="p-1.5 hover:bg-muted rounded cursor-pointer text-foreground"
                                                            >
                                                                <ArrowLeftToLine
                                                                    size={14}
                                                                />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                Add Column Left
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() =>
                                                                    handleAddColumn(
                                                                        cIdx,
                                                                        "right",
                                                                    )
                                                                }
                                                                className="p-1.5 hover:bg-muted rounded cursor-pointer text-foreground"
                                                            >
                                                                <ArrowRightToLine
                                                                    size={14}
                                                                />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                Add Column Right
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteColumn(
                                                                        cIdx,
                                                                    )
                                                                }
                                                                disabled={
                                                                    tableColumns.length <=
                                                                    1
                                                                }
                                                                className="p-1.5 hover:bg-destructive/20 text-destructive rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <Trash2
                                                                    size={14}
                                                                />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete Column</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Bottom Border for Header */}
                    <div
                        className="w-full h-[1px]"
                        style={{ backgroundColor: "var(--theme-card-border)" }}
                    />
                </div>

                {/* Body Rows */}
                <div className="flex flex-col w-full relative">
                    {items.length === 0 && !readOnly && onAddItem && (
                        <div className="w-full p-[1cqw]">
                            <button
                                onClick={() => onAddItem(0, "before")}
                                className="flex items-center justify-center gap-[0.5cqw] w-full py-[1cqw] text-[1.2cqw] text-muted-foreground/50 hover:text-primary hover:bg-primary/5 rounded-[0.5cqw] border border-dashed border-border/40 hover:border-primary/30 transition-all cursor-pointer"
                            >
                                <Plus className="w-[1.5cqw] h-[1.5cqw]" />
                                Add First Row
                            </button>
                        </div>
                    )}
                    {items.length === 0 && (readOnly || !onAddItem) && (
                        <div className="w-full p-[1.5cqw] text-center text-[1.2cqw] theme-text-muted">
                            No items to display
                        </div>
                    )}

                    {items.map((item, index) => (
                        <AnimatedItem
                            key={index}
                            index={index}
                            as="div"
                            className="group/item transition-colors hover:theme-bg-alt/50 relative flex flex-col w-full"
                        >
                            {/* Top border for rows after the first one */}
                            {index > 0 && (
                                <div
                                    className="w-full h-[1px]"
                                    style={{
                                        backgroundColor:
                                            "var(--theme-card-border)",
                                    }}
                                />
                            )}

                            {/* Item Actions Menu */}
                            {!readOnly && (onAddItem || onDeleteItem) && (
                                <div className="absolute top-[0.5cqw] left-[0.2cqw] opacity-0 group-hover/item:opacity-100 data-[menu-open=true]:opacity-100 transition-opacity z-10">
                                    <ItemActionsMenu
                                        onAddBefore={
                                            onAddItem
                                                ? () =>
                                                      onAddItem(index, "before")
                                                : undefined
                                        }
                                        onAddAfter={
                                            onAddItem
                                                ? () =>
                                                      onAddItem(index, "after")
                                                : undefined
                                        }
                                        onDelete={
                                            onDeleteItem
                                                ? () => onDeleteItem(index)
                                                : undefined
                                        }
                                    />
                                </div>
                            )}

                            <div
                                className="w-full grid"
                                style={{ gridTemplateColumns }}
                            >
                                {tableColumns.map((col, cIdx) => {
                                    const val = item.cells
                                        ? item.cells[col.id] || ""
                                        : item[col.id] || "";

                                    return (
                                        <div
                                            key={col.id}
                                            className="relative p-[1cqw] flex items-start group/cell"
                                        >
                                            {cIdx > 0 && (
                                                <>
                                                    <div
                                                        className="absolute left-0 top-0 bottom-0 w-[1px]"
                                                        style={{
                                                            backgroundColor:
                                                                "var(--theme-card-border)",
                                                        }}
                                                    />
                                                    {!readOnly && (
                                                        <div
                                                            className="absolute left-[-4px] top-0 bottom-0 w-[8px] cursor-col-resize z-20 hover:bg-primary/20 transition-colors"
                                                            onMouseDown={(e) =>
                                                                handleMouseDown(
                                                                    e,
                                                                    cIdx - 1,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </>
                                            )}
                                            <EditableElement
                                                value={val}
                                                onChange={(newVal) =>
                                                    handleCellChange(
                                                        index,
                                                        col.id,
                                                        newVal,
                                                    )
                                                }
                                                placeholder="Enter content"
                                                readOnly={readOnly}
                                                className={`text-[1.2cqw] w-full leading-relaxed font-medium theme-text-primary ${cIdx === 0 ? "ml-[2cqw]" : ""}`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </AnimatedItem>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TableBasic;
