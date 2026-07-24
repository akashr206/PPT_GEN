import React from "react";
import { Button } from "@/components/ui/button";
import { Undo, Redo, SlidersHorizontal, FolderOpen, Diamond, Palette, Share2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ViewerToolbar = React.memo(({ 
    isBusy, 
    isStreamGenerating, 
    canUndo, 
    canRedo, 
    onUndo, 
    onRedo, 
    onOpenSettings, 
    onOpenLibrary,
    onOpenThemeSelector,
    themeName
}) => {
    return (
        <div className="w-full h-12 relative bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 flex items-center justify-between px-6 z-20 shrink-0 select-none">
            <div className="flex items-center justify-between mx-auto w-full max-w-5xl gap-2">
                <div className="flex gap-2">
                    {/* Undo Button */}
                    <button
                        onClick={onUndo}
                        disabled={!canUndo || isBusy}
                        className="h-8 w-8 rounded-md bg-secondary/50 hover:bg-secondary disabled:opacity-50 text-secondary-foreground flex items-center justify-center transition-colors cursor-pointer border border-border/50 shadow-sm disabled:cursor-not-allowed"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo size={14} className="text-primary" />
                    </button>
                    {/* Redo Button */}
                    <button
                        onClick={onRedo}
                        disabled={!canRedo || isBusy}
                        className="h-8 w-8 rounded-md bg-secondary/50 hover:bg-secondary disabled:opacity-50 text-secondary-foreground flex items-center justify-center transition-colors cursor-pointer border border-border/50 shadow-sm disabled:cursor-not-allowed"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo size={14} className="text-primary" />
                    </button>
                </div>
                <div className="flex gap-2 max-md:hidden text-xs">
                    <Button
                        variant="outline"
                        onClick={onOpenThemeSelector}
                        className="cursor-pointer rounded-sm text-xs border-border text-foreground hover:bg-accent hover:text-accent-foreground flex items-center px-3"
                    >
                        <Palette size={14} className="text-primary mr-1" />
                        <span className="capitalize">{themeName || "Theme"}</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onOpenSettings}
                        className="cursor-pointer rounded-sm text-xs border-border"
                    >
                        <SlidersHorizontal size={14} className="mr-1" />
                        <span>Slide Settings</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onOpenLibrary}
                        className="cursor-pointer rounded-sm text-xs border-border"
                    >
                        <FolderOpen size={14} className="mr-1" />
                        <span>Library</span>
                    </Button>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isBusy}
                            className="h-8 px-3 rounded-md bg-secondary/50 hover:bg-secondary text-secondary-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-medium border border-border/50 shadow-sm md:hidden"
                        >
                            <SlidersHorizontal size={13} className="text-primary" />
                            <span>Slide Tools</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="min-w-[180px] bg-popover border-border text-popover-foreground rounded-md p-1.5 shadow-2xl z-50"
                    >
                        <DropdownMenuItem
                            onClick={onOpenThemeSelector}
                            className="px-2.5 py-2 cursor-pointer flex items-center gap-2 text-sm rounded-md"
                        >
                            <Palette size={14} className="text-primary" />
                            <span className="capitalize">Theme: {themeName || "Default"}</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={onOpenSettings}
                            className="px-2.5 py-2 cursor-pointer flex items-center gap-2 text-sm rounded-md"
                        >
                            <SlidersHorizontal size={14} />
                            <span>Slide Settings</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={onOpenLibrary}
                            className="px-2.5 py-2 cursor-pointer flex items-center gap-2 text-sm rounded-md"
                        >
                            <FolderOpen size={14} />
                            <span>Library</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isStreamGenerating && (
                <div className="absolute h-full w-full flex justify-center items-center bg-background/80">
                    <div className="flex gap-2 text-[11px] text-amber-500 font-medium">
                        <span>AI is generating slides. Do not close or reload</span>
                        <Diamond className="animate-spin w-4 h-4 shrink-0 p-px" />
                    </div>
                </div>
            )}
        </div>
    );
});

ViewerToolbar.displayName = "ViewerToolbar";
export default ViewerToolbar;
