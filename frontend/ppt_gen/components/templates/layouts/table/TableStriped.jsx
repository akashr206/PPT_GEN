"use client";

import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";
import { ColumnActionsMenu } from "@/components/ui/ColumnActionsMenu";

const TableStriped = ({ content, onUpdateSlide }) => {
    const n = content.length;

    if (n === 0) {
        return (
            <div className="max-w-[90cqw] mx-auto my-[2em] text-center text-[1.6em] theme-text-muted">
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

    // Dynamic sizing based on row count and cell content length to prevent vertical overflow
    const numRows = normalizedContent.length;
    let maxCellLength = 0;
    normalizedContent.forEach(item => {
        item.cells.forEach(cell => {
            const len = cell ? String(cell).length : 0;
            if (len > maxCellLength) maxCellLength = len;
        });
    });

    const rowFactor = numRows <= 5 ? 1 : 1 + (numRows - 5) * 0.08;
    const colFactor = numCols <= 3 ? 1 : 1 + (numCols - 3) * 0.12;
    const textFactor = maxCellLength <= 30 ? 1 : 1 + (maxCellLength - 30) * 0.005;
    
    const density = rowFactor * colFactor * textFactor;
    const scale = Math.max(0.72, Math.min(1.0, 1.1 / density));

    const py = (1.6 * scale).toFixed(2);
    const px = (2.0 * scale).toFixed(2);
    const paddingStyle = {
        paddingTop: `${py}cqw`,
        paddingBottom: `${py}cqw`,
        paddingLeft: `${px}cqw`,
        paddingRight: `${px}cqw`,
    };

    const headerTextSize = `${(2.0 * scale).toFixed(2)}cqw`;
    const rowTextSize = `${(1.6 * scale).toFixed(2)}cqw`;

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
        <div className="relative w-full h-full flex flex-col justify-center py-[1em]">
            <div className="max-w-[90cqw] w-full mx-auto rounded-[0.5em] border-[0.1em]" style={{ borderColor: "var(--theme-card-border)" }}>
                <table className="w-full border-collapse text-left table-fixed">
                    <colgroup>
                        {Array.from({ length: numCols }).map((_, colIdx) => (
                            <col key={colIdx} style={{ width: getColWidth(colIdx, numCols) }} />
                        ))}
                    </colgroup>
                    <thead>
                        <tr style={{ backgroundColor: "var(--theme-primary)", color: "var(--theme-bg)" }}>
                            {headerRow.cells.map((cell, colIdx) => {
                                const isFirstCol = colIdx === 0;
                                const isLastCol = colIdx === numCols - 1;
                                return (
                                    <th 
                                        key={colIdx} 
                                        className="font-bold relative group/colHeader"
                                        style={{
                                            ...paddingStyle,
                                            fontSize: headerTextSize,
                                            borderTopLeftRadius: isFirstCol ? "0.4cqw" : "0",
                                            borderTopRightRadius: isLastCol ? "0.4cqw" : "0"
                                        }}
                                    >
                                        <div className="flex items-center justify-between gap-[0.5em]">
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
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {dataRows.map((row, i) => {
                            const actualIdx = i + 1;
                            const isEven = i % 2 === 0;
                            const rowBg = isEven ? "var(--theme-bg-alt)" : "var(--theme-card-bg)";
                            const isLastRow = i === dataRows.length - 1;
                            return (
                                <tr 
                                    key={i} 
                                    className="group/row border-b-[0.1em] last:border-b-0"
                                    style={{ 
                                        backgroundColor: rowBg,
                                        borderColor: "var(--theme-card-border)" 
                                    }}
                                >
                                    {row.cells.map((cell, colIdx) => {
                                        const isFirstCol = colIdx === 0;
                                        const isLastCol = colIdx === numCols - 1;
                                        return (
                                            <td 
                                                key={colIdx} 
                                                className={`align-top ${colIdx === 0 ? "relative" : ""}`}
                                                style={{
                                                    ...paddingStyle,
                                                    fontSize: rowTextSize,
                                                    borderBottomLeftRadius: (isLastRow && isFirstCol) ? "0.4cqw" : "0",
                                                    borderBottomRightRadius: (isLastRow && isLastCol) ? "0.4cqw" : "0"
                                                }}
                                            >
                                                {colIdx === 0 && onUpdateSlide && (
                                                    <div className="absolute top-1/2 -translate-y-1/2 right-[102%] opacity-0 group-hover/row:opacity-100 group-focus-within/row:opacity-100 transition-opacity z-20">
                                                        <ItemActionsMenu
                                                            onAddBefore={() => addRow(actualIdx, "before")}
                                                            onAddAfter={() => addRow(actualIdx, "after")}
                                                            onDelete={() => deleteRow(actualIdx)}
                                                        />
                                                    </div>
                                                )}
                                                <EditableElement
                                                    as="span"
                                                    className={`w-full block bg-transparent border-none focus:outline-none ${colIdx === 0 ? "font-semibold" : ""}`}
                                                    value={cell}
                                                    onChange={(val) => updateCell(actualIdx, colIdx, val)}
                                                    readOnly={!onUpdateSlide}
                                                    placeholder="Text..."
                                                />
                                            </td>
                                        );
                                    })}
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
