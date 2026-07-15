"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import {
    Image as ImageIcon,
    Sparkles,
    Trash2,
    Upload,
    Search,
    Palette,
    Layout as LayoutIcon,
    Lock,
    Plus,
    Code,
    Copy,
    ExternalLink,
    Loader2,
    Check,
    Calendar,
    FileText,
    ArrowRight,
} from "lucide-react";
import * as phosphorIcons from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useThemes } from "@/hooks/use-themes";
import { useMediaStore } from "@/hooks/use-media-store";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function LibraryDashboard({
    activeTab: parentActiveTab,
    setActiveTab: setParentActiveTab,
}) {
    const activeTab =
        parentActiveTab === "uploads" || parentActiveTab === "pexels"
            ? "images"
            : parentActiveTab === "icons" || parentActiveTab === "system-icons"
              ? "icons"
              : parentActiveTab;

    // Images States
    const [pexelsQuery, setPexelsQuery] = useState("");
    const [pexelsResults, setPexResults] = useState([]);
    const [isSearchingPexels, setIsSearchingPexels] = useState(false);
    
    const searchImagesStore = useMediaStore(state => state.searchImages);
    const userImages = useMediaStore(state => state.userImages);
    const fetchUserImagesStore = useMediaStore(state => state.fetchUserImages);
    const userIcons = useMediaStore(state => state.userIcons);
    const fetchUserIconsStore = useMediaStore(state => state.fetchUserIcons);
    
    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Icons States
    const [systemIconQuery, setSystemIconQuery] = useState("");
    const [isLoadingIcons, setIsLoadingIcons] = useState(false);
    const [isUploadingIcon, setIsUploadingIcon] = useState(false);
    const [pastedSvg, setPastedSvg] = useState("");
    const [pastedIconName, setPastedIconName] = useState("");
    const [showPasteArea, setShowPasteArea] = useState(false);

    // Fetch User Images
    const fetchUserImages = useCallback(async (force = false) => {
        setIsLoadingImages(true);
        try {
            await fetchUserImagesStore(force);
        } catch (err) {
            console.error("Failed to fetch user images:", err);
            toast.error("Failed to load your images.");
        } finally {
            setIsLoadingImages(false);
        }
    }, [fetchUserImagesStore]);

    // Fetch User Icons
    const fetchUserIcons = useCallback(async (force = false) => {
        setIsLoadingIcons(true);
        try {
            await fetchUserIconsStore(force);
        } catch (err) {
            console.error("Failed to fetch user icons:", err);
            toast.error("Failed to load your icons.");
        } finally {
            setIsLoadingIcons(false);
        }
    }, [fetchUserIconsStore]);

    useEffect(() => {
        if (activeTab === "images") {
            fetchUserImages();
        } else if (activeTab === "icons") {
            fetchUserIcons();
        }
    }, [activeTab, fetchUserImages, fetchUserIcons]);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        const toastId = toast.loading(`Uploading ${file.name}...`);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await api.post("/api/library/images/upload", formData);
            if (res?.success) {
                toast.success("Image uploaded successfully!", { id: toastId });
                fetchUserImages(true);
            } else {
                throw new Error(res?.message || "Upload failed");
            }
        } catch (err) {
            console.error("Image upload failed:", err);
            toast.error("Failed to upload image.", {
                id: toastId,
            });
        } finally {
            setIsUploadingImage(false);
            e.target.value = "";
        }
    };

    const handleDeleteImage = async (id, e) => {
        if (e) e.stopPropagation();
        if (!confirm("Are you sure you want to delete this image?")) return;

        const toastId = toast.loading("Deleting image...");
        try {
            await api.delete(`/api/library/images/${id}`);
            toast.success("Image deleted successfully!", { id: toastId });
            fetchUserImages(true);
            if (previewImage?.id === id) {
                setPreviewImage(null);
            }
        } catch (err) {
            console.error("Failed to delete image:", err);
            toast.error("Failed to delete image.", { id: toastId });
        }
    };

    const handleSavePexelsToLibrary = async (imageUrl, imageName, e) => {
        if (e) e.stopPropagation();
        const toastId = toast.loading("Saving image to library uploads...");
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const filename = `${imageName.replace(/[^a-zA-Z0-9]/g, "_") || "pexels_image"}.jpg`;
            const file = new File([blob], filename, { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("file", file);

            const res = await api.post("/api/library/images/upload", formData);
            if (res?.success) {
                toast.success("Image saved to library uploads successfully!", {
                    id: toastId,
                });
                fetchUserImages(true);
            } else {
                throw new Error(res?.message || "Failed to save image");
            }
        } catch (err) {
            console.error("Failed to save Pexels image:", err);
            toast.error("Failed to save Pexels image to library.", {
                id: toastId,
            });
        }
    };

    // Pexels Search
    const handleSearchPexels = useCallback(async (query) => {
        if (!query || query.trim() === "") {
            setPexResults([]);
            return;
        }
        setIsSearchingPexels(true);
        try {
            const data = await searchImagesStore(query);
            setPexResults(data);
        } catch (err) {
            console.error("Failed to search Pexels:", err);
            setPexResults([]);
            toast.error("Failed to search images from Pexels.");
        } finally {
            setIsSearchingPexels(false);
        }
    }, [searchImagesStore]);

    const handleIconUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingIcon(true);
        const toastId = toast.loading(`Uploading icon ${file.name}...`);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", file.name);

            const res = await api.post("/api/library/icons/upload", formData);
            if (res?.success) {
                toast.success("Icon uploaded successfully!", { id: toastId });
                fetchUserIcons(true);
            } else {
                throw new Error(res?.message || "Upload failed");
            }
        } catch (err) {
            console.error("Icon upload failed:", err);
            toast.error("Failed to upload icon.", {
                id: toastId,
            });
        } finally {
            setIsUploadingIcon(false);
            e.target.value = "";
        }
    };

    const handlePasteIconSubmit = async (e) => {
        e.preventDefault();
        if (!pastedSvg.trim()) return;

        setIsUploadingIcon(true);
        const toastId = toast.loading("Saving custom SVG icon...");

        try {
            const iconName = pastedIconName.trim() || "Pasted Icon";
            const blob = new Blob([pastedSvg], { type: "image/svg+xml" });

            const formData = new FormData();
            formData.append(
                "file",
                blob,
                `${iconName.replace(/\s+/g, "_")}.svg`,
            );
            formData.append("name", iconName);

            const res = await api.post("/api/library/icons/upload", formData);
            if (res?.success) {
                toast.success("Custom SVG saved to library!", { id: toastId });
                setPastedSvg("");
                setPastedIconName("");
                setShowPasteArea(false);
                fetchUserIcons(true);
            } else {
                throw new Error(res?.message || "Upload failed");
            }
        } catch (err) {
            console.error("Pasted SVG upload failed:", err);
            toast.error("Failed to save SVG icon.", {
                id: toastId,
            });
        } finally {
            setIsUploadingIcon(false);
        }
    };

    const handleDeleteIcon = async (id, e) => {
        if (e) e.stopPropagation();
        if (!confirm("Are you sure you want to delete this custom icon?"))
            return;

        const toastId = toast.loading("Deleting icon...");
        try {
            await api.delete(`/api/library/icons/${id}`);
            toast.success("Icon deleted successfully!", { id: toastId });
            fetchUserIcons();
        } catch (err) {
            console.error("Failed to delete icon:", err);
            toast.error("Failed to delete icon.", { id: toastId });
        }
    };

    const handleCopyIconName = (name) => {
        navigator.clipboard.writeText(name);
        toast.success(`Copied icon name: "${name}"`);
    };

    // Filter Phosphor icons list for the system icons tab
    const filteredSystemIcons = useMemo(() => {
        const query = systemIconQuery.toLowerCase().trim();
        const allNames = Object.keys(phosphorIcons).filter((name) => {
            if (
                name === "default" ||
                name === "IconContext" ||
                name === "IconBase" ||
                !/^[A-Z]/.test(name) ||
                name.endsWith("Props")
            ) {
                return false;
            }

            // De-duplicate icons that are exported both as "Name" and "NameIcon"
            if (name.endsWith("Icon")) {
                const baseName = name.slice(0, -4);
                if (phosphorIcons[baseName] !== undefined) {
                    return false;
                }
            }

            return true;
        });
        if (!query) return allNames.slice(0, 72);
        return allNames
            .filter((name) => name.toLowerCase().includes(query))
            .slice(0, 120);
    }, [systemIconQuery]);

    // File helpers
    const formatBytes = (bytes, decimals = 1) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="w-full bg-card/20 dark:bg-card/10 border border-border/50 rounded-lg p-6 min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
                {parentActiveTab === "uploads" && (
                    <motion.div
                        key="uploads"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col"
                    >
                        {/* Inner header bar with upload action */}
                        <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6 flex-wrap gap-4">
                            <h3 className="text-sm font-semibold text-foreground">
                                Media Assets
                            </h3>
                            <label className="relative flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground rounded-md text-xs font-semibold shadow-sm cursor-pointer transition-colors">
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                                    onChange={handleImageUpload}
                                    disabled={isUploadingImage}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Image</span>
                            </label>
                        </div>

                        <div className="flex-1 flex flex-col min-h-0">
                            {isLoadingImages ? (
                                <div className="w-full overflow-hidden">
                                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                                        <div className="aspect-[3/4] rounded-xl skeleton-sweep border border-border/30 mb-4 break-inside-avoid h-[280px]" />
                                        <div className="aspect-video rounded-xl skeleton-sweep border border-border/30 mb-4 break-inside-avoid h-[160px]" />
                                        <div className="aspect-[3/2] rounded-xl skeleton-sweep border border-border/30 mb-4 break-inside-avoid h-[180px]" />
                                        <div className="aspect-video rounded-xl skeleton-sweep border border-border/30 mb-4 break-inside-avoid h-[160px]" />
                                    </div>
                                </div>
                            ) : userImages.length > 0 ? (
                                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                                    {userImages.map((img) => (
                                        <motion.div
                                            key={img.id}
                                            layoutId={`img-${img.id}`}
                                            className="break-inside-avoid relative overflow-hidden rounded-xl group transition-all duration-300 mb-4 cursor-zoom-in"
                                        >
                                            {/* Image container */}
                                            <div
                                                onClick={() =>
                                                    setPreviewImage(img)
                                                }
                                                className="w-full relative bg-muted/20 dark:bg-muted/10 overflow-hidden rounded-xl"
                                            >
                                                <img
                                                    src={img.url}
                                                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
                                                    alt={img.name}
                                                    loading="lazy"
                                                />
                                            </div>

                                            {/* Single premium glassmorphic overlay on hover */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/90 via-black/45 to-black/15 transition-all duration-300 p-3.5 flex flex-col justify-between pointer-events-none rounded-xl z-20">
                                                {/* Top action row */}
                                                <div className="flex justify-end gap-2 pointer-events-auto">
                                                    <button
                                                        onClick={(e) =>
                                                            handleDeleteImage(
                                                                img.id,
                                                                e,
                                                            )
                                                        }
                                                        className="p-1.5 rounded-lg bg-black/55 hover:bg-destructive text-white backdrop-blur-md border border-white/10 transition-all cursor-pointer hover:scale-105"
                                                        title="Delete Image"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {/* Bottom details info */}
                                                <div className="flex flex-col gap-0.5">
                                                    <span
                                                        className="text-xs font-semibold text-white tracking-tight line-clamp-2"
                                                        title={img.name}
                                                    >
                                                        {img.name}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-[9px] text-zinc-300 font-light mt-1 border-t border-white/10 pt-1.5">
                                                        <span className="flex items-center gap-1">
                                                            <FileText className="w-3 h-3 opacity-85" />
                                                            {formatBytes(
                                                                img.size,
                                                            )}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3 opacity-85" />
                                                            {formatDate(
                                                                img.created_at ||
                                                                    img.createdAt,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-border/60 bg-secondary/5 rounded-lg">
                                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20 text-primary mb-4">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-sm text-foreground">
                                        Upload your first image
                                    </h4>
                                    <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6 font-light">
                                        Upload images (PNG, JPG, WEBP, or SVG)
                                        to customize and insert them inside your
                                        slide decks easily.
                                    </p>
                                    <label className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-md text-xs font-semibold shadow-sm cursor-pointer transition-colors">
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                                            onChange={handleImageUpload}
                                            disabled={isUploadingImage}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <Upload className="w-4 h-4" />
                                        <span>Upload Image</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {parentActiveTab === "pexels" && (
                    <motion.div
                        key="pexels"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col"
                    >
                        <div className="flex-1 flex flex-col min-h-0">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSearchPexels(pexelsQuery);
                                }}
                                className="flex gap-2.5 max-w-md w-full mb-4 shrink-0"
                            >
                                <div className="relative flex-grow">
                                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={pexelsQuery}
                                        onChange={(e) =>
                                            setPexelsQuery(e.target.value)
                                        }
                                        placeholder="Search royalty-free stock photos..."
                                        className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSearchingPexels}
                                    className="px-4 rounded-md text-xs font-semibold cursor-pointer h-9 bg-primary hover:bg-primary/90"
                                >
                                    {isSearchingPexels ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        "Search"
                                    )}
                                </Button>
                            </form>
                            <div className="text-[10px] text-muted-foreground mb-6 flex items-center gap-1.5">
                                <span>Photos powered by</span>
                                <a
                                    href="https://www.pexels.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline font-semibold"
                                >
                                    Pexels
                                </a>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {isSearchingPexels ? (
                                    <div className="w-full overflow-hidden">
                                        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
                                            <div className="aspect-[3/4] rounded-xl skeleton-sweep border border-border/30 mb-4 break-inside-avoid h-[200px]" />
                                            <div className="aspect-[4/3] rounded-xl skeleton-sweep border border-border/30 mb-4 break-inside-avoid h-[130px]" />
                                            <div className="aspect-video rounded-xl skeleton-sweep border border-border/30 mb-4 break-inside-avoid h-[110px]" />
                                            <div className="aspect-[3/2] rounded-xl skeleton-sweep border border-border/30 mb-4 break-inside-avoid h-[140px]" />
                                            <div className="aspect-[3/4] rounded-xl skeleton-sweep border border-border/30 mb-4 break-inside-avoid h-[200px]" />
                                            <div className="aspect-[4/3] rounded-xl skeleton-sweep border border-border/30 mb-4 break-inside-avoid h-[130px]" />
                                        </div>
                                    </div>
                                ) : pexelsResults.length > 0 ? (
                                    <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
                                        {pexelsResults.map((img, i) => (
                                            <div
                                                key={i}
                                                onClick={() =>
                                                    setPreviewImage({
                                                        name:
                                                            img.alt ||
                                                            pexelsQuery ||
                                                            "Pexels Photo",
                                                        url: img.imageURL,
                                                        source: "pexels",
                                                    })
                                                }
                                                className="break-inside-avoid mb-4 relative rounded-xl overflow-hidden group transition-all duration-300 cursor-zoom-in"
                                            >
                                                <div className="w-full overflow-hidden rounded-xl bg-muted/20 dark:bg-muted/10">
                                                    <img
                                                        src={img.previewURL}
                                                        className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
                                                        alt="Pexels photo"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                {/* Hover Glass Overlay */}
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/90 via-black/45 to-black/15 transition-all duration-300 p-3.5 flex flex-col justify-between pointer-events-none rounded-xl z-20">
                                                    {/* Top action row */}
                                                    <div className="flex justify-end gap-2 pointer-events-auto">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPreviewImage(
                                                                    {
                                                                        name:
                                                                            img.alt ||
                                                                            pexelsQuery ||
                                                                            "Pexels Photo",
                                                                        url: img.imageURL,
                                                                        source: "pexels",
                                                                    },
                                                                );
                                                            }}
                                                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all cursor-pointer hover:scale-105"
                                                            title="Preview"
                                                        >
                                                            <Search className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={(e) =>
                                                                handleSavePexelsToLibrary(
                                                                    img.imageURL,
                                                                    img.alt ||
                                                                        pexelsQuery ||
                                                                        "Pexels Photo",
                                                                    e,
                                                                )
                                                            }
                                                            className="p-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground backdrop-blur-md border border-white/10 transition-all cursor-pointer hover:scale-105"
                                                            title="Save to library uploads"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    {/* Bottom details info */}
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xs font-semibold text-white tracking-tight line-clamp-2">
                                                            {img.alt ||
                                                                pexelsQuery ||
                                                                "Pexels Photo"}
                                                        </span>
                                                        <span className="text-[9px] text-zinc-300 font-light mt-1 border-t border-white/10 pt-1.5">
                                                            Royalty-free photo
                                                            via Pexels
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border border-dashed border-border/60 rounded-lg bg-secondary/5">
                                        <Search className="w-10 h-10 opacity-30 mb-3" />
                                        <h4 className="font-bold text-xs text-foreground">
                                            Find royalty-free photos
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground max-w-xs mt-0.5">
                                            Search millions of free,
                                            high-resolution stock images
                                            provided by the Pexels API.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {parentActiveTab === "icons" && (
                    <motion.div
                        key="icons"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col"
                    >
                        {/* Action Bar for Custom Icons */}
                        <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6 flex-wrap gap-4">
                            <h3 className="text-sm font-semibold text-foreground">
                                Custom Icons
                            </h3>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowPasteArea(true)}
                                    className="h-9 px-4 text-xs font-semibold gap-1.5 rounded-md border-border/60 hover:bg-secondary/40 cursor-pointer"
                                >
                                    <Code className="w-3.5 h-3.5" />
                                    <span>Paste SVG</span>
                                </Button>

                                <label className="relative flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground rounded-md text-xs font-semibold shadow-sm cursor-pointer transition-colors">
                                    <input
                                        type="file"
                                        accept=".svg, image/png, image/jpeg, image/webp"
                                        onChange={handleIconUpload}
                                        disabled={isUploadingIcon}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Upload Icon File</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex-grow flex flex-col min-h-0 gap-6">
                            <Dialog
                                open={showPasteArea}
                                onOpenChange={(open) => {
                                    setShowPasteArea(open);
                                    if (!open) {
                                        setPastedSvg("");
                                        setPastedIconName("");
                                    }
                                }}
                            >
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Code className="w-4 h-4 text-primary" />
                                            Paste Raw SVG Code
                                        </DialogTitle>
                                        <DialogDescription className="text-xs">
                                            Paste your custom SVG icon code
                                            below to add it to your library.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form
                                        onSubmit={handlePasteIconSubmit}
                                        className="flex flex-col gap-4 mt-2"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                                                    Icon Label / Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. rocket, smart-bulb, user-shield"
                                                    required
                                                    value={pastedIconName}
                                                    onChange={(e) =>
                                                        setPastedIconName(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full p-2.5 text-xs border border-border bg-background rounded-md focus:outline-none focus:ring-1 focus:ring-primary/40"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                                                    SVG Markup
                                                </label>
                                                <textarea
                                                    placeholder="<svg ...> ... </svg>"
                                                    required
                                                    rows={6}
                                                    value={pastedSvg}
                                                    onChange={(e) =>
                                                        setPastedSvg(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full p-3 text-xs border border-border bg-background rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-primary/40 resize-y"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => {
                                                    setShowPasteArea(false);
                                                    setPastedSvg("");
                                                    setPastedIconName("");
                                                }}
                                                className="h-9 px-4 text-xs font-semibold cursor-pointer"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isUploadingIcon}
                                                className="h-9 px-4 rounded-md text-xs font-semibold cursor-pointer bg-primary hover:bg-primary/95"
                                            >
                                                {isUploadingIcon ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    "Save Custom Icon"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            {/* Icons List */}
                            <div className="flex-1 overflow-y-auto">
                                {isLoadingIcons ? (
                                    <div className="w-full overflow-hidden">
                                        <div className="grid grid-cols-4 sm:grid-cols-64 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4">
                                            {Array.from({ length: 16 }).map(
                                                (_, i) => (
                                                    <div
                                                        key={i}
                                                        className="aspect-square rounded-md skeleton-sweep border border-border/50"
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ) : userIcons.length > 0 ? (
                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-12 gap-4">
                                        {userIcons.map((icn) => (
                                            <div
                                                key={icn.id}
                                                className="relative aspect-square rounded-md border border-border/80 hover:border-primary p-4 cursor-default group bg-card/60 dark:bg-zinc-900/60 flex flex-col items-center justify-center transition-all gap-2"
                                                title={icn.name}
                                            >
                                                <div className="flex-grow flex items-center justify-center">
                                                    {icn.iconType === "svg" ? (
                                                        <div
                                                            className="w-10 h-10 text-primary flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-current [&_svg]:text-current"
                                                            dangerouslySetInnerHTML={{
                                                                __html: icn.iconContent,
                                                            }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={
                                                                icn.iconContent
                                                            }
                                                            className="w-10 h-10 object-contain"
                                                            alt={icn.name}
                                                        />
                                                    )}
                                                </div>

                                                <span className="text-[10px] text-muted-foreground font-semibold truncate w-full text-center max-w-[80px]">
                                                    {icn.name}
                                                </span>

                                                <button
                                                    onClick={(e) =>
                                                        handleDeleteIcon(
                                                            icn.id,
                                                            e,
                                                        )
                                                    }
                                                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 dark:bg-black/80 hover:bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/10"
                                                    title="Delete Icon"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-grow flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-border/60 bg-secondary/5 rounded-lg">
                                        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20 text-primary mb-4">
                                            <Code className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-bold text-sm text-foreground">
                                            Save your custom icons
                                        </h4>
                                        <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6 font-light">
                                            Upload custom vector SVG files or
                                            paste XML markup code to reuse
                                            custom branding and graphics across
                                            your presentations.
                                        </p>
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setShowPasteArea(true)
                                                }
                                                className="px-4 text-xs font-semibold gap-1.5 rounded-md border-border/60 hover:bg-secondary/40 cursor-pointer"
                                            >
                                                <Code className="w-3.5 h-3.5" />
                                                <span>Paste SVG</span>
                                            </Button>

                                            <label className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-md text-xs font-semibold shadow-sm cursor-pointer transition-colors">
                                                <input
                                                    type="file"
                                                    accept=".svg, image/png, image/jpeg, image/webp"
                                                    onChange={handleIconUpload}
                                                    disabled={isUploadingIcon}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                <Upload className="w-4 h-4" />
                                                <span>Upload Icon File</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {parentActiveTab === "system-icons" && (
                    <motion.div
                        key="system-icons"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col"
                    >
                        <div className="flex-grow flex flex-col min-h-0 gap-6">
                            <div className="flex flex-col gap-1 shrink-0">
                                <div className="relative max-w-md w-full">
                                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={systemIconQuery}
                                        onChange={(e) =>
                                            setSystemIconQuery(e.target.value)
                                        }
                                        placeholder="Search system Phosphor icons..."
                                        className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1.5 font-light">
                                    Click any icon to copy its identifier. You
                                    can paste/type this icon identifier inside
                                    slide text elements or icon fields.
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-14 gap-3.5 p-2">
                                    {filteredSystemIcons.map((name) => {
                                        const IconComponent =
                                            phosphorIcons[name];
                                        if (!IconComponent) return null;
                                        return (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() =>
                                                    handleCopyIconName(name)
                                                }
                                                className="aspect-square flex flex-col items-center justify-center rounded-md hover:bg-accent border border-border/60 hover:border-primary transition-all group p-2 cursor-pointer bg-card/40 hover:scale-102"
                                                title={name}
                                            >
                                                <div className="flex-grow flex items-center justify-center">
                                                    <IconComponent
                                                        weight="regular"
                                                        className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors"
                                                    />
                                                </div>
                                                <span className="text-[9px] text-muted-foreground group-hover:text-foreground font-semibold truncate w-full text-center mt-1">
                                                    {name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "themes" && (
                    <motion.div
                        key="themes"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center text-center py-20 gap-4"
                    >
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shrink-0 animate-pulse">
                            <Palette className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 justify-center">
                                Custom Design Themes
                                <span className="text-[10px] font-bold tracking-wider text-primary bg-primary/10 border border-primary/25 px-2.5 py-0.5 rounded-full uppercase">
                                    Locked
                                </span>
                            </h3>
                            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                                Coming soon! Define custom visual brand identity
                                systems, custom corporate colors, and pair
                                custom typography suites to apply uniformly on
                                slide creations.
                            </p>
                        </div>
                        <div className="border border-border/50 bg-secondary/15 rounded-md p-3.5 text-left w-full max-w-sm flex items-start gap-2.5">
                            <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="text-[11px] text-muted-foreground leading-normal font-light">
                                Phase 2 Library rollout will let you author
                                layout templates and color maps that feed our
                                generation engine.
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* ------------------- LAYOUTS (LOCKED) ------------------- */}
                {activeTab === "layouts" && (
                    <motion.div
                        key="layouts"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center text-center py-20 gap-4"
                    >
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shrink-0 animate-pulse">
                            <LayoutIcon className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 justify-center">
                                Custom Slide Layouts Builder
                                <span className="text-[10px] font-bold tracking-wider text-primary bg-primary/10 border border-primary/25 px-2.5 py-0.5 rounded-full uppercase">
                                    Locked
                                </span>
                            </h3>
                            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                                Coming soon! A slide template editor to build
                                your custom slide structural templates.
                            </p>
                        </div>
                       
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lightbox Dialog preview for Images */}
            <Dialog
                open={previewImage !== null}
                onOpenChange={(open) => !open && setPreviewImage(null)}
            >
                <DialogContent className="max-w-3xl p-5 border border-border/80 bg-zinc-950 text-white rounded-lg shadow-2xl flex flex-col gap-4 overflow-hidden z-[100]">
                    <DialogHeader className="pb-3 border-b border-white/10 shrink-0">
                        <DialogTitle className="text-sm font-bold text-white truncate max-w-[500px]">
                            {previewImage?.name}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-400 mt-1">
                            {previewImage?.source === "pexels" ? (
                                <span className="flex items-center gap-1">
                                    Stock photo from Pexels
                                </span>
                            ) : (
                                <span className="flex items-center gap-2.5">
                                    {previewImage?.size &&
                                        `Size: ${formatBytes(previewImage.size)}`}
                                    {previewImage?.created_at &&
                                        ` • Uploaded: ${formatDate(previewImage.created_at)}`}
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 min-h-[300px] max-h-[500px] flex items-center justify-center bg-black/60 rounded-md overflow-hidden relative">
                        <img
                            src={previewImage?.url}
                            className="max-w-full max-h-[450px] object-contain rounded-lg"
                            alt={previewImage?.name || "Preview Image"}
                        />
                    </div>

                    <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10 shrink-0">
                        {previewImage?.source === "pexels" ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={(e) =>
                                        previewImage &&
                                        handleSavePexelsToLibrary(
                                            previewImage.url,
                                            previewImage.name,
                                            e,
                                        )
                                    }
                                    className="h-9 px-4 text-xs font-semibold gap-1.5 rounded-md border-white/10 bg-primary hover:bg-primary/95 text-primary cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Save to Library</span>
                                </Button>
                                <a
                                    href={previewImage.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-4 h-9 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-xs font-semibold cursor-pointer border border-white/10"
                                >
                                    <span>Open Direct Link</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="destructive"
                                    onClick={() =>
                                        previewImage &&
                                        handleDeleteImage(previewImage.id)
                                    }
                                    className="h-9 px-4 text-xs font-semibold gap-1.5 rounded-md cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Image</span>
                                </Button>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
