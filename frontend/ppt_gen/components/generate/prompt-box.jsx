"use client";

import React from "react";
import {
    Send,
    Sparkles,
    AlignLeft,
    Type,
    FileStack,
    Loader2,
    ChevronDown,
    ArrowUp,
} from "lucide-react";
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
    layoutStyle,
    setLayoutStyle,
    tone,
    setTone,
    slides,
    setSlides,
    autoFocus,
    thinking = "standard",
    setThinking,
}) {
    let slidesArray = Array.from({ length: 10 }, (_, i) => i + 1);
    slidesArray = slidesArray.concat([15, 20]);
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
                    placeholder="Describe your presentation topic, outline, or key details..."
                    className="w-full min-h-[140px] max-h-[400px] border-none focus-visible:ring-0 resize-none p-5 md:p-6 bg-transparent text-lg leading-relaxed rounded-none"
                    disabled={isGenerating}
                    autoFocus={autoFocus}
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 md:px-5 md:py-3 bg-zinc-50/80 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800/80 backdrop-blur-md gap-3 sm:gap-2">
                    <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:items-center sm:gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-full justify-between sm:w-auto sm:justify-start gap-1.5 text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-300 px-2 sm:px-3"
                                >
                                    <span className="flex items-center gap-1.5 min-w-0 truncate">
                                        <AlignLeft
                                            size={13}
                                            className="text-blue-500 dark:text-blue-400 shrink-0"
                                        />
                                        <span className="truncate">
                                            {layoutStyle}
                                        </span>
                                    </span>
                                    <ChevronDown
                                        size={13}
                                        className="opacity-50 shrink-0"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {["Concise", "Balanced", "Detailed"].map(
                                    (t) => (
                                        <DropdownMenuItem
                                            key={t}
                                            onClick={() => setLayoutStyle(t)}
                                        >
                                            {t}
                                        </DropdownMenuItem>
                                    ),
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Tone Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-full justify-between sm:w-auto sm:justify-start gap-1.5 text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-300 px-2 sm:px-3"
                                >
                                    <span className="flex items-center gap-1.5 min-w-0 truncate">
                                        <Type
                                            size={13}
                                            className="text-violet-500 dark:text-violet-400 shrink-0"
                                        />
                                        <span className="truncate">{tone}</span>
                                    </span>
                                    <ChevronDown
                                        size={13}
                                        className="opacity-50 shrink-0"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {["Professional", "Casual", "Enthusiastic"].map(
                                    (t) => (
                                        <DropdownMenuItem
                                            key={t}
                                            onClick={() => setTone(t)}
                                        >
                                            {t}
                                        </DropdownMenuItem>
                                    ),
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-full justify-between sm:w-auto sm:justify-start gap-1.5 text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-300 px-2 sm:px-3"
                                >
                                    <span className="flex items-center gap-1.5 min-w-0 truncate">
                                        <FileStack
                                            size={13}
                                            className="text-indigo-500 dark:text-indigo-400 shrink-0"
                                        />
                                        <span className="truncate">
                                            {slides} Slides
                                        </span>
                                    </span>
                                    <ChevronDown
                                        size={13}
                                        className="opacity-50 shrink-0"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {slidesArray.map((s) => (
                                    <DropdownMenuItem
                                        key={s}
                                        onClick={() => setSlides(s)}
                                    >
                                        {s} Slides
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-full justify-between sm:w-auto sm:justify-start gap-1.5 text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-300 px-2 sm:px-3"
                                >
                                    <span className="flex items-center gap-1.5 min-w-0 truncate">
                                        <Sparkles
                                            size={13}
                                            className="text-amber-500 dark:text-amber-400 shrink-0"
                                        />
                                        <span className="truncate">
                                            {thinking === "extended" ? "Extended (Thinking)" : "Standard Model"}
                                        </span>
                                    </span>
                                    <ChevronDown
                                        size={13}
                                        className="opacity-50 shrink-0"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setThinking("standard")}>
                                    Standard Model
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setThinking("extended")}>
                                    Extended (Thinking)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <Button
                        type="submit"
                        disabled={!prompt.trim() || isGenerating}
                        size="default"
                        className="w-full sm:w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer sm:p-0"
                    >
                        {isGenerating ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                <ArrowUp size={18} className="shrink-0" />
                                <span className="sm:hidden text-xs font-semibold">
                                    Generate Presentation
                                </span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
