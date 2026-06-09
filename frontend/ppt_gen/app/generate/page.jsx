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

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setIsGenerating(true);

        // Generate a random 10-character ID for the presentation
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let pptId = "";
        for (let i = 0; i < 10; i++) {
            pptId += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Immediately redirect to the editor view page, passing parameters in query string for SSE stream
        window.location.href = `/generate/${pptId}/view?generating=true` +
            `&prompt=${encodeURIComponent(prompt)}` +
            `&tone=${encodeURIComponent(tone.toLowerCase())}` +
            `&slidesCount=${Number(slides)}` +
            `&layoutStyle=${encodeURIComponent(layoutStyle.toLowerCase())}`;
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
