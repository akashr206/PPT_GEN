"use client";

import React from "react";
import { Sparkles, LayoutDashboard } from "lucide-react";

export function PPTGenerationBox() {
    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-full gap-8 z-10 animate-in fade-in zoom-in duration-500">
            {/* 16:9 Aspect Ratio Container */}
            <div className="w-full aspect-video relative bg-white dark:bg-zinc-900/80 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-800/80 overflow-hidden flex flex-col items-center justify-center p-8 backdrop-blur-xl">
                {/* Animated Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-violet-500/10 animate-pulse"></div>

                {/* Placeholder Content simulating slide creation */}
                <div className="w-full max-w-lg space-y-6 flex flex-col items-center z-10">
                    <div className="w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center animate-pulse">
                        <LayoutDashboard
                            className="text-blue-600 dark:text-blue-400"
                            size={32}
                        />
                    </div>

                    <div className="space-y-3 w-full">
                        <div className="h-8 bg-zinc-100 dark:bg-zinc-800/60 rounded-md w-3/4 mx-auto animate-pulse"></div>
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-800/60 rounded-md w-full animate-pulse delay-75"></div>
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-800/60 rounded-md w-5/6 mx-auto animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
