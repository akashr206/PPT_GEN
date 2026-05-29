"use client";

import React from "react";
import { Menu, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function MobileHeader() {
  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-2 font-semibold">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white">
          <Sparkles size={14} />
        </div>
        <span>DeckAI</span>
      </div>
      <div className="flex items-center gap-2">
         <ThemeToggle />
         <Button variant="ghost" size="icon" className="text-zinc-500">
           <Menu size={20} />
         </Button>
      </div>
    </header>
  );
}
