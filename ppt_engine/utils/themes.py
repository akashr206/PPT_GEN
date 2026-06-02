from pptx.dml.color import RGBColor

THEMES = {
    "neon_rose": {
        "name": "Neon Rose (Dark Mode)",
        "category": "modern",
        "colors": {
            "background": RGBColor(18, 18, 18),             # Deep Charcoal Base (#121212)
            "primary": RGBColor(30, 30, 30),                # Elevated Box Gray (#1E1E1E)
            "secondary": RGBColor(45, 45, 45),              # Slate Container Gray (#2D2D2D)
            "accent": RGBColor(219, 39, 119),               # Deeper Rose Pink (#DB2777)
            "primary_foreground": RGBColor(229, 231, 235),   # Soft Light Gray (#E5E7EB)
            "secondary_foreground": RGBColor(156, 163, 175), # Muted Slate Gray (#9CA3AF)
            "accent_foreground": RGBColor(255, 255, 255),   # Crisp White (#FFFFFF)
            "title": RGBColor(219, 39, 119),                # Rose Pink (#DB2777)
        },
        "fonts": {
            "title": "Poppins",
            "heading": "Poppins",
            "body": "Poppins",
        }
    },
    "royal_indigo": {
        "name": "Royal Indigo (Light Mode)",
        "category": "professional",
        "colors": {
            "background": RGBColor(248, 250, 252),           # Bright Cool Gray (#F8FAFC)
            "primary": RGBColor(241, 245, 249),             # Soft Elevated Gray (#F1F5F9)
            "secondary": RGBColor(226, 232, 240),           # Grid/border Slate (#E2E8F0)
            "accent": RGBColor(79, 70, 229),                # Royal Indigo (#4F46E5)
            "primary_foreground": RGBColor(15, 23, 42),      # Deep Navy/Slate Charcoal (#0F172A)
            "secondary_foreground": RGBColor(71, 85, 105),   # Muted Blue-Gray (#475569)
            "accent_foreground": RGBColor(255, 255, 255),   # Crisp White (#FFFFFF)
            "title": RGBColor(79, 70, 229),                 # Indigo Header (#4F46E5)
        },
        "fonts": {
            "title": "Inter",
            "heading": "Inter",
            "body": "Roboto",
        }
    },
    "nordic_forest": {
        "name": "Nordic Forest (Dark Mode)",
        "category": "casual",
        "colors": {
            "background": RGBColor(11, 29, 23),             # Very Deep Forest Green (#0B1D17)
            "primary": RGBColor(20, 47, 38),                # Muted Teal-Green Box (#142F26)
            "secondary": RGBColor(34, 69, 57),              # Dark Sage Accent (#224539)
            "accent": RGBColor(245, 158, 11),               # Golden Amber Highlight (#F59E0B)
            "primary_foreground": RGBColor(241, 245, 249),   # Ice Off-White (#F1F5F9)
            "secondary_foreground": RGBColor(148, 163, 184), # Muted Sage Gray (#94A3B8)
            "accent_foreground": RGBColor(28, 25, 23),       # Deep Charcoal for text contrast (#1C1917)
            "title": RGBColor(245, 158, 11),                # Golden Amber (#F59E0B)
        },
        "fonts": {
            "title": "Outfit",
            "heading": "Outfit",
            "body": "Inter",
        }
    },
    "classic_editorial": {
        "name": "Classic Editorial (Light Mode)",
        "category": "academic",
        "colors": {
            "background": RGBColor(253, 251, 247),           # Ivory Cream (#FDFBF7)
            "primary": RGBColor(245, 240, 230),             # Elevated Warm Sand (#F5F0E6)
            "secondary": RGBColor(230, 220, 205),           # Muted Linen Beige (#E6DCCD)
            "accent": RGBColor(153, 27, 27),                # Classic Crimson Maroon (#991B1B)
            "primary_foreground": RGBColor(31, 41, 55),      # Charcoal Slate (#1F2937)
            "secondary_foreground": RGBColor(75, 85, 99),    # Dark Gray (#4B5563)
            "accent_foreground": RGBColor(255, 255, 255),   # Crisp White (#FFFFFF)
            "title": RGBColor(153, 27, 27),                 # Classic Crimson Maroon (#991B1B)
        },
        "fonts": {
            "title": "Georgia",
            "heading": "Georgia",
            "body": "Garamond",
        }
    },
    "cyber_sunset": {
        "name": "Cyber Sunset (Dark Mode)",
        "category": "modern",
        "colors": {
            "background": RGBColor(15, 12, 27),              # Midnight Violet (#0F0C1B)
            "primary": RGBColor(30, 24, 51),                # Dark Indigo Box (#1E1833)
            "secondary": RGBColor(46, 37, 77),              # Supporting Deep Purple (#2E254D)
            "accent": RGBColor(249, 115, 22),               # Electric Orange (#F97316)
            "primary_foreground": RGBColor(243, 244, 246),   # Bright Gray (#F3F4F6)
            "secondary_foreground": RGBColor(167, 139, 250), # Lavender Accent (#A78BFA)
            "accent_foreground": RGBColor(15, 12, 27),       # Midnight Violet contrast (#0F0C1B)
            "title": RGBColor(249, 115, 22),                # Electric Orange (#F97316)
        },
        "fonts": {
            "title": "Space Grotesk",
            "heading": "Space Grotesk",
            "body": "Fira Code",
        }
    },
    "executive_tech": {
        "name": "Executive Tech (Light Mode)",
        "category": "professional",
        "colors": {
            "background": RGBColor(241, 245, 249),           # Slick Slate White (#F1F5F9)
            "primary": RGBColor(255, 255, 255),             # Elevated Pure White (#FFFFFF)
            "secondary": RGBColor(226, 232, 240),           # Light Slate Grid (#E2E8F0)
            "accent": RGBColor(13, 148, 136),               # Deep Ocean Teal (#0D9488)
            "primary_foreground": RGBColor(15, 23, 42),      # Dark Blue-Gray (#0F172A)
            "secondary_foreground": RGBColor(71, 85, 105),   # Cool Slate Gray (#475569)
            "accent_foreground": RGBColor(255, 255, 255),   # Crisp White (#FFFFFF)
            "title": RGBColor(13, 148, 136),                # Ocean Teal (#0D9488)
        },
        "fonts": {
            "title": "Montserrat",
            "heading": "Montserrat",
            "body": "Open Sans",
        }
    },
    "warm_terracotta": {
        "name": "Warm Terracotta (Light Mode)",
        "category": "casual",
        "colors": {
            "background": RGBColor(250, 250, 249),           # Warm Cream Stone (#FAFAF9)
            "primary": RGBColor(245, 245, 244),             # Elevated Warm Gray (#F5F5F4)
            "secondary": RGBColor(231, 229, 228),           # Sand Border Gray (#E7E5E4)
            "accent": RGBColor(194, 65, 12),                # Warm Terracotta Clay (#C2410C)
            "primary_foreground": RGBColor(41, 37, 36),      # Rich Dark Stone (#292524)
            "secondary_foreground": RGBColor(120, 113, 108), # Muted Pebble Gray (#78716C)
            "accent_foreground": RGBColor(255, 255, 255),   # Crisp White (#FFFFFF)
            "title": RGBColor(194, 65, 12),                 # Terracotta Heading (#C2410C)
        },
        "fonts": {
            "title": "Playfair Display",
            "heading": "Playfair Display",
            "body": "Lato",
        }
    },
    "minimal_slate": {
        "name": "Minimal Slate (Dark Mode)",
        "category": "academic",
        "colors": {
            "background": RGBColor(15, 23, 42),              # Deep Obsidian Slate (#0F172A)
            "primary": RGBColor(30, 41, 59),                # Elevated Blue-Gray Box (#1E293B)
            "secondary": RGBColor(51, 65, 85),              # Supporting Muted Slate (#334155)
            "accent": RGBColor(56, 189, 248),               # Radiant Ice Blue (#38BDF8)
            "primary_foreground": RGBColor(248, 250, 252),   # High-Contrast Ice White (#F8FAFC)
            "secondary_foreground": RGBColor(148, 163, 184), # Muted Blue-Gray (#94A3B8)
            "accent_foreground": RGBColor(15, 23, 42),       # Dark Slate contrast (#0F172A)
            "title": RGBColor(56, 189, 248),                # Ice Blue Heading (#38BDF8)
        },
        "fonts": {
            "title": "Helvetica Neue",
            "heading": "Helvetica Neue",
            "body": "Arial",
        }
    }
}
