"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Palette, Sparkles, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemes } from "@/hooks/use-themes";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Slide from "@/components/templates/Slide";

const SYSTEM_THEMES = [
    {
        id: "default",
        name: "Modern Light",
        bg: "#ffffff",
        primary: "#3b82f6",
        fg: "#1f2937",
        accent: "#8b5cf6",
        desc: "Clean modern design with blue highlights",
    },
    {
        id: "dark",
        name: "Dark Mode",
        bg: "#111827",
        primary: "#60a5fa",
        fg: "#f9fafb",
        accent: "#a78bfa",
        desc: "Sleek low-light experience with soft blue accent",
    },
    {
        id: "corporate",
        name: "Corporate",
        bg: "#f8fafc",
        primary: "#0369a1",
        fg: "#0f172a",
        accent: "#0284c7",
        desc: "Professional Slate theme with deep ocean blues",
    },
    {
        id: "creative",
        name: "Creative",
        bg: "#fff1f2",
        primary: "#f43f5e",
        fg: "#4c1d95",
        accent: "#ec4899",
        desc: "Vibrant and warm rose colors for bold content",
    },
    {
        id: "elegant",
        name: "Elegant",
        bg: "#fafaf9",
        primary: "#78716c",
        fg: "#44403c",
        accent: "#a8a29e",
        desc: "Stately warm stone motif with classic serif headings",
    },
    {
        id: "playful",
        name: "Playful",
        bg: "#fefce8",
        primary: "#eab308",
        fg: "#3f6212",
        accent: "#fb923c",
        desc: "Cheerfully bright yellow theme with Quicksand typography",
    },
    {
        id: "nature",
        name: "Nature",
        bg: "#f4f6f0",
        primary: "#2d5a3c",
        fg: "#1c2e24",
        accent: "#8fa882",
        desc: "Calm and organic forest tones with classic serifs",
    },
    {
        id: "sunset",
        name: "Sunset",
        bg: "#fdf8f5",
        primary: "#ea580c",
        fg: "#451a03",
        accent: "#f97316",
        desc: "Warm clay and peach hues reminiscent of a sunset",
    },
    {
        id: "ocean",
        name: "Ocean",
        bg: "#f0f7fa",
        primary: "#0284c7",
        fg: "#0c4a6e",
        accent: "#06b6d4",
        desc: "Fresh sea breeze blues and deep teal accents",
    },
    {
        id: "minimalist",
        name: "Minimalist",
        bg: "#ffffff",
        primary: "#111827",
        fg: "#111827",
        accent: "#374151",
        desc: "Stark black & white with luxury serif typefaces",
    },
    {
        id: "lavender",
        name: "Lavender",
        bg: "#faf9fe",
        primary: "#6366f1",
        fg: "#1e1b4b",
        accent: "#d946ef",
        desc: "Sophisticated and tech-forward violet tones",
    },
    {
        id: "dracula",
        name: "Dracula",
        bg: "#1e1e2e",
        primary: "#cba6f7",
        fg: "#f8f8f2",
        accent: "#f5c2e7",
        desc: "Cozy cyber orchid aesthetics for developers",
    },
    {
        id: "nord-dark",
        name: "Nord Dark",
        bg: "#2e3440",
        primary: "#88c0d0",
        fg: "#eceff4",
        accent: "#81a1c1",
        desc: "Arctic cold ice blue theme with clean structure",
    },
    {
        id: "forest-dark",
        name: "Forest Dark",
        bg: "#0f1715",
        primary: "#52b788",
        fg: "#e6ede9",
        accent: "#74c69d",
        desc: "Restorative deep forest green dark theme",
    },
    {
        id: "luxury-dark",
        name: "Luxury Dark",
        bg: "#141414",
        primary: "#d4af37",
        fg: "#f5f5f0",
        accent: "#c5a880",
        desc: "Premium obsidian black theme with gold highlights",
    },
];

