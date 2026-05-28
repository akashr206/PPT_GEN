"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Download, FileText, Presentation, FileQuestion, ArrowRight, Edit } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PPTGenerationBox } from "@/components/generate/ppt-generation-box";
import { OutlineReview } from "@/components/generate/detail/outline-review";
import { InteractionPanel } from "@/components/generate/detail/interaction-panel";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@/components/generate/detail/pdf-viewer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PPTDetailPage({ params }) {
  const unwrappedParams = use(params);
  const pptId = unwrappedParams?.id;
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [appState, setAppState] = useState("loading_outline");
  const [pptData, setPptData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState(null);
  const [messages, setMessages] = useState(null);

  const [editPrompt, setEditPrompt] = useState("");

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus === "unauthenticated") {
      router.push("/");
      return;
    }

    if (!pptId) return;

    const fetchPPT = async () => {
      try {
        const res = await api.get(`/api/ppt/${pptId}`);
        setPptData(res.data);

        const currentStatus = res.data.status;
        setStatus(currentStatus);

        if (currentStatus === "GENERATING_OUTLINE") {
          setAppState("loading_outline");
        } else if (currentStatus === "EDITING") {
          setAppState("outline_review");
        } else if (currentStatus === "DRAFT") {
          setAppState("outline_review");
        } else if (currentStatus === "BUILDING_PPT") {
          setAppState("building_ppt");
        } else if (currentStatus === "COMPLETED") {
          if (res.data.url) setPdfUrl(res.data.url);
          setAppState("viewing_pdf");
        } else if (currentStatus === "BUILD_FAILED") {
          toast.error("Presentation build failed. You can edit the outline and retry.");
          setAppState("outline_review");
        } else if (currentStatus === "FAILED") {
          toast.error("Generation failed.");
          setAppState("not_found");
        } else {
          if (res.data.url) {
            setPdfUrl(res.data.url);
            setAppState("viewing_pdf");
          } else {
            setAppState("outline_review");
          }
        }
        if (res.data.url)
          setPdfUrl(res.data.url);
      } catch (err) {
        console.error("Failed to fetch PPT details", err);
        if (err.status === 404) {
          setAppState("not_found");
        } else {
          toast.error("Failed to load presentation details.");
          router.push("/generate");
        }
      }
    };

    fetchPPT();
    fetchMessages()
  }, [pptId, authStatus, router]);

  useEffect(() => {
    if (!status || status === "DRAFT" || status === "COMPLETED" || status === "FAILED" || status === "BUILD_FAILED") {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const statusRes = await api.get(`/api/ppt/${pptId}/status`);
        const newStatus = typeof statusRes.data === 'string'
          ? statusRes.data
          : (statusRes.data.status || statusRes.data.data?.status);

        if (newStatus && newStatus !== "EDITING") {
          setIsUpdating(false);
        }

        if (newStatus && newStatus !== status) {
          if (newStatus === "DRAFT" || newStatus === "COMPLETED") {
            const fullRes = await api.get(`/api/ppt/${pptId}`);
            setPptData(fullRes.data);
            setStatus(fullRes.data.status);

            if (newStatus === "DRAFT") {
              setAppState("outline_review");
              fetchMessages();
            } else if (newStatus === "COMPLETED") {
              if (fullRes.data.url) setPdfUrl(fullRes.data.url);
              setAppState("viewing_pdf");
            }
          } else {
            setStatus(newStatus);

            if (newStatus === "GENERATING_OUTLINE" || newStatus === "EDITING") {
              setAppState("loading_outline");
            } else if (newStatus === "BUILDING_PPT") {
              setAppState("building_ppt");
            } else if (newStatus === "FAILED") {
              setAppState("not_found");
            } else if (newStatus === "BUILD_FAILED") {
              setAppState("outline_review");
              toast.error("Presentation build failed. You can edit the outline and retry.");
            }
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pptId, status]);

  const fetchMessages = async () => {
    try {
      const messageres = await api.get(`/api/ppt/${pptId}/messages`);
      const messageData = messageres.data || {};

      if (messageData.messages) {
        setMessages(messageData.messages);
      }
    } catch (err) {
      console.error("Failed to fetch initial status/messages", err);
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editPrompt.trim()) return;

    const userMessage = editPrompt;
    setMessages((prev) => [...prev, { role: "user", message: userMessage }]);

    setIsUpdating(true);
    setEditPrompt("");

    try {
      await api.post(`/api/ppt/${pptId}/regenerate`, { prompt: userMessage });
      setStatus("EDITING");
    } catch (err) {
      console.error("Regenerate error:", err);
      toast.error("Failed to request changes.");
    }
  };

  const handleBuildPPT = async () => {
    setAppState("building_ppt");
    setStatus("BUILDING_PPT");
    try {
      await api.post(`/api/ppt/build/${pptId}`);

    } catch (err) {
      console.error("Build error:", err);
      toast.error("Failed to start building presentation.");
      setAppState("outline_review");
      setStatus("DRAFT");
    }
  }; if (appState === "not_found") {
    return (
      <div className="w-full h-full min-h-[70vh] flex items-center justify-center text-foreground px-4 select-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-sm w-full bg-card border border-border rounded-xl p-8 text-center flex flex-col items-center shadow-sm"
        >
          <div className="mb-6 w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <FileQuestion size={24} />
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-foreground mb-2">
            Presentation Not Found
          </h2>

          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            The presentation you are looking for doesn't exist or may have been deleted.
          </p>

          <div className="w-full flex flex-col gap-2.5">
            <Button
              onClick={() => router.push("/generate")}
              className="w-full py-5 text-sm font-medium cursor-pointer"
            >
              Generate New Presentation
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/generate")}
              className="w-full py-5 text-sm font-medium cursor-pointer"
            >
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (appState === "building_ppt") {
    return (
      <div className="max-w-4xl mx-auto h-full flex flex-col justify-center px-4">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-semibold text-foreground mb-2">Building your Presentation</h2>
          <p className="text-muted-foreground">Our AI is designing your slides. This may take a moment...</p>
        </div>
        <PPTGenerationBox />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden select-none relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes sweep {
          0% {
            transform: translate(-150%, -150%) rotate(45deg);
          }
          100% {
            transform: translate(150%, 150%) rotate(45deg);
          }
        }
        .sweep-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(139, 92, 246, 0.005) 30%,
            rgba(139, 92, 246, 0.08) 50%,
            rgba(139, 92, 246, 0.005) 70%,
            transparent 100%
          );
          animation: sweep 3.5s infinite ease-in-out;
          pointer-events: none;
        }
      `}} />

      {/* LEFT PANE: Outline or Loading Skeleton */}
      {appState === "loading_outline" || authStatus === "loading" || !pptData ? (
        <div className="w-full flex-1 flex flex-col p-4 md:p-8 pb-[280px] md:pb-8 border-b md:border-b-0 md:border-r border-border min-h-0 shrink-0 md:shrink relative overflow-hidden">
          <div className="sweep-glow" />

          <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="space-y-2.5 flex-1">
              <Skeleton className="h-7 md:h-8 w-1/2 max-w-[280px] bg-muted/40 rounded-lg" />
              <Skeleton className="h-4 w-1/3 max-w-[180px] bg-muted/20 rounded-md" />
            </div>
            <Skeleton className="h-9 w-9 bg-muted/30 rounded-lg shrink-0" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center bg-background/50 rounded-2xl border border-border overflow-hidden relative p-8 w-full h-full min-h-[40vh] md:min-h-0">
            <div className="w-full max-w-[800px] aspect-[16/9] bg-card/25 border border-border/30 rounded-xl p-6 flex flex-col justify-between shrink-0 relative overflow-hidden shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]">
              <div className="sweep-glow" />
              <div className="space-y-3 relative z-10">
                <Skeleton className="h-5 w-1/4 bg-muted/30 rounded-md" />
                <Skeleton className="h-7 w-3/4 max-w-[450px] bg-muted/40 rounded-lg animate-pulse" />
              </div>
              <div className="space-y-2 my-4 relative z-10">
                <Skeleton className="h-3.5 w-full bg-muted/15 rounded-md" />
                <Skeleton className="h-3.5 w-11/12 bg-muted/10 rounded-md" />
                <Skeleton className="h-3.5 w-5/6 bg-muted/5 rounded-md" />
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border/20 relative z-10">
                <Skeleton className="h-5 w-20 bg-muted/20 rounded-md" />
                <Skeleton className="h-5 w-24 bg-muted/30 rounded-md" />
              </div>
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/90 px-2.5 py-1.5 rounded-full border border-border backdrop-blur-md z-10 shadow-sm">
              <Skeleton className="h-4 w-4 rounded-full bg-muted/30" />
              <Skeleton className="h-3.5 w-12 bg-muted/40 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-full bg-muted/30" />
            </div>
          </div>
        </div>
      ) : (
        <div className={`w-full flex-1 flex flex-col border-b md:border-b-0 md:border-r border-border relative min-h-0 shrink-0 md:shrink ${appState === "viewing_pdf"
          ? "p-2.5 sm:p-4 md:p-8 overflow-hidden pb-4 md:pb-8"
          : "p-4 md:p-8 overflow-y-auto pb-[280px] md:pb-8"
          }`}>

          <div className={`mb-3 md:mb-6 flex ${appState === "viewing_pdf"
            ? "flex-row items-center justify-between gap-2"
            : "flex-col sm:flex-row sm:items-center justify-between gap-3"
            }`}>
            <div className={appState === "viewing_pdf" ? "min-w-0 flex-1 pr-2" : ""}>
              <h1 className={`${appState === "viewing_pdf"
                ? "text-base md:text-2xl font-bold text-foreground truncate"
                : "text-xl md:text-2xl font-bold text-foreground"
                }`}>{pptData?.title || "Untitled Presentation"}</h1>
              <p className="text-muted-foreground text-[10px] md:text-sm mt-0.5 md:mt-1 truncate">
                {appState === "viewing_pdf" ? (
                  <span>{pptData?.slides?.length || 0} Slides</span>
                ) : (
                  <span>Theme: {pptData?.theme || "Modern"} • {pptData?.slides?.length || 0} Slides</span>
                )}
              </p>
            </div>
            {appState === "viewing_pdf" ? (
              <div className="flex gap-1.5 items-center shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setAppState("outline_review")}
                  className="border-border text-foreground hover:bg-accent hover:text-accent-foreground text-xs h-8 px-2.5 md:text-sm md:h-10 md:px-4 shrink-0"
                >
                  <Edit className="mr-1.5 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" /> Edit PPT
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 md:h-10 md:w-10 shrink-0">
                      <Download size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[200px]">
                    <DropdownMenuItem
                      onClick={async () => {
                        const response = await fetch(pdfUrl);
                        const blob = await response.blob();

                        const url = URL.createObjectURL(blob);

                        const a = document.createElement("a");
                        a.href = url;
                        a.download = pptData.title.split(" ").join("_") + ".pdf";
                        a.click();

                        URL.revokeObjectURL(url);
                      }}
                      className="cursor-pointer">
                      <FileText size={14} className="mr-2" /> Download as PDF
                    </DropdownMenuItem>
                    {pptData?.ppt_url && (
                      <DropdownMenuItem onClick={async () => {
                        const response = await fetch(pptData.ppt_url);
                        const blob = await response.blob();

                        const url = URL.createObjectURL(blob);

                        const a = document.createElement("a");
                        a.href = url;
                        a.download = pptData.title.split(" ").join("_") + ".pptx";
                        a.click();

                        URL.revokeObjectURL(url);
                      }} className="cursor-pointer">
                        <Presentation size={14} className="mr-2" /> Download as PPTX
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  onClick={() => setAppState("viewing_pdf")}
                  disabled={!pdfUrl}
                  className="border-border text-foreground hover:bg-accent hover:text-accent-foreground w-fit"
                >
                  <Presentation className="mr-2 h-4 w-4" /> View PPT
                </Button>
              </div>
            )}
          </div>

          {appState === "outline_review" && (
            <OutlineReview isUpdating={isUpdating} pptData={pptData} />
          )}

          {appState === "viewing_pdf" && (
            <div className="flex-1 flex flex-col relative min-h-0 h-full w-full">
              {isUpdating ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-background/50 rounded-2xl border border-border overflow-hidden relative p-8 w-full h-full min-h-[40vh] md:min-h-0 select-none animate-pulse">
                  <div className="sweep-glow" />

                  <div className="w-full max-w-[800px] aspect-[16/9] bg-card/25 border border-border/30 rounded-xl p-6 flex flex-col justify-between shrink-0 relative overflow-hidden shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]">
                    <div className="sweep-glow" />
                    <div className="space-y-3 relative z-10">
                      <Skeleton className="h-5 w-1/4 bg-muted/30 rounded-md" />
                      <Skeleton className="h-7 w-3/4 max-w-[450px] bg-muted/40 rounded-lg animate-pulse" />
                    </div>
                    <div className="space-y-2 my-4 relative z-10">
                      <Skeleton className="h-3.5 w-full bg-muted/15 rounded-md" />
                      <Skeleton className="h-3.5 w-11/12 bg-muted/10 rounded-md" />
                      <Skeleton className="h-3.5 w-5/6 bg-muted/5 rounded-md" />
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border/20 relative z-10">
                      <Skeleton className="h-5 w-20 bg-muted/20 rounded-md" />
                      <Skeleton className="h-5 w-24 bg-muted/30 rounded-md" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-primary/95 text-primary-foreground px-3.5 py-1.5 rounded-full border border-primary/20 backdrop-blur-md z-10 shadow-lg text-xs font-semibold tracking-wide">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Regenerating...</span>
                  </div>
                </div>
              ) : (
                <PDFViewer
                  pdfUrl={pdfUrl}
                  pageNumber={pageNumber}
                  numPages={numPages}
                  setPageNumber={setPageNumber}
                  setNumPages={setNumPages}
                />
              )}
            </div>
          )}
        </div>
      )}

      {appState !== "viewing_pdf" && (
        <InteractionPanel
          appState={appState}
          status={status}
          isUpdating={isUpdating}
          editPrompt={editPrompt}
          setEditPrompt={setEditPrompt}
          handleEditSubmit={handleEditSubmit}
          handleBuildPPT={handleBuildPPT}
          messages={messages}
        />
      )}
    </div>
  );
}