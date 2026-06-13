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
    Menu,
    X,
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
    const [pptInfo, setPptInfo] = useState({
        title: "",
        appState: "",
        isBusy: false,
    });
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <>
            <div className="w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-50 px-8">
            <div className="w-full h-14 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link
                        href="/dashboard"
                        className="hover:opacity-90 transition-opacity shrink-0"
                    >
                        <img
                            src="/logo.png"
                            alt="Broadside AI Logo"
                            className="w-6 h-6 object-contain dark:invert"
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
                        : "Broadside AI"}
                </div>

                <div className="flex items-center gap-3">
                    {isDetailPage && pptInfo.appState === "viewing_slides" && (
                        <div className="hidden md:flex items-center gap-3">
                            {/* Theme Selector Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsThemeModalOpen(true)}
                                disabled={pptInfo.isBusy}
                                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground h-8 gap-1.5 flex items-center px-3 rounded-md text-xs font-medium shrink-0 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        disabled={pptInfo.isBusy}
                                        className="border-border text-foreground hover:bg-accent hover:text-accent-foreground h-8 gap-1.5 flex items-center px-3 rounded-md text-xs font-medium shrink-0 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        className="px-2.5 py-2 cursor-pointer flex items-center gap-2 text-sm rounded-md"
                                    >
                                        <FileText size={14} />
                                        <span>Download as PDF</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleDownloadPPT}
                                        className="px-2.5 py-2 cursor-pointer flex items-center gap-2 text-sm rounded-md"
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
                                disabled={pptInfo.isBusy}
                                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground h-8 gap-1.5 flex items-center px-3 rounded-md text-xs font-medium shrink-0 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        </div>
                    )}

                    <div className="hidden md:flex items-center gap-3">
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
                    </div>

                    {/* Hamburger Button for Mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="flex md:hidden text-foreground hover:bg-accent w-9 h-9 items-center justify-center"
                    >
                        <Menu size={18} />
                    </Button>

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
                                    className="px-2.5 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive rounded-md cursor-pointer flex items-center gap-2"
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
        </div>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[9999] md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    {/* Drawer */}
                    <div className="fixed top-0 right-0 h-full w-[300px] bg-background border-l border-border z-[9999] p-5 flex flex-col gap-5 md:hidden shadow-2xl animate-in slide-in-from-right duration-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">
                                Menu
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                                <X size={18} />
                            </Button>
                        </div>

                        <div className="flex flex-col gap-4 overflow-y-auto flex-1">
                            {isDetailPage &&
                                pptInfo.appState === "viewing_slides" && (
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                                            Presentation Actions
                                        </span>

                                        {/* Theme Selector */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setIsThemeModalOpen(true);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            disabled={pptInfo.isBusy}
                                            className="w-full justify-start border-border text-foreground hover:bg-accent hover:text-accent-foreground h-9 gap-2 px-3 rounded-md text-xs font-medium cursor-pointer"
                                        >
                                            <Palette
                                                size={14}
                                                className="text-primary"
                                            />
                                            <span>Theme: </span>
                                            <span className="capitalize font-semibold">
                                                {themesList.find(
                                                    (t) =>
                                                        t.id === pptInfo.theme,
                                                )?.name ||
                                                    pptInfo.theme ||
                                                    "Theme"}
                                            </span>
                                        </Button>

                                        {/* Export PDF */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                handleDownloadPDF();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            disabled={pptInfo.isBusy}
                                            className="w-full justify-start border-border text-foreground hover:bg-accent hover:text-accent-foreground h-9 gap-2 px-3 rounded-md text-xs font-medium cursor-pointer"
                                        >
                                            <FileText
                                                size={14}
                                                className="text-primary"
                                            />
                                            <span>Download as PDF</span>
                                        </Button>

                                        {/* Export PPT */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                handleDownloadPPT();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            disabled={pptInfo.isBusy}
                                            className="w-full justify-start border-border text-foreground hover:bg-accent hover:text-accent-foreground h-9 gap-2 px-3 rounded-md text-xs font-medium cursor-pointer"
                                        >
                                            <Presentation
                                                size={14}
                                                className="text-primary"
                                            />
                                            <span>Download as PPTX</span>
                                        </Button>

                                        {/* Present */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                handlePresentClick();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            disabled={pptInfo.isBusy}
                                            className="w-full justify-start border-border text-foreground hover:bg-accent hover:text-accent-foreground h-9 gap-2 px-3 rounded-md text-xs font-medium cursor-pointer"
                                        >
                                            <Play
                                                size={14}
                                                className="fill-current text-primary"
                                            />
                                            <span>Present</span>
                                        </Button>
                                    </div>
                                )}

                            <div className="h-[1px] bg-border my-1" />

                            <div className="flex flex-col gap-3">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                                    Navigation & Settings
                                </span>

                                {/* Dashboard */}
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                                        pathname === "/dashboard"
                                            ? "bg-accent text-accent-foreground font-semibold"
                                            : "text-zinc-700 dark:text-zinc-300 hover:bg-accent hover:text-accent-foreground"
                                    }`}
                                >
                                    <LayoutDashboard className="h-4 w-4 text-primary" />
                                    <span>Dashboard</span>
                                </Link>

                                {/* Theme Toggle */}
                                <div className="flex items-center justify-between px-3 py-1 bg-muted/40 rounded-md">
                                    <span className="text-xs text-muted-foreground">
                                        Dark Mode
                                    </span>
                                    <ThemeToggle />
                                </div>
                            </div>

                            {session?.user && (
                                <div className="mt-auto border-t border-border pt-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-2.5 px-1">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage
                                                src={session.user.image}
                                                alt={
                                                    session.user.name || "User"
                                                }
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
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-semibold truncate text-foreground">
                                                {session.user.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground truncate">
                                                {session.user.email}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            signOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full justify-center gap-1.5 h-9 text-xs font-medium"
                                    >
                                        <LogOut size={14} />
                                        <span>Sign out</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Theme Selector Modal */}
            <Dialog
                open={isThemeModalOpen && !pptInfo.isBusy}
                onOpenChange={pptInfo.isBusy ? undefined : setIsThemeModalOpen}
            >
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
                                        className="theme-container w-full aspect-[16/10] rounded-md border theme-border p-2.5 flex flex-col justify-between overflow-hidden shadow-xs relative"
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
        </>
    );
}
