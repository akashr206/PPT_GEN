"use client";

import React from "react";
import { useThemes } from "@/hooks/use-themes";

export default function CustomThemesStyles() {
    const { customThemes } = useThemes({ fetchOnMount: false });

    if (!customThemes || customThemes.length === 0) return null;

    const styleContent = customThemes
        .map((theme) => {
            return `
[data-theme="${theme.id}"] {
    --theme-bg: ${theme.bg};
    --theme-bg-alt: ${theme.bg_alt};
    --theme-fg: ${theme.fg};
    --theme-fg-muted: ${theme.fg_muted};
    --theme-primary: ${theme.primary_color};
    --theme-card-bg: ${theme.card_bg};
    --theme-card-border: ${theme.card_border};
    --theme-font-heading: ${theme.font_heading};
    --theme-font-body: ${theme.font_body};
}`;
        })
        .join("\n");

    return <style dangerouslySetInnerHTML={{ __html: styleContent }} />;
}
