"use client";

import React, { useState, useEffect, Suspense } from "react";
import { HeroSection } from "@/components/generate/hero-section";
import { PromptBox } from "@/components/generate/prompt-box";
import { MinimizedPromptBox } from "@/components/generate/minimized-prompt-box";
import { OutlineGenerationBox } from "@/components/generate/outline-generation-box";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useHistory } from "@/contexts/history-context";

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin" size={30} /></div>}>
      <GeneratePageContent />
    </Suspense>
  );
}

function GeneratePageContent() {
  const { data: session, status } = useSession();
  const { refreshHistory } = useHistory();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [theme, setTheme] = useState("Modern");
  const [tone, setTone] = useState("Professional");
  const [slides, setSlides] = useState(6);
  const [autoFocus, setAutoFocus] = useState(false);
  const searchParams = useSearchParams();
  const urlprompt = searchParams.get("prompt");

  useEffect(() => {
    if (urlprompt) {
      setPrompt(urlprompt);
      setAutoFocus(true)
      
    }
    api.get("/api/ppt/history")
  }, [urlprompt]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
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
      const response = await api.post("/api/ppt/generate", {
        prompt,
        tone: tone.toLowerCase(),
        slides: parseInt(slides) || 10,
        theme: theme.toLowerCase(),
      });
      
      const data = response.data;
      if (data && data.ppt_id) {
        refreshHistory(true);
        router.push(`/generate/${data.ppt_id}`);
      } else {
        throw new Error("No ppt ID returned");
      }
    } catch (error) {
      console.error("Failed to generate outline:", error);
      setIsGenerating(false);
      toast.error("Failed to generate presentation. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16">
      {!isGenerating ? (
        <>
          <HeroSection user={session?.user?.name} />
          <PromptBox
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
            theme={theme}
            setTheme={setTheme}
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
