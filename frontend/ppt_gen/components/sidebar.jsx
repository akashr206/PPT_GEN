"use client";

import React, { useState } from "react";
import { Menu, Plus, MessageSquare, Sparkles, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <aside 
      className={`${
        isCollapsed ? "w-[72px]" : "w-64"
      } border-r border-zinc-200 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/30 hidden md:flex flex-col backdrop-blur-xl transition-all duration-300 ease-in-out`}
    >
      <div className={`p-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 font-semibold text-lg transition-all duration-300 whitespace-nowrap overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
              <Sparkles size={16} />
            </div>
            <span className="tracking-tight">DeckAI</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
        >
          <Menu size={18} />
        </Button>
      </div>
      
      <div className="px-4 py-2 flex justify-center">
        {isCollapsed ? (
          <Button 
            size="icon" 
            className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white shadow-sm transition-all"
            title="New Presentation"
          >
            <Plus size=
            {18} />
          </Button>
        ) : (
          <Button className="w-full justify-start gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white shadow-sm transition-all font-medium text-sm">
            <Plus size={16} />
            New Presentation
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-2 py-4 mt-2">
        {!isCollapsed && (
          <div className="px-3 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 transition-all duration-300 whitespace-nowrap overflow-hidden">
            Recent
          </div>
        )}
        <nav className="space-y-1">
          {["Q3 Marketing Strategy", "Startup Pitch Deck v2", "Weekly All-Hands", "Project Proposal"].map((item, i) => (
            !isCollapsed ? (
              <Button 
                key={i} 
                variant="ghost" 
                className="w-full justify-start gap-3 px-3 font-normal text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group"
              >
                <MessageSquare size={16} className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors flex-shrink-0" />
                <span className="truncate">{item}</span>
              </Button>
            ) : ""
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/60 flex flex-col gap-4 items-center bg-white/30 dark:bg-zinc-950/30 transition-all duration-300">
        {isCollapsed ? (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 p-0 flex items-center justify-center"
              title="My Account"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 flex-shrink-0">
                <User size={16} />
              </div>
            </Button>
          </>
        ) : (
          <div className="flex items-center justify-between gap-2 w-full transition-all duration-300">
            <Button variant="ghost" className="flex-1 justify-start gap-3 h-auto py-2 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 flex-shrink-0">
                <User size={16} />
              </div>
              <div className="text-sm font-medium truncate flex-1 text-left">My Account</div>
            </Button>
            <ThemeToggle />
          </div>
        )}
      </div>
    </aside>
  );
}
