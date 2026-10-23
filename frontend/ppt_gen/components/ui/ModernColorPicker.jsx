"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pipette, Copy, Check, ChevronDown } from "lucide-react";

// --- Color Conversion Helpers (Precise Float Math) ---
function hexToRgb(hex) {
    let cleanHex = (hex || "").replace(/^#/, "").trim();
    if (cleanHex.length === 3) {
        cleanHex = cleanHex
            .split("")
            .map((c) => c + c)
            .join("");
    }
    if (cleanHex.length !== 6) return { r: 59, g: 130, b: 246 };
    const num = parseInt(cleanHex, 16);
    if (isNaN(num)) return { r: 59, g: 130, b: 246 };
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
}

function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    let h = 0;
    if (diff === 0) {
        h = 0;
    } else if (max === r) {
        h = ((g - b) / diff) % 6;
    } else if (max === g) {
        h = (b - r) / diff + 2;
    } else {
        h = (r - g) / diff + 4;
    }
    h = h * 60;
    if (h < 0) h += 360;
    const s = max === 0 ? 0 : diff / max;
    const v = max;
    return { h, s, v };
}

function hsvToRgb(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0,
        g = 0,
        b = 0;
    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }
    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    };
}

function rgbToHex(r, g, b) {
    const toHex = (n) =>
        Math.max(0, Math.min(255, n))
            .toString(16)
            .padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hsvToHex(h, s, v) {
    const { r, g, b } = hsvToRgb(h, s, v);
    return rgbToHex(r, g, b);
}

function hexToHsv(hex) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHsv(r, g, b);
}

const PRESET_SWATCHES = [
    "#FFFFFF",
    "#F8FAFC",
    "#E2E8F0",
    "#94A3B8",
    "#475569",
    "#1E293B",
    "#0F172A",
    "#000000",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#06B6D4",
];

