"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, Presentation, ArrowRight, Loader2, FileText, MoreVertical, Trash2, FileDown, Presentation as PresentationIcon, Image, Upload, Search, Palette, Layout as LayoutIcon, Lock, Grid, List } from "lucide-react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/generate/navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { useHistory } from "@/contexts/history-context";
import { Loader } from "lucide-react";
import Slide from "@/components/templates/Slide";
import LibraryDashboard from "@/components/generate/LibraryDashboard";

function DashboardPageContent() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { history, isLoading, deletePresentation, refreshHistory } = useHistory();
  const [presentationToDelete, setPresentationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "";
    }
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
      <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2 className="animate-spin" size={30} />
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-zinc-900 dark:text-zinc-50 font-sans flex flex-col relative">
      <Navbar />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-15 dark:opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-r from-violet-600/30 to-blue-600/30 blur-[130px] rounded-full mix-blend-screen transform -rotate-12 dark:opacity-70 opacity-40"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-gradient-to-l from-violet-600/25 to-blue-600/25 blur-[140px] rounded-full mix-blend-screen transform rotate-12 dark:opacity-70 opacity-40"
        />
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col lg:flex-row gap-8 items-start">

        {/* Left SaaS Sidebar */}
        <div className="w-full lg:w-60 shrink-0 flex flex-row lg:flex-col gap-1.5 lg:gap-5 overflow-x-auto lg:overflow-x-visible bg-card/35 dark:bg-zinc-950/20 border border-border/60 p-3 rounded-xl backdrop-blur-md self-stretch lg:self-auto shadow-xs shrink-0 scrollbar-none">
          {/* Workspace Section */}
          <div className="flex flex-row lg:flex-col gap-1 shrink-0 lg:shrink">
            <span className="hidden lg:inline text-[9px] font-bold text-muted-foreground/80 uppercase tracking-wider px-3 mb-1">
              Workspace
            </span>
            <button
              onClick={() => setActiveTab("presentations")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "presentations"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
            >
              <PresentationIcon className="w-4 h-4" />
              <span>Presentations</span>
            </button>
          </div>

          {/* Library Section */}
          <div className="flex flex-row lg:flex-col gap-1 shrink-0 lg:shrink border-l lg:border-l-0 lg:border-t border-border/40 pl-2 lg:pl-0 lg:pt-4">
            <span className="hidden lg:inline text-[9px] font-bold text-muted-foreground/80 uppercase tracking-wider px-3 mb-1">
              Assets Library
            </span>
            <button
              onClick={() => setActiveTab("uploads")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "uploads"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
            >
              <Upload className="w-4 h-4" />
              <span>My Uploads</span>
            </button>
            <button
              onClick={() => setActiveTab("pexels")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "pexels"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
            >
              <Image className="w-4 h-4" />
              <span>Stock Photos</span>
            </button>
            <button
              onClick={() => setActiveTab("icons")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "icons"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
            >
              <FileText className="w-4 h-4" />
              <span>Custom Icons</span>
            </button>
            <button
              onClick={() => setActiveTab("system-icons")}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "system-icons"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
            >
              <Search className="w-4 h-4" />
              <span>System Icons</span>
            </button>
          </div>

          {/* Design System Section */}
          <div className="flex flex-row lg:flex-col gap-1 shrink-0 lg:shrink border-l lg:border-l-0 lg:border-t border-border/40 pl-2 lg:pl-0 lg:pt-4">
            <span className="hidden lg:inline text-[9px] font-bold text-muted-foreground/80 uppercase tracking-wider px-3 mb-1">
              Brand Kit
            </span>
            <button
              onClick={() => setActiveTab("themes")}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "themes"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/30"
                }`}
            >
              <span className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 opacity-50" />
                <span>Design Themes</span>
              </span>
              <span className="hidden lg:inline text-[8px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary px-1 py-0.5 rounded-md scale-90">
                Locked
              </span>
            </button>
            <button
              onClick={() => setActiveTab("layouts")}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "layouts"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/30"
                }`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutIcon className="w-4 h-4 opacity-50" />
                <span>Slide Layouts</span>
              </span>
              <span className="hidden lg:inline text-[8px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary px-1 py-0.5 rounded-md scale-90">
                Locked
              </span>
            </button>
          </div>
        </div>

        {/* Right Content Workspace */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
          {/* Header Description block */}
          <div className="border-b border-border/40 pb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {activeTab === "presentations" && "My Presentations"}
                {activeTab === "uploads" && "My Uploaded Images"}
                {activeTab === "pexels" && "Search Pexels Stock"}
                {activeTab === "icons" && "Custom Brand Icons"}
                {activeTab === "system-icons" && "Search System Icons"}
                {activeTab === "themes" && "Custom Brand Themes"}
                {activeTab === "layouts" && "Custom Slide Layouts"}
              </h1>
              <p className="text-muted-foreground mt-1 text-xs md:text-sm font-light">
                {activeTab === "presentations" && "Create, view, and manage your AI-generated presentation slide decks."}
                {activeTab === "uploads" && "Upload and manage your custom branding images, banners, and vector assets."}
                {activeTab === "pexels" && "Search and save millions of royalty-free high-resolution photos powered by Pexels."}
                {activeTab === "icons" && "Upload custom SVG files or paste raw vector code to reuse branding graphics."}
                {activeTab === "system-icons" && "Look up and copy reference keys for thousands of system-integrated Phosphor icons."}
                {activeTab === "themes" && "Define visual guidelines, colors, and font styles for uniform deck generations (Locked)."}
                {activeTab === "layouts" && "Assemble customized layout templates to feed the AI generator structural patterns (Locked)."}
              </p>
            </div>

            {activeTab === "presentations" && history && history.length > 0 && (
              <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/40 shrink-0 self-end md:self-auto">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === "list"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                  title="List View"
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === "grid"
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

          {activeTab === "presentations" ? (
            <>
              {viewMode === "list" ? (
                /* Sleek List View */
                <div className="w-full flex flex-col border border-border/50 rounded-xl bg-card/25 dark:bg-zinc-950/10 backdrop-blur-md overflow-hidden shadow-xs">
                  {/* Table Headers */}
                  <div className="grid grid-cols-12 px-6 py-3 border-b border-border/40 text-[10px] font-bold text-muted-foreground/85 tracking-wider uppercase bg-muted/10 select-none">
                    <div className="col-span-6 md:col-span-5 flex items-center">Name</div>
                    <div className="col-span-3 md:col-span-2 flex items-center">Theme</div>
                    <div className="col-span-3 md:col-span-2 flex items-center">Slides</div>
                    <div className="hidden md:col-span-2 md:flex items-center">Last Modified</div>
                    <div className="col-span-3 md:col-span-1 flex items-center justify-end">Actions</div>
                  </div>

                  <div className="divide-y divide-border/20">
                    {/* New Presentation Row */}
                    <Link href="/generate">
                      <div className="grid grid-cols-12 px-6 py-4 items-center hover:bg-muted/30 transition-colors cursor-pointer group">
                        <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-dashed border-border/80 group-hover:border-primary/40 flex items-center justify-center bg-muted/10 transition-colors">
                            <Plus size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">New Presentation</div>
                            <div className="text-[10px] text-muted-foreground font-light mt-0.5">Create a brand new slide deck</div>
                          </div>
                        </div>
                        <div className="col-span-3 md:col-span-2 text-xs text-muted-foreground/60 font-light">—</div>
                        <div className="col-span-3 md:col-span-2 text-xs text-muted-foreground/60 font-light">—</div>
                        <div className="hidden md:col-span-2 md:block text-xs text-muted-foreground/60 font-light">—</div>
                        <div className="col-span-3 md:col-span-1 flex items-center justify-end">
                          <ArrowRight size={14} className="text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
                        </div>
                      </div>
                    </Link>

                    {/* Loading placeholder rows */}
                    {isLoading && Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="grid grid-cols-12 px-6 py-4 items-center animate-pulse">
                        <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                          <Skeleton className="w-10 h-10 bg-muted/25 rounded-lg" />
                          <div className="space-y-1.5 flex-1 max-w-[180px]">
                            <Skeleton className="h-3.5 bg-muted/25 rounded-md" />
                            <Skeleton className="h-2.5 w-2/3 bg-muted/20 rounded" />
                          </div>
                        </div>
                        <div className="col-span-3 md:col-span-2">
                          <Skeleton className="h-4.5 w-16 bg-muted/20 rounded-full" />
                        </div>
                        <div className="col-span-3 md:col-span-2">
                          <Skeleton className="h-3.5 w-14 bg-muted/20 rounded" />
                        </div>
                        <div className="hidden md:col-span-2 md:block">
                          <Skeleton className="h-3 w-20 bg-muted/20 rounded" />
                        </div>
                        <div className="col-span-3 md:col-span-1 flex justify-end">
                          <Skeleton className="w-7 h-7 bg-muted/20 rounded-full" />
                        </div>
                      </div>
                    ))}

                    {/* Presentation list rows */}
                    {!isLoading && history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => router.push(`/generate/${item.id}/view`)}
                        className="grid grid-cols-12 px-6 py-4 items-center hover:bg-muted/20 transition-colors cursor-pointer group"
                      >
                        <div className="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
                          {/* Slide thumbnail preview scaled down */}
                          <div className="w-10 h-10 rounded-lg border border-border/60 bg-muted/20 overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative">
                            <div className="scale-[0.25] origin-center w-[160px] h-[90px] shrink-0 pointer-events-none">
                              <Slide theme={item.theme} slide_content={item.first_slide} />
                            </div>
                            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors leading-tight">
                              {item.title || "Untitled Presentation"}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-light mt-0.5">
                              ID: {item.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>

                        {/* Theme */}
                        <div className="col-span-3 md:col-span-2 flex items-center">
                          <span className="text-[9px] font-medium tracking-wider uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border/50">
                            {item.theme || "Modern"}
                          </span>
                        </div>

                        {/* Slides */}
                        <div className="col-span-3 md:col-span-2 flex items-center text-xs text-foreground/80 font-light">
                          <FileText size={12} className="text-muted-foreground mr-1.5" />
                          {item.slides_count || 0} Slides
                        </div>

                        {/* Date */}
                        <div className="hidden md:col-span-2 md:flex items-center text-xs text-muted-foreground font-light">
                          {formatDate(item.updated_at || item.created_at)}
                        </div>

                        {/* Actions dropdown */}
                        <div className="col-span-3 md:col-span-1 flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-muted/80 cursor-pointer"
                              >
                                <MoreVertical size={14} className="text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 bg-popover border-border text-popover-foreground rounded-md p-1.5 shadow-2xl z-50">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.info("Preparing PDF download");
                                  setTimeout(() => {
                                    toast.success("PDF downloaded successfully (simulation).");
                                  }, 1000);
                                }}
                                className="cursor-pointer gap-2 py-2"
                              >
                                <FileDown size={14} />
                                <span>Download PDF</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const toastId = toast.loading("Converting presentation to PPTX");

                                  const fetchAndDownload = async () => {
                                    try {
                                      const res = await api.get(`/api/ppt/${item.id}`);
                                      const presentation = (res && res.data && res.data[0]) || res[0] || res;

                                      if (!presentation || !presentation.slides) {
                                        throw new Error("Presentation slides not found");
                                      }

                                      const blob = await api.post("/api/ppt/convert", {
                                        slides: presentation.slides
                                      }, {
                                        responseType: "blob"
                                      });
                                      const downloadUrl = window.URL.createObjectURL(blob);
                                      const link = document.createElement("a");
                                      link.href = downloadUrl;
                                      link.setAttribute("download", `${presentation.title || "presentation"}.pptx`);
                                      document.body.appendChild(link);
                                      link.click();
                                      link.parentNode.removeChild(link);
                                      window.URL.revokeObjectURL(downloadUrl);

                                      toast.success("PPTX downloaded successfully!");
                                    } catch (err) {
                                      console.error("Failed to convert slides to PowerPoint:", err);
                                      toast.error(err.message || "Failed to export slides to PPTX");
                                    } finally {
                                      toast.dismiss(toastId);
                                    }
                                  };

                                  fetchAndDownload();
                                }}
                                className="cursor-pointer gap-2 py-2"
                              >
                                <PresentationIcon size={14} />
                                <span>Download PPTX</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border" />

                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPresentationToDelete(item);
                                }}
                                className="cursor-pointer gap-2 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Grid View */
                <div className="md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {!isLoading && history.length > 0 && (
                    <Link href="/generate" className="h-full">
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="h-full border border-primary/20 hover:border-primary/50 bg-gradient-to-br from-primary/5 via-card to-card hover:bg-card transition-all rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none group min-h-[220px]"
                      >
                        <div className="w-12 h-12 rounded-full border border-primary/10 group-hover:border-primary/30 bg-primary/5 group-hover:bg-primary/10 transition-colors flex items-center justify-center mb-3">
                          <Plus size={20} className="text-primary transition-colors" />
                        </div>
                        <h3 className="font-semibold text-sm text-foreground">New Presentation</h3>
                        <p className="text-xs text-muted-foreground mt-1 font-light">Design a brand new slide deck</p>
                      </motion.div>
                    </Link>
                  )}

                  {isLoading && Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="h-full border border-border bg-card rounded-xl p-5 flex flex-col justify-between shadow-sm animate-pulse min-h-[220px]">
                      <div className="space-y-3 flex-1">
                        <Skeleton className="h-24 w-full bg-muted/30 rounded-md" />
                        <div className="space-y-2 mt-3">
                          <Skeleton className="h-4 w-12 bg-muted/25 rounded" />
                          <Skeleton className="h-5 w-5/6 bg-muted/25 rounded-md" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-border/10">
                        <Skeleton className="h-3 w-16 bg-muted/20 rounded" />
                        <Skeleton className="h-3 w-12 bg-muted/20 rounded" />
                      </div>
                    </div>
                  ))}

                  {!isLoading && history.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => router.push(`/generate/${item.id}/view`)}
                      className="border border-border/60 bg-card hover:bg-card/85 hover:border-primary/30 transition-all rounded-xl flex flex-col cursor-pointer select-none overflow-hidden shadow-xs hover:shadow-md group relative min-h-[220px]"
                    >
                      <div className="aspect-video relative bg-muted/30 border-b border-border/50 overflow-hidden flex items-center justify-center shrink-0">
                        <Slide
                          theme={item.theme}
                          slide_content={item.first_slide}
                        />

                        <div onClick={(e) => e.stopPropagation()} className="absolute top-2.5 right-2.5 z-20">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full text-foreground/75 bg-background/70 dark:bg-black/75 backdrop-blur-xs hover:text-foreground hover:bg-background border border-border/20 p-0 flex items-center justify-center cursor-pointer shadow-sm"
                              >
                                <MoreVertical size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 bg-popover border-border text-popover-foreground rounded-md p-1.5 shadow-2xl z-50">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.info("Preparing PDF download");
                                  setTimeout(() => {
                                    toast.success("PDF downloaded successfully (simulation).");
                                  }, 1000);
                                }}
                                className="cursor-pointer gap-2 py-2"
                              >
                                <FileDown size={14} />
                                <span>Download PDF</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const toastId = toast.loading("Converting presentation to PPTX");

                                  const fetchAndDownload = async () => {
                                    try {
                                      const res = await api.get(`/api/ppt/${item.id}`);
                                      const presentation = (res && res.data && res.data[0]) || res[0] || res;

                                      if (!presentation || !presentation.slides) {
                                        throw new Error("Presentation slides not found");
                                      }

                                      const blob = await api.post("/api/ppt/convert", {
                                        slides: presentation.slides
                                      }, {
                                        responseType: "blob"
                                      });
                                      const downloadUrl = window.URL.createObjectURL(blob);
                                      const link = document.createElement("a");
                                      link.href = downloadUrl;
                                      link.setAttribute("download", `${presentation.title || "presentation"}.pptx`);
                                      document.body.appendChild(link);
                                      link.click();
                                      link.parentNode.removeChild(link);
                                      window.URL.revokeObjectURL(downloadUrl);

                                      toast.success("PPTX downloaded successfully!");
                                    } catch (err) {
                                      console.error("Failed to convert slides to PowerPoint:", err);
                                      toast.error(err.message || "Failed to export slides to PPTX");
                                    } finally {
                                      toast.dismiss(toastId);
                                    }
                                  };

                                  fetchAndDownload();
                                }}
                                className="cursor-pointer gap-2 py-2"
                              >
                                <PresentationIcon size={14} />
                                <span>Download PPTX</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border" />

                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPresentationToDelete(item);
                                }}
                                className="cursor-pointer gap-2 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="flex-1 p-4 flex flex-col justify-between gap-1 overflow-hidden">
                        <div className="flex flex-col gap-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-medium tracking-wider uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border/50">
                              {item.theme || "Modern"}
                            </span>
                          </div>
                          <h3 className="font-semibold text-sm text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2 mt-1">
                            {item.title || "Untitled Presentation"}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1 font-light">
                            <FileText size={11} />
                            {item.slides_count || 0} Slides
                          </span>
                          <span className="flex items-center gap-1 hover:text-foreground transition-colors font-medium">
                            Open <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>) : (
            <LibraryDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
        </div>

        <Dialog
          open={presentationToDelete !== null}
          onOpenChange={(open) => {
            if (!open) setPresentationToDelete(null);
          }}
        >
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This will permanently delete the presentation <span className="font-semibold text-foreground">"{presentationToDelete?.title || "Untitled"}"</span> and all its slides. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setPresentationToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={async () => {
                  const item = presentationToDelete;
                  if (!item) return;
                  setDeleting(true)
                  const success = await deletePresentation(item.id);
                  if (success) {
                    setPresentationToDelete(null);
                  }
                  setDeleting(false)
                }}
                disabled={deleting}
              >
                {deleting ? <Loader size={18} className="animate-spin mx-[14.5px]" /> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2 className="animate-spin" size={30} />
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  );
}
