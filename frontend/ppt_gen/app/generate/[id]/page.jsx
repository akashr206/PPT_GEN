"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PPTGenerationBox } from "@/components/generate/ppt-generation-box";
import { OutlineReview } from "@/components/generate/detail/outline-review";
import { InteractionPanel } from "@/components/generate/detail/interaction-panel";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion } from "framer-motion";

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

export default function PPTDetailPage({ params }) {
    const unwrappedParams = use(params);
    const pptId = unwrappedParams?.id;
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();

    const [appState, setAppState] = useState("loading_outline");
    const [pptData, setPptData] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState(null);
    const [messages, setMessages] = useState(null);

    const [editPrompt, setEditPrompt] = useState("");
    const [editableSlides, setEditableSlides] = useState([]);
    const [isSavingOutline, setIsSavingOutline] = useState(false);
    const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);

    useEffect(() => {
        if (pptData?.slides) {
            setEditableSlides(JSON.parse(JSON.stringify(pptData.slides)));
        }
    }, [pptData]);

    const hasUnsavedChanges =
        JSON.stringify(pptData?.slides || []) !==
        JSON.stringify(editableSlides);

    useEffect(() => {
        if (authStatus === "loading") return;
        if (authStatus === "unauthenticated") {
            router.push("/");
            return;
        }

        if (!pptId) return;

        // Simulate fetch PPT with mock data
        const loadPPT = () => {
            const mockData =
                MOCK_PRESENTATIONS[pptId] ||
                MOCK_PRESENTATIONS["quarterly-review"];
            setPptData(JSON.parse(JSON.stringify(mockData)));
            setStatus("DRAFT");
            setAppState("outline_review");
            setMessages([
                {
                    role: "assistant",
                    message:
                        "Here is the drafted outline for your presentation. Review it, and if you want to make any changes, just let me know below!",
                },
            ]);
        };

        const timer = setTimeout(loadPPT, 1000);
        return () => clearTimeout(timer);
    }, [pptId, authStatus, router]);

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editPrompt.trim()) return;

        const userMessage = editPrompt;
        setMessages((prev) => [
            ...prev,
            { role: "user", message: userMessage },
        ]);

        setIsUpdating(true);
        setEditPrompt("");

        // Simulate AI editing response with a timeout
        setTimeout(() => {
            setIsUpdating(false);

            const lowerMessage = userMessage.toLowerCase();
            let updatedSlides = [...editableSlides];
            let assistantResponse =
                "I've processed your request to edit the presentation.";

            if (lowerMessage.includes("theme")) {
                const themes = [
                    "sunset",
                    "ocean",
                    "dark",
                    "corporate",
                    "creative",
                    "elegant",
                    "playful",
                    "nature",
                    "cyberpunk",
                    "minimalist",
                    "lavender",
                    "default",
                ];
                const foundTheme = themes.find((t) => lowerMessage.includes(t));
                if (foundTheme) {
                    setPptData((prev) => ({ ...prev, theme: foundTheme }));
                    assistantResponse = `Theme changed to ${foundTheme}!`;
                    toast.success(`Theme updated to ${foundTheme}`);
                }
            } else if (
                lowerMessage.includes("add slide") ||
                lowerMessage.includes("insert slide")
            ) {
                const newSlide = {
                    title: "New Slide (AI Mock)",
                    subtitle: "Content added by simulated chat",
                    type: "BULLET_POINTS",
                    layout: 1,
                    items: [
                        {
                            header: "AI Draft",
                            description:
                                "Created via simulated chat message prompt.",
                        },
                    ],
                };
                updatedSlides.push(newSlide);
                setEditableSlides(updatedSlides);
                setPptData((prev) => ({ ...prev, slides: updatedSlides }));
                assistantResponse =
                    "I have appended a new slide to the presentation outline.";
                toast.success("New slide added (simulation)");
            } else {
                // generic mock text edit for slide 1 title
                if (updatedSlides[0]) {
                    updatedSlides[0].title =
                        "Updated: " + updatedSlides[0].title;
                    setEditableSlides(updatedSlides);
                    setPptData((prev) => ({ ...prev, slides: updatedSlides }));
                    assistantResponse =
                        "I've edited the title of the first slide to reflect your changes.";
                    toast.success("Presentation updated (simulation)");
                }
            }

            setMessages((prev) => [
                ...prev,
                { role: "assistant", message: assistantResponse },
            ]);
        }, 1200);
    };

    const handleSaveOutline = (onSuccessCallback) => {
        setIsSavingOutline(true);

        // Simulate API saving outline
        setTimeout(() => {
            setPptData((prev) => ({
                ...prev,
                slides: editableSlides,
                status: "DRAFT",
            }));
            setStatus("DRAFT");
            toast.success("Outline saved successfully (simulation).");
            setIsSavingOutline(false);
            if (onSuccessCallback && typeof onSuccessCallback === "function") {
                onSuccessCallback();
            }
        }, 800);
    };

    const handleBuildPPT = (force = false) => {
        if (hasUnsavedChanges && force !== true) {
            setShowUnsavedAlert(true);
            return;
        }

        setAppState("building_ppt");
        setStatus("BUILDING_PPT");

        // Simulate compile to slide rendering and redirect
        setTimeout(() => {
            setStatus("COMPLETED");
            toast.success("Presentation built successfully!");
            router.push(`/generate/${pptId}/view`);
        }, 1500);
    };

    const handleSaveAndBuild = () => {
        setShowUnsavedAlert(false);
        handleSaveOutline(() => {
            setAppState("building_ppt");
            setStatus("BUILDING_PPT");

            setTimeout(() => {
                setStatus("COMPLETED");
                toast.success("Presentation built successfully!");
                router.push(`/generate/${pptId}/view`);
            }, 1500);
        });
    };

    // Synchronize information with the header/navbar
    useEffect(() => {
        if (pptData) {
            const event = new CustomEvent("ppt-info-changed", {
                detail: {
                    title: pptData.title || "Untitled Presentation",
                    appState: "outline_review",
                    theme: pptData.theme || "sunset",
                },
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
                        appState: "outline_review",
                        theme: pptData.theme || "sunset",
                    },
                });
                window.dispatchEvent(event);
            }
        };

        window.addEventListener("request-ppt-info", handleRequest);
        return () => {
            window.removeEventListener("request-ppt-info", handleRequest);
        };
    }, [pptData]);

    if (appState === "not_found") {
        return (
            <div className="w-full h-full min-h-[70vh] flex items-center justify-center text-foreground px-4 select-none">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="max-w-sm w-full bg-card border border-border rounded-xl p-8 text-center flex flex-col items-center shadow-sm"
                >
                    <div className="mb-6 w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <FileQuestion size={24} />
                    </div>

                    <h2 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                        Presentation Not Found
                    </h2>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        The presentation you are looking for doesn't exist or
                        may have been deleted.
                    </p>

                    <div className="w-full flex flex-col gap-2.5">
                        <Button
                            onClick={() => router.push("/generate")}
                            className="w-full py-5 text-sm font-medium cursor-pointer"
                        >
                            Generate New Presentation
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.push("/generate")}
                            className="w-full py-5 text-sm font-medium cursor-pointer"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (appState === "building_ppt") {
        return (
            <div className="max-w-4xl mx-auto h-full flex flex-col justify-center px-4">
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-semibold text-foreground mb-2">
                        Building your Presentation
                    </h2>
                    <p className="text-muted-foreground">
                        Our AI is designing your slides. This may take a
                        moment...
                    </p>
                </div>
                <PPTGenerationBox />
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden select-none relative">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
        @keyframes sweep {
          0% {
            transform: translate(-150%, -150%) rotate(45deg);
          }
          100% {
            transform: translate(150%, 150%) rotate(45deg);
          }
        }
        .sweep-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(139, 92, 246, 0.005) 30%,
            rgba(139, 92, 246, 0.08) 50%,
            rgba(139, 92, 246, 0.005) 70%,
            transparent 100%
          );
          animation: sweep 3.5s infinite ease-in-out;
          pointer-events: none;
        }
      `,
                }}
            />

            {appState === "loading_outline" ||
            authStatus === "loading" ||
            !pptData ? (
                <div className="w-full flex-1 flex flex-col p-4 md:p-8 pb-[280px] md:pb-8 border-b md:border-b-0 md:border-r border-border min-h-0 shrink-0 md:shrink relative overflow-hidden">
                    <div className="sweep-glow" />

                    <div className="flex-1 overflow-hidden relative">
                        <div className="absolute inset-0 overflow-hidden flex flex-col">
                            <div className="flex-1 overflow-y-auto space-y-1 animate-pulse select-none pb-16 relative hide-scrollbar p-1">
                                {[1, 2, 3, 4, 5].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-none first-of-type:rounded-t-xl last-of-type:rounded-b-xl border border-border bg-card/25 p-5"
                                    >
                                        <div className="flex flex-row items-start gap-4 mb-3">
                                            <Skeleton className="w-8 h-8 rounded-lg bg-muted shrink-0 mt-1" />
                                            <div className="flex-1 space-y-3">
                                                <Skeleton className="h-6 w-1/3" />
                                                <Skeleton className="h-4 w-1/4 " />
                                            </div>
                                        </div>
                                        <div className="space-y-3 pl-[3rem]">
                                            <Skeleton className="h-3.5 w-5/6" />
                                            <Skeleton className="h-3.5 w-4/5 " />
                                            <Skeleton className="h-3.5 w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-primary/95 text-primary-foreground px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md z-10 shadow-lg text-sm font-medium tracking-wide">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Generating outline...</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full flex-1 flex flex-col border-b md:border-b-0 md:border-r border-border relative min-h-0 shrink-0 md:shrink p-4 md:p-8 overflow-y-auto pb-[280px] md:pb-8">
                    <OutlineReview
                        isUpdating={isUpdating}
                        pptData={pptData}
                        slides={editableSlides}
                        setSlides={setEditableSlides}
                        onSave={handleSaveOutline}
                        isSaving={isSavingOutline}
                        hasChanges={hasUnsavedChanges}
                    />
                </div>
            )}

            <InteractionPanel
                appState={appState}
                status={status}
                isUpdating={isUpdating}
                editPrompt={editPrompt}
                setEditPrompt={setEditPrompt}
                handleEditSubmit={handleEditSubmit}
                handleBuildPPT={handleBuildPPT}
                messages={messages}
            />

            <AlertDialog
                open={showUnsavedAlert}
                onOpenChange={setShowUnsavedAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes in your presentation
                            outline. Would you like to save them before building
                            the presentation?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSaveAndBuild}
                            className="cursor-pointer"
                        >
                            Save & Build
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
