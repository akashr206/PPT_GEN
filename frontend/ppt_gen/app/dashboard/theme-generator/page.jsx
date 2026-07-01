"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Save, Sparkles, Heading, CaseSensitive, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemes } from "@/hooks/use-themes";
import Slide from "@/components/templates/Slide";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Navbar } from "@/components/generate/navbar";

const FONTS_LIST = [
    { name: "Inter (Sans-serif)", value: '"Inter", sans-serif' },
    { name: "Lora (Serif)", value: '"Lora", serif' },
    { name: "Merriweather (Serif)", value: '"Merriweather", serif' },
    { name: "Outfit (Sans-serif)", value: '"Outfit", sans-serif' },
    { name: "Playfair Display (Serif)", value: '"Playfair Display", serif' },
    { name: "Poppins (Sans-serif)", value: '"Poppins", sans-serif' },
    { name: "Quicksand (Sans-serif)", value: '"Quicksand", sans-serif' },
    { name: "Roboto (Sans-serif)", value: '"Roboto", sans-serif' }
];

const PREVIEW_LAYOUTS = [
    // TITLE
    { name: "Title: Asymmetric", category: "title", type: "asymmetric" },
    { name: "Title: Main", category: "title", type: "main" },
    { name: "Title: Split", category: "title", type: "split" },
    { name: "Title: Image", category: "title", type: "image" },
    // AGENDA
    { name: "Agenda: Split", category: "agenda", type: "split" },
    { name: "Agenda: List", category: "agenda", type: "list" },
    // BULLETS
    { name: "Bullets: Big", category: "bullets", type: "big" },
    { name: "Bullets: Standard", category: "bullets", type: "standard" },
    { name: "Bullets: Grid", category: "bullets", type: "grid" },
    { name: "Bullets: Numbered", category: "bullets", type: "numbered" },
    // CARDS
    { name: "Cards: Simple", category: "cards", type: "simple" },
    { name: "Cards: Left Accent", category: "cards", type: "leftAccent" },
    { name: "Cards: Numbered", category: "cards", type: "numbered" },
    { name: "Cards: Filled", category: "cards", type: "filled" },
    // STATS
    { name: "Stats: Grid", category: "stats", type: "grid" },
    { name: "Stats: Callout", category: "stats", type: "callout" },
    // TIMELINES
    { name: "Timeline: Horizontal", category: "timelines", type: "horizontal" },
    { name: "Timeline: Chevron", category: "timelines", type: "chevron" },
    { name: "Timeline: Vertical", category: "timelines", type: "vertical" },
    { name: "Timeline: Alternating", category: "timelines", type: "alternating" },
    // ICONS
    { name: "Icons: Grid", category: "icons", type: "grid" },
    { name: "Icons: Row", category: "icons", type: "row" },
    { name: "Icons: List", category: "icons", type: "list" },
    // IMAGES
    { name: "Images: Split", category: "images", type: "split" },
    { name: "Images: Grid", category: "images", type: "grid" },
    // TABLE
    { name: "Table: Striped", category: "table", type: "striped" },
    { name: "Table: Bordered", category: "table", type: "bordered" },
    // CLOSING
    { name: "Closing: Thank You", category: "closing", type: "thankyou" },
    { name: "Closing: Q&A", category: "closing", type: "qa" },
    { name: "Closing: Contact", category: "closing", type: "contact" }
];

