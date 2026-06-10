"use client";

import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import { ColumnActionsMenu } from "@/components/ui/ColumnActionsMenu";

const TableStriped = ({ content, onUpdateSlide }) => {
    const n = content.length;

    if (n === 0) {
        return (
            <div className="max-w-[90cqw] mx-auto my-[2cqw] text-center text-[1.6cqw] theme-text-muted">
                No items available.
            </div>
        );
    }

    // Determine number of columns from the first item, fallback to 2
    const firstItemCells = content[0]?.cells;
    const numCols = firstItemCells ? firstItemCells.length : 2;

    // Bootstrap cells array for all items if they don't exist
    const normalizedContent = content.map((item) => {
        const cells = item.cells ? [...item.cells] : [item.header || "", item.description || ""];
        // Pad or truncate to match numCols
        while (cells.length < numCols) cells.push("");
        if (cells.length > numCols) cells.length = numCols;
        return { ...item, cells };
    });

    const headerRow = normalizedContent[0];
    const dataRows = normalizedContent.slice(1);

    const getColWidth = (colIdx, totalCols) => {
        if (totalCols <= 1) return "100%";
        if (colIdx === 0) {
            return totalCols === 2 ? "30%" : totalCols === 3 ? "25%" : "20%";
        }
        const remaining = totalCols === 2 ? 70 : totalCols === 3 ? 75 : 80;
        return `${remaining / (totalCols - 1)}%`;
    };

    // Dynamic sizing based on row count to prevent vertical overflow and optimize space
    let paddingClass = "py-[1.6cqw] px-[2.0cqw]";
    let headerTextSize = "text-[2.0cqw]";
    let rowTextSize = "text-[1.6cqw]";
    if (n > 9) {
        paddingClass = "py-[0.6cqw] px-[1.2cqw]";
        headerTextSize = "text-[1.3cqw]";
        rowTextSize = "text-[1.1cqw]";
    } else if (n > 6) {
        paddingClass = "py-[1.2cqw] px-[1.6cqw]";
        headerTextSize = "text-[1.7cqw]";
        rowTextSize = "text-[1.4cqw]";
    } else if (n <= 4) {
        paddingClass = "py-[2.0cqw] px-[2.4cqw]";
        headerTextSize = "text-[2.2cqw]";
        rowTextSize = "text-[1.8cqw]";
    }

    const updateCell = (rowIdx, colIdx, val) => {
        const newItems = [...normalizedContent];
        const item = { ...newItems[rowIdx] };
        const cells = [...item.cells];
        cells[colIdx] = val;
        
        item.cells = cells;
        if (colIdx === 0) item.header = val;
        if (colIdx === 1) item.description = val;
        
        newItems[rowIdx] = item;
        onUpdateSlide?.("items", newItems);
    };

    const addColumn = (colIdx, direction) => {
        const insertIndex = direction === "before" ? colIdx : colIdx + 1;
        const newItems = normalizedContent.map((item) => {
            const cells = [...item.cells];
            cells.splice(insertIndex, 0, "New Column");
            return {
                ...item,
                cells,
                header: cells[0],
                description: cells[1] || "",
            };
        });
        onUpdateSlide?.("items", newItems);
    };

    const deleteColumn = (colIdx) => {
        if (numCols <= 1) return;
        const newItems = normalizedContent.map((item) => {
            const cells = [...item.cells];
            cells.splice(colIdx, 1);
            return {
                ...item,
                cells,
                header: cells[0] || "",
                description: cells[1] || "",
            };
        });
        onUpdateSlide?.("items", newItems);
    };

    const addRow = (rowIdx, direction) => {
        const newItems = [...normalizedContent];
        const cells = Array(numCols).fill("");
        cells[0] = "New Row Item";
        const newItem = {
            header: cells[0],
            description: cells[1] || "",
            cells,
        };
        const insertIndex = direction === "before" ? rowIdx : rowIdx + 1;
        newItems.splice(insertIndex, 0, newItem);
        onUpdateSlide?.("items", newItems);
    };

    const deleteRow = (rowIdx) => {
        const newItems = normalizedContent.filter((_, idx) => idx !== rowIdx);
        onUpdateSlide?.("items", newItems);
    };

    return (
        <div className="relative w-full h-full flex flex-col justify-center py-[1cqw]">
            <div className="max-w-[90cqw] w-full mx-auto overflow-hidden rounded-[0.5cqw] border-[0.1cqw]" style={{ borderColor: "var(--theme-card-border)" }}>
                <table className="w-full border-collapse text-left table-fixed">
                    <colgroup>
                        {Array.from({ length: numCols }).map((_, colIdx) => (
                            <col key={colIdx} style={{ width: getColWidth(colIdx, numCols) }} />
                        ))}
                        {onUpdateSlide && <col style={{ width: "4cqw" }} />}
                    </colgroup>
                    <thead>
                        <tr style={{ backgroundColor: "var(--theme-primary)", color: "var(--theme-bg)" }}>
                            {headerRow.cells.map((cell, colIdx) => (
                                <th key={colIdx} className={`${paddingClass} ${headerTextSize} font-bold relative group/colHeader`}>
                                    <div className="flex items-center justify-between gap-[0.5cqw]">
                                        <EditableElement
                                            as="span"
                                            className="w-full bg-transparent border-none focus:outline-none"
                                            value={cell}
                                            onChange={(val) => updateCell(0, colIdx, val)}
                                            readOnly={!onUpdateSlide}
                                            placeholder={`Column ${colIdx + 1}`}
                                        />
                                        {onUpdateSlide && (
                                            <div className="opacity-0 group-hover/colHeader:opacity-100 group-focus-within/colHeader:opacity-100 data-[menu-open=true]:opacity-100 transition-opacity">
                                                <ColumnActionsMenu
                                                    onAddBefore={() => addColumn(colIdx, "before")}
                                                    onAddAfter={() => addColumn(colIdx, "after")}
                                                    onDelete={numCols > 1 ? () => deleteColumn(colIdx) : null}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {onUpdateSlide && <th className="w-[4cqw] p-0" />}
                        </tr>
                    </thead>
                    <tbody>
                        {dataRows.map((row, i) => {
                            const actualIdx = i + 1;
                            const isEven = i % 2 === 0;
                            const rowBg = isEven ? "var(--theme-bg-alt)" : "var(--theme-card-bg)";
                            return (
                                <tr 
                                    key={i} 
                                    className="group/row border-b-[0.1cqw] last:border-b-0"
                                    style={{ 
                                        backgroundColor: rowBg,
                                        borderColor: "var(--theme-card-border)" 
                                    }}
                                >
                                    {row.cells.map((cell, colIdx) => (
                                        <td key={colIdx} className={`${paddingClass} ${rowTextSize} align-top`}>
                                            <EditableElement
                                                as="span"
                                                className={`w-full block bg-transparent border-none focus:outline-none ${colIdx === 0 ? "font-semibold" : ""}`}
                                                value={cell}
                                                onChange={(val) => updateCell(actualIdx, colIdx, val)}
                                                readOnly={!onUpdateSlide}
                                                placeholder="Text..."
                                            />
                                        </td>
                                    ))}
                                    {onUpdateSlide && (
                                        <td className="relative w-[4cqw] p-0 align-middle text-center">
                                            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-0 group-hover/row:opacity-100 transition-opacity z-20">
                                                <ItemActionsMenu
                                                    onAddBefore={() => addRow(actualIdx, "before")}
                                                    onAddAfter={() => addRow(actualIdx, "after")}
                                                    onDelete={() => deleteRow(actualIdx)}
                                                />
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableStriped;
