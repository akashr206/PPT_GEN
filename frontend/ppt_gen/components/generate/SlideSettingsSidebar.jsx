import React from "react";
import { Layout, PanelLeft, PanelRight, PanelTop, Image as ImageIcon, Type, Settings } from "lucide-react";
import { FontSizeControl } from "@/components/ui/FontSizeControl";

const SlideSettingsSidebar = React.memo(({ isOpen, onClose, activeSlideType, onUpdateSlide, textSizes, onUpdateTextSizes }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
            />
            {/* Sidebar Container */}
            <div className="fixed inset-y-0 right-0 lg:relative lg:inset-auto w-[340px] sm:w-[380px] lg:w-[420px] border-l border-border bg-card flex flex-col shrink-0 animate-in slide-in-from-right duration-200 z-50 shadow-2xl lg:shadow-none pt-12 lg:pt-0">
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-secondary/10">
                    <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-primary" />
                        <div className="flex flex-col">
                            <h3 className="font-bold text-sm text-foreground">Slide Settings</h3>
                            <span className="text-[10px] text-muted-foreground">Configure layout and sizes</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                        Close
                    </button>
                </div>

                {/* Content Body */}
                <div className="grow overflow-y-auto flex flex-col p-4 gap-6">
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-semibold text-foreground">Slide Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(() => {
                                const isTitleType = activeSlideType && activeSlideType.startsWith("title");
                                const titleTypes = [
                                    { id: "title-bg-image", label: "Title Bg", icon: ImageIcon },
                                    { id: "title-top-image", label: "Title Top", icon: PanelTop },
                                    { id: "title-simple", label: "Title Simple", icon: Type },
                                ];
                                const normalTypes = [
                                    { id: "normal", label: "Standard", icon: Layout },
                                    { id: "split-left-image", label: "Split Left", icon: PanelLeft },
                                    { id: "split-right-image", label: "Split Right", icon: PanelRight },
                                    { id: "top-image-banner", label: "Top Banner", icon: PanelTop },
                                    { id: "full-image", label: "Full Image", icon: ImageIcon },
                                ];
                                return isTitleType ? titleTypes : normalTypes;
                            })().map((type) => {
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

                    <div className="flex flex-col gap-3 pt-4 border-t border-border">
                        <label className="text-sm font-semibold text-foreground">Global Text Sizes</label>
                        <div className="flex flex-col gap-4">
                            <FontSizeControl
                                label="Title"
                                valueCqw={textSizes?.title || 2.8}
                                onChangeCqw={(v) => onUpdateTextSizes({ ...textSizes, title: v })}
                                min={1}
                                max={8}
                                step={0.1}
                            />
                            <FontSizeControl
                                label="Subtitle"
                                valueCqw={textSizes?.subtitle || 2.0}
                                onChangeCqw={(v) => onUpdateTextSizes({ ...textSizes, subtitle: v })}
                                min={0.5}
                                max={5}
                                step={0.1}
                            />
                            <FontSizeControl
                                label="Heading"
                                valueCqw={textSizes?.heading || 1.8}
                                onChangeCqw={(v) => onUpdateTextSizes({ ...textSizes, heading: v })}
                                min={0.5}
                                max={5}
                                step={0.1}
                            />
                            <FontSizeControl
                                label="Desc"
                                valueCqw={textSizes?.description || 1.3}
                                onChangeCqw={(v) => onUpdateTextSizes({ ...textSizes, description: v })}
                                min={0.5}
                                max={5}
                                step={0.1}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

SlideSettingsSidebar.displayName = "SlideSettingsSidebar";
export default SlideSettingsSidebar;
