import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const EditWithAIModal = React.memo(({ 
    isOpen, 
    onOpenChange, 
    prompt, 
    setPrompt, 
    isLoading, 
    onApply 
}) => {
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!isLoading) {
                    onOpenChange(open);
                    if (!open) setPrompt("");
                }
            }}
        >
            <DialogContent className="max-w-md bg-popover border-border text-popover-foreground rounded-md p-6 shadow-2xl z-50">
                <DialogHeader className="shrink-0 mb-4">
                    <DialogTitle className="text-lg font-bold flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                            <span>Edit Slide with AI</span>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-help rounded-full hover:bg-muted/50">
                                        <Info className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>Editing with AI costs 5 credits per edit</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground pt-1">
                        Describe how you want to modify this slide. You can
                        ask the AI to rewrite text, add/remove points, or
                        adjust layout styling.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Change layout to stats grid and add metrics for user satisfaction and growth."
                        className="min-h-[100px] resize-none"
                        disabled={isLoading}
                    />

                    <div className="flex justify-end gap-2.5">
                        <Button
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                setPrompt("");
                            }}
                            disabled={isLoading}
                            className="cursor-pointer text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onApply}
                            disabled={isLoading || !prompt.trim()}
                            className="cursor-pointer text-xs flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Editing...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Apply Changes</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});

EditWithAIModal.displayName = "EditWithAIModal";
export default EditWithAIModal;
