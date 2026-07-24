import React, { useState } from "react";
import metadata from "@/components/templates/metadata.json";
import { useThemes } from "@/hooks/use-themes";
import { Palette } from "lucide-react";

const ThemeSidebar = ({ isOpen, onClose, currentTheme, isBusy, onThemeChange }) => {
    const { customThemes } = useThemes();
    const [activeThemeTab, setActiveThemeTab] = useState("all");

    if (!isOpen) return null;

    const themesList = [
        ...metadata.themes,
        ...(customThemes || []).map((t) => ({
            id: t.id,
            name: t.name,
            bg: t.bg,
            fg: t.fg,
            primary: t.primary_color,
            accent: t.accent,
            desc: "Custom Theme"
        }))
    ];

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
            />
            {/* Sidebar Container */}
            <div className="fixed inset-y-0 right-0 lg:relative lg:inset-auto w-[340px] sm:w-[380px] lg:w-[420px] border-l border-border bg-card flex flex-col shrink-0 animate-in slide-in-from-right duration-200 z-50 shadow-2xl lg:shadow-none pt-12 lg:pt-0">
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-secondary/10">
                    <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-primary" />
                        <div className="flex flex-col">
                            <h3 className="font-bold text-sm text-foreground">Select Theme</h3>
                            <span className="text-[10px] text-muted-foreground">Global visual style</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                        Close
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-border bg-muted/20 p-1 gap-1 shrink-0 px-4 pt-3">
                    <button
                        onClick={() => setActiveThemeTab("all")}
                        className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            activeThemeTab === "all"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setActiveThemeTab("system")}
                        className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            activeThemeTab === "system"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                        }`}
                    >
                        System
                    </button>
                    <button
                        onClick={() => setActiveThemeTab("custom")}
                        className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            activeThemeTab === "custom"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                        }`}
                    >
                        Custom
                    </button>
                </div>

                {/* Content Body */}
                <div className="grow overflow-y-auto flex flex-col p-4 min-h-0">
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-3.5 pb-4">
                        {themesList
                            .filter((t) => {
                                if (activeThemeTab === "all") return true;
                                if (activeThemeTab === "system") return !t.desc || t.desc !== "Custom Theme";
                                if (activeThemeTab === "custom") return t.desc === "Custom Theme";
                                return true;
                            })
                            .map((t) => {
                                const isActive = currentTheme === t.id;

                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            if (!isBusy) {
                                                onThemeChange(t.id);
                                            }
                                        }}
                                        disabled={isBusy}
                                        className={`flex flex-col text-left p-2.5 rounded-md border transition-all text-xs cursor-pointer gap-2 ${
                                            isActive
                                                ? "border-primary ring-2 ring-primary/20 bg-accent/10"
                                                : "border-border hover:border-muted-foreground/30 hover:bg-muted/10 bg-card"
                                        } ${isBusy ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <span className="font-semibold text-foreground capitalize text-[11px] truncate w-full px-0.5 mb-0.5">
                                            {t.name}
                                        </span>

                                        {/* Miniature slide layout preview */}
                                        <div
                                            data-theme={t.id}
                                            className="theme-container w-full aspect-[16/10] rounded-md border theme-border p-2.5 flex flex-col justify-between overflow-hidden shadow-xs relative"
                                        >
                                            {/* Title & Subtitle */}
                                            <div className="space-y-0.5">
                                                <div className="theme-heading font-bold text-[9px] tracking-tight leading-none truncate">
                                                    Title Style
                                                </div>
                                                <div className="theme-text-muted text-[5.5px] leading-none truncate">
                                                    Subtitle styling
                                                </div>
                                            </div>

                                            {/* Miniature Card visualization */}
                                            <div className="theme-card p-1 rounded-md border theme-border flex flex-col gap-0.5 mt-1.5">
                                                <div className="theme-text-primary font-semibold text-[6px] leading-none truncate">
                                                    Card Title
                                                </div>
                                                <div className="theme-text-muted text-[5px] leading-none truncate">
                                                    Card content text
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ThemeSidebar;
