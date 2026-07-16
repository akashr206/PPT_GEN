import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Layout, PanelLeft, PanelRight, PanelTop, Image as ImageIcon, Type, List, CheckSquare } from "lucide-react";

const SlideSettingsModal = React.memo(({ isOpen, onOpenChange, activeSlideType, onUpdateSlide }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-popover border-border text-popover-foreground rounded-md p-6 shadow-2xl z-50">
                <DialogHeader className="shrink-0 mb-4">
                    <DialogTitle className="text-lg font-bold">Slide Settings</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Configure the macro layout type and image sizes for the current slide.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium">Slide Type</label>
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { id: "normal", label: "Standard", icon: Layout },
                                { id: "split-left-image", label: "Split Left", icon: PanelLeft },
                                { id: "split-right-image", label: "Split Right", icon: PanelRight },
                                { id: "top-image-banner", label: "Top Banner", icon: PanelTop },
                                { id: "full-image", label: "Full Image", icon: ImageIcon },
                                { id: "title", label: "Title", icon: Type },
                                { id: "agenda", label: "Agenda", icon: List },
                                { id: "closing", label: "Closing", icon: CheckSquare },
                            ].map((type) => {
                                const Icon = type.icon;
                                const isActive = activeSlideType === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => onUpdateSlide("type", type.id)}
                                        className={`flex flex-col items-center justify-center p-3 gap-2 rounded-lg border transition-all ${isActive ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/50 hover:bg-muted text-muted-foreground'}`}
                                        title={type.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-[10px] font-semibold text-center leading-tight">{type.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});

SlideSettingsModal.displayName = "SlideSettingsModal";
export default SlideSettingsModal;