export default function ThemesTab() {
    const { customThemes, isLoading, deleteTheme } = useThemes();
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [themeToDelete, setThemeToDelete] = useState(null);

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Custom Themes Section */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-border/40 pb-2">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                            My Custom Themes
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-stretch">
                    {/* Create Theme CTA */}
                    <Link href="/dashboard/theme-generator">
                        <motion.div
                            whileHover={{ y: -3 }}
                            className="h-full border border-dashed border-border bg-card text-card-foreground hover:bg-accent/30 transition-all rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none group min-h-[120px]"
                        >
                            <div className="w-10 h-10 rounded-full border border-primary/20 bg-primary/5 group-hover:bg-primary/10 transition-colors flex items-center justify-center mb-3">
                                <Plus className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-xs text-card-foreground group-hover:text-primary transition-colors">
                                Create Custom Theme
                            </h3>
                            <p className="text-[10px] text-muted-foreground mt-1 font-light max-w-[200px]">
                                Custom colors, cards, icons and font families
                            </p>
                        </motion.div>
                    </Link>

                    {/* Loader */}
                    {isLoading && (
                        <div className="border border-border bg-muted/20 rounded-xl p-5 flex items-center justify-center min-h-[160px]">
                            <Loader2
                                className="animate-spin text-muted-foreground"
                                size={20}
                            />
                        </div>
                    )}

                    {/* Custom Themes List */}
                    {!isLoading &&
                        customThemes.map((theme) => (
                            <motion.div
                                key={theme.id}
                                whileHover={{ y: -3 }}
                                onClick={() => setSelectedTheme(theme)}
                                className="border border-border bg-card text-card-foreground hover:bg-accent/20 transition-all rounded-xl p-5 flex flex-col justify-between relative group min-h-[120px] cursor-pointer"
                            >
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold  text-card-foreground truncate leading-tight">
                                            {theme.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-0.5 font-light">
                                            Fonts:{" "}
                                            {theme.font_heading.split(",")[0]} /{" "}
                                            {theme.font_body.split(",")[0]}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Link
                                            href={`/dashboard/theme-generator?id=${theme.id}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            className="text-muted-foreground hover:text-primary p-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
                                            title="Edit custom theme"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setThemeToDelete(theme);
                                            }}
                                            className="text-muted-foreground hover:text-destructive p-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
                                            title="Delete custom theme"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Color Swatch Circle Palette */}
                                <div className="flex items-center gap-1.5 mt-3 mb-1">
                                    <div
                                        className="w-8 h-8 rounded-sm border border-border/50 shadow-xs"
                                        style={{ backgroundColor: theme.bg }}
                                        title={`Background: ${theme.bg}`}
                                    />
                                    <div
                                        className="w-8 h-8 rounded-sm border border-border/50 shadow-xs"
                                        style={{ backgroundColor: theme.fg }}
                                        title={`Text: ${theme.fg}`}
                                    />
                                    <div
                                        className="w-8 h-8 rounded-sm border border-border/50 shadow-xs"
                                        style={{
                                            backgroundColor:
                                                theme.primary_color,
                                        }}
                                        title={`Primary: ${theme.primary_color}`}
                                    />
                                    <div
                                        className="w-8 h-8 rounded-sm border border-border/50 shadow-xs"
                                        style={{
                                            backgroundColor: theme.accent,
                                        }}
                                        title={`Accent: ${theme.accent}`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                </div>
            </div>

            {/* System Themes Section */}
            <div className="flex flex-col gap-4">
                <div className="border-b border-border/40 pb-2">
                    <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                        System Themes
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {SYSTEM_THEMES.map((theme) => (
                        <motion.div
                            key={theme.id}
                            whileHover={{ y: -3 }}
                            onClick={() => setSelectedTheme(theme.id)}
                            className="border border-border bg-card text-card-foreground hover:bg-accent/20 transition-all rounded-xl p-5 flex flex-col justify-between min-h-[120px] cursor-pointer"
                        >
                            <div>
                                <h3 className="font-semibold text-card-foreground leading-tight">
                                    {theme.name}
                                </h3>
                                <p className="text-xs text-muted-foreground font-light leading-normal mt-1">
                                    {theme.desc}
                                </p>
                            </div>

                            <div className="flex items-center gap-1.5 mt-4">
                                <div
                                    className="w-8 h-8 rounded-sm border border-border/50 shadow-xs"
                                    style={{ backgroundColor: theme.bg }}
                                ></div>
                                <div
                                    className="w-8 h-8 rounded-sm border border-border/50 shadow-xs"
                                    style={{ backgroundColor: theme.fg }}
                                ></div>
                                <div
                                    className="w-8 h-8 rounded-sm border border-border/50 shadow-xs"
                                    style={{ backgroundColor: theme.primary }}
                                ></div>
                                <div
                                    className="w-8 h-8 rounded-sm border border-border/50 shadow-xs"
                                    style={{ backgroundColor: theme.accent }}
                                ></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Theme Preview Modal */}
            <Dialog
                open={selectedTheme !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedTheme(null);
                }}
            >
                <DialogContent className="sm:max-w-5xl w-[90vw] p-6 bg-background">
                    <DialogHeader>
                        <DialogTitle>
                            {typeof selectedTheme === "string"
                                ? SYSTEM_THEMES.find(
                                      (t) => t.id === selectedTheme,
                                  )?.name
                                : selectedTheme?.name}{" "}
                            Theme Preview
                        </DialogTitle>
                        <DialogDescription>
                            Review the slide typography, visual segment
                            structures, card presets, and color layout logic.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="w-full flex items-center justify-center mt-6">
                        <div className="w-full max-w-[800px] pointer-events-none">
                            <Slide
                                slide_content={{
                                    title: "Defining Your Brand Identity",
                                    subtitle:
                                        "Create harmonized designs dynamically compile-ready for slide decks.",
                                    items: [
                                        {
                                            header: "Define color hierarchy",
                                            description:
                                                "Establish visual guidelines for text, borders, and backgrounds.",
                                        },
                                        {
                                            header: "Typography pairing",
                                            description:
                                                "Select classic heading and body fonts matching your brand.",
                                        },
                                        {
                                            header: "Generate layouts",
                                            description:
                                                "Assemble custom slide structures responsive to all screen sizes.",
                                        },
                                        {
                                            header: "Lorem Ipsum",
                                            description:
                                                "Lorem Ipsum dolor sit amet, consectetur adipiscing elit.",
                                        },
                                        {
                                            header: "Lorem Ipsum",
                                            description:
                                                "Lorem Ipsum dolor sit amet, consectetur adipiscing elit.",
                                        },
                                    ],
                                    layout: {
                                        category: "card",
                                        type: "numbered",
                                    },
                                }}
                                theme={
                                    typeof selectedTheme === "string"
                                        ? selectedTheme
                                        : selectedTheme?.id
                                }
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert Dialog */}
            <AlertDialog
                open={themeToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setThemeToDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete custom theme?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the custom theme
                            &ldquo;{themeToDelete?.name}&rdquo;? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setThemeToDelete(null)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                if (themeToDelete) {
                                    deleteTheme(themeToDelete.id);
                                    setThemeToDelete(null);
                                }
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
