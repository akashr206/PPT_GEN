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
    Info,
    Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function PromptBox({
    prompt,
    setPrompt,
    isGenerating,
    handleGenerate,
    layoutStyle,
    setLayoutStyle,
    slides,
    setSlides,
    autoFocus,
    thinking = "standard",
    setThinking,
}) {
    let slidesArray = Array.from({ length: 10 }, (_, i) => i + 1);
    slidesArray = slidesArray.concat([15]);
    const totalCredits = 20 + (slides === 15 ? 5 : 0) + (thinking === "extended" ? 5 : 0);

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-3 relative z-10 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>

            <form
                onSubmit={handleGenerate}
                className="relative bg-white dark:bg-zinc-900/80 rounded-lg shadow-xl dark:shadow-2xl border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-xl transition-all overflow-hidden flex flex-col"
            >
                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your presentation topic, outline, or key details."
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
                                    className="h-8 w-full justify-between sm:w-auto sm:justify-start gap-1.5 text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-300 px-2 sm:px-3 cursor-pointer"
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
                                            className="cursor-pointer"
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
                                    className="h-8 w-full justify-between sm:w-auto sm:justify-start gap-1.5 text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-300 px-2 sm:px-3 cursor-pointer"
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
                                        className="flex items-center justify-between gap-3 cursor-pointer"
                                    >
                                        <span>{s} Slides</span>
                                        {s === 15 && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
                                                            <Info size={12} />
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right">
                                                        <p>15 slides option costs +5 extra credits</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-full justify-between sm:w-auto sm:justify-start gap-1.5 text-[11px] sm:text-xs text-muted-foreground hover:text-foreground px-2 sm:px-3 cursor-pointer"
                                >
                                    <span className="flex items-center gap-1.5 min-w-0 truncate">
                                        <Sparkles
                                            size={13}
                                            className="text-primary shrink-0"
                                        />
                                        <span className="truncate">
                                            {thinking === "extended"
                                                ? "Extended (Thinking)"
                                                : "Standard Model"}
                                        </span>
                                    </span>
                                    <ChevronDown
                                        size={13}
                                        className="opacity-50 shrink-0"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    onClick={() => setThinking("standard")}
                                    className="cursor-pointer"
                                >
                                    Standard Model
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setThinking("extended")}
                                    className="flex items-center justify-between gap-3 cursor-pointer"
                                >
                                    <span>Extended (Thinking)</span>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
                                                    <Info size={12} />
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <p>Extended thinking costs +5 extra credits</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 hover:bg-muted border border-border px-2.5 py-1.5 rounded-md cursor-help transition-all">
                                        
                                        <span className="font-semibold text-[11px] sm:text-xs text-foreground">
                                            {totalCredits} Credits
                                        </span>
                                        <Info size={11} className="opacity-70 shrink-0 ml-0.5" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="space-y-1 p-2.5 flex-col flex text-xs z-50">
                                    <p className="font-semibold text-xs border-b border-border pb-1 text-foreground">Credit Cost Breakdown</p>
                                    <div className="text-[11px] space-y-1 text-muted-foreground pt-0.5">
                                        <p className="flex justify-between gap-4"><span>Base PPT Creation:</span> <span className="font-medium text-foreground">20 credits</span></p>
                                        {slides === 15 ? (
                                            <p className="flex justify-between gap-4 text-primary font-medium"><span>15 Slides Option:</span> <span>+5 credits</span></p>
                                        ) : (
                                            <p className="flex justify-between gap-4 text-muted-foreground/60"><span>15 Slides Option:</span> <span>+0 credits</span></p>
                                        )}
                                        {thinking === "extended" ? (
                                            <p className="flex justify-between gap-4 text-primary font-medium"><span>Extended Thinking:</span> <span>+5 credits</span></p>
                                        ) : (
                                            <p className="flex justify-between gap-4 text-muted-foreground/60"><span>Extended Thinking:</span> <span>+0 credits</span></p>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Button
                            type="submit"
                            disabled={!prompt.trim() || isGenerating}
                            size="default"
                            className="w-full sm:w-10 h-10 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer sm:p-0"
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
                </div>
            </form>
        </div>
    );
}
