"use client";
 
import { List } from "lucide-react";
import { Diamond } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
 
export function     OutlineGenerationBox() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-full gap-6 z-10 animate-in fade-in zoom-in duration-500 relative select-none">
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
 
      <div className="w-full max-w-[800px] aspect-[16/9] relative bg-card/40 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] border border-border/50 overflow-hidden p-8 flex flex-col justify-between">
        
        <div className="sweep-glow" />
        
        <div className="w-full space-y-2 z-10 relative">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-8 w-3/5 rounded-lg mt-2" />
          <Skeleton className="h-4 w-2/5 rounded-md mt-1" />
        </div>
 
        <div className="grid grid-cols-3 gap-6 my-6 z-10 relative">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border/30 bg-card/20 space-y-3">
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-5/6 rounded" />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center border-t border-border/20 pt-4 z-10 relative">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
 
      </div>
      
      <p className="text-muted-foreground flex gap-2 items-center font-medium tracking-wide text-sm">
        Our AI is generating your presentation slides <Diamond size={16} className="animate-spin-pause text-primary" />
      </p>
 
    </div>
  );
}
 