"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { HeroSection } from "@/components/hero-section";
import { PromptBox } from "@/components/prompt-box";
import { MinimizedPromptBox } from "@/components/minimized-prompt-box";
import { PPTGenerationBox } from "@/components/ppt-generation-box";

export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [theme, setTheme] = useState("Modern");
  const [tone, setTone] = useState("Professional");
  const [slides, setSlides] = useState("10");

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-50 font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col relative h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-15 dark:opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        ></div>

        <div className="absolute top-1/4 -left-[10%] w-[50%] h-[50%] bg-gradient-to-r from-violet-600/30 to-blue-600/30 blur-[130px] rounded-full pointer-events-none z-0 mix-blend-screen transform -rotate-12 dark:opacity-70 opacity-40"></div>
        <div className="absolute bottom-1/4 -right-[10%] w-[50%] h-[50%] bg-gradient-to-l from-violet-600/25 to-blue-600/25 blur-[140px] rounded-full pointer-events-none z-0 mix-blend-screen transform rotate-12 dark:opacity-70 opacity-40"></div>

        <MobileHeader />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16">
            {!isGenerating ? (
              <>
                <HeroSection />
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
                />
              </>
            ) : (
              <>
                <PPTGenerationBox />
                <MinimizedPromptBox 
                  prompt={prompt}
                  setPrompt={setPrompt}
                  isGenerating={isGenerating}
                  handleGenerate={handleGenerate}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
