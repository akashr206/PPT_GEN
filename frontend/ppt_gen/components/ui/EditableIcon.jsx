import React, { useState } from "react";
import * as icons from "@phosphor-icons/react";
import { Pencil } from "@phosphor-icons/react";
import { IconPicker } from "./IconPicker";

const WEIGHTS = [
    { value: "thin", short: "T", label: "Thin" },
    { value: "light", short: "L", label: "Light" },
    { value: "regular", short: "R", label: "Regular" },
    { value: "bold", short: "B", label: "Bold" },
    { value: "fill", short: "F", label: "Fill" },
    { value: "duotone", short: "D", label: "Duotone" },
];

export function EditableIcon({
    iconName,
    onChange,
    readOnly = false,
    contextText = "",
    className = "",
    iconClassName = "",
    recommendedIcons = [],
}) {
    const [pickerOpen, setPickerOpen] = useState(false);

    const parseIconName = (nameString) => {
        if (!nameString) return { pureName: "Star", currentWeight: "regular" };
        const parts = nameString.split(":");
        return {
            pureName: parts[0] || "Star",
            currentWeight: parts[1] || "regular",
        };
    };

    const { pureName, currentWeight } = parseIconName(iconName);
    const IconComponent = icons[pureName] || icons["Star"];

    return (
        <div className={`relative inline-flex group/icon ${className}`}>
            {!readOnly && (
                <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 scale-95 -translate-y-1 group-hover/icon:opacity-100 group-hover/icon:scale-100 group-hover/icon:translate-y-0 transition-all duration-200 z-30 flex items-center gap-0.5 bg-background border border-border shadow-lg rounded-md p-0.5 pointer-events-none group-hover/icon:pointer-events-auto before:content-[''] before:absolute before:bottom-full before:left-0 before:right-0 before:h-3 group-data-[menu-open=true]/item:!opacity-0 group-data-[menu-open=true]/item:!pointer-events-none">
                    {WEIGHTS.map((w) => (
                        <button
                            key={w.value}
                            type="button"
                            onClick={() => {
                                onChange?.(`${pureName}:${w.value}`);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                                currentWeight === w.value
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                            title={w.label}
                        >
                            {w.short}
                        </button>
                    ))}
                    <div className="h-3.5 w-[1px] bg-border mx-1 self-center" />

                    <button
                        type="button"
                        onClick={() => setPickerOpen(true)}
                        className="p-1 rounded-sm text-primary hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors flex items-center justify-center"
                        title="Change Icon"
                    >
                        <Pencil className="w-[14px] h-[14px]" />
                    </button>
                </div>
            )}

            <div
                className={`flex items-center justify-center relative transition-all rounded-[0.4cqw] ${iconClassName} ${!readOnly ? "group-hover/icon:outline group-hover/icon:outline-[0.15cqw] group-hover/icon:outline-blue-500/80 group-hover/icon:outline-offset-[0.2cqw] group-data-[menu-open=true]/item:!outline-none" : ""}`}
            >
                <IconComponent
                    weight={currentWeight}
                    className="theme-text-primary my-[1cqw]"
                    style={{ width: "100%", height: "100%" }}
                />
            </div>

            {!readOnly && (
                <IconPicker
                    open={pickerOpen}
                    onOpenChange={setPickerOpen}
                    onSelectIcon={onChange}
                    defaultWeight={currentWeight}
                    contextText={contextText}
                    recommendedIcons={recommendedIcons}
                />
            )}
        </div>
    );
}
