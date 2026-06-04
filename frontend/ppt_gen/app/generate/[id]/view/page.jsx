"use client";

import React, { useState, useEffect, use, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Layout, Check, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Slide from "@/components/templates/Slide";
import metadata from "@/components/templates/metadata.json";
import { toast } from "sonner";
import { extractSlideData } from "@/utils/extractor";

const MOCK_PRESENTATIONS = {
    "quarterly-review": {
        id: "quarterly-review",
        title: "Quarterly Business Review",
        theme: "sunset",
        slides_count: 3,
        slides: [
            {
                title: "Q2 Business Performance",
                subtitle: "Key metrics and strategic initiatives overview.",
                layout: { category: "title", type: "main" },
                presenter: "Akash Ramakrishnan",
                company: "Iota AI",
                date: "June 2026",
            },
            {
                title: "Growth Metrics",
                subtitle:
                    "Analyzing user retention and sales performance over Q2.",
                layout: { category: "stats", type: "grid" },
                items: [
                    {
                        header: "10x Speed",
                        description: "Increase in rendering performance.",
                    },
                    {
                        header: "99% Success",
                        description:
                            "Production pipeline deployment pass rate.",
                    },
                    {
                        header: "24/7 Support",
                        description: "Active system health monitoring.",
                    },
                ],
            },
            {
                title: "Roadmap to Q3",
                subtitle:
                    "Next steps for product enhancements and scaling operations.",
                layout: { category: "timelines", type: "horizontal" },
                items: [
                    {
                        header: "Phase 1: Design",
                        description: "Establish premium design components.",
                    },
                    {
                        header: "Phase 2: Alpha Test",
                        description:
                            "Deploy local testing suite to beta group.",
                    },
                    {
                        header: "Phase 3: Launch",
                        description:
                            "Public deployment on high-speed global CDN.",
                    },
                ],
            },
        ],
    },
    "ai-future": {
        id: "ai-future",
        title: "AI and Future of Web Development",
        theme: "cyberpunk",
        slides_count: 2,
        slides: [
            {
                title: "AI and Future of Web Dev",
                subtitle:
                    "How generative technologies are changing developer workflows.",
                layout: { category: "title", type: "split" },
                presenter: "Akash R.",
                company: "Vercel & DeepMind",
                date: "Q2 2026",
            },
            {
                title: "Core Technologies",
                subtitle:
                    "Crucial stack decisions for next generation AI products.",
                layout: { category: "cards", type: "simple" },
                items: [
                    {
                        header: "React Server Components",
                        description:
                            "Optimizing initial load and streaming HTML.",
                    },
                    {
                        header: "Edge Functions",
                        description:
                            "Low latency executions globally distributed.",
                    },
                ],
            },
        ],
    },
};

const CURSOR_LEFT = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M12 19l-7-7 7-7' stroke='black' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><path d='M19 12H5M12 19l-7-7 7-7' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>") 16 16, w-resize`;
const CURSOR_RIGHT = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none'><path d='M5 12h14M12 5l7 7-7 7' stroke='black' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><path d='M5 12h14M12 5l7 7-7 7' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>") 16 16, e-resize`;

export default function PPTSlidesViewerPage({ params }) {
    const unwrappedParams = use(params);
    const pptId = unwrappedParams?.id;
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();

    const [pptData, setPptData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [editableSlides, setEditableSlides] = useState([]);
    const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const slideRefs = useRef([]);
    const presentationRef = useRef(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const handlePresent = useCallback(async () => {
        if (presentationRef.current) {
            try {
                if (document.fullscreenElement) {
                    await document.exitFullscreen();
                } else {
                    await presentationRef.current.requestFullscreen();
                }
            } catch (err) {
                console.error("Error attempting to enable fullscreen:", err);
                toast.error("Fullscreen presentation not supported or blocked.");
            }
        }
    }, []);

    useEffect(() => {
        if (pptData?.slides) {
            setEditableSlides(JSON.parse(JSON.stringify(pptData.slides)));
        }
    }, [pptData]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Do not trigger slide change if user is typing in an input or editable element
            if (
                e.target.tagName === "INPUT" ||
                e.target.tagName === "TEXTAREA" ||
                e.target.isContentEditable
            ) {
                return;
            }

            if (e.key === "ArrowRight") {
                setActiveSlideIndex((prev) =>
                    Math.min(prev + 1, editableSlides.length - 1)
                );
            } else if (e.key === "ArrowLeft") {
                setActiveSlideIndex((prev) => Math.max(prev - 1, 0));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [editableSlides.length]);

    useEffect(() => {
        if (authStatus === "loading") return;
        if (authStatus === "unauthenticated") {
            router.push("/");
            return;
        }

        if (!pptId) return;

        // Simulate fetching presentation data
        const timer = setTimeout(() => {
            const localData = localStorage.getItem(`ppt_${pptId}`);
            if (localData) {
                try {
                    setPptData(JSON.parse(localData));
                    setIsLoading(false);
                    return;
                } catch (e) {
                    console.error("Failed to parse local data", e);
                }
            }
            
            const mockData =
                MOCK_PRESENTATIONS[pptId] ||
                MOCK_PRESENTATIONS["quarterly-review"];
            setPptData(JSON.parse(JSON.stringify(mockData)));
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [pptId, authStatus, router]);

    // Save to local storage whenever pptData changes
    useEffect(() => {
        if (pptData && !isLoading && pptId) {
            localStorage.setItem(`ppt_${pptId}`, JSON.stringify(pptData));
        }
    }, [pptData, isLoading, pptId]);

    const handleDownloadAsPPT = async (e) => {
        if (slideRefs.current) {
            const slideElements = slideRefs.current.filter((el) => el !== null);

            const allSlidesData = await Promise.all(
                Array.from(slideElements).map(async (element) => {
                    return await extractSlideData(element.firstChild);
                }),
            );
            await fetch("http://localhost:8000/api/convert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    slides: allSlidesData,
                }),
            });
        }
    };

    const handleLayoutChange = (category, type) => {
        if (!editableSlides || !editableSlides[activeSlideIndex]) return;
        
        const updatedSlides = [...editableSlides];
        updatedSlides[activeSlideIndex].layout = {
            category: category,
            type: type
        };
        
        setEditableSlides(updatedSlides);
        setPptData((prev) => ({
            ...prev,
            slides: updatedSlides
        }));
        
        toast.success(`Layout changed to ${category} (${type})`);
    };

    const handleUpdateSlide = (field, value) => {
        if (!editableSlides || !editableSlides[activeSlideIndex]) return;
        
        const updatedSlides = [...editableSlides];
        updatedSlides[activeSlideIndex] = {
            ...updatedSlides[activeSlideIndex],
            [field]: value
        };
        
        setEditableSlides(updatedSlides);
        // Save to local storage or state
        setPptData((prev) => ({
            ...prev,
            slides: updatedSlides
        }));
    };

    const handleUpdateItem = (itemIndex, field, value) => {
        if (!editableSlides || !editableSlides[activeSlideIndex]) return;
        
        const updatedSlides = [...editableSlides];
        const slide = updatedSlides[activeSlideIndex];
        if (!slide.items) slide.items = [];
        
        const updatedItems = [...slide.items];
        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            [field]: value
        };
        
        updatedSlides[activeSlideIndex] = {
            ...slide,
            items: updatedItems
        };
        
        setEditableSlides(updatedSlides);
        setPptData((prev) => ({
            ...prev,
            slides: updatedSlides
        }));
    };

    const handleAddItem = () => {
        if (!editableSlides || !editableSlides[activeSlideIndex]) return;
        
        const updatedSlides = [...editableSlides];
        const slide = updatedSlides[activeSlideIndex];
        const currentItems = slide.items || [];
        
        updatedSlides[activeSlideIndex] = {
            ...slide,
            items: [...currentItems, { header: "New Item", description: "Item description" }]
        };
        
        setEditableSlides(updatedSlides);
        setPptData((prev) => ({
            ...prev,
            slides: updatedSlides
        }));
        toast.success("Item added");
    };

    const handleAddItemAtIndex = (itemIndex, direction) => {
        if (!editableSlides || !editableSlides[activeSlideIndex]) return;
        
        const updatedSlides = [...editableSlides];
        const slide = updatedSlides[activeSlideIndex];
        const currentItems = [...(slide.items || [])];
        
        const newItem = { header: "New Point", description: "Point description" };
        const insertIndex = direction === "before" ? itemIndex : itemIndex + 1;
        currentItems.splice(insertIndex, 0, newItem);
        
        updatedSlides[activeSlideIndex] = {
            ...slide,
            items: currentItems
        };
        
        setEditableSlides(updatedSlides);
        setPptData((prev) => ({
            ...prev,
            slides: updatedSlides
        }));
        toast.success(`Point added ${direction}`);
    };

    const handleDeleteItem = (itemIndex) => {
        if (!editableSlides || !editableSlides[activeSlideIndex]) return;
        
        const updatedSlides = [...editableSlides];
        const slide = updatedSlides[activeSlideIndex];
        if (!slide.items) return;
        
        const updatedItems = slide.items.filter((_, idx) => idx !== itemIndex);
        
        updatedSlides[activeSlideIndex] = {
            ...slide,
            items: updatedItems
        };
        
        setEditableSlides(updatedSlides);
        setPptData((prev) => ({
            ...prev,
            slides: updatedSlides
        }));
        toast.success("Item deleted");
    };

    // Synchronize information with the header/navbar
    useEffect(() => {
        if (pptData) {
            const event = new CustomEvent("ppt-info-changed", {
                detail: {
                    title: pptData.title || "Untitled Presentation",
                    appState: "viewing_slides",
                    theme: pptData.theme || "sunset"
                }
            });
            window.dispatchEvent(event);
        }
    }, [pptData]);

    useEffect(() => {
        const handleRequest = () => {
            if (pptData) {
                const event = new CustomEvent("ppt-info-changed", {
                    detail: {
                        title: pptData.title || "Untitled Presentation",
                        appState: "viewing_slides",
                        theme: pptData.theme || "sunset"
                    }
                });
                window.dispatchEvent(event);
            }
        };

        const handlePDF = () => {
            toast.info("Preparing PDF download...");
            setTimeout(() => {
                toast.success("PDF Downloaded successfully (simulation).");
            }, 1000);
        };

        const handlePPT = (e) => {
            handleDownloadAsPPT(e);
        };

        const handleTheme = (e) => {
            if (e.detail && e.detail.theme) {
                const newTheme = e.detail.theme;
                setPptData((prev) => ({ ...prev, theme: newTheme }));
                toast.success(`Theme updated to ${newTheme}`);
            }
        };

        const handlePresentEvent = () => {
            handlePresent();
        };

        window.addEventListener("request-ppt-info", handleRequest);
        window.addEventListener("trigger-download-pdf", handlePDF);
        window.addEventListener("trigger-download-pptx", handlePPT);
        window.addEventListener("trigger-change-theme", handleTheme);
        window.addEventListener("trigger-present", handlePresentEvent);

        return () => {
            window.removeEventListener("request-ppt-info", handleRequest);
            window.removeEventListener("trigger-download-pdf", handlePDF);
            window.removeEventListener("trigger-download-pptx", handlePPT);
            window.removeEventListener("trigger-change-theme", handleTheme);
            window.removeEventListener("trigger-present", handlePresentEvent);
        };
    }, [pptData, handleDownloadAsPPT, handlePresent]);

    if (isLoading || authStatus === "loading") {
        return (
            <div className="w-full flex-1 flex flex-col justify-center items-center p-8 min-h-[60vh]">
                <div className="w-full max-w-[1000px] aspect-[16/9] bg-card/25 border border-border/30 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden animate-pulse">
                    <div className="space-y-3">
                        <div className="h-5 w-20 bg-muted/30 rounded-md" />
                        <div className="h-7 w-3/4 max-w-[450px] bg-muted/40 rounded-lg" />
                    </div>
                    <div className="space-y-2 my-4">
                        <div className="h-3.5 w-full bg-muted/15 rounded-md" />
                        <div className="h-3.5 w-11/12 bg-muted/10 rounded-md" />
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border/20">
                        <div className="h-5 w-20 bg-muted/20 rounded-md" />
                        <div className="h-5 w-24 bg-muted/30 rounded-md" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center p-2 md:p-8 min-h-0 select-none overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-between md:justify-center w-full h-full p-2 sm:p-4 pb-4 md:pb-4 relative min-h-0">
                
                {/* Vertical Centering Wrapper */}
                <div className="w-full flex-1 md:flex-none flex flex-col items-center justify-center min-h-0 gap-3">
                    
                    {/* Top Action Bar */}
                    <div className="w-full max-w-[1000px] flex justify-end gap-2 px-1">


                        {editableSlides && editableSlides[activeSlideIndex] && editableSlides[activeSlideIndex].layout?.category !== "title" && (
                            <button
                                onClick={handleAddItem}
                                className="h-8 px-3 rounded-md bg-secondary/50 hover:bg-secondary text-secondary-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-medium border border-border/50 shadow-sm"
                                title="Add New Point"
                            >
                                <Plus size={14} className="text-primary" />
                                <span>Add Point</span>
                            </button>
                        )}
                        <button
                            onClick={() => setIsLayoutModalOpen(true)}
                            className="h-8 px-3 rounded-md bg-secondary/50 hover:bg-secondary text-secondary-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-medium border border-border/50 shadow-sm"
                            title="Change Slide Layout"
                        >
                            <Layout size={14} className="text-primary" />
                            <span>Layout</span>
                        </button>
                    </div>

                    <div 
                        ref={presentationRef}
                        className={`w-full max-w-[1000px] relative group flex items-center justify-center ${isFullscreen ? '!max-w-none bg-black w-screen h-screen' : ''}`}
                    >
                        {!isFullscreen && (
                            <button
                                onClick={() => setActiveSlideIndex((prev) => Math.max(prev - 1, 0))}
                                disabled={activeSlideIndex === 0}
                                className="absolute z-20 h-8 w-8 md:h-10 md:w-10 rounded-full bg-background/80 hover:bg-background border border-border text-foreground flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:!opacity-0 shadow-sm backdrop-blur-sm cursor-pointer -left-4 md:-left-12"
                                title="Previous Slide (Left Arrow)"
                            >
                                <ChevronLeft size={20} className="mr-0.5" />
                            </button>
                        )}
                        
                        <div className={`w-full relative overflow-hidden ${isFullscreen ? 'max-h-screen max-w-[calc(100vh*16/9)] bg-background' : 'shadow-xl rounded-xl ring-1 ring-border/20'}`}>
                            {editableSlides &&
                                editableSlides[activeSlideIndex] && (
                                    <Slide
                                        slide_content={{
                                            ...editableSlides[activeSlideIndex],
                                            theme: pptData?.theme || "sunset",
                                        }}
                                        onUpdateSlide={handleUpdateSlide}
                                        onUpdateItem={handleUpdateItem}
                                        onDeleteItem={handleDeleteItem}
                                        onAddItem={handleAddItemAtIndex}
                                    />
                                )}
                        </div>

                        {isFullscreen && (
                            <>
                                {/* Left half click area */}
                                <div
                                    onClick={() => setActiveSlideIndex((prev) => Math.max(prev - 1, 0))}
                                    className="absolute left-0 top-0 w-1/2 h-full z-30"
                                    style={{
                                        cursor: activeSlideIndex === 0 ? "default" : CURSOR_LEFT
                                    }}
                                    title="Previous Slide"
                                />
                                {/* Right half click area */}
                                <div
                                    onClick={() => setActiveSlideIndex((prev) => Math.min(prev + 1, editableSlides.length - 1))}
                                    className="absolute right-0 top-0 w-1/2 h-full z-30"
                                    style={{
                                        cursor: activeSlideIndex === editableSlides.length - 1 ? "default" : CURSOR_RIGHT
                                    }}
                                    title="Next Slide"
                                />
                            </>
                        )}

                        {!isFullscreen && (
                            <button
                                onClick={() => setActiveSlideIndex((prev) => Math.min(prev + 1, editableSlides.length - 1))}
                                disabled={activeSlideIndex === editableSlides.length - 1}
                                className="absolute z-20 h-8 w-8 md:h-10 md:w-10 rounded-full bg-background/80 hover:bg-background border border-border text-foreground flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:!opacity-0 shadow-sm backdrop-blur-sm cursor-pointer -right-4 md:-right-12"
                                title="Next Slide (Right Arrow)"
                            >
                                <ChevronRight size={20} className="ml-0.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Previews */}
                <div className="mt-4 md:mt-6 w-full max-w-[1000px] shrink-0 overflow-x-auto flex gap-4 py-2 px-1 scrollbar-thin scrollbar-thumb-muted justify-start md:justify-center">
                    {editableSlides.map((slide, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveSlideIndex(idx)}
                            className={`relative flex w-[120px] aspect-video rounded-lg overflow-hidden border-2 text-left shrink-0 transition-all ${
                                activeSlideIndex === idx
                                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                                    : "border-border hover:border-muted-foreground/30 opacity-70 hover:opacity-100"
                            }`}
                        >
                            <div
                                ref={(el) => {
                                    slideRefs.current[idx] = el;
                                }}
                                className="w-full h-full pointer-events-none select-none"
                            >
                                <Slide
                                    slide_content={{
                                        ...slide,
                                        theme: pptData?.theme || "sunset",
                                    }}
                                />
                            </div>
                            <div className="absolute bottom-1 right-1.5 bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md">
                                {idx + 1}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Layout Selector Modal */}
            <Dialog open={isLayoutModalOpen} onOpenChange={setIsLayoutModalOpen}>
                <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] flex flex-col bg-popover border-border text-popover-foreground rounded-xl p-6 shadow-2xl z-50">
                    <DialogHeader className="shrink-0 mb-4">
                        <DialogTitle className="text-lg font-bold">Select Slide Layout</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Choose a layout type to display your current slide content.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Scrollable grid area */}
                    <div className="flex-1 overflow-y-auto pr-1">
                        {Object.entries(metadata.layoutCategories)
                            .filter(([catKey]) => {
                                const isTitleSlide = editableSlides[activeSlideIndex]?.layout?.category === "title";
                                return isTitleSlide ? catKey === "title" : catKey !== "title";
                            })
                            .map(([catKey, category]) => (
                            <div key={catKey} className="mb-6">
                                <h3 className="text-[11px] font-bold tracking-wider text-primary uppercase mb-3 border-b border-border/40 pb-1.5">
                                    {category.name}
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                                    {category.types.map((type) => {
                                        const activeSlide = editableSlides[activeSlideIndex];
                                        const isSelected = 
                                            activeSlide?.layout?.category === catKey &&
                                            activeSlide?.layout?.type === type.id;

                                        // Fallback items in case the active slide has no items (e.g. Title slides)
                                        const previewItems = activeSlide?.items?.length ? activeSlide.items : [
                                            { header: "Key Highlight 1", description: "This is a detailed description of the first key highlight item." },
                                            { header: "Key Highlight 2", description: "This is a detailed description of the second key highlight item." },
                                            { header: "Key Highlight 3", description: "This is a detailed description of the third key highlight item." }
                                        ];

                                        return (
                                            <button
                                                key={type.id}
                                                onClick={() => {
                                                    handleLayoutChange(catKey, type.id);
                                                    setIsLayoutModalOpen(false);
                                                }}
                                                className={`flex flex-col text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer gap-2 bg-card ${
                                                    isSelected
                                                        ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/20 opacity-100"
                                                        : "border-border hover:border-muted-foreground/20 opacity-75 hover:opacity-100"
                                                }`}
                                            >
                                                {/* Mini Slide Preview */}
                                                <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border theme-border shadow-xs bg-background/50 relative pointer-events-none">
                                                    <Slide
                                                        slide_content={{
                                                            ...activeSlide,
                                                            items: previewItems,
                                                            layout: { category: catKey, type: type.id },
                                                            theme: pptData?.theme || "sunset",
                                                        }}
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute top-1.5 right-1.5 z-10 bg-blue-500 text-white rounded-full w-4 h-4 shadow-sm flex items-center justify-center animate-in fade-in zoom-in-75 duration-200">
                                                            <Check size={10} strokeWidth={3} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-0.5 px-0.5 mt-0.5">
                                                    <span className="font-semibold text-foreground text-[11px] leading-tight">
                                                        {type.name}
                                                    </span>
                                                    <span className="text-[9px] text-muted-foreground leading-normal line-clamp-2">
                                                        {type.description}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
