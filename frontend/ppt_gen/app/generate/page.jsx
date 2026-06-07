"use client";

import React, { useState, useEffect, Suspense } from "react";
import { HeroSection } from "@/components/generate/hero-section";
import { PromptBox } from "@/components/generate/prompt-box";
import { MinimizedPromptBox } from "@/components/generate/minimized-prompt-box";
import { OutlineGenerationBox } from "@/components/generate/outline-generation-box";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useHistory } from "@/contexts/history-context";

export default function GeneratePage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center text-white">
                    <Loader2 className="animate-spin" size={30} />
                </div>
            }
        >
            <GeneratePageContent />
        </Suspense>
    );
}

function GeneratePageContent() {
    const { data: session, status } = useSession();
    const { refreshHistory } = useHistory();
    const [isGenerating, setIsGenerating] = useState(false);
    const [activePptId, setActivePptId] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [layoutStyle, setLayoutStyle] = useState("Balanced");
    const [tone, setTone] = useState("Professional");
    const [slides, setSlides] = useState(6);
    const [autoFocus, setAutoFocus] = useState(false);
    const searchParams = useSearchParams();
    const urlprompt = searchParams.get("prompt");

    useEffect(() => {
        if (urlprompt) {
            setPrompt(urlprompt);
            setAutoFocus(true);
        }
    }, [urlprompt]);

    useEffect(() => {
        if (!activePptId) return;

        const currentPptId = activePptId;
        let isMounted = true;
        let pollTries = 0;
        let timeoutId = null;

        const pollStatus = async () => {
            if (!isMounted) return;

            pollTries++;

            if (pollTries > 40) {
                if (isMounted) {
                    setIsGenerating(false);
                    setActivePptId(null);
                    toast.error("Generation timed out. Please try again.");
                }
                return;
            }

            try {
                const res = await api.get(`/api/ppt/status/${currentPptId}`);
                if (!isMounted) return;
                
                const statusData = res?.data?.[0] || res?.data;
                const status = statusData?.status;

                if (status === "SUCCESS") {
                    const targetUrl = `/generate/${currentPptId}/view`;
                    toast.success("Presentation generated successfully!");
                    try {
                        refreshHistory();
                    } catch (e) {
                        console.error("Error refreshing history", e);
                    }
                    window.location.href = targetUrl;
                    return;
                }

                if (status === "FAILED") {
                    setIsGenerating(false);
                    setActivePptId(null);
                    toast.error(
                        "Failed to generate presentation. Please try a different prompt.",
                    );
                    return;
                }

                if (isMounted) {
                    timeoutId = setTimeout(pollStatus, 2000);
                }
            } catch (err) {
                console.error("Error polling generation status:", err);

                if (isMounted) {
                    setIsGenerating(false);
                    setActivePptId(null);
                    toast.error("Network error while checking status.");
                }
            }
        };

        timeoutId = setTimeout(pollStatus, 2000);

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [activePptId]);

    if (status === "loading") {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#050505] text-white">
                <Loader2 className="animate-spin" size={30} />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setIsGenerating(true);

        try {
            const res = await api.post("/api/ppt/", {
                prompt: prompt,
                tone: tone.toLowerCase(),
                slidesCount: Number(slides),
                layoutStyle: layoutStyle.toLowerCase(),
            });

            const pptId = res?.data?.data?.ppt_id || res?.data?.ppt_id;

            if (pptId) {
                setActivePptId(pptId);
            } else {
                throw new Error("Failed to get presentation ID from server");
            }
        } catch (err) {
            console.error("Failed to generate presentation:", err);
            toast.error(
                err.message || "Failed to start presentation generation",
            );
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-7xl w-full mx-auto h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16">
            {!isGenerating ? (
                <>
                    <HeroSection user={session?.user?.name} />
                    <PromptBox
                        prompt={prompt}
                        setPrompt={setPrompt}
                        isGenerating={isGenerating}
                        handleGenerate={handleGenerate}
                        layoutStyle={layoutStyle}
                        setLayoutStyle={setLayoutStyle}
                        tone={tone}
                        setTone={setTone}
                        slides={slides}
                        setSlides={setSlides}
                        autoFocus={autoFocus}
                    />
                </>
            ) : (
                <>
                    <OutlineGenerationBox />
                    <MinimizedPromptBox
                        prompt={prompt}
                        setPrompt={setPrompt}
                        isGenerating={isGenerating}
                        handleGenerate={handleGenerate}
                    />
                </>
            )}
        </div>
    );
}
