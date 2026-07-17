import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2, Plus } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const SlideFloatingControls = React.memo(({ 
    isTouchDevice, 
    isBusy, 
    onEditWithAI, 
    onDeleteSlide, 
    canDelete,
    onAddBlock
}) => {
    return (
        <div
            className={`absolute top-4 right-4 z-30 flex items-center gap-2.5 p-1.5 px-2.5 bg-white/95 dark:bg-black/95 border rounded-sm border-border/80 shadow-lg transition-opacity duration-200 ${
                isTouchDevice
                    ? "opacity-100 shadow-xl"
                    : "opacity-0 group-hover:opacity-100"
            }`}
        >
            <TooltipProvider>
                {onAddBlock && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onAddBlock}
                                className="h-4 w-4 p-1 cursor-pointer"
                                disabled={isBusy}
                            >
                                <Plus size={8} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add block to slide</p>
                        </TooltipContent>
                    </Tooltip>
                )}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onEditWithAI}
                            className="h-4 w-4 p-1 cursor-pointer"
                            disabled={isBusy}
                        >
                            <Sparkles size={8} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit slide with AI</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDeleteSlide}
                            className="h-4 w-4 text-destructive hover:text-destructive hover:bg-destructive/25 p-1 cursor-pointer"
                            disabled={isBusy || !canDelete}
                        >
                            <Trash2 size={8} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete slide</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
});

SlideFloatingControls.displayName = "SlideFloatingControls";
export default SlideFloatingControls;
