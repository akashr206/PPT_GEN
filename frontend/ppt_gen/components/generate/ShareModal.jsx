import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Share2, Link as LinkIcon, Loader2, Copy, Check } from "lucide-react";

const ShareModal = React.memo(({ 
    isOpen, 
    onOpenChange, 
    isShared, 
    onToggleShare,
    isLoading,
    shareUrl
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!isLoading) {
                    onOpenChange(open);
                }
            }}
        >
            <DialogContent className="max-w-md bg-popover border-border text-popover-foreground rounded-md p-6 shadow-2xl z-50">
                <DialogHeader className="shrink-0 mb-4">
                    <DialogTitle className="text-lg font-bold flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-primary" />
                        <span>Share Presentation</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Create a view-only link. Anyone with this link will be able to view the presentation in real-time as you update it.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/20">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold">Share to web</span>
                            <span className="text-xs text-muted-foreground">Make your presentation accessible via link</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                            <Switch 
                                checked={isShared} 
                                onCheckedChange={onToggleShare} 
                                disabled={isLoading} 
                            />
                        </div>
                    </div>

                    {isShared && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-semibold text-muted-foreground">Public Link</label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input 
                                        readOnly 
                                        value={shareUrl} 
                                        className="pl-9 text-xs h-9 bg-secondary/10"
                                    />
                                </div>
                                <Button
                                    onClick={handleCopy}
                                    variant="default"
                                    className="h-9 px-4 gap-2 text-xs"
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
});

ShareModal.displayName = "ShareModal";
export default ShareModal;
