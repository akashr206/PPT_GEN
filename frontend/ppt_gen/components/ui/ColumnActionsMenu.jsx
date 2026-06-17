"use client";

import React, { useRef, useCallback } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreVertical,
    Trash2,
    ArrowLeftToLine,
    ArrowRightToLine,
} from "lucide-react";
import { Button } from "./button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import "../templates/themes.css";

export function ColumnActionsMenu({ onAddBefore, onAddAfter, onDelete }) {
    const triggerRef = useRef(null);

    const handleOpenChange = useCallback((open) => {
        const header = triggerRef.current?.closest(".group\\/colHeader");
        if (header) {
            header.setAttribute("data-menu-open", String(open));
            // Also set style directly just in case css selectors don't cover it
            if (open) {
                header.classList.add("menu-open");
            } else {
                header.classList.remove("menu-open");
            }
        }
    }, []);

    return (
        <TooltipProvider delayDuration={50}>
            <DropdownMenu onOpenChange={handleOpenChange}>
                <DropdownMenuTrigger asChild>
                    <Button
                        ref={triggerRef}
                        type="button"
                        variant="outline"
                        className="h-5 w-5 p-0 bg-transparent border-none text-current hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                    >
                        <MoreVertical size={12} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="flex justify-between bg-popover border-border text-popover-foreground rounded-md shadow-2xl z-50 p-1 gap-1"
                >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuItem
                                onClick={onAddBefore}
                                className="cursor-pointer text-xs flex items-center justify-center p-2 rounded-md hover:bg-accent"
                            >
                                <ArrowLeftToLine
                                    size={14}
                                    className="text-primary"
                                />
                            </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            className="text-[10px] py-1 px-2 font-medium"
                        >
                            <span>Add Column Left</span>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuItem
                                onClick={onAddAfter}
                                className="cursor-pointer text-xs flex items-center justify-center p-2 rounded-md hover:bg-accent"
                            >
                                <ArrowRightToLine
                                    size={14}
                                    className="text-primary"
                                />
                            </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            className="text-[10px] py-1 px-2 font-medium"
                        >
                            <span>Add Column Right</span>
                        </TooltipContent>
                    </Tooltip>

                    {onDelete && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuItem
                                    onClick={onDelete}
                                    className="cursor-pointer text-xs flex items-center justify-center p-2 text-destructive focus:bg-destructive/10 focus:text-destructive rounded-md"
                                >
                                    <Trash2 size={14} />
                                </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                className="text-[10px] py-1 px-2 font-medium bg-destructive text-destructive-foreground border border-destructive/20 shadow-lg"
                            >
                                <span>Delete Column</span>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipProvider>
    );
}
