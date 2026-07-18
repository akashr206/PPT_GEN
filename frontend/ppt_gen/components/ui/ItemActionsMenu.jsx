import React, { useRef, useCallback } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
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

export function ItemActionsMenu({ onAddBefore, onAddAfter, onDelete }) {
    const triggerRef = useRef(null);

    const handleOpenChange = useCallback((open) => {
        const groupItem = triggerRef.current?.closest(".group\\/item");
        if (groupItem) {
            groupItem.setAttribute("data-menu-open", String(open));
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
                        className="h-max w-max theme-menu-button rounded-xs! theme-text-primary"
                    >
                        <MoreHorizontal className="h-3 w-3 md:h-3! md:w-3!" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="center"
                    side="top"
                    className="flex min-w-22 w-max bg-popover border-border text-popover-foreground rounded-[4px] shadow-2xl z-50 p-[3px] gap-[3px]"
                >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuItem
                                onClick={onAddBefore}
                                className="cursor-pointer text-xs flex items-center justify-center p-1 rounded-sm hover:bg-accent"
                            >
                                <ArrowLeftToLine
                                    size={10}
                                    className="text-primary"
                                />
                            </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            className="text-[10px] py-1 px-2 font-medium"
                        >
                            <span>Add Item Before</span>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuItem
                                onClick={onAddAfter}
                                className="cursor-pointer text-xs flex items-center justify-center p-1 rounded-sm hover:bg-accent"
                            >
                                <ArrowRightToLine
                                    size={10}
                                    className="text-primary"
                                />
                            </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            className="text-[10px] py-1 px-2 font-medium"
                        >
                            <span>Add Item After</span>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuItem
                                onClick={onDelete}
                                className="cursor-pointer text-xs flex items-center justify-center p-1 text-destructive focus:bg-destructive/10 focus:text-destructive rounded-sm"
                            >
                                <Trash2 size={10} />
                            </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            className="text-[10px] py-1 px-2 font-medium bg-destructive text-destructive-foreground border border-destructive/20 shadow-lg"
                        >
                            <span>Delete</span>
                        </TooltipContent>
                    </Tooltip>
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipProvider>
    );
}
