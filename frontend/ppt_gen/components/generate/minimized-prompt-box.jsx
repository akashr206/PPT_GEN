"use client";

import React from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MinimizedPromptBox({
    prompt,
    setPrompt,
    isGenerating,
    handleGenerate,
}) {
    return (
        <div className="w-full mt-2 max-w-3xl mx-auto flex flex-col gap-3 relative z-10 group mt-auto mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>

            <form
                onSubmit={handleGenerate}
                className="relative bg-white dark:bg-zinc-900/80 rounded-lg shadow-xl dark:shadow-2xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-xl transition-all overflow-hidden flex items-center p-2 sm:p-3 gap-3"
            >
                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Refine your prompt..."
                    className="w-full min-h-[44px] max-h-[120px] border-none focus-visible:ring-0 resize-none px-4 py-3 bg-transparent rounded-md text-base leading-relaxed"
                    disabled={isGenerating}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleGenerate(e);
                        }
                    }}
                />

                <Button
                    type="submit"
                    disabled={!prompt.trim() || isGenerating}
                    size="icon"
                    className="w-10 h-10 rounded-md shrink-0 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all self-end mb-0.5 mr-0.5"
                >
                    {isGenerating ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <ArrowUp size={18} className="ml-0.5" />
                    )}
                </Button>
            </form>
        </div>
    );
}
