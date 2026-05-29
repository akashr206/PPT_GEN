"use client";
 
import React from "react";
import { LayoutDashboard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
 
export function PPTGenerationBox() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-8 z-10 animate-in fade-in zoom-in duration-500 relative select-none">
      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />
 
      <div className="w-full aspect-video relative bg-card/40 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] border border-border/50 overflow-hidden flex flex-col items-center justify-center p-8">
        
        <div className="sweep-glow" />
        <div className="w-full max-w-lg space-y-6 flex flex-col items-center z-10 relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <LayoutDashboard className="text-primary animate-pulse" size={32} />
          </div>
          
          <div className="space-y-3 w-full flex flex-col items-center">
            <Skeleton className="h-8 w-3/4 bg-muted/40 rounded-lg animate-pulse" />
            <Skeleton className="h-4 w-full bg-muted/20 rounded-md animate-pulse" />
            <Skeleton className="h-4 w-5/6 bg-muted/15 rounded-md animate-pulse" />
          </div>
        </div>
 
      </div>
    </div>
  );
}
