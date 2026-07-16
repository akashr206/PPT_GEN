"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Plus,
    ArrowRight,
    Loader2,
    FileText,
    MoreVertical,
    Trash2,
    FileDown,
    Presentation as PresentationIcon,
    Loader,
} from "lucide-react";
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
import Slide from "@/components/templates/Slide";

export default function PresentationsTab() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { history, isLoading, deletePresentation } = useHistory();
    const [presentationToDelete, setPresentationToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [pdfGeneratingData, setPdfGeneratingData] = useState(null);

    const viewMode = searchParams.get("view") || "grid";

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

    const handleDownloadPDF = async (item, e) => {
        if (e) e.stopPropagation();
        const toastId = toast.loading(`Preparing PDF for "${item.title || "Untitled"}"`);
        try {
            const res = await api.get(`/api/ppt/${item.id}`);
            const presentation = res?.data?.[0] || res?.data || res;
            console.log(presentation);
            
            if (!presentation || !presentation.slides) {
                throw new Error("Presentation slides not found");
            }
            
            setPdfGeneratingData({
                slides: presentation.slides,
                theme: presentation.theme || "light",
                title: presentation.title || "presentation",
                toastId
            });
        } catch (err) {
            console.error("Failed to fetch presentation for PDF:", err);
            toast.error("Failed to prepare PDF download.", { id: toastId });
        }
    };

    useEffect(() => {
        if (!pdfGeneratingData) return;
        
        let active = true;
        
        const generate = async () => {
            await new Promise((resolve) => setTimeout(resolve, 800));
            if (!active) return;
            
            try {
                const { jsPDF } = await import("jspdf");
                const html2canvas = (await import("html2canvas-pro")).default;
                console.log(pdfGeneratingData);
                
                const pdf = new jsPDF({
                    orientation: "landscape",
                    unit: "px",
                    format: [1280, 720],
                });
                
                for (let i = 0; i < pdfGeneratingData.slides.length; i++) {
                    if (!active) return;
                    
                    const element = document.getElementById(`pdf-export-slide-${i}`);
                    if (!element) continue;
                    
                    const canvas = await html2canvas(element, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        width: 1280,
                        height: 720,
                        windowWidth: 1280,
                        windowHeight: 720,
                    });
                    
                    if (!active) return;
                    const imgData = canvas.toDataURL("image/jpeg", 0.95);
                    
                    if (i > 0) pdf.addPage([1280, 720], "landscape");
                    pdf.addImage(imgData, "JPEG", 0, 0, 1280, 720);
                }
                
                if (!active) return;
                pdf.save(`${pdfGeneratingData.title}.pdf`);
                toast.success("PDF Downloaded successfully!", { id: pdfGeneratingData.toastId });
            } catch (err) {
                console.error("PDF generation failed:", err);
                if (active) toast.error("Failed to generate PDF.", { id: pdfGeneratingData.toastId });
            } finally {
                if (active) setPdfGeneratingData(null);
            }
        };
        
        generate();
        
        return () => {
            active = false;
        };
    }, [pdfGeneratingData]);

    return (
        <>
            {!isLoading && history.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-24 text-center px-4 border border-border/50 rounded-lg bg-card/25 dark:bg-zinc-950/10 backdrop-blur-md shadow-xs">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <PresentationIcon className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">Create your first presentation</h2>
                    <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-md">
                        Get started by entering a topic and letting our AI generate a complete, professional slide deck for you in seconds.
                    </p>
                    <Link href="/generate">
                        <Button className="cursor-pointer gap-2 rounded-full px-8 shadow-md hover:shadow-lg transition-all hover:scale-105" size="lg">
                            <Plus size={18} />
                            <span className="font-semibold">Create Presentation</span>
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    {viewMode === "list" ? (
                        /* Sleek List View */
                        <div className="w-full flex flex-col border border-border/50 rounded-lg bg-card/25 dark:bg-zinc-950/10 backdrop-blur-md overflow-hidden shadow-xs">
                    {/* Table Headers */}
                    <div className="grid grid-cols-12 px-6 py-3 border-b border-border/40 text-[10px] font-bold text-muted-foreground/85 tracking-wider uppercase bg-muted/10 select-none">
                        <div className="col-span-6 md:col-span-5 flex items-center">
                            Name
                        </div>
                        <div className="col-span-3 md:col-span-2 flex items-center">
                            Theme
                        </div>
                        <div className="col-span-3 md:col-span-2 flex items-center">
                            Slides
                        </div>
                        <div className="hidden md:col-span-2 md:flex items-center">
                            Last Modified
                        </div>
                        <div className="col-span-3 md:col-span-1 flex items-center justify-end">
                            Actions
                        </div>
                    </div>

                    <div className="divide-y divide-border/20">
                        {/* New Presentation Row */}
                        <Link href="/generate">
                            <div className="grid grid-cols-12 px-6 py-4 items-center hover:bg-muted/30 transition-colors cursor-pointer group">
                                <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg border border-dashed border-border/80 group-hover:border-primary/40 flex items-center justify-center bg-muted/10 transition-colors">
                                        <Plus
                                            size={16}
                                            className="text-muted-foreground group-hover:text-primary transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                                            New Presentation
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-light mt-0.5">
                                            Create a brand new slide deck
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-3 md:col-span-2 text-xs text-muted-foreground/60 font-light">
                                    —
                                </div>
                                <div className="col-span-3 md:col-span-2 text-xs text-muted-foreground/60 font-light">
                                    —
                                </div>
                                <div className="hidden md:col-span-2 md:block text-xs text-muted-foreground/60 font-light">
                                    —
                                </div>
                                <div className="col-span-3 md:col-span-1 flex items-center justify-end">
                                    <ArrowRight
                                        size={14}
                                        className="text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all"
                                    />
                                </div>
                            </div>
                        </Link>

                        {/* Loading placeholder rows */}
                        {isLoading &&
                            Array.from({ length: 3 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="grid grid-cols-12 px-6 py-4 items-center animate-pulse"
                                >
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
                        {!isLoading &&
                            history.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() =>
                                        router.push(`/generate/${item.id}/view`)
                                    }
                                    className="grid grid-cols-12 px-6 py-4 items-center hover:bg-muted/20 transition-colors cursor-pointer group"
                                >
                                    <div className="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
                                        {/* Slide thumbnail preview scaled down */}
                                        <div className="w-10 h-10 rounded-lg border border-border/60 bg-muted/20 overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative">
                                            <div className="scale-[0.25] origin-center w-[160px] h-[90px] shrink-0 pointer-events-none">
                                                <Slide
                                                    theme={item.theme}
                                                    slide_content={item.first_slide}
                                                />
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
                                        <FileText
                                            size={12}
                                            className="text-muted-foreground mr-1.5"
                                        />
                                        {item.slides_count || 0} Slides
                                    </div>

                                    {/* Date */}
                                    <div className="hidden md:col-span-2 md:flex items-center text-xs text-muted-foreground font-light">
                                        {formatDate(item.updated_at || item.created_at)}
                                    </div>

                                    {/* Actions dropdown */}
                                    <div
                                        className="col-span-3 md:col-span-1 flex items-center justify-end"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-full hover:bg-muted/80 cursor-pointer"
                                                >
                                                    <MoreVertical
                                                        size={14}
                                                        className="text-muted-foreground"
                                                    />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-44 bg-popover border-border text-popover-foreground rounded-md p-1.5 shadow-2xl z-50"
                                            >
                                                <DropdownMenuItem
                                                    onClick={(e) => handleDownloadPDF(item, e)}
                                                    className="cursor-pointer gap-2 py-2"
                                                >
                                                    <FileDown size={14} />
                                                    <span>Download PDF</span>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const toastId = toast.loading(
                                                            "Converting presentation to PPTX"
                                                        );

                                                        const fetchAndDownload = async () => {
                                                            try {
                                                                const res = await api.get(
                                                                    `/api/ppt/${item.id}`
                                                                );
                                                                const presentation =
                                                                    (res &&
                                                                        res.data &&
                                                                        res.data[0]) ||
                                                                    res[0] ||
                                                                    res;

                                                                if (
                                                                    !presentation ||
                                                                    !presentation.slides
                                                                ) {
                                                                    throw new Error(
                                                                        "Presentation slides not found"
                                                                    );
                                                                }

                                                                const blob = await api.post(
                                                                    "/api/ppt/convert",
                                                                    {
                                                                        slides: presentation.slides,
                                                                    },
                                                                    {
                                                                        responseType: "blob",
                                                                    }
                                                                );
                                                                const downloadUrl =
                                                                    window.URL.createObjectURL(
                                                                        blob
                                                                    );
                                                                const link =
                                                                    document.createElement(
                                                                        "a"
                                                                    );
                                                                link.href = downloadUrl;
                                                                link.setAttribute(
                                                                    "download",
                                                                    `${presentation.title || "presentation"}.pptx`
                                                                );
                                                                document.body.appendChild(
                                                                    link
                                                                );
                                                                link.click();
                                                                link.parentNode.removeChild(
                                                                    link
                                                                );
                                                                window.URL.revokeObjectURL(
                                                                    downloadUrl
                                                                );

                                                                toast.success(
                                                                    "PPTX downloaded successfully!"
                                                                );
                                                            } catch (err) {
                                                                console.error(
                                                                    "Failed to convert slides to PowerPoint:",
                                                                    err
                                                                );
                                                                toast.error(
                                                                        "Failed to export slides to PPTX"
                                                                );
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
                <div className="md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
                    {!isLoading && history.length > 0 && (
                        <Link href="/generate" className="h-full">
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="h-full border border-primary/20 hover:border-primary/50 bg-gradient-to-br from-primary/5 via-card to-card hover:bg-card transition-all rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none group min-h-[220px]"
                            >
                                <div className="w-12 h-12 rounded-full border border-primary/10 group-hover:border-primary/30 bg-primary/5 group-hover:bg-primary/10 transition-colors flex items-center justify-center mb-3">
                                    <Plus
                                        size={20}
                                        className="text-primary transition-colors"
                                    />
                                </div>
                                <h3 className="font-semibold text-sm text-foreground">
                                    New Presentation
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 font-light">
                                    Design a brand new slide deck
                                </p>
                            </motion.div>
                        </Link>
                    )}

                    {isLoading &&
                        Array.from({ length: 3 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="h-full border border-border bg-card rounded-lg p-5 flex flex-col justify-between shadow-sm animate-pulse min-h-[220px]"
                            >
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

                    {!isLoading &&
                        history.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                onClick={() =>
                                    router.push(`/generate/${item.id}/view`)
                                }
                                className="border border-border/60 bg-card hover:bg-card/85 hover:border-primary/30 transition-all rounded-lg flex flex-col cursor-pointer select-none overflow-hidden shadow-xs hover:shadow-md group relative min-h-[220px]"
                            >
                                <div className="aspect-video relative bg-muted/30 border-b border-border/50 overflow-hidden flex items-center justify-center shrink-0">
                                    <Slide
                                        theme={item.theme}
                                        slide_content={item.first_slide}
                                    />

                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute top-2.5 right-2.5 z-20"
                                    >
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
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-44 bg-popover border-border text-popover-foreground rounded-md p-1.5 shadow-2xl z-50"
                                            >
                                                <DropdownMenuItem
                                                    onClick={(e) => handleDownloadPDF(item, e)}
                                                    className="cursor-pointer gap-2 py-2"
                                                >
                                                    <FileDown size={14} />
                                                    <span>Download PDF</span>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const toastId = toast.loading(
                                                            "Converting presentation to PPTX"
                                                        );

                                                        const fetchAndDownload = async () => {
                                                            try {
                                                                const res = await api.get(
                                                                    `/api/ppt/${item.id}`
                                                                );
                                                                const presentation =
                                                                    (res &&
                                                                        res.data &&
                                                                        res.data[0]) ||
                                                                    res[0] ||
                                                                    res;

                                                                if (
                                                                    !presentation ||
                                                                    !presentation.slides
                                                                ) {
                                                                    throw new Error(
                                                                        "Presentation slides not found"
                                                                    );
                                                                }

                                                                const blob = await api.post(
                                                                    "/api/ppt/convert",
                                                                    {
                                                                        slides: presentation.slides,
                                                                    },
                                                                    {
                                                                        responseType: "blob",
                                                                    }
                                                                );
                                                                const downloadUrl =
                                                                    window.URL.createObjectURL(
                                                                        blob
                                                                    );
                                                                const link =
                                                                    document.createElement(
                                                                        "a"
                                                                    );
                                                                link.href = downloadUrl;
                                                                link.setAttribute(
                                                                    "download",
                                                                    `${presentation.title || "presentation"}.pptx`
                                                                );
                                                                document.body.appendChild(
                                                                    link
                                                                );
                                                                link.click();
                                                                link.parentNode.removeChild(
                                                                    link
                                                                );
                                                                window.URL.revokeObjectURL(
                                                                    downloadUrl
                                                                );

                                                                toast.success(
                                                                    "PPTX downloaded successfully!"
                                                                );
                                                            } catch (err) {
                                                                console.error(
                                                                    "Failed to convert slides to PowerPoint:",
                                                                    err
                                                                );
                                                                toast.error(
                                                                        "Failed to export slides to PPTX"
                                                                );
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
                                            Open{" "}
                                            <ArrowRight
                                                size={11}
                                                className="transition-transform group-hover:translate-x-0.5"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </div>
            )}
            </>
            )}

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
                            This will permanently delete the presentation{" "}
                            <span className="font-semibold text-foreground">
                                &quot;{presentationToDelete?.title || "Untitled"}&quot;
                            </span>{" "}
                            and all its slides. This action cannot be undone.
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
                                setDeleting(true);
                                const success = await deletePresentation(item.id);
                                if (success) {
                                    setPresentationToDelete(null);
                                }
                                setDeleting(false);
                            }}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <Loader
                                    size={18}
                                    className="animate-spin mx-[14.5px]"
                                />
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {pdfGeneratingData && (
                <div
                    style={{
                        position: "absolute",
                        left: "-9999px",
                        top: "-9999px",
                        width: "1280px",
                        zIndex: -9999,
                        pointerEvents: "none",
                    }}
                >
                    {pdfGeneratingData.slides.map((slide, i) => (
                        <div
                            key={i}
                            id={`pdf-export-slide-${i}`}
                            style={{
                                width: "1280px",
                                height: "720px",
                                overflow: "hidden",
                            }}
                        >
                            <Slide slide_content={slide} theme={pdfGeneratingData.theme} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
