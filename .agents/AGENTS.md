# Agent Rules

## Block Layout Generation
- **CSS Borders**: Do NOT use single-sided borders (e.g., `border-l`, `border-t`, `border-r`, `border-b`) for styling block layouts. The PowerPoint extraction engine struggles to parse single-sided CSS borders correctly. Always use a dedicated `div` or `span` with a specific width/height and background color to represent a line or border visually.
- **Icons**: Always use the `<EditableIcon>` component for rendering icons in block layouts instead of static `<LucideIcon>` components so that users can edit them. Pass the appropriate props (e.g., `iconName={item.icon}`, `onChange`, `contextText={item.header}`).
- **Sizing & Spacing Units**: Always use `cqw` (container query width) units/conventions for all layout properties including `width`, `height`, `border-width`, `border-radius`, padding, margin, font sizes, etc., to ensure proper scaling within blocks.
- **Flex Containment**: For split layouts, always apply `shrink` and `overflow-hidden` container styles to prevent nested block content from expanding beyond boundaries and overlapping adjacent panels.
- **Staggered Animations**: When rendering mapped lists or grids in block components, wrap each child element in the `<AnimatedItem>` component (passing the `index` prop) to support smooth staggered transitions during fullscreen presentations.


## Code rules
- Always use **SOLID principles** while writing the code.
- Please use shadcn components for app UI, don't use them in ppt components.
- **Theme Variables**: When coloring components in block layouts, do NOT use hardcoded colors or standard Tailwind color utilities (e.g., `bg-primary`, `text-blue-500`). Always use the custom utility classes defined in `themes.css` (e.g., `theme-bg-primary`, `theme-text-primary`, `theme-bg-alt`, `theme-text-muted`) to ensure colors adapt dynamically to the user's selected presentation theme.
