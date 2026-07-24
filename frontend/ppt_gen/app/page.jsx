"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Sparkles,
    ArrowUp,
    Monitor,
    Smartphone,
    Palette,
    Plus,
    LogOut,
    LayoutDashboard,
    Volume2,
    VolumeX,
    FileStack,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import InteractiveDotGrid from "@/components/ui/InteractiveDotGrid";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function LandingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const [slides, setSlides] = useState(6);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const slidesArray = Array.from({ length: 10 }, (_, i) => i + 1).concat([15]);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        const animationId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(animationId);
            lenis.destroy();
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (prompt.trim()) {
            const targetUrl = `/generate?prompt=${encodeURIComponent(prompt)}&slides=${slides}`;
            if (status === "authenticated") {
                router.push(targetUrl);
            } else {
                setShowLoginModal(true);
            }
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [session]);

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-50 font-sans selection:bg-blue-500/30 relative overflow-hidden flex flex-col">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-1/3 left-[-20%] w-[50%] h-[60%] bg-gradient-to-r from-violet-600/40 to-blue-600/40 blur-[140px] rounded-full pointer-events-none z-0 mix-blend-screen transform -rotate-12"
            />
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 4.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2,
                }}
                className="fixed top-1/2 -right-[20%] w-[60%] h-[70%] bg-gradient-to-l from-violet-600/30 to-blue-600/30 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen transform rotate-12"
            />
            <InteractiveDotGrid
                spacing={28}
                dotRadius={1.2}
                repelRadius={200}
                maxRepel={30}
                className="[mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_95%)]"
            />

            <nav className="relative z-99 flex items-center justify-between p-6 max-w-7xl 2xl:max-w-[1536px] w-full mx-auto">
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="font-semibold text-xl tracking-tight flex items-center gap-2.5"
                    >
                        <img
                            src="/logo.png"
                            alt="Broadside AI Logo"
                            className="h-6 w-6 object-contain invert"
                        />
                        <span>Broadside AI</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {status === "authenticated" ? (
                        <div className="flex gap-2 items-center">
                            <Button
                                variant="ghost"
                                className={
                                    "items-center hover:bg-accent-foreground p-2"
                                }
                                onClick={() => router.push("/dashboard")}
                            >
                                <LayoutDashboard className="w-4 h-4"></LayoutDashboard>{" "}
                                Dashboard
                            </Button>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all">
                                        {session.user.image ? (
                                            <img
                                                src={session.user.image}
                                                alt={
                                                    session.user.name || "User"
                                                }
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            (
                                                session.user.name ||
                                                session.user.email ||
                                                "U"
                                            )
                                                .charAt(0)
                                                .toUpperCase()
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="bg-[#121218] border-white/10 text-white min-w-[200px] rounded-md p-1.5 shadow-2xl"
                                >
                                    <DropdownMenuLabel className="px-2.5 py-2">
                                        <div className="flex flex-col space-y-0.5">
                                            <p className="text-sm font-medium text-white">
                                                {session.user.name}
                                            </p>
                                            <p className="text-xs text-white/50 truncate">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem
                                        onClick={() => signOut()}
                                        className="px-2.5 py-2 text-red-400 focus:bg-red-500/10 focus:text-red-400 rounded-md cursor-pointer flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        <span>Sign out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Button
                            onClick={() => setShowLoginModal(true)}
                            className="rounded-md bg-white text-black hover:bg-white/90 px-6 font-medium cursor-pointer"
                        >
                            Sign In
                        </Button>
                    )}
                </div>
            </nav>

            <main className="relative z-10 min-h-[100vh] flex flex-col items-center justify-center text-center px-4 -mt-20 w-full max-w-6xl 2xl:max-w-7xl mx-auto">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] 2xl:text-[6rem] font-medium tracking-tight mb-6 text-white leading-[1.08] max-w-5xl  mx-auto">
                    The Next Generation of Presentations
                </h1>

                <div className="w-full max-w-5xl  mx-auto">
                    <form
                        onSubmit={handleSearch}
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

            {/* Video Showcase Section */}
            <section className="relative z-10 w-full max-w-7xl 2xl:max-w-330 mx-auto px-4 mt-12 mb-32">
                <div className="relative">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="group/video"
                    >
                        <div className="relative aspect-video transform-[translateZ(0)]">
                            <video
                                src="/broadside-ai-info.webm"
                                className="w-full h-full object-contain rounded-xl"
                                autoPlay
                                muted={isMuted}
                                loop
                                playsInline
                                controls={false}
                            />
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover/video:opacity-100"
                            >
                                {isMuted ? (
                                    <VolumeX size={18} />
                                ) : (
                                    <Volume2 size={18} />
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Bento Grid Features Section */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-5 md:gap-6 max-w-7xl 2xl:max-w-[1536px] mx-auto text-left">
                    {/* Large Main Feature (Spans 2 cols, 2 rows) */}
                    <div className="md:col-span-2 md:row-span-2 p-8 md:p-10 rounded-[1.25rem] bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 hover:border-white/20 backdrop-blur-xl transition-all flex flex-col justify-end relative overflow-hidden group">
                        <div className="absolute top-8 right-8 w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <Sparkles size={24} />
                        </div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-all" />
                        <div className="relative z-10 mt-32">
                            <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
                                AI-Powered Creation
                            </h3>
                            <p className="text-white/60 text-lg md:text-xl leading-relaxed">
                                Turn any text prompt or raw idea into a fully
                                structured, beautifully designed presentation in
                                a matter of seconds. Let the AI do the heavy
                                lifting.
                            </p>
                        </div>
                    </div>

                    {/* Top Right Feature (Spans 2 cols, 1 row) */}
                    <div className="md:col-span-2 p-8 md:p-10 rounded-[1.25rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:bg-white/[0.05] transition-all flex flex-col justify-between group">
                        <div className="flex justify-between items-start mb-12">
                            <h3 className="text-2xl font-semibold text-white tracking-tight">
                                Stunning Designs
                            </h3>
                            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
                                <Palette size={20} />
                            </div>
                        </div>
                        <p className="text-white/60 text-lg leading-relaxed">
                            Access premium themes and dynamic layouts that
                            automatically adapt to your content instantly,
                            ensuring pixel-perfect slides every time.
                        </p>
                    </div>

                    {/* Bottom Right Features (1 col, 1 row each) */}
                    <div className="p-8 rounded-[1.25rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:bg-white/[0.05] transition-all flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-12">
                            <Monitor size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Real-time Editing
                            </h3>
                            <p className="text-white/60 text-base leading-relaxed">
                                Fine-tune text, icons, and colors instantly.
                            </p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[1.25rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:bg-white/[0.05] transition-all flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-12">
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Export Anywhere
                            </h3>
                            <p className="text-white/60 text-base leading-relaxed">
                                Download as PPTX, PDF or present directly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 w-full border-t border-white/10 bg-black/20 backdrop-blur-lg py-12 mt-auto">
                <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="Broadside AI"
                            className="w-6 h-6 invert opacity-80"
                        />
                        <span className="text-white/80 font-medium tracking-tight">
                            Broadside AI
                        </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-white/50">
                        <Link
                            href="/terms"
                            className="hover:text-white transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/privacy"
                            className="hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <a
                            href="mailto:akashr6514@gmail.com"
                            className="hover:text-white transition-colors"
                        >
                            Contact
                        </a>
                    </div>
                    <p className="text-white/40 text-sm">
                        © {new Date().getFullYear()} Broadside AI. All rights
                        reserved.
                    </p>
                </div>
            </footer>

            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent
                    className="max-w-[380px] bg-[#0c0c12]/95 border-white/10 text-white rounded-lg p-6 shadow-2xl backdrop-blur-md select-none flex flex-col gap-0"
                    showCloseButton={true}
                >
                    <DialogHeader className="flex flex-col items-center text-center pb-4">
                        <img
                            src="/logo.png"
                            alt="Broadside AI Logo"
                            className="w-14 h-14 object-contain invert"
                        />
                        <DialogTitle className="text-xl font-bold text-white tracking-tight">
                            Sign in to Broadside AI
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400 text-xs mt-1 px-4 leading-normal">
                            Sign in to design your presentation and customize
                            slides in real-time.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-2.5 pt-2">
                        <Button
                            onClick={() => {
                                const targetUrl = `/generate?prompt=${encodeURIComponent(prompt)}&slides=${slides}`;
                                signIn("google", { callbackUrl: targetUrl });
                            }}
                            className="w-full rounded-md bg-white text-black hover:bg-white/90 font-medium py-5 gap-2 cursor-pointer shadow-lg flex items-center justify-center text-sm"
                        >
                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                                <path
                                    fill="#EA4335"
                                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.61 14.99 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.82 2.96c2.24-2.07 3.59-5.11 3.59-8.75z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.24 14.45c-.23-.69-.36-1.43-.36-2.2c0-.77.13-1.51.36-2.2L1.39 7.56C.5 9.35 0 11.35 0 13.5c0 2.15.5 4.15 1.39 5.94l3.85-2.99z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.82-2.96c-1.06.71-2.42 1.13-4.14 1.13-3.34 0-5.86-2.21-6.87-5.21H1.28v3.08C3.28 20.33 7.26 23 12 23z"
                                />
                            </svg>
                            <span>Continue with Google</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setShowLoginModal(false)}
                            className="w-full rounded-md border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white font-medium py-5 cursor-pointer text-sm bg-transparent"
                        >
                            Cancel
                        </Button>

                        <p className="text-center text-[11px] text-zinc-500 mt-4 leading-relaxed">
                            By continuing, you agree to our{" "}
                            <Link
                                href="/terms"
                                className="text-zinc-300 hover:text-white underline underline-offset-2"
                            >
                                Terms of Service
                            </Link>{" "}
                            and Privacy Policy.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
