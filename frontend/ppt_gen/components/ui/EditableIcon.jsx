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
        if (!nameString) return { pureName: "Star", currentWeight: "regular", isCustomSvg: false, isCustomImg: false };
        
        if (nameString.startsWith("custom_svg:")) {
            let svgContent = "";
            try {
                const base64 = nameString.substring("custom_svg:".length);
                svgContent = atob(base64);
                // Sanitize scripts
                svgContent = svgContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
                svgContent = svgContent.replace(/on\w+\s*=\s*"(?:\\"|[^"])*"/g, "");
                svgContent = svgContent.replace(/on\w+\s*=\s*'(?:\\'|[^'])*'/g, "");
            } catch (e) {
                console.error("Failed to decode custom SVG:", e);
            }
            return {
                pureName: "",
                currentWeight: "regular",
                isCustomSvg: true,
                isCustomImg: false,
                svgContent
            };
        }
        
        if (nameString.startsWith("custom_img:")) {
            const imgUrl = nameString.substring("custom_img:".length);
            return {
                pureName: "",
                currentWeight: "regular",
                isCustomSvg: false,
                isCustomImg: true,
                imgUrl
            };
        }
        
        if (nameString.startsWith("http://") || nameString.startsWith("https://") || nameString.startsWith("/")) {
            return {
                pureName: "",
                currentWeight: "regular",
                isCustomSvg: false,
                isCustomImg: true,
                imgUrl: nameString
            };
        }
        
        const parts = nameString.split(":");
        return {
            pureName: parts[0] || "Star",
            currentWeight: parts[1] || "regular",
            isCustomSvg: false,
            isCustomImg: false
        };
    };

    const { pureName, currentWeight, isCustomSvg, isCustomImg, svgContent, imgUrl } = parseIconName(iconName);
    const IconComponent = (!isCustomSvg && !isCustomImg) ? (icons[pureName] || icons["Star"]) : null;

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
                {isCustomSvg ? (
                    <div 
                        className="theme-text-primary my-[1cqw] w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-current [&_svg]:text-current"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                ) : isCustomImg ? (
                    <img
                        src={imgUrl}
                        className="w-full h-full object-contain my-[1cqw] block"
                        alt="Custom Icon"
                    />
                ) : (
                    <IconComponent
                        weight={currentWeight}
                        className="theme-text-primary my-[1cqw]"
                        style={{ width: "100%", height: "100%" }}
                    />
                )}
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