const getMockContent = (category) => {
    switch (category) {
        case "title":
            return {
                title: "Defining Your Brand Identity",
                subtitle: "Create harmonized designs dynamically compile-ready for slide decks.",
                presenter: "Broadside AI Team",
                company: "Design Systems Corp",
                date: "July 2026",
                image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
            };
        case "agenda":
            return {
                title: "Today's Agenda",
                subtitle: "An overview of what we will cover.",
                items: [
                    { header: "Introduction", description: "Welcome and opening remarks." },
                    { header: "Design System", description: "Exploring typography and color semantics." },
                    { header: "Implementation", description: "Technical constraints and optimizations." },
                    { header: "Q&A Session", description: "Open floor for team questions." }
                ]
            };
        case "stats":
            return {
                title: "Metrics and Core Performance",
                subtitle: "Significant efficiency outcomes driving layout generations.",
                items: [
                    { header: "99.8%", description: "Generation accuracy on standard templates." },
                    { header: "60 FPS", description: "Direct-DOM styling rendering speed." },
                    { header: "12+", description: "Built-in design systems fully supported." },
                    { header: "150ms", description: "Input debouncer sync latency." }
                ]
            };
        case "images":
            return {
                title: "Visual Assets Integrations",
                subtitle: "High resolution royalty-free search assets.",
                image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
                imageDescription: "Dynamic visual collaboration",
                items: [
                    { header: "Pexels Search", description: "Search thousands of assets instantly." },
                    { header: "Layout auto-scaling", description: "Content scales gracefully with image sizes." }
                ]
            };
        case "timelines":
            return {
                title: "Implementation Milestones",
                subtitle: "Project timeline mapping from initialization to product launch.",
                items: [
                    { header: "Phase 1: Design", description: "System wireframing" },
                    { header: "Phase 2: Alpha", description: "Design sync API" },
                    { header: "Phase 3: Beta", description: "Broadside integration" },
                    { header: "Phase 4: Launch", description: "Public release" }
                ]
            };
        case "closing":
            return {
                title: "Thank You for Designing",
                subtitle: "We look forward to creating decks with you.",
                presenter: "support@broadside.ai",
                company: "broadside.ai",
                items: [
                    { header: "Website", description: "www.broadside.ai" },
                    { header: "Email", description: "hello@broadside.ai" },
                    { header: "Phone", description: "+1 (555) 123-4567" }
                ]
            };
        case "icons":
            return {
                title: "Core Values",
                subtitle: "What drives our product vision.",
                items: [
                    { header: "Innovation", description: "Pushing boundaries in web tech.", icon: "Lightbulb" },
                    { header: "Security", description: "Protecting data and privacy.", icon: "Shield" },
                    { header: "Speed", description: "Optimized for minimal latency.", icon: "Zap" },
                    { header: "Simplicity", description: "Clean and intuitive user experience.", icon: "CheckCircle" }
                ]
            };
        case "table":
            return {
                title: "Feature Comparison",
                subtitle: "How our generator stacks up against alternatives.",
                table: {
                    headers: ["Feature", "Our Solution", "Alternative A", "Alternative B"],
                    rows: [
                        ["Live Preview", "Yes (60FPS)", "Yes (Laggy)", "No"],
                        ["Custom Layouts", "30+", "10", "15"],
                        ["Theme Extensibility", "Infinite", "Fixed", "Fixed"],
                        ["Export Formats", "PDF, PPTX", "PDF", "PPTX"]
                    ]
                }
            };
        default:
            return {
                title: "Defining Your Brand Identity",
                subtitle: "Create harmonized designs dynamically compile-ready for slide decks.",
                items: [
                    { header: "Define color hierarchy", description: "Establish visual guidelines for text, borders, and backgrounds." },
                    { header: "Typography pairing", description: "Select classic heading and body fonts matching your brand." },
                    { header: "Generate layouts", description: "Assemble custom slide structures responsive to all screen sizes." },
                    { header: "Lorem Ipsum", description: "Lorem Ipsum dolor sit amet, consectetur adipiscing elit." },
                    { header: "Lorem Ipsum", description: "Lorem Ipsum dolor sit amet, consectetur adipiscing elit." }
                ]
            };
    }
};

// Debounce helper to prevent heavy React state changes during drags
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Self-contained, memoized color selector to decouple input dragging from parent re-renders
const ColorSelector = React.memo(({ label, name, value, onChange, onInstantStyleUpdate }) => {
    const [localVal, setLocalVal] = useState(value);

    // Synchronize local input state with initial database values
    useEffect(() => {
        setLocalVal(value);
    }, [value]);

    const handleChange = (e) => {
        const val = e.target.value;
        setLocalVal(val);
        onInstantStyleUpdate(name, val); // GPU-accelerated style injection (0ms delay)
        onChange(val); // Debounced parent state updater
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-muted-foreground font-medium">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={localVal}
                    onChange={handleChange}
                    className="w-8 h-8 rounded-md border border-input p-0 cursor-pointer overflow-hidden shrink-0"
                />
                <input
                    type="text"
                    value={localVal}
                    onChange={handleChange}
                    className="p-1.5 bg-background border border-input rounded-md text-xs w-full text-foreground uppercase font-mono"
                />
            </div>
        </div>
    );
});
ColorSelector.displayName = "ColorSelector";

