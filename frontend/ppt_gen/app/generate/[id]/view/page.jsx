"use client";

import React, { useState, useEffect, use, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Loader2,
    Layout,
    Plus,
    ChevronLeft,
    ChevronRight,
    Undo,
    Redo,
    FolderOpen,
    SlidersHorizontal,
    Diamond,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Slide from "@/components/templates/Slide";
import { toast } from "sonner";
import { extractSlideData } from "@/utils/extractor";
import api from "@/lib/api";

import LibrarySidebar from "./components/LibrarySidebar";
import LayoutSelectorModal from "./components/LayoutSelectorModal";
import SlideThumbnails from "./components/SlideThumbnails";

const CURSOR_LEFT = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none'><path d='M19 12H5M12 19l-7-7 7-7' stroke='black' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><path d='M19 12H5M12 19l-7-7 7-7' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>") 16 16, w-resize`;
const CURSOR_RIGHT = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none'><path d='M5 12h14M12 5l7 7-7 7' stroke='black' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><path d='M5 12h14M12 5l7 7-7 7' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>") 16 16, e-resize`;

export default function PPTSlidesViewerPage({ params }) {
    const unwrappedParams = use(params);
    const pptId = unwrappedParams?.id;
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();

    const [pptData, setPptData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [editableSlides, setEditableSlides] = useState([]);
    const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [isExtractingPPTX, setIsExtractingPPTX] = useState(false);

    const searchParams = useSearchParams();
    const isGeneratingParam = searchParams?.get("generating") === "true";

    // Detect if page was reloaded to prevent triggering new stream / generation on reload
    const [isReloaded] = useState(() => {
        if (typeof window === "undefined") return false;
        const navigationEntries =
            window.performance?.getEntriesByType?.("navigation");
        return (
            navigationEntries &&
            navigationEntries.length > 0 &&
            navigationEntries[0].type === "reload"
        );
    });

    const [isStreamGenerating, setIsStreamGenerating] = useState(
        isGeneratingParam && !isReloaded,
    );
    const isBusy = isStreamGenerating || isGeneratingPDF || isExtractingPPTX;

    // Undo / Redo history state
    const [past, setPast] = useState([]);
    const [future, setFuture] = useState([]);

    const editableSlidesRef = useRef(editableSlides);
    const pastRef = useRef(past);
    const futureRef = useRef(future);
    const activeSlideIndexRef = useRef(activeSlideIndex);

    useEffect(() => {
        editableSlidesRef.current = editableSlides;
    }, [editableSlides]);

    useEffect(() => {
        pastRef.current = past;
    }, [past]);

    useEffect(() => {
        futureRef.current = future;
    }, [future]);

    useEffect(() => {
        activeSlideIndexRef.current = activeSlideIndex;
    }, [activeSlideIndex]);

    const isFirstLoadRef = useRef(true);

    // Image fetching states
    const [fetchedImages, setFetchedImages] = useState({});
    const [imageLoading, setImageLoading] = useState({});
    const fetchQueueRef = useRef(new Set());

    // Unified Library Sidebar states
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [libraryActiveTab, setLibraryActiveTab] = useState("images");
    const [imageEditContext, setImageEditContext] = useState(null);
    const [libraryIconCallback, setLibraryIconCallback] = useState(null);

    const fetchImage = useCallback(async (key, query) => {
        setImageLoading((prev) => ({ ...prev, [key]: true }));
        let finalImageUrl = null;
        try {
            const res = await api.get(`/api/ppt/images/search`, {
                params: { description: query },
            });
            if (res?.success && res.data && res.data.length > 0) {
                finalImageUrl = res.data[0].imageURL;
                setFetchedImages((prev) => ({ ...prev, [key]: finalImageUrl }));
            } else {
                throw new Error("No images found in search results");
            }
        } catch (err) {
            console.error(`Failed to fetch image for key ${key}:`, err);
            // Fallback placeholder
            finalImageUrl = `https://picsum.photos/seed/${encodeURIComponent(query)}/800/600`;
            setFetchedImages((prev) => ({ ...prev, [key]: finalImageUrl }));
        } finally {
            setImageLoading((prev) => ({ ...prev, [key]: false }));

            if (finalImageUrl) {
                const keyParts = key.split("_");
                const sIndex = parseInt(keyParts[1], 10);

                const updateSlideImage = (slidesList) => {
                    if (!slidesList || !slidesList[sIndex]) return slidesList;
                    const updated = [...slidesList];
                    if (keyParts.length === 2) {
                        // Slide level image split / overlay
                        updated[sIndex] = {
                            ...updated[sIndex],
                            image: finalImageUrl,
                            imageDescription: query,
                        };
                    } else if (
                        keyParts.length === 4 &&
                        keyParts[2] === "item"
                    ) {
                        // Item level image grid
                        const iIndex = parseInt(keyParts[3], 10);
                        if (
                            updated[sIndex].items &&
                            updated[sIndex].items[iIndex]
                        ) {
                            const updatedItems = [...updated[sIndex].items];
                            updatedItems[iIndex] = {
                                ...updatedItems[iIndex],
                                image: finalImageUrl,
                                imageDescription: query,
                            };
                            updated[sIndex] = {
                                ...updated[sIndex],
                                items: updatedItems,
                            };
                        }
                    }
                    return updated;
                };

                setEditableSlides((prev) => updateSlideImage(prev));
                setPptData((prev) => {
                    if (!prev || !prev.slides) return prev;
                    return {
                        ...prev,
                        slides: updateSlideImage(prev.slides),
                    };
                });
            }
        }
    }, []);

    useEffect(() => {
        if (!editableSlides || editableSlides.length === 0) return;

        editableSlides.forEach((slide, sIndex) => {
            const isImageCategory =
                slide.layout?.category === "images" ||
                slide.layout?.category === "image";
            if (!isImageCategory) return;

            const lType = slide.layout?.type;

            if (lType === "split" || lType === "overlay") {
                const sKey = `slide_${sIndex}`;
                const hasUrl =
                    slide.image &&
                    (slide.image.startsWith("http://") ||
                        slide.image.startsWith("https://"));
                const query = hasUrl
                    ? null
                    : slide.imageDescription || slide.image;

                if (query && !fetchQueueRef.current.has(sKey)) {
                    fetchQueueRef.current.add(sKey);
                    fetchImage(sKey, query);
                }
            } else if (lType === "grid") {
                if (slide.items) {
                    slide.items.forEach((item, iIndex) => {
                        const itemKey = `slide_${sIndex}_item_${iIndex}`;
                        const hasUrl =
                            item.image &&
                            (item.image.startsWith("http://") ||
                                item.image.startsWith("https://"));
                        const query = hasUrl
                            ? null
                            : item.imageDescription || item.image;

                        if (query && !fetchQueueRef.current.has(itemKey)) {
                            fetchQueueRef.current.add(itemKey);
                            fetchImage(itemKey, query);
                        }
                    });
                }
            }
        });
    }, [editableSlides, fetchImage]);

    const resolveSlideContent = useCallback(
        (slide, index) => {
            if (!slide) return null;

            const resolved = { ...slide };
            const sKey = `slide_${index}`;

            if (fetchedImages[sKey]) {
                resolved.image = fetchedImages[sKey];
            }
            if (imageLoading[sKey]) {
                resolved.imageLoading = true;
            }

            if (resolved.items) {
                resolved.items = resolved.items.map((item, itemIdx) => {
                    const itemKey = `slide_${index}_item_${itemIdx}`;
                    const newItem = { ...item };
                    if (fetchedImages[itemKey]) {
                        newItem.image = fetchedImages[itemKey];
                    }
                    if (imageLoading[itemKey]) {
                        newItem.imageLoading = true;
                    }
                    return newItem;
                });
            }

            return resolved;
        },
        [fetchedImages, imageLoading],
    );

    const handleEditImage = useCallback((context) => {
        setImageEditContext(context);
        setLibraryActiveTab("images");
        setIsLibraryOpen(true);
    }, []);

    const handleSelectSidebarIcon = useCallback(
        (iconName) => {
            if (libraryIconCallback) {
                libraryIconCallback(iconName);
            }
        },
        [libraryIconCallback],
    );

    useEffect(() => {
        const handleOpenLibraryEvent = (e) => {
            const { tab, onSelectIcon } = e.detail;
            setLibraryActiveTab(tab || "images");
            if (onSelectIcon) {
                setLibraryIconCallback(() => onSelectIcon);
            }
            setIsLibraryOpen(true);
        };
        window.addEventListener("trigger-open-library", handleOpenLibraryEvent);
        return () =>
            window.removeEventListener(
                "trigger-open-library",
                handleOpenLibraryEvent,
            );
    }, []);

    const handleSelectSidebarImage = useCallback(
        (imageUrl, queryStr) => {
            if (
                !imageEditContext ||
                !editableSlides ||
                !editableSlides[activeSlideIndex]
            )
                return;

            const updatedSlides = [...editableSlides];
            const slide = updatedSlides[activeSlideIndex];

            if (imageEditContext.type === "slide") {
                slide.image = imageUrl;
                slide.imageDescription = queryStr;
            } else if (
                imageEditContext.type === "item" &&
                imageEditContext.itemIndex !== undefined
            ) {
                const itemIndex = imageEditContext.itemIndex;
                if (slide.items && slide.items[itemIndex]) {
                    slide.items[itemIndex] = {
                        ...slide.items[itemIndex],
                        image: imageUrl,
                        imageDescription: queryStr,
                    };
                }
            }

            const cacheKey =
                imageEditContext.type === "slide"
                    ? `slide_${activeSlideIndex}`
                    : `slide_${activeSlideIndex}_item_${imageEditContext.itemIndex}`;

            setFetchedImages((prev) => ({ ...prev, [cacheKey]: imageUrl }));

            updateSlidesState(updatedSlides);
            toast.success("Image updated successfully");
        },
        [imageEditContext, editableSlides, activeSlideIndex],
    );

    const presentationRef = useRef(null);

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

    // Redirect reloads back to /generate (only if we were in generating mode)
    useEffect(() => {
        if (isReloaded && isGeneratingParam) {
            router.replace("/generate");
        }
    }, [isReloaded, isGeneratingParam, router]);

    // Handle warning before reload / tab close during generation
    useEffect(() => {
        if (!isStreamGenerating) return;

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue =
                "Reloading will abort the generation. Are you sure you want to leave?";
            return e.returnValue;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isStreamGenerating]);

    const handlePresent = useCallback(async () => {
        if (presentationRef.current) {
            try {
                if (document.fullscreenElement) {
                    await document.exitFullscreen();
                } else {
                    await presentationRef.current.requestFullscreen();
                }
            } catch (err) {
                console.error("Error attempting to enable fullscreen:", err);
                toast.error(
                    "Fullscreen presentation not supported or blocked.",
                );
            }
        }
    }, []);

    const updateSlidesState = (newSlides) => {
        setPast((prev) => [
            ...prev,
            JSON.parse(JSON.stringify(editableSlidesRef.current)),
        ]);
        setFuture([]);
        setEditableSlides(newSlides);
        setPptData((prev) => ({
            ...prev,
            slides: newSlides,
        }));
    };

    const handleUndo = useCallback(() => {
        const currentPast = pastRef.current;
        if (currentPast.length === 0) return;

        const previous = currentPast[currentPast.length - 1];

        // Find modified slide index to set as active
        const currentSlides = editableSlidesRef.current;
        let diffIndex = -1;
        if (currentSlides && previous) {
            for (
                let i = 0;
                i < Math.min(currentSlides.length, previous.length);
                i++
            ) {
                if (
                    JSON.stringify(currentSlides[i]) !==
                    JSON.stringify(previous[i])
                ) {
                    diffIndex = i;
                    break;
                }
            }
            if (diffIndex === -1) {
                diffIndex = Math.min(
                    previous.length - 1,
                    Math.max(
                        0,
                        Math.min(currentSlides.length, previous.length),
                    ),
                );
            }
        } else {
            diffIndex = 0;
        }

        const executeUndo = () => {
            const latestPast = pastRef.current;
            if (latestPast.length === 0) return;
            const latestPrevious = latestPast[latestPast.length - 1];
            const newPast = latestPast.slice(0, latestPast.length - 1);

            setPast(newPast);
            setFuture((prev) => [
                JSON.parse(JSON.stringify(editableSlidesRef.current)),
                ...prev,
            ]);

            setEditableSlides(latestPrevious);
            setPptData((prev) => ({
                ...prev,
                slides: latestPrevious,
            }));
        };

        // UX: If current active slide is not the modified slide, first take them there and perform undo after a brief delay
        if (activeSlideIndexRef.current !== diffIndex) {
            setActiveSlideIndex(diffIndex);
            setTimeout(() => {
                executeUndo();
            }, 300);
        } else {
            executeUndo();
        }
    }, []);

    const handleRedo = useCallback(() => {
        const currentFuture = futureRef.current;
        if (currentFuture.length === 0) return;

        const next = currentFuture[0];

        // Find modified slide index to set as active
        const currentSlides = editableSlidesRef.current;
        let diffIndex = -1;
        if (currentSlides && next) {
            for (
                let i = 0;
                i < Math.min(currentSlides.length, next.length);
                i++
            ) {
                if (
                    JSON.stringify(currentSlides[i]) !== JSON.stringify(next[i])
                ) {
                    diffIndex = i;
                    break;
                }
            }
            if (diffIndex === -1) {
                diffIndex = Math.min(
                    next.length - 1,
                    Math.max(0, Math.min(currentSlides.length, next.length)),
                );
            }
        } else {
            diffIndex = 0;
        }

        const executeRedo = () => {
            const latestFuture = futureRef.current;
            if (latestFuture.length === 0) return;
            const latestNext = latestFuture[0];
            const newFuture = latestFuture.slice(1);

            setFuture(newFuture);
            setPast((prev) => [
                ...prev,
                JSON.parse(JSON.stringify(editableSlidesRef.current)),
            ]);

            setEditableSlides(latestNext);
            setPptData((prev) => ({
                ...prev,
                slides: latestNext,
            }));
        };

        // UX: If current active slide is not the modified slide, first take them there and perform redo after a brief delay
        if (activeSlideIndexRef.current !== diffIndex) {
            setActiveSlideIndex(diffIndex);
            setTimeout(() => {
                executeRedo();
            }, 300);
        } else {
            executeRedo();
        }
    }, []);

    useEffect(() => {
        if (pptData?.slides && isFirstLoadRef.current) {
            setEditableSlides(JSON.parse(JSON.stringify(pptData.slides)));
            isFirstLoadRef.current = false;
        }
    }, [pptData]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isBusy) {
                return;
            }
            // Check for Undo / Redo shortcuts
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

            // Do not trigger slide change if user is typing in an input or editable element
            if (
                e.target.tagName === "INPUT" ||
                e.target.tagName === "TEXTAREA" ||
                e.target.isContentEditable
            ) {
                return;
            }

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

    const initialDataRef = useRef(null);

    useEffect(() => {
        if (authStatus === "loading") return;
        if (authStatus === "unauthenticated") {
            router.push("/");
            return;
        }

        if (!pptId) return;

        // Skip fetching presentation from database on mount if we are actively generating it.
        // The SSE streaming connection will initialize the record, and the complete event will trigger final refetch.
        if (isStreamGenerating) {
            setPptData({ id: pptId, title: "Generating", slides: [] });
            setIsLoading(false);
            return;
        }

        let active = true;

        const fetchPPT = async () => {
            setIsLoading((prev) => (prev !== true ? true : prev));
            try {
                const res = await api.get(`/api/ppt/${pptId}`);
                if (!active) return;
                if (res?.data && res.data.length > 0) {
                    const presentation = res.data[0];
                    setPptData(presentation);
                    initialDataRef.current = JSON.stringify(presentation);
                } else {
                    toast.error("Presentation not found");
                }
            } catch (err) {
                console.error("Failed to fetch presentation:", err);
                if (active) {
                    toast.error(err.message || "Failed to load presentation");
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        fetchPPT();

        return () => {
            active = false;
        };
    }, [pptId, authStatus, router, isStreamGenerating]);

    // Effect to handle Server-Sent Events (SSE) streaming during generation via fetch
    useEffect(() => {
        if (!pptId || !isStreamGenerating || !session?.accessToken) return;

        let active = true;
        const abortController = new AbortController();

        const startStream = async () => {
            const token = session.accessToken;

            // Extract generation parameters from URL
            const promptParam = searchParams?.get("prompt") || "";
            const toneParam = searchParams?.get("tone") || "";
            const slidesCountParam = searchParams?.get("slidesCount") || "";
            const layoutStyleParam = searchParams?.get("layoutStyle") || "";

            const backendUrl =
                process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
            const streamUrl =
                `${backendUrl.replace(/\/$/, "")}/api/ppt/stream/${pptId}?` +
                `prompt=${encodeURIComponent(promptParam)}` +
                `&tone=${encodeURIComponent(toneParam)}` +
                `&slidesCount=${encodeURIComponent(slidesCountParam)}` +
                `&layoutStyle=${encodeURIComponent(layoutStyleParam)}`;

            console.log(
                `[Stream] Establishing fetch stream connection to: ${streamUrl}`,
            );

            try {
                const response = await fetch(streamUrl, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: abortController.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let buffer = "";

                while (active) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop();

                    for (const line of lines) {
                        const cleanLine = line.trim();
                        if (!cleanLine) continue;

                        if (cleanLine.startsWith("event: complete")) {
                            handleComplete();
                            break;
                        } else if (cleanLine.startsWith("event: error")) {
                            handleError();
                            break;
                        } else if (cleanLine.startsWith("data: ")) {
                            try {
                                const data = JSON.parse(cleanLine.slice(6));
                                if (data.slides && Array.isArray(data.slides)) {
                                    setEditableSlides(data.slides);
                                    setPptData((prev) => ({
                                        ...prev,
                                        slides: data.slides,
                                    }));
                                    if (data.slides.length > 0) {
                                        setActiveSlideIndex(
                                            data.slides.length - 1,
                                        );
                                    }
                                }
                            } catch (e) {
                                console.error(
                                    "[Stream] Error parsing SSE chunk:",
                                    e,
                                );
                            }
                        }
                    }
                }
            } catch (err) {
                if (active && err.name !== "AbortError") {
                    console.error("[Stream] SSE connection error:", err);
                    handleError();
                }
            }
        };

        const handleComplete = () => {
            if (!active) return;
            console.log("[Stream] Complete event received.");
            toast.success("Presentation generated successfully!");
            setIsStreamGenerating(false);
            clearQueryParams();

            // Refetch final DB representation of the presentation (sets parsed images, author, author details, status)
            const refetch = async () => {
                try {
                    const res = await api.get(`/api/ppt/${pptId}`);
                    if (res?.data && res.data.length > 0) {
                        const presentation = res.data[0];
                        setPptData(presentation);
                        setEditableSlides(presentation.slides || []);
                        initialDataRef.current = JSON.stringify(presentation);
                    }
                } catch (err) {
                    console.error(
                        "[Stream] Failed refetching presentation on complete:",
                        err,
                    );
                }
            };
            refetch();
        };

        const handleError = () => {
            if (!active) return;
            toast.error("Generation failed. Please try again or check prompt.");
            setIsStreamGenerating(false);
            clearQueryParams();
        };

        const clearQueryParams = () => {
            const url = new URL(window.location.href);
            url.searchParams.delete("generating");
            url.searchParams.delete("prompt");
            url.searchParams.delete("tone");
            url.searchParams.delete("slidesCount");
            url.searchParams.delete("layoutStyle");
            window.history.replaceState({}, "", url.pathname);
        };

        startStream();

        return () => {
            active = false;
            abortController.abort();
        };
    }, [pptId, isStreamGenerating, session?.accessToken]);

    // Debounced auto-save to backend database whenever pptData changes
    useEffect(() => {
        if (!pptData || isLoading || !pptId || !initialDataRef.current) return;
        if (isStreamGenerating) return; // Do not auto-save while actively receiving SSE stream

        const currentDataStr = JSON.stringify(pptData);
        if (currentDataStr === initialDataRef.current) return;

        const delayDebounce = setTimeout(async () => {
            try {
                await api.patch(`/api/ppt/${pptId}`, {
                    theme: pptData.theme,
                    slides: pptData.slides,
                });
                initialDataRef.current = currentDataStr;
            } catch (err) {
                console.error(
                    "Failed to auto-save presentation to backend:",
                    err,
                );
                toast.error(
                    err.message || "Failed to save presentation changes",
                );
            }
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [pptData, isLoading, pptId, isStreamGenerating]);

    const handleDownloadAsPPT = async (e) => {
        const toastId = toast.loading(
            "Preparing slides for PowerPoint export",
        );

        // 1. Mount the full-size slides off-screen
        setIsExtractingPPTX(true);

        // 2. Give the browser time to render the hidden slides at full size (1280x720)
        await new Promise((resolve) => setTimeout(resolve, 800));

        try {
            // 3. Extract layout data from the full-size elements
            const allSlidesData = [];
            for (let i = 0; i < editableSlides.length; i++) {
                const element = document.getElementById(`pptx-slide-${i}`);
                if (!element) {
                    throw new Error(
                        `Failed to find off-screen slide container for slide ${i + 1}`,
                    );
                }
                const slideData = await extractSlideData(
                    element.firstChild || element,
                );
                allSlidesData.push(slideData);
            }

            // 4. Send the request to backend
            const blob = await api.post(
                "/api/ppt/convert",
                {
                    slides: allSlidesData,
                },
                {
                    responseType: "blob",
                },
            );
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute(
                "download",
                `${pptData?.title || "presentation"}.pptx`,
            );
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            toast.success("PPTX downloaded successfully!");
        } catch (err) {
            console.error("Failed to convert slides to PowerPoint:", err);
            toast.error(err.message || "Failed to export slides to PPTX");
        } finally {
            setIsExtractingPPTX(false);
            toast.dismiss(toastId);
        }
    };

    const handleLayoutChange = (category, type) => {
        if (!editableSlides || !editableSlides[activeSlideIndex]) return;

        const updatedSlides = [...editableSlides];
        updatedSlides[activeSlideIndex] = {
            ...updatedSlides[activeSlideIndex],
            layout: {
                category: category,
                type: type,
            },
        };

        updateSlidesState(updatedSlides);
        toast.success(`Layout changed to ${category} (${type})`);
    };

    const handleUpdateSlide = (field, value) => {
        if (!editableSlides || !editableSlides[activeSlideIndex]) return;

        const updatedSlides = [...editableSlides];
        updatedSlides[activeSlideIndex] = {
            ...updatedSlides[activeSlideIndex],
            [field]: value,
        };

        updateSlidesState(updatedSlides);
    };

    const handleUpdateItem = (itemIndex, field, value) => {
        if (!editableSlides || !editableSlides[activeSlideIndex]) return;

        const updatedSlides = [...editableSlides];
        const slide = updatedSlides[activeSlideIndex];
        if (!slide.items) slide.items = [];

        const updatedItems = [...slide.items];
        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            [field]: value,
        };

        updatedSlides[activeSlideIndex] = {
            ...slide,
            items: updatedItems,
        };

        updateSlidesState(updatedSlides);
    };

    const handleAddItem = () => {
        if (!editableSlides || !editableSlides[activeSlideIndex]) return;

        const updatedSlides = [...editableSlides];
        const slide = updatedSlides[activeSlideIndex];
        const currentItems = slide.items || [];

        if (currentItems.length >= 10) {
            toast.error("Maximum of 10 points allowed per slide");
            return;
        }

        updatedSlides[activeSlideIndex] = {
            ...slide,
            items: [
                ...currentItems,
                { header: "New Item", description: "Item description" },
            ],
        };

        updateSlidesState(updatedSlides);
    };

    const handleAddItemAtIndex = (itemIndex, direction) => {
        if (!editableSlides || !editableSlides[activeSlideIndex]) return;

        const updatedSlides = [...editableSlides];
        const slide = updatedSlides[activeSlideIndex];
        const currentItems = [...(slide.items || [])];

        if (currentItems.length >= 10) {
            toast.error("Maximum of 10 points allowed per slide");
            return;
        }

        const newItem = {
            header: "New Point",
            description: "Point description",
        };
        const insertIndex = direction === "before" ? itemIndex : itemIndex + 1;
        currentItems.splice(insertIndex, 0, newItem);

        updatedSlides[activeSlideIndex] = {
            ...slide,
            items: currentItems,
        };

        updateSlidesState(updatedSlides);
    };

    const handleDeleteItem = (itemIndex) => {
        if (!editableSlides || !editableSlides[activeSlideIndex]) return;

        const updatedSlides = [...editableSlides];
        const slide = updatedSlides[activeSlideIndex];
        if (!slide.items) return;

        const updatedItems = slide.items.filter((_, idx) => idx !== itemIndex);

        updatedSlides[activeSlideIndex] = {
            ...slide,
            items: updatedItems,
        };

        updateSlidesState(updatedSlides);
    };

    // Synchronize information with the header/navbar
    useEffect(() => {
        if (pptData) {
            const timer = setTimeout(() => {
                const event = new CustomEvent("ppt-info-changed", {
                    detail: {
                        title: pptData.title || "Untitled Presentation",
                        appState: "viewing_slides",
                        theme: pptData.theme || "sunset",
                        isBusy: isBusy,
                    },
                });
                window.dispatchEvent(event);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [pptData, isBusy]);

    useEffect(() => {
        const handleRequest = () => {
            if (pptData) {
                setTimeout(() => {
                    const event = new CustomEvent("ppt-info-changed", {
                        detail: {
                            title: pptData.title || "Untitled Presentation",
                            appState: "viewing_slides",
                            theme: pptData.theme || "sunset",
                            isBusy: isBusy,
                        },
                    });
                    window.dispatchEvent(event);
                }, 0);
            }
        };

        const handlePDF = () => {
            if (isBusy) return;
            setIsGeneratingPDF(true);
        };

        const handlePPT = (e) => {
            if (isBusy) return;
            handleDownloadAsPPT(e);
        };

        const handleTheme = (e) => {
            if (isBusy) return;
            if (e.detail && e.detail.theme) {
                const newTheme = e.detail.theme;
                setPptData((prev) => ({ ...prev, theme: newTheme }));
                toast.success(`Theme updated to ${newTheme}`);
            }
        };

        const handlePresentEvent = () => {
            if (isBusy) return;
            handlePresent();
        };

        window.addEventListener("request-ppt-info", handleRequest);
        window.addEventListener("trigger-download-pdf", handlePDF);
        window.addEventListener("trigger-download-pptx", handlePPT);
        window.addEventListener("trigger-change-theme", handleTheme);
        window.addEventListener("trigger-present", handlePresentEvent);

        return () => {
            window.removeEventListener("request-ppt-info", handleRequest);
            window.removeEventListener("trigger-download-pdf", handlePDF);
            window.removeEventListener("trigger-download-pptx", handlePPT);
            window.removeEventListener("trigger-change-theme", handleTheme);
            window.removeEventListener("trigger-present", handlePresentEvent);
        };
    }, [pptData, handleDownloadAsPPT, handlePresent, isBusy]);

    useEffect(() => {
        if (!isGeneratingPDF) return;

        let active = true;

        const generate = async () => {
            const toastId = toast.loading(
                "Preparing slides for high-res PDF export",
            );

            // Give browser time to render the hidden slides
            await new Promise((resolve) => setTimeout(resolve, 800));

            if (!active) return;

            try {
                const { jsPDF } = await import("jspdf");
                const html2canvas = (await import("html2canvas-pro")).default;

                const pdf = new jsPDF({
                    orientation: "landscape",
                    unit: "px",
                    format: [1280, 720],
                });

                for (let i = 0; i < editableSlides.length; i++) {
                    if (!active) return;

                    const element = document.getElementById(`pdf-slide-${i}`);
                    if (!element) {
                        console.error(`Element pdf-slide-${i} not found`);
                        continue;
                    }

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

                    if (i > 0) {
                        pdf.addPage([1280, 720], "landscape");
                    }
                    pdf.addImage(imgData, "JPEG", 0, 0, 1280, 720);
                }

                if (!active) return;
                pdf.save(`${pptData?.title || "presentation"}.pdf`);
                toast.success("PDF Downloaded successfully!");
            } catch (err) {
                console.error("PDF generation failed:", err);
                if (active) {
                    toast.error("Failed to generate PDF. Please try again.");
                }
            } finally {
                toast.dismiss(toastId);
                if (active) {
                    setIsGeneratingPDF(false);
                }
            }
        };

        generate();

        return () => {
            active = false;
        };
    }, [isGeneratingPDF, editableSlides, pptData]);

    if (isLoading || authStatus === "loading") {
        return (
            <div className="w-full flex-1 flex flex-col justify-center items-center p-8 min-h-[60vh]">
                <div className="w-full max-w-[1000px] aspect-[16/9] bg-card/25 border border-border/30 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
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
            {/* Top Toolbar Panel */}
            <div className="w-full h-12 relative bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 flex items-center justify-between px-6 z-20 shrink-0 select-none">
                <div className="flex items-center justify-between mx-auto w-full max-w-5xl gap-2">
                    <div className="flex gap-2">
                        {/* Undo Button */}
                        <button
                            onClick={handleUndo}
                            disabled={past.length === 0 || isBusy}
                            className="h-8 w-8 rounded-md bg-secondary/50 hover:bg-secondary disabled:opacity-50 text-secondary-foreground flex items-center justify-center transition-colors cursor-pointer border border-border/50 shadow-sm disabled:cursor-not-allowed"
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo size={14} className="text-primary" />
                        </button>
                        {/* Redo Button */}
                        <button
                            onClick={handleRedo}
                            disabled={future.length === 0 || isBusy}
                            className="h-8 w-8 rounded-md bg-secondary/50 hover:bg-secondary disabled:opacity-50 text-secondary-foreground flex items-center justify-center transition-colors cursor-pointer border border-border/50 shadow-sm disabled:cursor-not-allowed"
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo size={14} className="text-primary" />
                        </button>
                    </div>
                    <div className="flex gap-2 max-md:hidden text-xs">
                        {editableSlides &&
                            editableSlides[activeSlideIndex] &&
                            !["title", "titles"].includes(
                                editableSlides[
                                    activeSlideIndex
                                ].layout?.category?.toLowerCase(),
                            ) && (
                                <Button
                                    variant="outline"
                                    onClick={handleAddItem}
                                    className="cursor-pointer text-xs rounded-sm"
                                >
                                    <Plus size={14} />
                                    <span>Add Point</span>
                                </Button>
                            )}
                        <Button
                            variant="outline"
                            onClick={() => setIsLayoutModalOpen(true)}
                            className="cursor-pointer rounded-sm text-xs"
                        >
                            <Layout size={14} />
                            <span>Change Layout</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setLibraryActiveTab("images");
                                setLibraryIconCallback(null);
                                setImageEditContext(null);
                                setIsLibraryOpen(true);
                            }}
                            className="cursor-pointer rounded-sm text-xs"
                        >
                            <FolderOpen size={14} />
                            <span>Open Library</span>
                        </Button>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isBusy}
                                className="h-8 px-3 rounded-md bg-secondary/50 hover:bg-secondary text-secondary-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-medium border border-border/50 shadow-sm md:hidden"
                            >
                                <SlidersHorizontal
                                    size={13}
                                    className="text-primary"
                                />
                                <span>Slide Tools</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            className="min-w-[180px] bg-popover border-border text-popover-foreground rounded-md p-1.5 shadow-2xl z-50"
                        >
                            {editableSlides &&
                                editableSlides[activeSlideIndex] &&
                                !["title", "titles"].includes(
                                    editableSlides[
                                        activeSlideIndex
                                    ].layout?.category?.toLowerCase(),
                                ) && (
                                    <DropdownMenuItem
                                        onClick={handleAddItem}
                                        className="px-2.5 py-2 cursor-pointer flex items-center gap-2 text-sm rounded-md"
                                    >
                                        <Plus size={14} />
                                        <span>Add Point</span>
                                    </DropdownMenuItem>
                                )}
                            <DropdownMenuItem
                                onClick={() => setIsLayoutModalOpen(true)}
                                className="px-2.5 py-2 cursor-pointer flex items-center gap-2 text-sm rounded-md"
                            >
                                <Layout size={14} />
                                <span>Change Layout</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setLibraryActiveTab("images");
                                    setLibraryIconCallback(null);
                                    setImageEditContext(null);
                                    setIsLibraryOpen(true);
                                }}
                                className="px-2.5 py-2 cursor-pointer flex items-center gap-2 text-sm rounded-md"
                            >
                                <FolderOpen size={14} />
                                <span>Open Library</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {isStreamGenerating && (
                    <div className="absolute h-full w-full flex justify-center items-center bg-background/80">
                        <div className="flex gap-2 text-[11px] text-amber-500 font-medium">
                            <span>
                                AI is generating slides. Do not close or reload
                            </span>
                            <Diamond className="animate-spin w-4 h-4 shrink-0 p-px"></Diamond>
                        </div>
                    </div>
                )}
            </div>

            {/* Main content body below top panel */}
            <div className="w-full flex-1 flex flex-row min-h-0 relative overflow-hidden">
                {/* Left Panel: Main slide editor preview */}
                <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-8 min-h-0 overflow-y-auto">
                    <div className="flex-1 flex flex-col items-center justify-between md:justify-center w-full h-full p-2 sm:p-4 pb-4 md:pb-4 relative min-h-0">
                        <div className="w-full flex-1 md:flex-none flex flex-col items-center justify-center min-h-0 gap-3">
                            <div
                                ref={presentationRef}
                                className={`w-full relative group flex items-center justify-center ${isFullscreen ? "!max-w-none bg-black w-screen h-screen" : ""}`}
                                style={
                                    isFullscreen
                                        ? undefined
                                        : {
                                              maxWidth:
                                                  "min(1000px, 100%, calc(1.778 * (100vh - 240px)))",
                                          }
                                }
                            >
                                {!isFullscreen && (
                                    <button
                                        onClick={() =>
                                            setActiveSlideIndex((prev) =>
                                                Math.max(prev - 1, 0),
                                            )
                                        }
                                        disabled={
                                            activeSlideIndex === 0 || isBusy
                                        }
                                        className="absolute z-20 h-8 w-8 md:h-10 md:w-10 rounded-full bg-background/80 hover:bg-background border border-border text-foreground flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:!opacity-0 shadow-sm backdrop-blur-sm cursor-pointer -left-4 md:-left-12"
                                        title="Previous Slide (Left Arrow)"
                                    >
                                        <ChevronLeft
                                            size={20}
                                            className="mr-0.5"
                                        />
                                    </button>
                                )}

                                <div
                                    className={`w-full relative overflow-hidden ${isFullscreen ? "max-h-screen max-w-[calc(100vh*16/9)] bg-background" : "shadow-xl rounded-lg max-md:rounded-md overflow-hidden ring-1 ring-border/20"}`}
                                >
                                    {editableSlides &&
                                    editableSlides[activeSlideIndex] ? (
                                        <Slide
                                            slide_content={{
                                                ...resolveSlideContent(
                                                    editableSlides[
                                                        activeSlideIndex
                                                    ],
                                                    activeSlideIndex,
                                                ),
                                                theme:
                                                    pptData?.theme || "sunset",
                                            }}
                                            onUpdateSlide={
                                                isBusy
                                                    ? undefined
                                                    : handleUpdateSlide
                                            }
                                            onUpdateItem={
                                                isBusy
                                                    ? undefined
                                                    : handleUpdateItem
                                            }
                                            onDeleteItem={
                                                isBusy
                                                    ? undefined
                                                    : handleDeleteItem
                                            }
                                            onAddItem={
                                                isBusy
                                                    ? undefined
                                                    : handleAddItemAtIndex
                                            }
                                            onEditImage={
                                                isBusy
                                                    ? undefined
                                                    : handleEditImage
                                            }
                                        />
                                    ) : isStreamGenerating ? (
                                        <div className="w-full aspect-video bg-[#0d0d0d] flex flex-col items-center justify-center text-white gap-4 p-8 text-center rounded-xl border border-neutral-800">
                                            <Loader2 className="animate-spin text-primary w-8 h-8" />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-semibold text-neutral-200">
                                                    Generating presentation
                                                </p>
                                                <p className="text-xs text-neutral-500 max-w-sm">
                                                    Our AI is thinking and
                                                    preparing your slides. This
                                                    will take a few moments.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-video bg-[#0d0d0d] flex flex-col items-center justify-center text-neutral-500 rounded-xl border border-neutral-800">
                                            <p className="text-sm">
                                                No slides available
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {isFullscreen && (
                                    <>
                                        {/* Left half click area */}
                                        <div
                                            onClick={() =>
                                                setActiveSlideIndex((prev) =>
                                                    Math.max(prev - 1, 0),
                                                )
                                            }
                                            className="absolute left-0 top-0 w-1/2 h-full z-30"
                                            style={{
                                                cursor:
                                                    activeSlideIndex === 0
                                                        ? "default"
                                                        : CURSOR_LEFT,
                                            }}
                                            title="Previous Slide"
                                        />
                                        {/* Right half click area */}
                                        <div
                                            onClick={() =>
                                                setActiveSlideIndex((prev) =>
                                                    Math.min(
                                                        prev + 1,
                                                        editableSlides.length -
                                                            1,
                                                    ),
                                                )
                                            }
                                            className="absolute right-0 top-0 w-1/2 h-full z-30"
                                            style={{
                                                cursor:
                                                    activeSlideIndex ===
                                                    editableSlides.length - 1
                                                        ? "default"
                                                        : CURSOR_RIGHT,
                                            }}
                                            title="Next Slide"
                                        />
                                    </>
                                )}

                                {!isFullscreen && (
                                    <button
                                        onClick={() =>
                                            setActiveSlideIndex((prev) =>
                                                Math.min(
                                                    prev + 1,
                                                    editableSlides.length - 1,
                                                ),
                                            )
                                        }
                                        disabled={
                                            activeSlideIndex ===
                                                editableSlides.length - 1 ||
                                            isBusy
                                        }
                                        className="absolute z-20 h-8 w-8 md:h-10 md:w-10 rounded-full bg-background/80 hover:bg-background border border-border text-foreground flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:!opacity-0 shadow-sm backdrop-blur-sm cursor-pointer -right-4 md:-right-12"
                                        title="Next Slide (Right Arrow)"
                                    >
                                        <ChevronRight
                                            size={20}
                                            className="ml-0.5"
                                        />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Previews */}
                        <SlideThumbnails
                            editableSlides={editableSlides}
                            activeSlideIndex={activeSlideIndex}
                            setActiveSlideIndex={setActiveSlideIndex}
                            isBusy={isBusy}
                            theme={pptData?.theme || "sunset"}
                            resolveSlideContent={resolveSlideContent}
                        />
                    </div>
                </div>

                {/* Right Panel: Unified User Library */}
                <LibrarySidebar
                    isOpen={isLibraryOpen}
                    isBusy={isBusy}
                    imageEditContext={imageEditContext}
                    onSelectImage={handleSelectSidebarImage}
                    iconEditCallback={libraryIconCallback}
                    onSelectIcon={handleSelectSidebarIcon}
                    defaultTab={libraryActiveTab}
                    onClose={() => {
                        setIsLibraryOpen(false);
                        setImageEditContext(null);
                        setLibraryIconCallback(null);
                    }}
                />
            </div>

            {/* Layout Selector Modal */}
            <LayoutSelectorModal
                isOpen={isLayoutModalOpen}
                isBusy={isBusy}
                onClose={() => setIsLayoutModalOpen(false)}
                activeSlide={editableSlides[activeSlideIndex]}
                activeSlideIndex={activeSlideIndex}
                theme={pptData?.theme || "sunset"}
                resolveSlideContent={resolveSlideContent}
                onLayoutChange={handleLayoutChange}
            />

            {isGeneratingPDF && (
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
                    {editableSlides.map((slide, idx) => (
                        <div
                            key={idx}
                            id={`pdf-slide-${idx}`}
                            style={{
                                width: "1280px",
                                height: "720px",
                                overflow: "hidden",
                            }}
                        >
                            <Slide
                                slide_content={{
                                    ...resolveSlideContent(slide, idx),
                                    theme: pptData?.theme || "sunset",
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {isExtractingPPTX && (
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
                    {editableSlides.map((slide, idx) => (
                        <div
                            key={idx}
                            id={`pptx-slide-${idx}`}
                            style={{
                                width: "1280px",
                                height: "720px",
                                overflow: "hidden",
                            }}
                        >
                            <Slide
                                slide_content={{
                                    ...resolveSlideContent(slide, idx),
                                    theme: pptData?.theme || "sunset",
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
