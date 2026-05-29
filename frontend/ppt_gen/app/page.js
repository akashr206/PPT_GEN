"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowUp, Monitor, Smartphone, Palette, Mic, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setPlaceholder("What presentation shall we design? e.g. A 10-slide pitch deck for a sustainable coffee brand...");
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
        setPlaceholder("What presentation shall we design? e.g. " + currentString.substring(0, charIdx - 1));
        charIdx--;
      } else {
        setPlaceholder("What presentation shall we design? e.g. " + currentString.substring(0, charIdx + 1));
        charIdx++;
      }

      let speed = isDeleting ? 25 : 50;

      if (!isDeleting && charIdx === currentString.length) {
        speed = 2500; // Pause at full string
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        currentIdx = (currentIdx + 1) % placeholders.length;
        speed = 400; // Pause before starting next string
      }

      timeoutId = setTimeout(type, speed);
    };

    type();

    return () => clearTimeout(timeoutId);
  }, [isFocused]);

  const handleSearch = (e) => {
    e.preventDefault();
    if(prompt.trim()) {
      window.location.href = `/generate?prompt=${encodeURIComponent(prompt)}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-50 font-sans selection:bg-blue-500/30 relative overflow-hidden flex flex-col">
      
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      ></div>

      <div className="absolute top-1/3 -left-[20%] w-[50%] h-[60%] bg-gradient-to-r from-violet-600/40 to-blue-600/40 blur-[140px] rounded-full pointer-events-none z-0 mix-blend-screen transform -rotate-12"></div>
      <div className="absolute top-1/2 -right-[20%] w-[60%] h-[70%] bg-gradient-to-l from-violet-600/30 to-blue-600/30 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen transform rotate-12"></div>

      <nav className="relative z-10 flex items-center justify-between p-6 max-w-[1400px] w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="font-semibold text-xl tracking-tight flex items-center gap-2">
            DeckAI
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/generate">
            <Button variant="outline" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white px-6">
              Dashboard
            </Button>
          </Link>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium">
            A
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 -mt-20 w-full max-w-5xl mx-auto">
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-medium tracking-tight mb-6 text-white leading-[1.1] max-w-4xl mx-auto">
          Presentations at the speed of AI
        </h1>
        
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-normal mb-12">
          Transform ideas into beautiful pitch decks and presentations
        </p>

        <div className="w-full max-w-4xl mx-auto">
          <form 
            onSubmit={handleSearch}
            className="relative bg-[#1a1a24]/60 backdrop-blur-2xl rounded-[32px] border border-white/10 overflow-hidden flex flex-col shadow-2xl transition-all focus-within:bg-[#1a1a24]/80 focus-within:border-white/20"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full min-h-[160px] p-6 md:p-8 bg-transparent resize-none outline-none text-white placeholder:text-white/40 text-lg md:text-xl leading-relaxed rounded-none"
            
            />
            
            <div className="flex flex-wrap items-center justify-between px-6 pb-6 pt-2">
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" className="w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10">
                  <Plus size={18} />
                </Button>
                
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  type="submit"
                  disabled={!prompt.trim()}
                  className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all ml-1 border border-white/10 p-0 flex items-center justify-center"
                >
                  <ArrowUp size={16} />
                </Button>
              </div>
            </div>
          </form>
        </div>
        
      </main>
    </div>
  );
}
