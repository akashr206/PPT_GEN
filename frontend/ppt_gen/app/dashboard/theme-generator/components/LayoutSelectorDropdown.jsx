import React, { useMemo } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";
import metadata from "@/components/templates/metadata.json";

export function LayoutSelectorDropdown({ category, type, onSelect }) {
    // Dynamically derive groups from metadata to adhere to Open/Closed Principle
    const groupedLayouts = useMemo(() => {
        return Object.entries(metadata.layoutCategories).map(([catKey, catMeta]) => ({
            category: catKey,
            label: catMeta.name,
            items: catMeta.types.map(t => ({
                type: t.id,
                name: t.name,
                value: `${catKey}:${t.id}`
            }))
        }));
    }, []);

    // Find current active name for the trigger label
    const activeLayoutName = useMemo(() => {
        for (const group of groupedLayouts) {
            for (const item of group.items) {
                if (group.category === category && item.type === type) return item.name;
            }
        }
        return "Select Layout";
    }, [category, type, groupedLayouts]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="h-8 text-xs bg-background border-input text-foreground font-normal px-3 rounded-md cursor-pointer border hover:bg-accent/50 min-w-[200px] justify-between shadow-sm"
                >
                    <span className="truncate">{activeLayoutName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground opacity-60 ml-2 shrink-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-56 max-h-[60vh] overflow-y-auto bg-popover text-popover-foreground border border-border rounded-md shadow-md z-30 p-0"
                align="start"
            >
                {groupedLayouts.map((group, groupIndex) => (
                    <React.Fragment key={group.category}>
                        <DropdownMenuGroup className="p-1">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold py-1.5 px-2">
                                {group.label}
                            </DropdownMenuLabel>
                            {group.items.map((item) => {
                                const isActive = group.category === category && item.type === type;
                                return (
                                    <DropdownMenuItem
                                        key={item.value}
                                        onClick={() => onSelect(group.category, item.type)}
                                        className={`text-xs px-2 py-1.5 cursor-pointer rounded-sm flex items-center justify-between ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}
                                    >
                                        <span>{item.name}</span>
                                        {isActive && <Check className="w-3.5 h-3.5 text-primary" />}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuGroup>
                        {groupIndex < groupedLayouts.length - 1 && (
                            <DropdownMenuSeparator className="m-0" />
                        )}
                    </React.Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
