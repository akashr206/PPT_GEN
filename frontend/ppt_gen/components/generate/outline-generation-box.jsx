"use client";
 
import { List } from "lucide-react";
import { Diamond } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
 
export function OutlineGenerationBox() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-full gap-8 z-10 animate-in fade-in zoom-in duration-500 relative select-none">
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
        @keyframes spin-pause {
          0% {
            transform: rotate(0deg);
          }
          83.33% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-pause {
          animation: spin-pause 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}} />
 
      <div className="w-full max-w-xl relative bg-card/40 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] border border-border/50 overflow-hidden p-8">
        
        <div className="sweep-glow" />
        <div className="w-full space-y-6 z-10 relative mb-10">
          <Skeleton className="h-12 w-1/2 bg-muted/40 rounded-lg animate-pulse" />
        </div>
 
        <div className="w-full space-y-4 z-10 relative">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-2.5 h-2.5 rounded-full bg-primary/20 shrink-0" />
              <Skeleton 
                className="h-3.5 w-full bg-muted/20 rounded-md animate-pulse" 
                style={{ 
                  maxWidth: `${85 - (i % 3) * 15}%` 
                }}
              />
            </div>
          ))}
        </div>
 
      </div>
      
      <p className="text-muted-foreground flex gap-2 items-center font-medium tracking-wide text-sm">
        Our AI is drafting your presentation outline <Diamond size={16} className="animate-spin-pause text-primary" />
      </p>
 
    </div>
  );
}
 