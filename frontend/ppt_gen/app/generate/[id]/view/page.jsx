"use client";

import React, {
    useState,
    useEffect,
    use,
    useCallback,
    useMemo,
    useRef,
} from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import api from "@/lib/api";

import { useSlideEditor, normalizeSlides, denormalizeSlide } from "@/hooks/use-slide-editor";
import { usePptData } from "@/hooks/use-ppt-data";
import { useImageFetcher } from "@/hooks/use-image-fetcher";
import { useMediaStore } from "@/hooks/use-media-store";
import { useLibrarySidebar } from "@/hooks/use-library-sidebar";
import { useExport } from "@/hooks/use-export";
import { useAutosave } from "@/hooks/use-autosave";
import { useHistoryStore } from "@/contexts/history-context";

import ViewerToolbar from "@/components/generate/ViewerToolbar";
import SlideSettingsSidebar from "@/components/generate/SlideSettingsSidebar";
import EditWithAIModal from "@/components/generate/EditWithAIModal";
import BlockLayoutSelectorModal from "@/components/generate/BlockLayoutSelectorModal";
import ThemeSidebar from "@/components/generate/ThemeSidebar";
import ShareModal from "@/components/generate/ShareModal";

import SlideViewer from "./components/SlideViewer";
import SlideThumbnails from "./components/SlideThumbnails";
import LibrarySidebar from "./components/LibrarySidebar";
import HiddenRenderFrame from "./components/HiddenRenderFrame";
import { usePathname } from "next/navigation";