export default function ThemeGeneratorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const themeId = searchParams.get("id");
    const { customThemes, createTheme, updateTheme } = useThemes();

    // Theme Variables State
    const [name, setName] = useState("My Custom Brand");
    const [bg, setBg] = useState("#ffffff");
    const [bgAlt, setBgAlt] = useState("#f9fafb");
    const [fg, setFg] = useState("#1f2937");
    const [fgMuted, setFgMuted] = useState("#4b5563");
    const [primaryColor, setPrimaryColor] = useState("#3b82f6");
    const [secondary, setSecondary] = useState("#f3f4f6");
    const [accent, setAccent] = useState("#8b5cf6");
    const [cardBg, setCardBg] = useState("#ffffff");
    const [cardBorder, setCardBorder] = useState("#e5e7eb");
    const [bullet, setBullet] = useState("#3b82f6");
    const [fontHeading, setFontHeading] = useState('"Inter", sans-serif');
    const [fontBody, setFontBody] = useState('"Inter", sans-serif');

    const [hasLoadedTheme, setHasLoadedTheme] = useState(false);

    // Preview Layout State
    const [layoutCategory, setLayoutCategory] = useState("cards");
    const [layoutType, setLayoutType] = useState("numbered");

    // Ref to directly apply CSS styles in DOM without triggering React reconciliations
    const previewContainerRef = useRef(null);

    // Debounced setters to prevent main-thread blockage during sliding
    const debouncedSetBg = React.useMemo(() => debounce(setBg, 150), []);
    const debouncedSetBgAlt = React.useMemo(() => debounce(setBgAlt, 150), []);
    const debouncedSetFg = React.useMemo(() => debounce(setFg, 150), []);
    const debouncedSetFgMuted = React.useMemo(() => debounce(setFgMuted, 150), []);
    const debouncedSetPrimaryColor = React.useMemo(() => debounce(setPrimaryColor, 150), []);
    const debouncedSetSecondary = React.useMemo(() => debounce(setSecondary, 150), []);
    const debouncedSetAccent = React.useMemo(() => debounce(setAccent, 150), []);
    const debouncedSetCardBg = React.useMemo(() => debounce(setCardBg, 150), []);
    const debouncedSetCardBorder = React.useMemo(() => debounce(setCardBorder, 150), []);
    const debouncedSetBullet = React.useMemo(() => debounce(setBullet, 150), []);

    // Instant style update handler (writes directly to preview container element style properties)
    const handleInstantStyleUpdate = React.useCallback((varName, value) => {
        if (previewContainerRef.current) {
            const cssMap = {
                bg: "--theme-bg",
                bgAlt: "--theme-bg-alt",
                fg: "--theme-fg",
                fgMuted: "--theme-fg-muted",
                primaryColor: "--theme-primary",
                secondary: "--theme-secondary",
                accent: "--theme-accent",
                cardBg: "--theme-card-bg",
                cardBorder: "--theme-card-border",
                bullet: "--theme-bullet",
            };
            const customVarName = cssMap[varName] || `--theme-${varName}`;
            previewContainerRef.current.style.setProperty(customVarName, value);
        }
    }, []);

    useEffect(() => {
        /* eslint-disable react-hooks/set-state-in-effect */
        if (themeId && customThemes && customThemes.length > 0 && !hasLoadedTheme) {
            const theme = customThemes.find((t) => t.id === themeId);
            if (theme) {
                setName(theme.name);
                setBg(theme.bg);
                setBgAlt(theme.bg_alt);
                setFg(theme.fg);
                setFgMuted(theme.fg_muted);
                setPrimaryColor(theme.primary_color);
                setSecondary(theme.secondary);
                setAccent(theme.accent);
                setCardBg(theme.card_bg);
                setCardBorder(theme.card_border);
                setBullet(theme.bullet);
                setFontHeading(theme.font_heading);
                setFontBody(theme.font_body);
                setHasLoadedTheme(true);
            }
        }
    }, [themeId, customThemes, hasLoadedTheme]);

    const handleSave = async (e) => {
        e.preventDefault();

        // Check for duplicate names (excluding current theme if editing)
        const isDuplicate = (customThemes || []).some(
            (t) => t.name.toLowerCase().trim() === name.toLowerCase().trim() && t.id !== themeId
        );
        if (isDuplicate) {
            toast.error(`A custom theme with the name "${name}" already exists. Please choose a unique name.`);
            return;
        }

        const themeData = {
            name,
            bg,
            bg_alt: bgAlt,
            fg,
            fg_muted: fgMuted,
            primary_color: primaryColor,
            secondary,
            accent,
            card_bg: cardBg,
            card_border: cardBorder,
            bullet,
            font_heading: fontHeading,
            font_body: fontBody
        };
        try {
            if (themeId) {
                await updateTheme(themeId, themeData);
            } else {
                await createTheme(themeData);
            }
            router.push("/dashboard?tab=themes");
        } catch (err) {
            console.error("Error saving theme:", err);
        }
    };

    // Memoize the layout structure of the slide preview to prevent JSX rebuilds
    const memoizedSlide = React.useMemo(() => {
        const mockContent = getMockContent(layoutCategory);
        return (
            <Slide 
                slide_content={{
                    ...mockContent,
                    layout: { category: layoutCategory, type: layoutType }
                }}
                theme="editing-theme"
            />
        );
    }, [layoutCategory, layoutType]);

    // Update typography CSS variables directly when select changes
    useEffect(() => {
        if (previewContainerRef.current) {
            previewContainerRef.current.style.setProperty("--theme-font-heading", fontHeading);
            previewContainerRef.current.style.setProperty("--theme-font-body", fontBody);
        }
    }, [fontHeading, fontBody]);

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden text-foreground font-sans relative z-10 ">
            <Navbar />

            <div className="flex-grow flex max-lg:flex-col-reverse flex-col lg:flex-row min-h-0 max-lg:overflow-y-auto lg:overflow-hidden relative">
                {/* Sidebar color controls */}
                <aside className="w-full lg:w-96 lg:h-full max-lg:h-auto bg-card text-card-foreground flex flex-col border-r border-border shrink-0 select-none lg:min-h-0">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-border flex items-center justify-start gap-1.5 shrink-0">
                        <span className="font-bold text-foreground">Theme Creator</span>
                    </div>

                    <form onSubmit={handleSave} className="flex-1 lg:overflow-y-auto p-5 flex flex-col gap-5 lg:min-h-0">
                        {/* Theme Name input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                Theme Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="My Brand Theme"
                                className="p-2 bg-background border border-input rounded-md text-xs w-full focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                            />
                        </div>

                        {/* Font Selections */}
                        <div className="grid grid-cols-2 gap-3.5 border-t border-border pt-4">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1">
                                    <Heading className="w-3 h-3" /> Heading Font
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between text-xs h-9 bg-background border-input text-foreground font-normal px-3 rounded-md cursor-pointer border hover:bg-accent/50"
                                        >
                                            <span>
                                                {FONTS_LIST.find((f) => f.value === fontHeading)?.name.split(" ")[0]}
                                            </span>
                                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground opacity-60 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-40 max-h-60 overflow-y-auto bg-popover text-popover-foreground border border-border rounded-md shadow-md p-1 z-30">
                                        {FONTS_LIST.map((font) => (
                                            <DropdownMenuItem
                                                key={font.value}
                                                onClick={() => setFontHeading(font.value)}
                                                className="text-xs px-2 py-1.5 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground"
                                            >
                                                {font.name.split(" ")[0]}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1">
                                    <CaseSensitive className="w-3 h-3" /> Body Font
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between text-xs h-9 bg-background border-input text-foreground font-normal px-3 rounded-md cursor-pointer border hover:bg-accent/50"
                                        >
                                            <span>
                                                {FONTS_LIST.find((f) => f.value === fontBody)?.name.split(" ")[0]}
                                            </span>
                                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground opacity-60 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-40 max-h-60 overflow-y-auto bg-popover text-popover-foreground border border-border rounded-md shadow-md p-1 z-30">
                                        {FONTS_LIST.map((font) => (
                                            <DropdownMenuItem
                                                key={font.value}
                                                onClick={() => setFontBody(font.value)}
                                                className="text-xs px-2 py-1.5 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground"
                                            >
                                                {font.name.split(" ")[0]}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Colors Settings Grid */}
                        <div className="border-t border-border pt-4 flex flex-col gap-3.5">
                            <h4 className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                Theme Colors
                            </h4>

                            <div className="grid grid-cols-2 gap-3.5 pb-4">
                                <ColorSelector label="Background" name="bg" value={bg} onChange={debouncedSetBg} onInstantStyleUpdate={handleInstantStyleUpdate} />
                                <ColorSelector label="Background Alt" name="bgAlt" value={bgAlt} onChange={debouncedSetBgAlt} onInstantStyleUpdate={handleInstantStyleUpdate} />
                                <ColorSelector label="Primary Accent" name="primaryColor" value={primaryColor} onChange={debouncedSetPrimaryColor} onInstantStyleUpdate={handleInstantStyleUpdate} />
                                <ColorSelector label="Text (Foreground)" name="fg" value={fg} onChange={debouncedSetFg} onInstantStyleUpdate={handleInstantStyleUpdate} />
                                <ColorSelector label="Muted Text" name="fgMuted" value={fgMuted} onChange={debouncedSetFgMuted} onInstantStyleUpdate={handleInstantStyleUpdate} />
                                <ColorSelector label="Secondary (Badge Bg)" name="secondary" value={secondary} onChange={debouncedSetSecondary} onInstantStyleUpdate={handleInstantStyleUpdate} />
                                <ColorSelector label="Accent Highlight" name="accent" value={accent} onChange={debouncedSetAccent} onInstantStyleUpdate={handleInstantStyleUpdate} />
                                <ColorSelector label="Card Background" name="cardBg" value={cardBg} onChange={debouncedSetCardBg} onInstantStyleUpdate={handleInstantStyleUpdate} />
                                <ColorSelector label="Card Border" name="cardBorder" value={cardBorder} onChange={debouncedSetCardBorder} onInstantStyleUpdate={handleInstantStyleUpdate} />
                                <ColorSelector label="Bullet Point Color" name="bullet" value={bullet} onChange={debouncedSetBullet} onInstantStyleUpdate={handleInstantStyleUpdate} />
                            </div>
                        </div>

                        {/* Save control panel footer */}
                        <div className="border-t border-border pt-5 mt-auto flex items-center gap-3 shrink-0 pb-4">
                            <Button
                                type="submit"
                                size="sm"
                                className="flex-1 h-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save Theme</span>
                            </Button>
                        </div>
                    </form>
                </aside>

                {/* Central Slide Preview Section */}
                <main className="flex-grow lg:h-full lg:overflow-y-auto max-lg:overflow-visible flex flex-col items-center justify-start p-4 md:p-8 lg:p-12 relative select-none gap-4">
                    {/* Layout Selector Bar */}
                    <div className="w-full max-w-[1000px] flex items-center justify-between bg-card text-card-foreground border border-border px-4 py-2.5 rounded-lg shadow-sm shrink-0">
                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                             Slide Layout Preview
                        </span>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium">Layout:</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-8 text-xs bg-background border-input text-foreground font-normal px-3 rounded-md cursor-pointer border hover:bg-accent/50 min-w-[160px] justify-between"
                                    >
                                        <span>{PREVIEW_LAYOUTS.find(l => l.category === layoutCategory && l.type === layoutType)?.name || "Numbered Cards"}</span>
                                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground opacity-60 ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 max-h-60 overflow-y-auto bg-popover text-popover-foreground border border-border rounded-md shadow-md p-1 z-30">
                                    {PREVIEW_LAYOUTS.map((layout) => (
                                        <DropdownMenuItem
                                            key={layout.name}
                                            onClick={() => {
                                                setLayoutCategory(layout.category);
                                                setLayoutType(layout.type);
                                            }}
                                            className="text-xs px-2 py-1.5 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground"
                                        >
                                            {layout.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div 
                        ref={previewContainerRef}
                        style={{
                            "--theme-bg": bg,
                            "--theme-bg-alt": bgAlt,
                            "--theme-fg": fg,
                            "--theme-fg-muted": fgMuted,
                            "--theme-primary": primaryColor,
                            "--theme-secondary": secondary,
                            "--theme-accent": accent,
                            "--theme-card-bg": cardBg,
                            "--theme-card-border": cardBorder,
                            "--theme-bullet": bullet,
                            "--theme-font-heading": fontHeading,
                            "--theme-font-body": fontBody,
                        }}
                        className="w-full rounded-md overflow-hidden pointer-events-none max-w-[1000px] [container-type:inline-size]"
                    >
                        {memoizedSlide}
                    </div>
                </main>
            </div>
        </div>
    );
}
