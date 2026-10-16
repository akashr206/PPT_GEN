"use client";

import { useRef } from "react";
import { ArrowUp, FileStack, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SilkyAurora from "./SilkyAurora";

export default function Hero({ prompt, setPrompt, slides, setSlides, onSearch }) {
    const slidesArray = Array.from({ length: 10 }, (_, i) => i + 1).concat([15]);

    // Split text into words for staggered animation
    const titleText = "The Next Generation of Presentations";
    const words = titleText.split(" ");

    const heroRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 1.6 });

        tl.fromTo(".hero-word", 
        {
            y: "100%",
            opacity: 0,
            rotationZ: 4,
        },
        {
            y: "0%",
            opacity: 1,
            rotationZ: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out"
        });

        tl.fromTo(".hero-form", 
        {
            opacity: 0,
            y: 40,
            scale: 0.95,
            filter: "blur(10px)",
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out"
        }, "-=0.4");
    }, { scope: heroRef });

    return (
        <main ref={heroRef} className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-4 -mt-20 w-full max-w-6xl 2xl:max-w-7xl mx-auto">
            <SilkyAurora />
            <h1 
                className="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] 2xl:text-[6rem] font-medium tracking-tight mb-8 text-white leading-[1.1] max-w-5xl mx-auto flex flex-wrap justify-center overflow-hidden"
            >
                {words.map((word, i) => (
                    <div key={i} className="overflow-hidden pb-2 mr-[0.25em] last:mr-0 inline-block">
                        <span 
                            className="hero-word inline-block origin-bottom-left"
                        >
                            {word}
                        </span>
                    </div>
                ))}
            </h1>

            <div 
                className="hero-form w-full max-w-5xl mx-auto relative z-10"
            >
                <form
                    onSubmit={onSearch}
                    className="relative bg-[#1a1a24]/60 backdrop-blur-2xl rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-2xl transition-all focus-within:bg-[#1a1a24]/80 focus-within:border-white/20"
                >
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={"What presentation shall we design?"}
                        className="w-full min-h-[170px] p-6 md:p-8 bg-transparent resize-none outline-none text-white placeholder:text-white/40 text-lg md:text-xl leading-relaxed rounded-none"
                    />

                    <div className="flex flex-wrap items-center justify-between px-6 pb-6 pt-2">
                        <div className="flex items-center gap-2">
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-1.5 text-xs text-white/80 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white px-3 rounded-md cursor-pointer"
                                    >
                                        <FileStack size={14} className="text-indigo-400 shrink-0" />
                                        <span>{slides} Slides</span>
                                        <ChevronDown size={14} className="opacity-50 shrink-0" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-[#121218] border-white/10 text-white min-w-[120px] rounded-md p-1 shadow-2xl">
                                    {slidesArray.map((s) => (
                                        <DropdownMenuItem
                                            key={s}
                                            onClick={() => setSlides(s)}
                                            className="flex items-center justify-between gap-3 cursor-pointer text-xs focus:bg-white/10 focus:text-white"
                                        >
                                            <span>{s} Slides</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="submit"
                                disabled={!prompt.trim()}
                                className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all ml-1 border border-white/10 p-0 flex items-center justify-center"
                            >
                                <ArrowUp size={16} />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