export default function PPTSlidesViewerPage({ params }) {
    const unwrappedParams = use(params);
    const pptId = unwrappedParams.id;

    // --- Editor States ---
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSlideSettingsOpen, setIsSlideSettingsOpen] = useState(false);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const [isEditWithAIModalOpen, setIsEditWithAIModalOpen] = useState(false);
    const [editWithAIPrompt, setEditWithAIPrompt] = useState("");
    const [isEditWithAILoading, setIsEditWithAILoading] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isShareLoading, setIsShareLoading] = useState(false);
    const [isTouchDevice] = useState(() => {
        return (
            typeof window !== "undefined" &&
            ("ontouchstart" in window || navigator.maxTouchPoints > 0)
        );
    });
    const pathname = usePathname();

    const [blockLayoutModalState, setBlockLayoutModalState] = useState({
        isOpen: false,
        blockIndex: null,
        currentCategory: "",
        currentType: "",
        blockData: null,
        onSelect: null,
    });

    // --- Library sidebar ---
    const {
        isLibraryOpen,
        libraryActiveTab,
        imageEditContext,
        iconEditContext,
        libraryIconCallback,
        openLibrary,
        openLibraryForImage,
        closeLibrary,
        handleSelectSidebarIcon,
    } = useLibrarySidebar();

    // Stable callbacks for opening sidebars and modals
    const openSettings = useCallback(() => {
        setIsSlideSettingsOpen(true);
        setIsThemeModalOpen(false);
        closeLibrary();
    }, [closeLibrary]);

    const openThemeSelector = useCallback(() => {
        setIsThemeModalOpen(true);
        setIsSlideSettingsOpen(false);
        closeLibrary();
    }, [closeLibrary]);
    
    const handleOpenLibrary = useCallback(() => {
        openLibrary();
        setIsSlideSettingsOpen(false);
        setIsThemeModalOpen(false);
    }, [openLibrary]);

    const openEditWithAI = useCallback(
        () => setIsEditWithAIModalOpen(true),
        [],
    );

    const openShareModal = useCallback(() => {
        setIsShareModalOpen(true);
        setIsSlideSettingsOpen(false);
        setIsThemeModalOpen(false);
        closeLibrary();
    }, [closeLibrary]);

    useEffect(() => {
        const handleOpenShare = () => openShareModal();
        window.addEventListener("trigger-share-modal", handleOpenShare);
        return () => window.removeEventListener("trigger-share-modal", handleOpenShare);
    }, [openShareModal]);


    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
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
        handleSplitBlock,
        handleUpdateSlide,
        handleUpdateItem,
        handleSplitSlide,
        handleAddItemAtIndex,
        handleDeleteItem,
        handleAddSlide,
        handleDeleteSlide,
        handleMoveSlide,
        handleReplaceBlock,
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
    const {
        isGeneratingPDF,
        isExtractingPPTX,
        setIsGeneratingPDF,
        handleDownloadAsPPT,
    } = useExport({
        editableSlides,
        pptData,
    });

    const isBusy = isStreamGenerating || isGeneratingPDF || isExtractingPPTX;

    const handleToggleShare = useCallback(async (checked) => {
        setIsShareLoading(true);
        try {
            await api.post(`/api/ppt/${pptId}/share`, { is_shared: checked });
            setPptData((prev) => ({ ...prev, is_shared: checked }));
            toast.success(checked ? "Share link enabled!" : "Share link disabled.");
        } catch (err) {
            toast.error(err.message || "Failed to update sharing status.");
            console.error("Toggle share error:", err);
        } finally {
            setIsShareLoading(false);
        }
    }, [pptId, setPptData]);

    // --- Global Text Sizes ---
    const defaultTextSizes = { title: 2.8, subtitle: 2.0, heading: 1.8, description: 1.3 };
    const textSizes = pptData?.textSizes || defaultTextSizes;

    const handleUpdateTextSizes = useCallback(
        async (newSizes) => {
            setPptData((prev) => ({ ...prev, textSizes: newSizes }));
            try {
                const payloadSlides = JSON.parse(JSON.stringify(editableSlidesRef.current));
                if (payloadSlides.length > 0) {
                    payloadSlides[0].globalTextSizes = newSizes;
                }
                await api.patch(`/api/ppt/${pptId}`, { slides: payloadSlides });
            } catch (err) {
                console.error("[TextSizes] Failed to save text sizes:", err);
            }
        },
        [pptId, setPptData]
    );

    const handleThemeChange = useCallback(
        async (newTheme) => {
            if (isBusy) return;
            setPptData((prev) => ({ ...prev, theme: newTheme }));
            try {
                await api.patch(`/api/ppt/${pptId}`, { theme: newTheme });
                useHistoryStore
                    .getState()
                    .updateFirstSlide(
                        pptId,
                        undefined,
                        undefined,
                        newTheme,
                    );
                console.log("[Theme] Saved theme to database:", newTheme);
            } catch (err) {
                console.error("[Theme] Failed to save theme:", err);
            }
        },
        [pptId, isBusy, setPptData]
    );

    // --- Auto-save slides to DB on every edit (debounced) ---
    useAutosave({ pptId, editableSlides, initialDataRef, isBusy, textSizes });


    // --- Image fetching ---
    const { resolveSlideContent, handleEditImage, handleSelectSidebarImage } =
        useImageFetcher({
            editableSlides,
            setEditableSlides,
            setPptData,
            activeSlideIndex,
            updateSlidesState,
        });

    // --- Layout selector sidebar toggle & sync ---
    useEffect(() => {
        const handleOpenEvent = (e) => {
            closeLibrary(); // Close library sidebar if layout selector opens
            setBlockLayoutModalState({
                isOpen: true,
                blockIndex: e.detail.blockIndex,
                currentCategory: e.detail.currentCategory,
                currentType: e.detail.currentType,
                blockData: e.detail.blockData,
                onSelect: e.detail.onSelect,
            });
        };
        window.addEventListener(
            "trigger-open-block-layout-picker",
            handleOpenEvent,
        );
        return () =>
            window.removeEventListener(
                "trigger-open-block-layout-picker",
                handleOpenEvent,
            );
    }, [closeLibrary]);

    // Close layout selector if library sidebar opens
    useEffect(() => {
        if (isLibraryOpen) {
            const timer = setTimeout(() => {
                setBlockLayoutModalState((prev) => ({
                    ...prev,
                    isOpen: false,
                }));
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isLibraryOpen]);

    // One-time initialization guard to restore slide index from URL on load
    const isSlideInitializedRef = useRef(false);

    useEffect(() => {
        if (
            !isSlideInitializedRef.current &&
            editableSlides &&
            editableSlides.length > 0
        ) {
            const params = new URLSearchParams(window.location.search);
            const slideParam = params.get("slide");
            if (slideParam !== null) {
                const index = parseInt(slideParam, 10);
                if (
                    !isNaN(index) &&
                    index >= 0 &&
                    index < editableSlides.length
                ) {
                    setActiveSlideIndex(index);
                }
            }
            isSlideInitializedRef.current = true;
        }
    }, [editableSlides, setActiveSlideIndex]);

    // Update URL parameter when active slide index changes
    useEffect(() => {
        if (
            activeSlideIndex !== null &&
            editableSlides &&
            editableSlides.length > 0 &&
            isSlideInitializedRef.current
        ) {
            const params = new URLSearchParams(window.location.search);
            const currentParam = params.get("slide");
            const newParam = activeSlideIndex.toString();
            if (currentParam !== newParam) {
                params.set("slide", newParam);
                window.history.replaceState(
                    null,
                    "",
                    `${pathname}?${params.toString()}`,
                );
            }
        }
    }, [activeSlideIndex, editableSlides, pathname]);

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
            const isUndo =
                (e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey;
            const isRedo =
                (e.ctrlKey || e.metaKey) &&
                (e.key === "y" || (e.shiftKey && e.key === "z"));

            if (isUndo) {
                e.preventDefault();
                handleUndo();
                return;
            }
            if (isRedo) {
                e.preventDefault();
                handleRedo();
                return;
            }

            if (
                e.target.tagName === "INPUT" ||
                e.target.tagName === "TEXTAREA" ||
                e.target.isContentEditable
            )
                return;

            if (e.key === "ArrowRight") {
                setActiveSlideIndex((prev) =>
                    Math.min(prev + 1, editableSlides.length - 1),
                );
            } else if (e.key === "ArrowLeft") {
                setActiveSlideIndex((prev) => Math.max(prev - 1, 0));
            } else if ((e.ctrlKey || e.metaKey) && e.key === "v") {
                if (document.querySelector('.group\\/block.outline')) {
                    // A block is selected. Let ContentBlock's keydown handler deal with the paste.
                    return;
                }

                const copiedData = localStorage.getItem('ppt_copied_block');
                if (copiedData) {
                    try {
                        const parsedBlock = JSON.parse(copiedData);
                        const currentSlide = editableSlides[activeSlideIndexRef.current];
                        
                        // We can only paste on the slide if the slide's root block is empty
                        const isDefaultItem = currentSlide?.contentTree?.items?.length === 1 && currentSlide.contentTree.items[0]?.header === "New Point";
                        const isEmpty = currentSlide && currentSlide.contentTree && currentSlide.contentTree.type === 'leaf' && (!currentSlide.contentTree.layout || isDefaultItem || currentSlide.contentTree.items?.length === 0);

                        if (isEmpty) {
                            e.preventDefault();
                            handleReplaceBlock(currentSlide.contentTree.id, parsedBlock);
                            toast.success("Block pasted on slide successfully!");
                        } else {
                            e.preventDefault();
                            handleAddBlock(parsedBlock);
                            toast.success("Block pasted alongside existing content on the slide!");
                        }
                    } catch (error) {
                        console.error("Failed to parse copied block data", error);
                    }
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [editableSlides, activeSlideIndexRef, handleUndo, handleRedo, isBusy, handleReplaceBlock]);

    // Clean up copied block on mount/unmount
    useEffect(() => {
        localStorage.removeItem('ppt_copied_block');
        return () => localStorage.removeItem('ppt_copied_block');
    }, []);

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

        const handlePDF = () => {
            if (!isBusy) setIsGeneratingPDF(true);
        };
        const handlePPT = (e) => {
            if (!isBusy) handleDownloadAsPPT(e);
        };

        window.addEventListener("request-ppt-info", handleRequest);
        window.addEventListener("trigger-download-pdf", handlePDF);
        window.addEventListener("trigger-download-pptx", handlePPT);

        return () => {
            window.removeEventListener("request-ppt-info", handleRequest);
            window.removeEventListener("trigger-download-pdf", handlePDF);
            window.removeEventListener("trigger-download-pptx", handlePPT);
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
                slide: denormalizeSlide(activeSlide),
                prompt: editWithAIPrompt,
                presentationTitle: pptData?.title || "Presentation",
                slideTitles: currentSlides.map(
                    (s) => s.title || "Untitled Slide",
                ),
                slideIndex: activeIndex,
            });
            if (res?.success && res.data) {
                let updatedSlide = normalizeSlides([res.data])[0];

                const searchImages = useMediaStore.getState().searchImages;
                const searchIcons = useMediaStore.getState().searchIcons;

                const isRealUrl = (str) =>
                    str &&
                    (str.startsWith("http://") ||
                        str.startsWith("https://") ||
                        str.startsWith("data:") ||
                        str.startsWith("/") ||
                        str.startsWith("blob:"));

                const resolveNode = async (node) => {
                    if (!node) return;
                    if (node.type === "split") {
                        await Promise.all([resolveNode(node.first), resolveNode(node.second)]);
                    } else if (node.type === "leaf" || node.type === "content") {
                        if (node.items) {
                            for (const item of node.items) {
                                if (!item.icon && (item.iconKeywords || item.header)) {
                                    const query = item.iconKeywords || item.header;
                                    const data = await searchIcons(query);
                                    if (data && data.length > 0) {
                                        item.icon = data[0].name;
                                    } else {
                                        item.icon = "Star";
                                    }
                                }
                                if (item.image && !isRealUrl(item.image)) {
                                    const query = item.image || item.imageDescription || item.header;
                                    const data = await searchImages(query);
                                    if (data && data.length > 0) {
                                        item.image = data[0].imageURL;
                                    }
                                } else if (!item.image && (node.layout?.category === "images" || node.layout?.category === "image" || node.layout?.type === "image" || (node.layout?.category === "basic" && (node.layout?.type === "gallery" || node.layout?.type === "single")))) {
                                    const query = item.imageDescription || item.header || "placeholder";
                                    const data = await searchImages(query);
                                    if (data && data.length > 0) {
                                        item.image = data[0].imageURL;
                                    }
                                }
                            }
                        }
                    }
                };

                if (updatedSlide.contentTree) {
                    await resolveNode(updatedSlide.contentTree);
                }

                if (['full-image', 'split-left-image', 'split-right-image', 'top-image-banner'].includes(updatedSlide.type)) {
                    if (!isRealUrl(updatedSlide.image)) {
                        const query = updatedSlide.imageDescription || updatedSlide.image;
                        if (query) {
                            const data = await searchImages(query);
                            if (data && data.length > 0) {
                                updatedSlide.image = data[0].imageURL;
                            }
                        }
                    }
                }

                const updatedSlides = [...currentSlides];
                updatedSlides[activeIndex] = updatedSlide;
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
        () =>
            activeSlide
                ? resolveSlideContent(activeSlide, activeSlideIndex)
                : null,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activeSlide, activeSlideIndex, resolveSlideContent],
    );

    // Memoize handler bundle — prevents new prop refs on every render.
    const slideViewerHandlers = useMemo(
        () => ({
            onUpdateSlide: isBusy ? undefined : handleUpdateSlide,
            onUpdateBlock: isBusy ? undefined : handleUpdateBlock,
            onReplaceBlock: isBusy ? undefined : handleReplaceBlock,
            onDeleteBlock: isBusy ? undefined : handleDeleteBlock,
            onAddBlock: isBusy ? undefined : handleAddBlock,
            onSplitBlock: isBusy ? undefined : handleSplitBlock,
            onUpdateItem: isBusy ? undefined : handleUpdateItem,
            onDeleteItem: isBusy ? undefined : handleDeleteItem,
            onAddItem: isBusy ? undefined : handleAddItemAtIndex,
            onEditImage: isBusy ? undefined : handleEditImageBridged,
            onSplitSlide: isBusy ? undefined : handleSplitSlide,
            onDeleteSlide: isBusy ? undefined : handleDeleteSlide,
        }),
        [
            isBusy,
            handleUpdateSlide,
            handleUpdateBlock,
            handleReplaceBlock,
            handleDeleteBlock,
            handleAddBlock,
            handleSplitBlock,
            handleUpdateItem,
            handleDeleteItem,
            handleAddItemAtIndex,
            handleEditImageBridged,
            handleSplitSlide,
            handleDeleteSlide,
        ],
    );

    // --- Loading skeleton (early return AFTER all hooks) ---
    if (isLoading) {
        return (
            <div className="w-full flex-1 flex flex-col justify-center items-center p-8 min-h-[60vh]">
                <div className="w-full max-w-[1000px] aspect-video bg-card border border-border shadow-md rounded-md p-6 flex flex-col justify-between relative overflow-hidden">
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
        <div className="w-full grow flex flex-col min-h-0 select-none overflow-hidden relative">
            <ViewerToolbar
                isBusy={isBusy}
                isStreamGenerating={isStreamGenerating}
                canUndo={past.length > 0}
                canRedo={future.length > 0}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onOpenSettings={openSettings}
                onOpenLibrary={handleOpenLibrary}
                onOpenThemeSelector={openThemeSelector}
                themeName={theme}
            />

            {/* Main content area */}
            <div className="w-full flex-1 flex flex-row min-h-0 relative overflow-hidden">
                {/* Left: slide editor + thumbnails */}
                <div className="flex-1 flex flex-col items-center justify-center p-2 min-h-0 overflow-y-auto">
                    <div className="flex-1 flex flex-col items-center justify-between md:justify-center w-full h-full p-2 sm:p-4 pb-4 md:pb-4 relative min-h-0">
                        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-0 gap-3">
                            <SlideViewer
                                editableSlides={editableSlides}
                                activeSlideIndex={activeSlideIndex}
                                setActiveSlideIndex={setActiveSlideIndex}
                                resolvedSlideContent={resolvedContent}
                                resolveSlideContent={resolveSlideContent}
                                theme={theme}
                                isBusy={isBusy}
                                isStreamGenerating={isStreamGenerating}
                                isFullscreen={isFullscreen}
                                isTouchDevice={isTouchDevice}
                                onEditWithAI={openEditWithAI}
                                textSizes={textSizes}
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
                    iconEditContext={iconEditContext}
                    onSelectImage={handleSelectSidebarImageBridged}
                    iconEditCallback={libraryIconCallback}
                    onSelectIcon={handleSelectSidebarIcon}
                    defaultTab={libraryActiveTab}
                    onClose={closeLibrary}
                />

                <BlockLayoutSelectorModal
                    isOpen={blockLayoutModalState.isOpen}
                    onClose={() =>
                        setBlockLayoutModalState((prev) => ({
                            ...prev,
                            isOpen: false,
                        }))
                    }
                    currentCategory={blockLayoutModalState.currentCategory}
                    currentType={blockLayoutModalState.currentType}
                    blockData={blockLayoutModalState.blockData}
                    onSelect={blockLayoutModalState.onSelect}
                    theme={pptData?.theme || "default"}
                />
                
                {/* Sidebars */}
                <SlideSettingsSidebar
                    isOpen={isSlideSettingsOpen}
                    onClose={() => setIsSlideSettingsOpen(false)}
                    activeSlideType={
                        editableSlides?.[activeSlideIndex]?.type || "normal"
                    }
                    onUpdateSlide={handleUpdateSlide}
                    textSizes={textSizes}
                    onUpdateTextSizes={handleUpdateTextSizes}
                />

                <ThemeSidebar
                    isOpen={isThemeModalOpen}
                    onClose={() => setIsThemeModalOpen(false)}
                    currentTheme={theme}
                    isBusy={isBusy}
                    onThemeChange={handleThemeChange}
                />
            </div>

            {/* Modals */}

            <EditWithAIModal
                isOpen={isEditWithAIModalOpen}
                onOpenChange={setIsEditWithAIModalOpen}
                prompt={editWithAIPrompt}
                setPrompt={setEditWithAIPrompt}
                isLoading={isEditWithAILoading}
                onApply={handleEditSlideWithAI}
            />

            <ShareModal
                isOpen={isShareModalOpen}
                onOpenChange={setIsShareModalOpen}
                isShared={!!pptData?.is_shared}
                onToggleShare={handleToggleShare}
                isLoading={isShareLoading}
                shareUrl={typeof window !== "undefined" ? `${window.location.origin}/share/${pptId}` : ""}
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
