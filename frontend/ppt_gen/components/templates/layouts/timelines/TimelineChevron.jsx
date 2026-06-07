import React from "react";
import { EditableElement } from "@/components/ui/EditableElement";
import { EditableIcon } from "@/components/ui/EditableIcon";
import { ItemActionsMenu } from "@/components/ui/ItemActionsMenu";

const TimelineChevron = ({
    content,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
}) => {
    const n = content.length;

    const getDefaultIcon = (index) => {
        const icons = [
            "Lightbulb",
            "MagnifyingGlass",
            "Clock",
            "Gear",
            "Target",
            "ChartLine",
        ];
        return icons[index % icons.length] || "Star";
    };

    const overlap = n > 0 ? 7.2 / n : 1.2;

    return (
        <div className="w-full max-w-[95cqw] mx-auto flex flex-col justify-center items-center py-[2cqw]">
            <div className="flex flex-row items-stretch w-full justify-center overflow-visible">
                {content.map((ele, i) => {
                    const isFirst = i === 0;
                    const isEven = i % 2 === 0;
                    const themeColor = isEven
                        ? "var(--theme-primary)"
                        : "var(--theme-accent)";

                    return (
                        <div
                            key={i}
                            className="flex-1 flex flex-col items-center relative overflow-visible group/col"
                            style={{
                                marginLeft: isFirst ? "0" : `-${overlap}cqw`,
                                zIndex: n - i,
                            }}
                        >
                            <div className="w-full h-[15cqw] flex flex-col items-center justify-end relative pb-[1.5cqw]">
                                {isEven ? (
                                    <div className="flex flex-col items-center justify-end h-full w-full">
                                        <div
                                            className="w-[3.6cqw] h-[3.6cqw] rounded-full flex items-center justify-center shadow-md border-[0.2cqw] border-white relative z-30"
                                            style={{
                                                backgroundColor: themeColor,
                                            }}
                                        >
                                            <EditableIcon
                                                iconName={
                                                    ele.icon ||
                                                    getDefaultIcon(i)
                                                }
                                                onChange={(newIcon) =>
                                                    onUpdateItem?.(
                                                        i,
                                                        "icon",
                                                        newIcon,
                                                    )
                                                }
                                                readOnly={!onUpdateItem}
                                                contextText={`${ele.header || ""} ${ele.description || ""}`}
                                                recommendedIcons={
                                                    ele.recommendedIcons
                                                }
                                                className="w-[1.8cqw] h-[1.8cqw] flex items-center justify-center relative z-30"
                                                iconClassName="w-full h-full [&_svg]:!text-white [&_svg]:!my-0 [&_svg]:relative [&_svg]:z-30"
                                            />
                                        </div>
                                        <svg
                                            className="w-[1cqw] grow my-[0.5cqw] pointer-events-none"
                                            viewBox="0 0 10 100"
                                            preserveAspectRatio="none"
                                            width="100%"
                                            height="100%"
                                        >
                                            <line
                                                x1="5"
                                                y1="0"
                                                x2="5"
                                                y2="100"
                                                stroke={themeColor}
                                                strokeWidth="2.5"
                                                strokeDasharray="4 4"
                                                opacity="0.6"
                                            />
                                        </svg>
                                    </div>
                                ) : (
                                    // Text Description (centered above)
                                    <div className="w-full px-[1cqw] text-center mb-[1cqw]">
                                        <EditableElement
                                            as="p"
                                            className="text-[1.15cqw] theme-text-muted w-full text-balance line-clamp-4"
                                            value={ele.description}
                                            onChange={(val) =>
                                                onUpdateItem?.(
                                                    i,
                                                    "description",
                                                    val,
                                                )
                                            }
                                            readOnly={!onUpdateItem}
                                            placeholder="Description..."
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Middle Chevron Cell */}
                            <div className="w-full h-[5cqw] flex items-center justify-center relative z-20">
                                {/* SVG Chevron Background (supported by the PPTX exporter) */}
                                <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    width="100%"
                                    height="100%"
                                >
                                    <polygon
                                        points={
                                            isFirst
                                                ? "0,0 92,0 100,50 92,100 0,100"
                                                : "0,0 92,0 100,50 92,100 0,100 8,50"
                                        }
                                        fill={themeColor}
                                    />
                                </svg>

                                {/* Editable Text Content overlay */}
                                <div
                                    className="w-full h-full flex items-center justify-center text-white font-bold relative z-10"
                                    style={{
                                        paddingLeft: isFirst
                                            ? `${overlap}cqw`
                                            : `${overlap * 2}cqw`,
                                        paddingRight: isFirst
                                            ? `${overlap * 2}cqw`
                                            : `${overlap}cqw`,
                                    }}
                                >
                                    <EditableElement
                                        as="span"
                                        className="font-bold text-center w-full text-[1.6cqw] truncate"
                                        value={ele.header}
                                        onChange={(val) =>
                                            onUpdateItem?.(i, "header", val)
                                        }
                                        readOnly={!onUpdateItem}
                                        placeholder="Year"
                                    />
                                </div>
                            </div>

                            {/* Bottom Content Cell */}
                            <div className="w-full h-[15cqw] flex flex-col items-center justify-start relative pt-[1.5cqw]">
                                {isEven ? (
                                    // Text Description (centered below)
                                    <div className="w-full px-[1cqw] text-center mt-[1cqw]">
                                        <EditableElement
                                            as="p"
                                            className="text-[1.15cqw] theme-text-muted w-full text-balance line-clamp-4"
                                            value={ele.description}
                                            onChange={(val) =>
                                                onUpdateItem?.(
                                                    i,
                                                    "description",
                                                    val,
                                                )
                                            }
                                            readOnly={!onUpdateItem}
                                            placeholder="Description..."
                                        />
                                    </div>
                                ) : (
                                    // Dotted Line and Icon going down
                                    <div className="flex flex-col items-center justify-start h-full w-full">
                                        <svg
                                            className="w-[1cqw] grow my-[0.5cqw] pointer-events-none"
                                            viewBox="0 0 10 100"
                                            preserveAspectRatio="none"
                                            width="100%"
                                            height="100%"
                                        >
                                            <line
                                                x1="5"
                                                y1="0"
                                                x2="5"
                                                y2="100"
                                                stroke={themeColor}
                                                strokeWidth="2.5"
                                                strokeDasharray="4 4"
                                                opacity="0.6"
                                            />
                                        </svg>
                                        <div
                                            className="w-[3.6cqw] h-[3.6cqw] rounded-full flex items-center justify-center shadow-md border-[0.2cqw] border-white relative z-30"
                                            style={{
                                                backgroundColor: themeColor,
                                            }}
                                        >
                                            <EditableIcon
                                                iconName={
                                                    ele.icon ||
                                                    getDefaultIcon(i)
                                                }
                                                onChange={(newIcon) =>
                                                    onUpdateItem?.(
                                                        i,
                                                        "icon",
                                                        newIcon,
                                                    )
                                                }
                                                readOnly={!onUpdateItem}
                                                contextText={`${ele.header || ""} ${ele.description || ""}`}
                                                recommendedIcons={
                                                    ele.recommendedIcons
                                                }
                                                className="w-[1.8cqw] h-[1.8cqw] flex items-center justify-center relative z-30"
                                                iconClassName="w-full h-full [&_svg]:!text-white [&_svg]:!my-0 [&_svg]:relative [&_svg]:z-30"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions Menu (hover active only, no animations or transitions) */}
                            {onDeleteItem && (
                                <div className="absolute top-[14.5cqw] left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover/col:opacity-100 pointer-events-auto">
                                    <ItemActionsMenu
                                        onAddBefore={() =>
                                            onAddItem?.(i, "before")
                                        }
                                        onAddAfter={() =>
                                            onAddItem?.(i, "after")
                                        }
                                        onDelete={() => onDeleteItem(i)}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TimelineChevron;
