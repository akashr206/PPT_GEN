"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Sparkles,
    ArrowUp,
    Monitor,
    Smartphone,
    Palette,
    Mic,
    ChevronDown,
    Plus,
    LogOut,
    LayoutDashboard,
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
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (prompt.trim()) {
            if (status === "authenticated") {
                const targetUrl = `/generate?prompt=${encodeURIComponent(prompt)}`;
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
                className="absolute top-1/3 -left-[20%] w-[50%] h-[60%] bg-gradient-to-r from-violet-600/40 to-blue-600/40 blur-[140px] rounded-full pointer-events-none z-0 mix-blend-screen transform -rotate-12"
            />
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 4.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2,
                }}
                className="absolute top-1/2 -right-[20%] w-[60%] h-[70%] bg-gradient-to-l from-violet-600/30 to-blue-600/30 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen transform rotate-12"
            />

            <nav className="relative z-99 flex items-center justify-between p-6 max-w-[1400px] w-full mx-auto">
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
                            <DropdownMenu>
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
                            onClick={() =>
                                signIn("google", { callbackUrl: "/dashboard" })
                            }
                            className="rounded-full bg-white text-black hover:bg-white/90 px-6 font-medium cursor-pointer"
                        >
                            Sign In
                        </Button>
                    )}
                </div>
            </nav>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 -mt-20 w-full max-w-5xl mx-auto">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-medium tracking-tight mb-6 text-white leading-[1.1] max-w-4xl mx-auto">
                    Presentations at the speed of AI
                </h1>

                <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-normal mb-12">
                    Transform ideas into beautiful pitch decks and presentations
                </p>

                <div className="w-full max-w-4xl mx-auto">
                    <form
                        onSubmit={handleSearch}
                        className="relative bg-[#1a1a24]/60 backdrop-blur-2xl rounded-[32px] border border-white/10 overflow-hidden flex flex-col shadow-2xl transition-all focus-within:bg-[#1a1a24]/80 focus-within:border-white/20"
                    >
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={"What presentation shall we design?"}
                            className="w-full min-h-[160px] p-6 md:p-8 bg-transparent resize-none outline-none text-white placeholder:text-white/40 text-lg md:text-xl leading-relaxed rounded-none"
                        />

                        <div className="flex flex-wrap items-center justify-between px-6 pb-6 pt-2">
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                                >
                                    <Plus size={18} />
                                </Button>
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

            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent
                    className="max-w-[380px] bg-[#0c0c12]/95 border-white/10 text-white rounded-lg p-6 shadow-2xl backdrop-blur-md select-none flex flex-col gap-0"
                    showCloseButton={true}
                >
                    <DialogHeader className="flex flex-col items-center text-center pb-4">
                        <img
                            src="/logo.png"
                            alt="Broadside AI Logo"
                            className="w-14 h-14 object-contain dark:invert"
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
                                const targetUrl = `/generate?prompt=${encodeURIComponent(prompt)}`;
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
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
