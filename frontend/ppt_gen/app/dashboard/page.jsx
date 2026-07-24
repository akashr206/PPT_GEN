"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Loader2,
    Bolt,
    Presentation as PresentationIcon,
    Image,
    Palette,
    Layout as LayoutIcon,
    Grid,
    List,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/generate/navbar";
import { motion } from "framer-motion";
import { useHistory } from "@/contexts/history-context";
import LibraryDashboard from "@/components/generate/LibraryDashboard";
import UserMenu from "@/components/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import PresentationsTab from "@/components/dashboard/PresentationsTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import ThemesTab from "@/components/dashboard/ThemesTab";

function DashboardPageContent() {
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();
    const { history } = useHistory();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const activeTab = searchParams.get("tab") || "presentations";
    const viewMode = searchParams.get("view") || "grid";

    const setActiveTab = (tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const setViewMode = (view) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("view", view);
        router.replace(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        if (authStatus === "loading") return;
        if (authStatus === "unauthenticated") {
            router.push("/");
            return;
        }
    }, [authStatus, router]);

    if (authStatus === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-foreground">
                <Loader2 className="animate-spin" size={30} />
            </div>
        );
    }

    if (authStatus === "unauthenticated") {
        return null;
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-zinc-900 dark:text-zinc-50 font-sans flex flex-col relative">
            {/* Background dot grid overlay */}

            <span className="lg:hidden">
                <Navbar />
            </span>

            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-r from-violet-600/30 to-blue-600/30 blur-[130px] rounded-full mix-blend-screen transform -rotate-12 dark:opacity-70 opacity-40"
                />
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        duration: 4.5,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.2,
                    }}
                    className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-gradient-to-l from-violet-600/25 to-blue-600/25 blur-[140px] rounded-full mix-blend-screen transform rotate-12 dark:opacity-70 opacity-40"
                />
            </div>

            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-8 pb-28 lg:pb-8 relative z-10 flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Sidebar (Desktop only) */}
                <div className="max-lg:hidden flex flex-col w-16 min-h-[calc(100vh-4rem)] h-full py-4 bg-zinc-50/50 dark:bg-zinc-950/20 justify-between items-center top-8 border border-border/40 sticky rounded-lg backdrop-blur-md">
                    {/* Presentations */}
                    <div className="flex flex-col gap-2 items-center shrink-0">
                        <Link
                            href="/dashboard"
                            className="hover:opacity-90 transition-opacity shrink-0"
                        >
                            <img
                                src="/logo.png"
                                alt="Broadside AI Logo"
                                className="w-8 h-8 object-contain dark:invert"
                            />
                        </Link>
                        <button
                            onClick={() => setActiveTab("presentations")}
                            className="group flex flex-col items-center gap-1 w-full py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                            <div
                                className={`p-2.5 rounded-md transition-all duration-200 ${
                                    activeTab === "presentations"
                                        ? "bg-primary/10 text-primary shadow-xs"
                                        : "text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/60 group-hover:scale-105"
                                }`}
                            >
                                <PresentationIcon className="w-4.5 h-4.5" />
                            </div>
                            <span
                                className={`text-[10px] font-medium tracking-tight text-center leading-tight transition-colors ${
                                    activeTab === "presentations"
                                        ? "text-foreground font-semibold"
                                        : "text-zinc-500 dark:text-zinc-400 group-hover:text-foreground"
                                }`}
                            >
                                Home
                            </span>
                        </button>

                        {/* Stock Photos */}
                        <button
                            onClick={() => setActiveTab("uploads")}
                            className="group flex flex-col items-center gap-1 w-full py-1.5 rounded-md transition-all duration-200 cursor-pointer"
                        >
                            <div
                                className={`p-2.5 rounded-md transition-all duration-200 ${
                                    activeTab === "pexels" ||
                                    activeTab === "uploads"
                                        ? "bg-primary/10 text-primary shadow-xs"
                                        : "text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/60 group-hover:scale-105"
                                }`}
                            >
                                <Image className="w-4.5 h-4.5" />
                            </div>
                            <span
                                className={`text-[10px] font-medium tracking-tight text-center leading-tight transition-colors ${
                                    activeTab === "pexels" ||
                                    activeTab === "uploads"
                                        ? "text-foreground font-semibold"
                                        : "text-zinc-500 dark:text-zinc-400 group-hover:text-foreground"
                                }`}
                            >
                                Media
                            </span>
                        </button>

                        {/* Custom Icons */}
                        <button
                            onClick={() => setActiveTab("icons")}
                            className="group flex flex-col items-center gap-1 w-full py-1.5 rounded-md transition-all duration-200 cursor-pointer"
                        >
                            <div
                                className={`p-2.5 rounded-md transition-all duration-200 ${
                                    activeTab === "icons" ||
                                    activeTab === "system-icons"
                                        ? "bg-primary/10 text-primary shadow-xs"
                                        : "text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/60 group-hover:scale-105"
                                }`}
                            >
                                <Bolt className="w-4.5 h-4.5" />
                            </div>
                            <span
                                className={`text-[10px] font-medium tracking-tight text-center leading-tight transition-colors ${
                                    activeTab === "icons" ||
                                    activeTab === "system-icons"
                                        ? "text-foreground font-semibold"
                                        : "text-zinc-500 dark:text-zinc-400 group-hover:text-foreground"
                                }`}
                            >
                                Icons
                            </span>
                        </button>

                        {/* Design Themes */}
                        <button
                            onClick={() => setActiveTab("themes")}
                            className="group flex flex-col items-center gap-1 w-full py-1.5 rounded-md transition-all duration-200 cursor-pointer relative"
                        >
                            <div
                                className={`p-2.5 rounded-md transition-all duration-200 ${
                                    activeTab === "themes"
                                        ? "bg-primary/10 text-primary shadow-xs"
                                        : "text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/60 group-hover:scale-105"
                                }`}
                            >
                                <Palette className="w-4.5 h-4.5" />
                            </div>
                            <span
                                className={`text-[10px] font-medium tracking-tight text-center leading-tight transition-colors ${
                                    activeTab === "themes"
                                        ? "text-foreground font-semibold"
                                        : "text-zinc-500 dark:text-zinc-400 group-hover:text-foreground"
                                }`}
                            >
                                Themes
                            </span>
                        </button>

                        {/* Slide Layouts */}
                        <button
                            onClick={() => setActiveTab("templates")}
                            className="group flex flex-col items-center gap-1 w-full py-1.5 rounded-md transition-all duration-200 cursor-pointer relative"
                        >
                            <div
                                className={`p-2.5 rounded-md transition-all duration-200 ${
                                    activeTab === "templates"
                                        ? "bg-primary/10 text-primary shadow-xs"
                                        : "text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/60 group-hover:scale-105"
                                }`}
                            >
                                <LayoutIcon className="w-4.5 h-4.5" />
                            </div>
                            <span
                                className={`text-[10px] font-medium tracking-tight text-center leading-tight transition-colors ${
                                    activeTab === "templates"
                                        ? "text-foreground font-semibold"
                                        : "text-zinc-500 dark:text-zinc-400 group-hover:text-foreground"
                                }`}
                            >
                                Templates
                            </span>
                            <div
                                className="absolute top-1.5 right-0 w-1.5 h-1.5 rounded-full bg-primary"
                                title="Locked feature"
                            />
                        </button>
                    </div>
                    <div className="flex flex-col  gap-2 items-center">
                        <ThemeToggle></ThemeToggle>
                        <UserMenu></UserMenu>
                    </div>
                </div>

                {/* Right Content Workspace */}
                <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
                    {/* Header Description block */}
                    <div className="border-b border-border/40 pb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                {activeTab === "presentations" &&
                                    "My Presentations"}
                                {activeTab === "uploads" &&
                                    "My Uploaded Images"}
                                {activeTab === "pexels" &&
                                    "Search Pexels Stock"}
                                {activeTab === "icons" && "Custom Brand Icons"}
                                {activeTab === "system-icons" &&
                                    "Search System Icons"}
                                {activeTab === "themes" &&
                                    "Custom Brand Themes"}
                                {activeTab === "layouts" &&
                                    "Custom Slide Layouts"}
                                {activeTab === "settings" &&
                                    "Workspace Settings"}
                            </h1>
                            <p className="text-muted-foreground mt-1 text-xs md:text-sm font-light">
                                {activeTab === "presentations" &&
                                    "Create, view, and manage your AI-generated presentation slide decks."}
                                {activeTab === "uploads" &&
                                    "Upload and manage your custom branding images, banners, and vector assets."}
                                {activeTab === "pexels" &&
                                    "Search and save millions of royalty-free high-resolution photos powered by Pexels."}
                                {activeTab === "icons" &&
                                    "Upload custom SVG files or paste raw vector code to reuse branding graphics."}
                                {activeTab === "system-icons" &&
                                    "Look up and copy reference keys for thousands of system-integrated Phosphor icons."}
                                {activeTab === "themes" &&
                                    "Define visual guidelines, colors, and font styles for uniform deck generations."}
                                {activeTab === "layouts" &&
                                    "Assemble customized layout templates to feed the AI generator structural patterns (Locked)."}
                                {activeTab === "settings" &&
                                    "Configure workspace settings and manage account preferences."}
                            </p>
                        </div>

                        {activeTab === "presentations" &&
                            history &&
                            history.length > 0 && (
                                <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/40 shrink-0 self-end md:self-auto">
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-1.5 rounded-md transition-all cursor-pointer ${
                                            viewMode === "list"
                                                ? "bg-background text-foreground shadow-xs"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                        title="List View"
                                    >
                                        <List size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-1.5 rounded-md transition-all cursor-pointer ${
                                            viewMode === "grid"
                                                ? "bg-background text-foreground shadow-xs"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                        title="Grid View"
                                    >
                                        <Grid size={16} />
                                    </button>
                                </div>
                            )}
                    </div>

                    {/* Sub-navigation for Media and Icons */}
                    {(activeTab === "uploads" || activeTab === "pexels") && (
                        <div className="flex items-center gap-1 bg-muted/45 p-1 rounded-lg border border-border/40 w-fit shrink-0">
                            <button
                                onClick={() => setActiveTab("uploads")}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                    activeTab === "uploads"
                                        ? "bg-background text-foreground shadow-xs border border-border/10"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                My Uploads
                            </button>
                            <button
                                onClick={() => setActiveTab("pexels")}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                    activeTab === "pexels"
                                        ? "bg-background text-foreground shadow-xs border border-border/10"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Stock Photos
                            </button>
                        </div>
                    )}

                    {(activeTab === "icons" ||
                        activeTab === "system-icons") && (
                        <div className="flex items-center gap-1 bg-muted/45 p-1 rounded-lg border border-border/40 w-fit shrink-0">
                            <button
                                onClick={() => setActiveTab("icons")}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                    activeTab === "icons"
                                        ? "bg-background text-foreground shadow-xs border border-border/10"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Custom Icons
                            </button>
                            <button
                                onClick={() => setActiveTab("system-icons")}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                    activeTab === "system-icons"
                                        ? "bg-background text-foreground shadow-xs border border-border/10"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                System Icons
                            </button>
                        </div>
                    )}

                    {activeTab === "presentations" ? (
                        <PresentationsTab />
                    ) : activeTab === "settings" ? (
                        <SettingsTab />
                    ) : activeTab === "themes" ? (
                        <ThemesTab />
                    ) : (
                        <LibraryDashboard
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center bg-background text-foreground">
                    <Loader2 className="animate-spin" size={30} />
                </div>
            }
        >
            <DashboardPageContent />
        </Suspense>
    );
}
