"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LogOut,
    User,
    LayoutDashboard,
    Download,
    FileText,
    Presentation,
    Palette,
    Play,
} from "lucide-react";
import { ThemeToggle } from "@/components/generate/theme-toggle";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import metadata from "@/components/templates/metadata.json";

const themesList = metadata.themes;

export function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const pathSegments = pathname.split("/");
    const isDetailPage =
        pathname.startsWith("/generate/") &&
        (pathSegments.length === 3 || pathSegments.length === 4);
    const [pptInfo, setPptInfo] = useState({ title: "", appState: "" });
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

    useEffect(() => {
        if (!isDetailPage) return;

        const handleInfoChange = (e) => {
            if (e.detail) {
                setPptInfo(e.detail);
            }
        };
        window.addEventListener("ppt-info-changed", handleInfoChange);

        const timer = setTimeout(() => {
            window.dispatchEvent(new CustomEvent("request-ppt-info"));
        }, 0);

        return () => {
            window.removeEventListener("ppt-info-changed", handleInfoChange);
            clearTimeout(timer);
        };
    }, [pathname, isDetailPage]);

    const handleDownloadPDF = () => {
        window.dispatchEvent(new CustomEvent("trigger-download-pdf"));
    };

    const handleDownloadPPT = () => {
        window.dispatchEvent(new CustomEvent("trigger-download-pptx"));
    };

    const handleThemeChange = (themeName) => {
        window.dispatchEvent(
            new CustomEvent("trigger-change-theme", {
                detail: { theme: themeName },
            }),
        );
    };

    const handlePresentClick = () => {
        window.dispatchEvent(new CustomEvent("trigger-present"));
    };

    return (
        <div className="w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-50 px-6">
            <div className="w-full h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="hover:opacity-90 transition-opacity shrink-0"
                    >
                        <img
                            src="/logo.png"
                            alt="iota AI Logo"
                            className="w-7 h-7 object-contain dark:invert"
                        />
                    </Link>
                    {isDetailPage
                        ? pptInfo.title && (
                              <>
                                  <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10" />
                                  <span className="text-sm font-semibold truncate max-w-[200px] sm:max-w-[300px] text-foreground/90">
                                      {pptInfo.title}
                                  </span>
                              </>
                          )
                        : "iota AI"}
                </div>

                <div className="flex items-center gap-3">
                    {isDetailPage && pptInfo.appState === "viewing_slides" && (
                        <>
                            {/* Theme Selector Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsThemeModalOpen(true)}
                                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground h-8 gap-1.5 flex items-center px-3 rounded-md text-xs font-medium shrink-0 cursor-pointer transition-all duration-200"
                            >
                                <Palette size={13} className="text-primary" />
                                <span className="capitalize">
                                    {themesList.find(
                                        (t) => t.id === pptInfo.theme,
                                    )?.name ||
                                        pptInfo.theme ||
                                        "Theme"}
                                </span>
                            </Button>

                            {/* Export Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-border text-foreground hover:bg-accent hover:text-accent-foreground h-8 gap-1.5 flex items-center px-3 rounded-md text-xs font-medium shrink-0 cursor-pointer transition-all duration-200"
                                    >
                                        <Download size={13} />
                                        <span>Export</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="min-w-[180px] bg-popover border-border text-popover-foreground rounded-xl p-1.5 shadow-2xl z-50"
                                >
                                    <DropdownMenuItem
                                        onClick={handleDownloadPDF}
                                        className="px-2.5 py-2 cursor-pointer flex items-center gap-2 text-sm rounded-lg"
                                    >
                                        <FileText size={14} />
                                        <span>Download as PDF</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleDownloadPPT}
                                        className="px-2.5 py-2 cursor-pointer flex items-center gap-2 text-sm rounded-lg"
                                    >
                                        <Presentation size={14} />
                                        <span>Download as PPTX</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePresentClick}
                                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground h-8 gap-1.5 flex items-center px-3 rounded-md text-xs font-medium shrink-0 cursor-pointer transition-all duration-200"
                            >
                                <Play
                                    size={13}
                                    className="fill-current text-primary"
                                />
                                <span className="hidden sm:inline">
                                    Present
                                </span>
                            </Button>

                            <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10" />
                        </>
                    )}

                    <Link
                        href="/dashboard"
                        title="Dashboard"
                        className={`inline-flex items-center justify-center rounded-md w-9 h-9 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 ${
                            pathname === "/dashboard"
                                ? "bg-zinc-100 dark:bg-zinc-800 text-foreground font-semibold"
                                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                        <LayoutDashboard className="h-[1.2rem] w-[1.2rem]" />
                    </Link>

                    <ThemeToggle />

                    {session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="w-7.5 h-7.5 cursor-pointer border border-border/60 hover:opacity-90 transition-opacity">
                                    <AvatarImage
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                    />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                                        {(
                                            session.user.name ||
                                            session.user.email ||
                                            "U"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="bg-popover border-border text-popover-foreground min-w-[200px] rounded-xl p-1.5 shadow-2xl z-50"
                            >
                                <DropdownMenuLabel className="px-2.5 py-2">
                                    <div className="flex flex-col space-y-0.5">
                                        <p className="text-sm font-medium text-popover-foreground">
                                            {session.user.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="px-2.5 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg cursor-pointer flex items-center gap-2"
                                >
                                    <LogOut size={16} />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="w-7.5 h-7.5 rounded-full bg-muted flex items-center justify-center">
                            <User size={14} className="text-muted-foreground" />
                        </div>
                    )}
                </div>
            </div>

            {/* Theme Selector Modal */}
            <Dialog open={isThemeModalOpen} onOpenChange={setIsThemeModalOpen}>
                <DialogContent className="max-w-4xl sm:max-w-4xl bg-popover border-border text-popover-foreground rounded-xl p-6 shadow-2xl z-50">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">
                            Select Presentation Theme
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Choose a global visual style for all slides in this
                            presentation.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 my-4">
                        {themesList.map((t) => {
                            const isActive = pptInfo.theme === t.id;

                            return (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        handleThemeChange(t.id);
                                        setIsThemeModalOpen(false);
                                    }}
                                    className={`flex flex-col text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer gap-2 ${
                                        isActive
                                            ? "border-primary ring-2 ring-primary/20 bg-accent/10"
                                            : "border-border hover:border-muted-foreground/30 hover:bg-muted/10 bg-card"
                                    }`}
                                >
                                    <span className="font-semibold text-foreground capitalize text-[11px] truncate w-full px-0.5 mb-0.5">
                                        {t.name}
                                    </span>

                                    {/* Miniature slide layout preview */}
                                    <div
                                        data-theme={t.id}
                                        className="theme-container w-full aspect-[16/10] rounded-lg border theme-border p-2.5 flex flex-col justify-between overflow-hidden shadow-xs relative"
                                    >
                                        {/* Title & Subtitle */}
                                        <div className="space-y-0.5">
                                            <div className="theme-heading font-bold text-[9px] tracking-tight leading-none truncate">
                                                Title Style
                                            </div>
                                            <div className="theme-text-muted text-[5.5px] leading-none truncate">
                                                Subtitle styling
                                            </div>
                                        </div>

                                        {/* Miniature Card visualization */}
                                        <div className="theme-card p-1 rounded-md border theme-border flex flex-col gap-0.5 mt-1.5">
                                            <div className="theme-text-primary font-semibold text-[6px] leading-none truncate">
                                                Card Title
                                            </div>
                                            <div className="theme-text-muted text-[5px] leading-none truncate">
                                                Card content text
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
