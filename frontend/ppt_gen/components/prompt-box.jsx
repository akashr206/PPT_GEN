"use client";

import React, { useState, useEffect } from "react";
import { Send, Sparkles, LayoutTemplate, Type, FileStack, Loader2, ChevronDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PromptBox({ 
  prompt, 
  setPrompt, 
  isGenerating, 
  handleGenerate, 
  theme, 
  setTheme, 
  tone, 
  setTone, 
  slides, 
  setSlides 
}) {
  const [placeholder, setPlaceholder] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setPlaceholder("");
      return;
    }

    const placeholders = [
      "A 10-slide pitch deck for a sustainable coffee brand...",
      "A comprehensive presentation for a Quarterly Business Review...",
      "An investor pitch deck for a modern SaaS startup...",
      "An engaging slides deck for Employee Onboarding...",
      "A clean, minimal presentation on AI and the future of work..."
    ];

    let currentIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeoutId;

    const type = () => {
      const currentString = placeholders[currentIdx];
      
      if (isDeleting) {
        setPlaceholder("e.g. " + currentString.substring(0, charIdx - 1));
        charIdx--;
      } else {
        setPlaceholder("e.g. " + currentString.substring(0, charIdx + 1));
        charIdx++;
      }

      let speed = isDeleting ? 25 : 50;

      if (!isDeleting && charIdx === currentString.length) {
        speed = 2500; 
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        currentIdx = (currentIdx + 1) % placeholders.length;
        speed = 400; 
      }

      timeoutId = setTimeout(type, speed);
    };

    type();

    return () => clearTimeout(timeoutId);
  }, [isFocused]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-3 relative z-10 group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>

      <form 
        onSubmit={handleGenerate}
        className="relative bg-white dark:bg-zinc-900/80 rounded-2xl shadow-xl dark:shadow-2xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-xl transition-all overflow-hidden flex flex-col"
      >
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full min-h-[140px] max-h-[400px] border-none focus-visible:ring-0 resize-none p-5 md:p-6 bg-transparent text-lg leading-relaxed rounded-none"
          disabled={isGenerating}
        />
        
        {/* Bottom toolbar */}
        <div className="flex flex-wrap items-center justify-between p-3 md:px-5 md:py-3 bg-zinc-50/80 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800/80 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Theme Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                  <LayoutTemplate size={14} className="text-blue-500 dark:text-blue-400" />
                  {theme}
                  <ChevronDown size={14} className="opacity-50 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["Modern", "Professional", "Creative"].map((t) => (
                  <DropdownMenuItem key={t} onClick={() => setTheme(t)}>{t}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tone Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                  <Type size={14} className="text-violet-500 dark:text-violet-400" />
                  {tone}
                  <ChevronDown size={14} className="opacity-50 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["Professional", "Casual", "Enthusiastic"].map((t) => (
                  <DropdownMenuItem key={t} onClick={() => setTone(t)}>{t}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Slides Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                  <FileStack size={14} className="text-indigo-500 dark:text-indigo-400" />
                  {slides} Slides
                  <ChevronDown size={14} className="opacity-50 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["5", "10", "15", "20"].map((s) => (
                  <DropdownMenuItem key={s} onClick={() => setSlides(s)}>{s} Slides</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
          
          <Button 
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            size="icon"
            className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all mt-3 sm:mt-0"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <ArrowUp size={18} className="ml-0.5" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
