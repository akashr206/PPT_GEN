"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function CreditsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isManual, setIsManual] = useState(false);
    const [credits, setCredits] = useState(0);

    useEffect(() => {
        const handleInsufficientCredits = (e) => {
            setIsManual(e.detail?.isManual === true);
            if (e.detail?.credits !== undefined) {
                setCredits(e.detail.credits);
            }
            setIsOpen(true);
        };

        window.addEventListener("insufficient-credits", handleInsufficientCredits);

        return () => {
            window.removeEventListener("insufficient-credits", handleInsufficientCredits);
        };
    }, []);

    const handleContact = () => {
        window.location.href = "mailto:akashr6514@gmail.com?subject=Request for more credits";
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-sm bg-popover border-border text-popover-foreground rounded-xl p-6 shadow-2xl z-50 text-center overflow-hidden">
                {/* Blue Aurora at the bottom */}
                <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-full h-80 bg-blue-500/20 blur-[70px] pointer-events-none" />

                <DialogHeader className="shrink-0 mb-2 flex flex-col items-center relative z-10">
                    <div className="flex flex-col items-center justify-center mb-6 mt-2">
                        <span className="text-[5rem] leading-none font-black text-foreground tracking-tighter">
                            {credits}
                        </span>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.25em] mt-2">
                            Available Credits
                        </span>
                    </div>
                    
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {isManual ? "Credits Balance" : "Out of Credits"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-3 leading-relaxed px-2">
                        Credits are used by AI features in <strong>Broadside AI</strong> to generate and edit your presentations.
                        {!isManual && <span className="block mt-1 font-medium text-destructive/80">You need more credits to complete this action.</span>}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 relative z-10">
                    <p className="text-sm text-foreground">
                        Please contact us for more credits.
                    </p>
                    <Button 
                        onClick={handleContact} 
                        className="w-full gap-2 font-medium"
                        size="lg"
                    >
                        <Mail size={16} />
                        Contact us
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
