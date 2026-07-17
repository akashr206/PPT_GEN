"use client";

import React, { useState, useEffect, use, useCallback, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import api from "@/lib/api";

import { useSlideEditor } from "@/hooks/use-slide-editor";
import { usePptData } from "@/hooks/use-ppt-data";
import { useImageFetcher } from "@/hooks/use-image-fetcher";
import { useLibrarySidebar } from "@/hooks/use-library-sidebar";
import { useExport } from "@/hooks/use-export";
import { useAutosave } from "@/hooks/use-autosave";

import ViewerToolbar from "@/components/generate/ViewerToolbar";
import SlideSettingsModal from "@/components/generate/SlideSettingsModal";
import EditWithAIModal from "@/components/generate/EditWithAIModal";

import SlideViewer from "./components/SlideViewer";
import SlideThumbnails from "./components/SlideThumbnails";
import LibrarySidebar from "./components/LibrarySidebar";
import HiddenRenderFrame from "./components/HiddenRenderFrame";

export default function PPTSlidesViewerPage({ params }) {
    const unwrappedParams = use(params);
    const pptId = unwrappedParams?.id;

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSlideSettingsOpen, setIsSlideSettingsOpen] = useState(false);
    const [isEditWithAIModalOpen, setIsEditWithAIModalOpen] = useState(false);
    const [editWithAIPrompt, setEditWithAIPrompt] = useState("");
    const [isEditWithAILoading, setIsEditWithAILoading] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Stable callbacks for opening modals — must be useCallback so they don't
    // create new references on every render (which would break React.memo on children)
    const openSettings = useCallback(() => setIsSlideSettingsOpen(true), []);
    const openEditWithAI = useCallback(() => setIsEditWithAIModalOpen(true), []);

    useEffect(() => {
        
        setIsTouchDevice(
            typeof window !== "undefined" &&
                ("ontouchstart" in window || navigator.maxTouchPoints > 0),
        );
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // --- Slide editor state & handlers ---
    const {
        pptData,
        setPptData,
        activeSlideIndex,
        setActiveSlideIndex,
        editableSlides,
        setEditableSlides,
        past,
        future,
        updateSlidesState,
        handleUndo,
        handleRedo,
        handleUpdateBlock,
        handleDeleteBlock,
        handleAddBlock,
        handleUpdateSlide,
        handleUpdateItem,
        handleSplitSlide,
        handleAddItemAtIndex,
        handleDeleteItem,
        handleAddSlide,
        handleDeleteSlide,
        handleMoveSlide,
        editableSlidesRef,
        activeSlideIndexRef,
    } = useSlideEditor(null, false /* isBusy assigned below */);

    // --- PPT data fetch + SSE stream ---
    const { isLoading, isStreamGenerating, initialDataRef } = usePptData({
        pptId,
        setPptData,
        setEditableSlides,
        setActiveSlideIndex,
    });

    // --- Export (PDF / PPTX) ---
    const { isGeneratingPDF, isExtractingPPTX, setIsGeneratingPDF, handleDownloadAsPPT } =
        useExport({
            editableSlides,
            pptData,
        });

    const isBusy = isStreamGenerating || isGeneratingPDF || isExtractingPPTX;

    // --- Auto-save slides to DB on every edit (debounced) ---
    useAutosave({ pptId, editableSlides, initialDataRef, isBusy });

    // --- Library sidebar ---
    const {
        isLibraryOpen,
        libraryActiveTab,
        imageEditContext,
        libraryIconCallback,
        openLibrary,
        openLibraryForImage,
        closeLibrary,
        handleSelectSidebarIcon,
    } = useLibrarySidebar();

    // --- Image fetching ---
    const { resolveSlideContent, handleEditImage, handleSelectSidebarImage } =
        useImageFetcher({
            editableSlides,
            setEditableSlides,
            setPptData,
            activeSlideIndex,
            updateSlidesState,
        });

    // Bridge: handleEditImage opens the library sidebar
    const handleEditImageBridged = useCallback(
        (context) => {
            handleEditImage(context, openLibraryForImage);
        },
        [handleEditImage, openLibraryForImage],
    );

    // Bridge: library image selection needs the current imageEditContext
    const handleSelectSidebarImageBridged = useCallback(
        (imageUrl, queryStr) => {
            handleSelectSidebarImage(imageUrl, queryStr, imageEditContext);
        },
        [handleSelectSidebarImage, imageEditContext],
    );

    // --- Keyboard shortcuts ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isBusy) return;
            const isUndo = (e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey;
            const isRedo =
                (e.ctrlKey || e.metaKey) &&
                (e.key === "y" || (e.shiftKey && e.key === "z"));

            if (isUndo) { e.preventDefault(); handleUndo(); return; }
            if (isRedo) { e.preventDefault(); handleRedo(); return; }

            if (
                e.target.tagName === "INPUT" ||
                e.target.tagName === "TEXTAREA" ||
                e.target.isContentEditable
            ) return;

            if (e.key === "ArrowRight") {
                setActiveSlideIndex((prev) =>
                    Math.min(prev + 1, editableSlides.length - 1),
                );
            } else if (e.key === "ArrowLeft") {
                setActiveSlideIndex((prev) => Math.max(prev - 1, 0));
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [editableSlides.length, handleUndo, handleRedo, isBusy]);

    // --- Sync info with header / navbar ---
    useEffect(() => {
        if (!pptData) return;
        const timer = setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("ppt-info-changed", {
                    detail: {
                        title: pptData.title || "Untitled Presentation",
                        appState: "viewing_slides",
                        theme: pptData.theme || "sunset",
                        isBusy,
                    },
                }),
            );
        }, 0);
        return () => clearTimeout(timer);
    }, [pptData, isBusy]);

    useEffect(() => {
        const handleRequest = () => {
            if (!pptData) return;
            setTimeout(() => {
                window.dispatchEvent(
                    new CustomEvent("ppt-info-changed", {
                        detail: {
                            title: pptData.title || "Untitled Presentation",
                            appState: "viewing_slides",
                            theme: pptData.theme || "sunset",
                            isBusy,
                        },
                    }),
                );
            }, 0);
        };

        const handlePDF = () => { if (!isBusy) setIsGeneratingPDF(true); };
        const handlePPT = (e) => { if (!isBusy) handleDownloadAsPPT(e); };
        const handleTheme = (e) => {
            if (isBusy) return;
            if (e.detail?.theme) {
                setPptData((prev) => ({ ...prev, theme: e.detail.theme }));
            }
        };

        window.addEventListener("request-ppt-info", handleRequest);
        window.addEventListener("trigger-download-pdf", handlePDF);
        window.addEventListener("trigger-download-pptx", handlePPT);
        window.addEventListener("trigger-change-theme", handleTheme);

        return () => {
            window.removeEventListener("request-ppt-info", handleRequest);
            window.removeEventListener("trigger-download-pdf", handlePDF);
            window.removeEventListener("trigger-download-pptx", handlePPT);
            window.removeEventListener("trigger-change-theme", handleTheme);
        };
    }, [pptData, isBusy, handleDownloadAsPPT]);

    // --- AI slide edit ---
    const handleEditSlideWithAI = useCallback(async () => {
        if (!editWithAIPrompt.trim()) {
            toast.error("Please enter a prompt.");
            return;
        }
        const activeIndex = activeSlideIndexRef.current;
        const currentSlides = editableSlidesRef.current;
        const activeSlide = currentSlides[activeIndex];

        setIsEditWithAILoading(true);
        const toastId = toast.loading("AI is editing your slide...");
        try {
            const res = await api.post(`/api/ppt/edit-slide`, {
                slide: activeSlide,
                prompt: editWithAIPrompt,
                presentationTitle: pptData?.title || "Presentation",
                slideTitles: currentSlides.map((s) => s.title || "Untitled Slide"),
                slideIndex: activeIndex,
            });
            if (res?.success && res.data) {
                const updatedSlides = [...currentSlides];
                updatedSlides[activeIndex] = res.data;
                updateSlidesState(updatedSlides);
                toast.success("AI successfully edited the Slide!");
                setIsEditWithAIModalOpen(false);
                setEditWithAIPrompt("");
            } else {
                throw new Error(res?.message || "Failed to edit slide");
            }
        } catch (err) {
            console.error("AI Slide Edit failed:", err);
            toast.error("Failed to edit slide with AI");
        } finally {
            setIsEditWithAILoading(false);
            toast.dismiss(toastId);
        }
    }, [editWithAIPrompt]);

    const theme = pptData?.theme || "sunset";
    const activeSlide = editableSlides?.[activeSlideIndex];

    // Both useMemo calls MUST live before any early returns (Rules of Hooks).
    // Memoize resolved content so SlideViewer's React.memo bailout works.
    const resolvedContent = useMemo(
        () => (activeSlide ? resolveSlideContent(activeSlide, activeSlideIndex) : null),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activeSlide, activeSlideIndex, resolveSlideContent],
    );

    // Memoize handler bundle — prevents new prop refs on every render.
    const slideViewerHandlers = useMemo(
        () => ({
            onUpdateSlide: isBusy ? undefined : handleUpdateSlide,
            onUpdateBlock: isBusy ? undefined : handleUpdateBlock,
            onDeleteBlock: isBusy ? undefined : handleDeleteBlock,
            onAddBlock: isBusy ? undefined : handleAddBlock,
            onUpdateItem: isBusy ? undefined : handleUpdateItem,
            onDeleteItem: isBusy ? undefined : handleDeleteItem,
            onAddItem: isBusy ? undefined : handleAddItemAtIndex,
            onEditImage: isBusy ? undefined : handleEditImageBridged,
            onSplitSlide: isBusy ? undefined : handleSplitSlide,
            onDeleteSlide: isBusy ? undefined : handleDeleteSlide,
        }),
        [
            isBusy,
            handleUpdateSlide, handleUpdateBlock, handleDeleteBlock, handleAddBlock,
            handleUpdateItem, handleDeleteItem, handleAddItemAtIndex,
            handleEditImageBridged, handleSplitSlide, handleDeleteSlide,
        ],
    );

    // --- Loading skeleton (early return AFTER all hooks) ---
    if (isLoading) {
        return (
            <div className="w-full flex-1 flex flex-col justify-center items-center p-8 min-h-[60vh]">
                <div className="w-full max-w-[1000px] aspect-[16/9] bg-card/25 border border-border/30 rounded-md p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-7 w-3/4 max-w-[450px]" />
                    </div>
                    <div className="space-y-2 my-4">
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-11/12" />
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border/20">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex-grow flex flex-col min-h-0 select-none overflow-hidden relative">
            <ViewerToolbar
                isBusy={isBusy}
                isStreamGenerating={isStreamGenerating}
                canUndo={past.length > 0}
                canRedo={future.length > 0}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onOpenSettings={openSettings}
                onOpenLibrary={openLibrary}
            />

            {/* Main content area */}
            <div className="w-full flex-1 flex flex-row min-h-0 relative overflow-hidden">
                {/* Left: slide editor + thumbnails */}
                <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-8 min-h-0 overflow-y-auto">
                    <div className="flex-1 flex flex-col items-center justify-between md:justify-center w-full h-full p-2 sm:p-4 pb-4 md:pb-4 relative min-h-0">
                        <div className="w-full flex-1 md:flex-none flex flex-col items-center justify-center min-h-0 gap-3">
                            <SlideViewer
                                editableSlides={editableSlides}
                                activeSlideIndex={activeSlideIndex}
                                setActiveSlideIndex={setActiveSlideIndex}
                                resolvedSlideContent={resolvedContent}
                                theme={theme}
                                isBusy={isBusy}
                                isStreamGenerating={isStreamGenerating}
                                isFullscreen={isFullscreen}
                                isTouchDevice={isTouchDevice}
                                onEditWithAI={openEditWithAI}
                                {...slideViewerHandlers}
                            />
                        </div>

                        <SlideThumbnails
                            editableSlides={editableSlides}
                            activeSlideIndex={activeSlideIndex}
                            setActiveSlideIndex={setActiveSlideIndex}
                            isBusy={isBusy}
                            theme={theme}
                            resolveSlideContent={resolveSlideContent}
                            handleAddSlide={handleAddSlide}
                            handleDeleteSlide={handleDeleteSlide}
                            handleMoveSlide={handleMoveSlide}
                        />
                    </div>
                </div>

                {/* Right: Library sidebar */}
                <LibrarySidebar
                    isOpen={isLibraryOpen}
                    isBusy={isBusy}
                    imageEditContext={imageEditContext}
                    onSelectImage={handleSelectSidebarImageBridged}
                    iconEditCallback={libraryIconCallback}
                    onSelectIcon={handleSelectSidebarIcon}
                    defaultTab={libraryActiveTab}
                    onClose={closeLibrary}
                />
            </div>

            {/* Modals */}
            <SlideSettingsModal
                isOpen={isSlideSettingsOpen}
                onOpenChange={setIsSlideSettingsOpen}
                activeSlideType={editableSlides?.[activeSlideIndex]?.type || "normal"}
                onUpdateSlide={handleUpdateSlide}
            />

            <EditWithAIModal
                isOpen={isEditWithAIModalOpen}
                onOpenChange={setIsEditWithAIModalOpen}
                prompt={editWithAIPrompt}
                setPrompt={setEditWithAIPrompt}
                isLoading={isEditWithAILoading}
                onApply={handleEditSlideWithAI}
            />

            {/* Off-screen export frames (only mounted during export) */}
            {isGeneratingPDF && (
                <HiddenRenderFrame
                    mode="pdf"
                    editableSlides={editableSlides}
                    resolveSlideContent={resolveSlideContent}
                    theme={theme}
                />
            )}
            {isExtractingPPTX && (
                <HiddenRenderFrame
                    mode="pptx"
                    editableSlides={editableSlides}
                    resolveSlideContent={resolveSlideContent}
                    theme={theme}
                />
            )}
        </div>
    );
}
