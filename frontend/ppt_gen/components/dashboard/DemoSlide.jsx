import React from "react";

export default function DemoSlide({ theme, activeVariables }) {
    // If activeVariables is passed, we style it dynamically inline (for the live creator page)
    // Otherwise, we load the theme classes/properties from the passed theme string or object
    const isEditingPreset = !!activeVariables;
    let themeId = "";
    let inlineStyles = {
        containerType: "inline-size"
    };

    if (isEditingPreset) {
        const v = activeVariables;
        inlineStyles = {
            ...inlineStyles,
            "--theme-bg": v.bg,
            "--theme-bg-alt": v.bgAlt || v.bg_alt,
            "--theme-fg": v.fg,
            "--theme-fg-muted": v.fgMuted || v.fg_muted,
            "--theme-primary": v.primaryColor || v.primary_color || v.primary,
            "--theme-secondary": v.secondary,
            "--theme-accent": v.accent,
            "--theme-card-bg": v.cardBg || v.card_bg,
            "--theme-card-border": v.cardBorder || v.card_border,
            "--theme-bullet": v.bullet,
            "--theme-font-heading": v.fontHeading || v.font_heading,
            "--theme-font-body": v.fontBody || v.font_body,
            fontFamily: v.fontBody || v.font_body,
            backgroundColor: v.bg,
            color: v.fg
        };
    } else {
        if (typeof theme === "string") {
            themeId = theme;
        } else if (theme && typeof theme === "object") {
            themeId = theme.id;
            inlineStyles = {
                ...inlineStyles,
                "--theme-bg": theme.bg,
                "--theme-bg-alt": theme.bg_alt,
                "--theme-fg": theme.fg,
                "--theme-fg-muted": theme.fg_muted,
                "--theme-primary": theme.primary_color || theme.primary,
                "--theme-card-bg": theme.card_bg,
                "--theme-card-border": theme.card_border,
                "--theme-font-heading": theme.font_heading,
                "--theme-font-body": theme.font_body,
                fontFamily: theme.font_body,
                backgroundColor: theme.bg,
                color: theme.fg
            };
        }
    }

    return (
        <div 
            style={inlineStyles}
            data-theme={themeId}
            className="w-full aspect-video rounded-sm inline-block shadow-2xl border border-border overflow-hidden flex-col justify-between transition-colors duration-300 relative text-left theme-container"
        >
            {/* Header Details */}
            <div className="flex flex-col gap-[1.25cqw]">
                {/* Slide Category Badge */}
                <div 
                    className="w-fit px-[1.5cqw] py-[0.5cqw] rounded-[99cqw] text-[1.2cqw] font-bold uppercase tracking-wider transition-colors duration-300 theme-badge"
                    style={isEditingPreset ? { backgroundColor: activeVariables.secondary, color: activeVariables.primaryColor || activeVariables.primary_color || activeVariables.primary } : {}}
                >
                    Executive Overview
                </div>
                {/* Title */}
                <h1 
                    className="text-[4cqw] font-extrabold tracking-tight transition-colors duration-300 theme-heading leading-tight"
                    style={isEditingPreset ? { fontFamily: activeVariables.fontHeading || activeVariables.font_heading, color: activeVariables.primaryColor || activeVariables.primary_color || activeVariables.primary } : {}}
                >
                    Defining Your Brand Identity
                </h1>
                {/* Subtitle */}
                <p 
                    className="text-[1.75cqw] font-medium transition-colors duration-300 theme-text-muted"
                    style={isEditingPreset ? { color: activeVariables.fgMuted || activeVariables.fg_muted } : {}}
                >
                    Create harmonized designs dynamically compile-ready for slide decks.
                </p>
            </div>

            {/* Body Content Blocks */}
            <div className="flex gap-[3.5cqw] items-stretch grow mt-[3cqw] min-h-0">
                {/* Bullet Lists */}
                <div className="flex-1 flex flex-col gap-[1.5cqw] justify-center">
                    <h3 
                        className="font-bold text-[1.4cqw] uppercase tracking-widest theme-text-muted"
                        style={isEditingPreset ? { color: activeVariables.fgMuted || activeVariables.fg_muted } : {}}
                    >
                        Core Deliverables
                    </h3>
                    <ul className="space-y-[1cqw]">
                        <li className="flex items-start gap-[1.25cqw] text-[1.5cqw] leading-snug">
                            <span className="text-[2.5cqw] leading-none mt-[-0.2cqw]" style={isEditingPreset ? { color: activeVariables.bullet } : { color: "var(--theme-bullet)" }}>•</span>
                            <span>Define a responsive color hierarchy for layouts.</span>
                        </li>
                        <li className="flex items-start gap-[1.25cqw] text-[1.5cqw] leading-snug">
                            <span className="text-[2.5cqw] leading-none mt-[-0.2cqw]" style={isEditingPreset ? { color: activeVariables.bullet } : { color: "var(--theme-bullet)" }}>•</span>
                            <span>Pair elegant typography suites instantly.</span>
                        </li>
                        <li className="flex items-start gap-[1.25cqw] text-[1.5cqw] leading-snug">
                            <span className="text-[2.5cqw] leading-none mt-[-0.2cqw]" style={isEditingPreset ? { color: activeVariables.bullet } : { color: "var(--theme-bullet)" }}>•</span>
                            <span>Generate slides matching this design.</span>
                        </li>
                    </ul>
                </div>

                {/* Interactive Sample Card Component */}
                <div 
                    className="w-[35cqw] rounded-[1cqw] p-[2.5cqw] border flex flex-col justify-between transition-colors duration-300 theme-card"
                    style={isEditingPreset ? {
                        backgroundColor: activeVariables.cardBg || activeVariables.card_bg,
                        borderColor: activeVariables.cardBorder || activeVariables.card_border
                    } : {}}
                >
                    <div className="flex flex-col gap-[1cqw]">
                        <h4 
                            className="font-bold text-[1.5cqw] uppercase tracking-wide theme-text-primary"
                            style={isEditingPreset ? { color: activeVariables.primaryColor || activeVariables.primary_color || activeVariables.primary } : {}}
                        >
                            Featured Card component
                        </h4>
                        <p className="text-[1.3cqw] font-light leading-relaxed theme-text-muted" style={isEditingPreset ? { color: activeVariables.fgMuted || activeVariables.fg_muted } : {}}>
                            Cards inherit secondary elements and custom borders to segment data points cleanly.
                        </p>
                    </div>
                    <div 
                        className="w-fit text-[1.1cqw] font-semibold px-[1.5cqw] py-[0.5cqw] rounded-[0.5cqw] mt-[2cqw] transition-colors duration-300 theme-bg-secondary theme-text-accent"
                        style={isEditingPreset ? {
                            backgroundColor: activeVariables.secondary,
                            color: activeVariables.accent
                        } : {}}
                    >
                        Highlighted Badge
                    </div>
                </div>
            </div>
        </div>
    );
}
