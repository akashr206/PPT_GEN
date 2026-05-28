"use client";
import React from "react";
import { Sparkles, Send, Play, Loader2, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function InteractionPanel({ appState, status, isUpdating, editPrompt, setEditPrompt, handleEditSubmit, handleBuildPPT, messages = [] }) {
  const isEditingOrBuilding = isUpdating || status === "EDITING" || status === "BUILDING_PPT" || appState === "building_ppt";

  if (status === null || status === undefined || messages == null) {
    return (
      <div className="fixed bottom-0 left-0 w-full h-[260px] md:h-full md:relative md:bottom-auto md:left-auto md:w-[350px] lg:md:w-[400px] flex flex-col p-4 md:p-6 bg-background dark:bg-zinc-950 md:bg-background/50 border-t md:border-t-0 md:border-l border-border shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-none z-40 relative overflow-hidden select-none">
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
        <div className="sweep-glow" />
        
        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between relative z-10">
          <Skeleton className="h-6 w-28 bg-muted/40 rounded-md" />
          <Skeleton className="h-5 w-16 bg-muted/25 rounded-full" />
        </div>
        
        <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto relative z-10">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 bg-muted/30 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3.5 w-24 bg-muted/20 rounded-md" />
                <Skeleton className="h-14 w-full bg-muted/15 rounded-xl" />
              </div>
            </div>
          </div>
          
          <div className="space-y-3 pt-4 border-t border-border/40">
            <Skeleton className="h-20 w-full bg-muted/20 rounded-xl" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-9 w-24 bg-muted/30 rounded-lg" />
              <Skeleton className="h-9 w-28 bg-muted/40 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full h-[260px] md:h-full md:relative md:bottom-auto md:left-auto md:w-[350px] lg:md:w-[400px] flex flex-col p-4 md:p-6 bg-background dark:bg-zinc-950 md:bg-background/50 border-t md:border-t-0 md:border-l border-border shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-none z-40">
      
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 pb-4 flex flex-col">
        <div className="hidden md:flex flex-col gap-3.5 mt-2 mb-4">
          {messages.length === 0 ? (
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Sparkles size={14} />
                </AvatarFallback>
              </Avatar>
              <Card className="rounded-2xl rounded-tl-sm shadow-sm border-border bg-card">
                <CardContent className="p-3 text-sm text-card-foreground">
                  Here is the drafted outline for your presentation. Review it, and if you want to make any changes, just let me know below!
                </CardContent>
              </Card>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className={msg.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}>
                    {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                  </AvatarFallback>
                </Avatar>
                <Card className={`rounded-2xl shadow-sm border-border ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card text-card-foreground rounded-tl-sm'}`}>
                  <CardContent className="p-3 text-sm whitespace-pre-wrap">
                    {msg.message}
                  </CardContent>
                </Card>
              </div>
            ))
          )}

          {(status === "EDITING" || isUpdating) && (
            <div className="flex items-start gap-3 animate-pulse">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Sparkles size={14} className="animate-spin duration-1000" />
                </AvatarFallback>
              </Avatar>
              <Card className="rounded-2xl rounded-tl-sm shadow-sm border-border bg-card">
                <CardContent className="p-3 text-sm text-card-foreground flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
                  <span>Editing presentation outline...</span>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mt-auto md:hidden">
          {status === "EDITING" || isUpdating ? (
            <span className="flex items-center gap-1.5 text-primary font-medium">
              <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
              Editing presentation outline...
            </span>
          ) : (
            "Review the outline and enter edits, or build presentation below:"
          )}
        </p>
      </div>

      <div className="shrink-0 flex flex-col pt-2">
        <form onSubmit={handleEditSubmit} className="relative group">
          <Textarea
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="E.g. Add a slide about market competition..."
            className="w-full bg-input border border-border focus-visible:ring-1 focus-visible:ring-primary rounded-2xl p-4 pr-12 resize-none h-[75px] md:h-[120px] text-sm text-foreground transition-all shadow-inner"
            disabled={isEditingOrBuilding}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!editPrompt.trim() || isEditingOrBuilding}
            className="absolute bottom-3 right-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg disabled:opacity-50"
          >
            <ArrowUp size={16} />
          </Button>
        </form>

        {(appState === "outline_review") && (
          <div className="mt-3 pt-3 md:mt-5 md:pt-5 border-t border-border">
            <p className="text-[11px] md:text-xs text-muted-foreground mb-1.5 md:mb-3 text-center">Satisfied with the outline?</p>
            <Button 
              onClick={handleBuildPPT}
              disabled={isEditingOrBuilding}
              className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/90 py-4.5 md:py-6 font-medium text-sm md:text-base shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all"
            >
              <Play size={16} className="mr-2 md:w-[18px] md:h-[18px]" />
              Build Presentation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
