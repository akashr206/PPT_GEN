import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const BulletsBig = ({ content, onUpdateItem, onDeleteItem, onAddItem }) => {
    const n = content.length;

    const cols = n >= 5 ? 3 : n === 3 ? 3 : n === 1 ? 1 : 2;
    const rows = Math.ceil(n / cols);

    // Adjust layout density based on text length to prevent vertical overflows
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

    const effectiveRows = rows + textInflation;

    let gapVal = 2;
    let numSize = "w-[3.5em] h-[3.5em] text-[1.5em]";
    let headerSize = "text-[2.5em]";
    let descSize = "text-[1.75em]";

    if (effectiveRows >= 5) {
        gapVal = 0.6;
        numSize = "w-[2.2em] h-[2.2em] text-[1.0em]";
        headerSize = "text-[1.5em]";
        descSize = "text-[1.1em]";
    } else if (effectiveRows >= 4) {
        gapVal = 1.0;
        numSize = "w-[2.6em] h-[2.6em] text-[1.2em]";
        headerSize = "text-[1.8em]";
        descSize = "text-[1.3em]";
    } else if (effectiveRows >= 3) {
        gapVal = 1.4;
        numSize = "w-[3.0em] h-[3.0em] text-[1.4em]";
        headerSize = "text-[2.1em]";
        descSize = "text-[1.5em]";
    }

    const gapClass = `gap-[${gapVal}em]`;

    const getFlexBasis = () => {
        if (n === 1) return "100%";
        if (cols === 2) {
            return `calc(50% - ${gapVal / 2}em)`;
        }
        return `calc(33.333% - ${(gapVal * 2) / 3}em)`;
    };

    return (
        <div className="max-w-[95cqw] mx-auto my-[1.5em] w-full">
            <div className={`flex flex-wrap justify-center ${gapClass} items-center`}>
                {content.map((ele, i) => (
                    <div
                        className="flex items-start gap-[1em]"
                        key={i}
                        style={{ flex: `0 1 ${getFlexBasis()}` }}
                    >
                        <div
                            className={`${numSize} mt-[0.2em] rounded-full flex font-bold theme-bg-primary justify-center items-center shrink-0`}
                        >
                            <span>{i + 1}</span>
                        </div>

                        <div className="relative group/item flex-1">
                            <EditableElement
                                as="h2"
                                className={`font-bold theme-heading ${headerSize}`}
                                value={ele.header}
                                onChange={(val) => onUpdateItem?.(i, "header", val)}
                                readOnly={!onUpdateItem}
                                placeholder="Header"
                            />
                            <EditableElement
                                as="p"
                                className={`${descSize} theme-text-muted w-full text-wrap`}
                                value={ele.description}
                                onChange={(val) =>
                                    onUpdateItem?.(i, "description", val)
                                }
                                readOnly={!onUpdateItem}
                                placeholder="Description..."
                            />
                            {onDeleteItem && (
                                <div className="absolute -top-[1.2em] left-1/2 -translate-x-1/2 cqw opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                                    <ItemActionsMenu
                                        onAddBefore={() => onAddItem?.(i, "before")}
                                        onAddAfter={() => onAddItem?.(i, "after")}
                                        onDelete={() => onDeleteItem(i)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BulletsBig;