export const ModernColorPicker = React.memo(
    ({ label, description, name, value, onChange, onInstantStyleUpdate }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [currentHex, setCurrentHex] = useState(value || "#3B82F6");
        const [textInputVal, setTextInputVal] = useState(value || "#3B82F6");
        const [hsv, setHsv] = useState(() => hexToHsv(value || "#3B82F6"));
        const [copied, setCopied] = useState(false);

        const svAreaRef = useRef(null);
        const hueBarRef = useRef(null);

        // Keep local state in sync when parent prop changes
        useEffect(() => {
            if (value && value.toUpperCase() !== currentHex.toUpperCase()) {
                setCurrentHex(value);
                setTextInputVal(value);
                setHsv(hexToHsv(value));
            }
        }, [value, currentHex]);

        const emitColorChange = useCallback(
            (newHex) => {
                setCurrentHex(newHex);
                setTextInputVal(newHex);
                if (onInstantStyleUpdate) {
                    onInstantStyleUpdate(name, newHex);
                }
                if (onChange) {
                    onChange(newHex);
                }
            },
            [name, onChange, onInstantStyleUpdate]
        );

        // --- Saturation & Value (2D Surface) Drag Handling ---
        const handleSvPointer = useCallback(
            (e) => {
                if (!svAreaRef.current) return;
                const rect = svAreaRef.current.getBoundingClientRect();
                const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

                const s = x / rect.width;
                const v = 1 - y / rect.height;

                setHsv((prev) => {
                    const newHsv = { ...prev, s, v };
                    const newHex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
                    emitColorChange(newHex);
                    return newHsv;
                });
            },
            [emitColorChange]
        );

        const handleSvPointerDown = (e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            handleSvPointer(e);
        };

        const handleSvPointerMove = (e) => {
            if (e.buttons === 1) {
                handleSvPointer(e);
            }
        };

        // --- Hue Slider Drag Handling ---
        const handleHuePointer = useCallback(
            (e) => {
                if (!hueBarRef.current) return;
                const rect = hueBarRef.current.getBoundingClientRect();
                const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                const h = Math.min(360, Math.max(0, (x / rect.width) * 360));

                setHsv((prev) => {
                    const newHsv = { ...prev, h };
                    const newHex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
                    emitColorChange(newHex);
                    return newHsv;
                });
            },
            [emitColorChange]
        );

        const handleHuePointerDown = (e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            handleHuePointer(e);
        };

        const handleHuePointerMove = (e) => {
            if (e.buttons === 1) {
                handleHuePointer(e);
            }
        };

        // --- Native EyeDropper API (Chromium / Modern Browsers) ---
        const handleEyeDropper = async () => {
            if (typeof window !== "undefined" && "EyeDropper" in window) {
                try {
                    const eyeDropper = new window.EyeDropper();
                    const result = await eyeDropper.open();
                    if (result?.sRGBHex) {
                        const newHex = result.sRGBHex.toUpperCase();
                        setHsv(hexToHsv(newHex));
                        emitColorChange(newHex);
                    }
                } catch (err) {
                    console.log("EyeDropper dismissed or error:", err);
                }
            }
        };

        // --- Manual Text Input Change ---
        const handleTextChange = (e) => {
            const raw = e.target.value;
            setTextInputVal(raw);
            let formatted = raw.trim();
            if (!formatted.startsWith("#")) {
                formatted = "#" + formatted;
            }
            if (/^#[0-9A-Fa-f]{6}$/.test(formatted)) {
                const upper = formatted.toUpperCase();
                setCurrentHex(upper);
                setHsv(hexToHsv(upper));
                emitColorChange(upper);
            }
        };

        const handleCopy = async (e) => {
            e.stopPropagation();
            try {
                await navigator.clipboard.writeText(currentHex);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        };

        const handlePresetClick = (hex) => {
            setHsv(hexToHsv(hex));
            emitColorChange(hex);
        };

        return (
            <div className="flex flex-col gap-1.5 p-2 rounded-lg bg-secondary/10 border border-border/40 hover:border-border/80 transition-all">
                <div className="flex items-start justify-between gap-1">
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate">
                            {label}
                        </span>
                        {description && (
                            <span className="text-[10px] text-muted-foreground leading-tight truncate">
                                {description}
                            </span>
                        )}
                    </div>
                </div>

                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="group flex items-center justify-between w-full h-9 px-2 py-1 rounded-md bg-background border border-input hover:border-primary/50 hover:bg-accent/30 transition-all cursor-pointer shadow-2xs"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                {/* Visual Color Swatch */}
                                <div className="relative w-5 h-5 rounded-md overflow-hidden border border-black/10 dark:border-white/20 shrink-0 shadow-inner">
                                    <div
                                        className="w-full h-full"
                                        style={{ backgroundColor: currentHex }}
                                    />
                                </div>
                                <span className="font-mono text-xs font-medium text-foreground tracking-wider uppercase truncate">
                                    {currentHex}
                                </span>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200" />
                        </button>
                    </PopoverTrigger>

                    <PopoverContent
                        align="start"
                        side="right"
                        sideOffset={8}
                        className="w-64 p-3.5 flex flex-col gap-3 rounded-xl bg-card border border-border text-card-foreground shadow-2xl z-50 select-none animate-in fade-in-50 zoom-in-95"
                    >
                        {/* 1. Interactive 2D Saturation / Value Gradient Surface */}
                        <div
                            ref={svAreaRef}
                            onPointerDown={handleSvPointerDown}
                            onPointerMove={handleSvPointerMove}
                            style={{
                                backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                            }}
                            className="relative w-full h-32 rounded-lg overflow-hidden cursor-crosshair touch-none shadow-inner"
                        >
                            {/* White to Transparent (Horizontal) */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                            {/* Transparent to Black (Vertical) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

                            {/* Pointer Thumb Indicator */}
                            <div
                                className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2 ring-1 ring-black/40"
                                style={{
                                    left: `${Math.max(0, Math.min(100, hsv.s * 100))}%`,
                                    top: `${Math.max(0, Math.min(100, (1 - hsv.v) * 100))}%`,
                                    backgroundColor: currentHex,
                                }}
                            />
                        </div>

                        {/* 2. Rainbow Hue Slider */}
                        <div className="flex items-center gap-2">
                            <div
                                ref={hueBarRef}
                                onPointerDown={handleHuePointerDown}
                                onPointerMove={handleHuePointerMove}
                                className="relative flex-1 h-3 rounded-full cursor-pointer touch-none shadow-inner"
                                style={{
                                    background:
                                        "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                                }}
                            >
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary/50 shadow-md pointer-events-none -translate-x-1/2 ring-1 ring-black/20"
                                    style={{
                                        left: `${Math.max(0, Math.min(100, (hsv.h / 360) * 100))}%`,
                                    }}
                                />
                            </div>

                            {/* EyeDropper button if supported */}
                            {typeof window !== "undefined" && "EyeDropper" in window && (
                                <button
                                    type="button"
                                    onClick={handleEyeDropper}
                                    className="w-7 h-7 rounded-md border border-input bg-background hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors shrink-0"
                                    title="Pick color from screen"
                                >
                                    <Pipette className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* 3. Hex Input & Copy Controls */}
                        <div className="flex items-center gap-2">
                            <div className="relative w-7 h-7 rounded-md border border-border overflow-hidden shrink-0 shadow-inner">
                                <div
                                    className="w-full h-full"
                                    style={{ backgroundColor: currentHex }}
                                />
                            </div>

                            <div className="relative flex-1">
                                <Input
                                    type="text"
                                    value={textInputVal}
                                    onChange={handleTextChange}
                                    maxLength={7}
                                    placeholder="#000000"
                                    className="h-8 text-xs font-mono uppercase bg-background border-input pl-2 pr-7 tracking-wider"
                                />
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                    title="Copy HEX"
                                >
                                    {copied ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 4. Curated Designer Presets */}
                        <div className="flex flex-col gap-1.5 pt-1 border-t border-border/50">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                Preset Swatches
                            </span>
                            <div className="grid grid-cols-8 gap-1.5">
                                {PRESET_SWATCHES.map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => handlePresetClick(preset)}
                                        style={{ backgroundColor: preset }}
                                        className={`w-5 h-5 rounded-md border transition-all cursor-pointer hover:scale-110 shadow-2xs ${
                                            preset.toUpperCase() ===
                                            currentHex.toUpperCase()
                                                ? "border-primary ring-2 ring-primary/40 scale-105"
                                                : "border-black/10 dark:border-white/10"
                                        }`}
                                        title={preset}
                                    />
                                ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        );
    }
);

ModernColorPicker.displayName = "ModernColorPicker";
