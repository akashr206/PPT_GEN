"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Presentation, ArrowRight, Loader2, FileText, MoreVertical, Trash2, FileDown, Presentation as PresentationIcon } from "lucide-react";
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

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { history, isLoading, deletePresentation, refreshHistory } = useHistory();
  const [presentationToDelete, setPresentationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Presentations</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base font-light">
            Create, view, and manage your AI-generated slide decks.
          </p>
        </div>

        <div className="md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">

          {!isLoading && history.length > 0 && (
            <Link href="/generate" className="h-full">
              <motion.div
                whileHover={{ y: -4 }}
                className="h-full border-2 border-dashed border-border hover:border-muted-foreground/30 bg-card/30 hover:bg-card/60 transition-all rounded-md flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none group"
              >
                <div className="w-12 h-12 rounded-full border border-border group-hover:border-muted-foreground/20 bg-muted/20 group-hover:bg-muted/40 transition-colors flex items-center justify-center mb-3">
                  <Plus size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">New Presentation</h3>
                <p className="text-xs text-muted-foreground mt-1 font-light">Design a brand new slide deck</p>
              </motion.div>
            </Link>
          )}

          {isLoading && Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-full border border-border bg-card rounded-2xl p-5 flex flex-col justify-between shadow-sm animate-pulse">
              <div className="space-y-3 flex-1">
                <Skeleton className="h-24 w-full bg-muted/30 rounded-xl" />
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
              className="border border-border bg-card hover:bg-card/80 transition-all rounded-md flex flex-col cursor-pointer select-none overflow-hidden shadow-sm group hover:shadow-md relative"
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
                    <DropdownMenuContent align="end" className="w-44 bg-popover border-border text-popover-foreground rounded-xl p-1.5 shadow-2xl z-50">
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
                              // Fetch full presentation to get all slides
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

        {!isLoading && history.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-12 text-center py-16 border border-border/60 dark:border-border/30 bg-gradient-to-b from-card/60 to-card/20 rounded-[32px] backdrop-blur-md max-w-lg mx-auto flex flex-col items-center p-8 md:p-10 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group/empty"
          >
            {/* Soft decorative glow behind icon */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 dark:bg-blue-950/80 bg-blue-500/50 rounded-full blur-3xl pointer-events-none group-hover/empty:bg-blue-500/35 dark:group-hover/empty:bg-blue-950/50 transition-colors duration-300" />

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5 border border-primary/20 dark:border-primary/30 flex items-center justify-center text-primary mb-6 relative shadow-inner group-hover/empty:scale-105 transition-transform duration-300">
              <Presentation size={28} className="text-primary drop-shadow-[0_2px_8px_rgba(var(--primary),0.3)]" />
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-300" />
            </div>

            <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">No presentations yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-8 font-light leading-relaxed">
              Unlock the power of AI to design stunning slide decks. Tell us your topic and watch the magic happen in seconds.
            </p>

            <Link href="/generate" className="w-full sm:w-auto">
              <Button className="rounded-md p-4 font-medium text-sm cursor-pointer transition-all w-full sm:w-auto flex items-center justify-center gap-2 group/btn bg-primary text-primary-foreground hover:bg-primary/90">
                <span>Create First Presentation</span>
                <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1 duration-300" />
              </Button>
            </Link>
          </motion.div>
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
