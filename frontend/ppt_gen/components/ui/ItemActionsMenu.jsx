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
                        className="h-max w-max theme-menu-button theme-text-primary"
                    >
                        <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="flex justify-between bg-popover border-border text-popover-foreground rounded-xl shadow-2xl z-50 p-1 gap-1"
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
                            <span>Add Item Before</span>
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
                            <span>Add Item After</span>
                        </TooltipContent>
                    </Tooltip>

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
                            <span>Delete</span>
                        </TooltipContent>
                    </Tooltip>
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipProvider>
    );
}
