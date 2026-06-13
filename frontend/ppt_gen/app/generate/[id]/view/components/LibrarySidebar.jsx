"use client";

import React, { useState, useEffect, useCallback } from "react";
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
    FileUp,
} from "lucide-react";
import * as phosphorIcons from "@phosphor-icons/react";

export default function LibrarySidebar({
    isOpen,
    isBusy,
    imageEditContext,
    onSelectImage,
    iconEditCallback,
    onSelectIcon,
    onClose,
    defaultTab = "images",
}) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Images States
    const [imageSubTab, setImageSubTab] = useState("uploads"); // "uploads" | "pexels"
    const [pexelsQuery, setPexelsQuery] = useState("");
    const [pexelsResults, setPexResults] = useState([]);
    const [isSearchingPexels, setIsSearchingPexels] = useState(false);

    const [userImages, setUserImages] = useState([]);
    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Icons States
    const [iconSubTab, setIconSubTab] = useState("uploads"); // "uploads" | "system"
    const [systemIconQuery, setSystemIconQuery] = useState("");
    const [userIcons, setUserIcons] = useState([]);
    const [isLoadingIcons, setIsLoadingIcons] = useState(false);
    const [isUploadingIcon, setIsUploadingIcon] = useState(false);
    const [pastedSvg, setPastedSvg] = useState("");
    const [pastedIconName, setPastedIconName] = useState("");
    const [showPasteArea, setShowPasteArea] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(defaultTab);
        }
    }, [isOpen, defaultTab]);

    // API Call: Load User Uploaded Images
    const fetchUserImages = useCallback(async () => {
        setIsLoadingImages(true);
        try {
            const res = await api.get("/api/library/images");
            if (res?.success && res.data) {
                setUserImages(res.data.images);
            }
        } catch (err) {
            console.error("Failed to load user images:", err);
            // Fallback empty list if backend route is not created yet
            setUserImages([]);
        } finally {
            setIsLoadingImages(false);
        }
    }, []);

    // API Call: Load User Custom Icons
    const fetchUserIcons = useCallback(async () => {
        setIsLoadingIcons(true);
        try {
            const res = await api.get("/api/library/icons");
            if (res?.success && res.data) {
                setUserIcons(res.data);
            }
        } catch (err) {
            console.error("Failed to load user icons:", err);
            // Fallback empty list if backend route is not created yet
            setUserIcons([]);
        } finally {
            setIsLoadingIcons(false);
        }
    }, []);

    // Load data when tab changes or sidebar opens
    useEffect(() => {
        if (!isOpen) return;
        if (activeTab === "images") {
            fetchUserImages();
        } else if (activeTab === "icons") {
            fetchUserIcons();
        }
    }, [isOpen, activeTab, fetchUserImages, fetchUserIcons]);

    // Image Search (Pexels)
    const handleSearchPexels = useCallback(async (query) => {
        if (!query || query.trim() === "") {
            setPexResults([]);
            return;
        }
        setIsSearchingPexels(true);
        try {
            const res = await api.get(`/api/ppt/images/search`, {
                params: { q: query },
            });
            if (res?.success && res.data) {
                setPexResults(res.data);
            } else {
                setPexResults([]);
            }
        } catch (err) {
            console.error("Failed to search Pexels:", err);
            setPexResults([]);
            toast.error("Failed to search images from Pexels.");
        } finally {
            setIsSearchingPexels(false);
        }
    }, []);

    // Auto-search Pexels if query context exists from image edit trigger
    useEffect(() => {
        if (
            isOpen &&
            activeTab === "images" &&
            imageEditContext?.currentQuery
        ) {
            const query = imageEditContext.currentQuery;
            const isUrl =
                query.startsWith("http://") || query.startsWith("https://");
            if (!isUrl) {
                setImageSubTab("pexels");
                setPexelsQuery(query);
                handleSearchPexels(query);
            }
        }
    }, [isOpen, activeTab, imageEditContext, handleSearchPexels]);

    // Upload Handlers
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        const toastId = toast.loading(`Uploading ${file.name}`);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await api.post("/api/library/images/upload", formData);
            if (res?.success) {
                toast.success("Image uploaded successfully!", { id: toastId });
                fetchUserImages();
            } else {
                throw new Error(res?.message || "Upload failed");
            }
        } catch (err) {
            console.error("Image upload failed:", err);
            toast.error(err.message || "Failed to upload image to backend.", {
                id: toastId,
            });
        } finally {
            setIsUploadingImage(false);
            e.target.value = "";
        }
    };

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
                fetchUserIcons();
            } else {
                throw new Error(res?.message || "Upload failed");
            }
        } catch (err) {
            console.error("Icon upload failed:", err);
            toast.error(err.message || "Failed to upload icon to backend.", {
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
        const toastId = toast.loading("Saving custom SVG icon");

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
                toast.success("SVG icon saved successfully!", { id: toastId });
                setPastedSvg("");
                setPastedIconName("");
                setShowPasteArea(false);
                fetchUserIcons();
            } else {
                throw new Error(res?.message || "Upload failed");
            }
        } catch (err) {
            console.error("Pasted SVG upload failed:", err);
            toast.error(err.message || "Failed to save SVG icon.", {
                id: toastId,
            });
        } finally {
            setIsUploadingIcon(false);
        }
    };

    // ----------------------------------------------------
    // Delete Handlers
    // ----------------------------------------------------
    const handleDeleteImage = async (id, e) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this image?")) return;

        const toastId = toast.loading("Deleting image");
        try {
            await api.delete(`/api/library/images/${id}`);
            toast.success("Image deleted", { id: toastId });
            fetchUserImages();
        } catch (err) {
            console.error("Failed to delete image:", err);
            toast.error("Failed to delete image.", { id: toastId });
        }
    };

    const handleDeleteIcon = async (id, e) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this custom icon?"))
            return;

        const toastId = toast.loading("Deleting icon");
        try {
            await api.delete(`/api/library/icons/${id}`);
            toast.success("Icon deleted", { id: toastId });
            fetchUserIcons();
        } catch (err) {
            console.error("Failed to delete icon:", err);
            toast.error("Failed to delete icon.", { id: toastId });
        }
    };

    // ----------------------------------------------------
    // Selection Apply Handlers
    // ----------------------------------------------------
    const handleSelectImageItem = (url, name) => {
        if (imageEditContext && onSelectImage) {
            onSelectImage(url, name);
        } else {
            toast.info("Select 'Edit Image' on a slide to apply this image.");
        }
    };

    const handleSelectIconItem = (iconItem) => {
        let value = "";
        if (iconItem.iconType === "svg") {
            // Encode custom SVG markup to base64 string
            const base64 = btoa(
                unescape(encodeURIComponent(iconItem.iconContent)),
            );
            value = `custom_svg:${base64}`;
        } else {
            value = `custom_img:${iconItem.iconContent}`;
        }

        if (onSelectIcon) {
            onSelectIcon(value);
            toast.success("Icon applied to slide");
        } else if (iconEditCallback) {
            iconEditCallback(value);
            toast.success("Icon applied to slide");
        } else {
            toast.info("Select an icon slot on a slide to apply this icon.");
        }
    };

    const handleSelectSystemIconItem = (iconName, weight = "regular") => {
        const value = `${iconName}:${weight}`;
        if (onSelectIcon) {
            onSelectIcon(value);
            toast.success("Icon applied to slide");
        } else if (iconEditCallback) {
            iconEditCallback(value);
            toast.success("Icon applied to slide");
        } else {
            toast.info("Select an icon slot on a slide to apply this icon.");
        }
    };

    // Filter Phosphor icons list for the system icons tab
    const filteredSystemIcons = React.useMemo(() => {
        const query = systemIconQuery.toLowerCase().trim();
        const allNames = Object.keys(phosphorIcons).filter((name) => {
            return (
                name !== "default" &&
                name !== "IconContext" &&
                name !== "IconBase" &&
                /^[A-Z]/.test(name) &&
                !name.endsWith("Props")
            );
        });
        if (!query) return allNames.slice(0, 36);
        return allNames
            .filter((name) => name.toLowerCase().includes(query))
            .slice(0, 48);
    }, [systemIconQuery]);

    if (!isOpen || isBusy) return null;

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
            />
            {/* Sidebar Container */}
            <div className="fixed inset-y-0 right-0 md:relative md:inset-auto w-[340px] sm:w-[380px] md:w-[420px] border-l border-border bg-card flex flex-col shrink-0 animate-in slide-in-from-right duration-200 z-50 shadow-2xl md:shadow-none">
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-secondary/10">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <h3 className="font-bold text-sm text-foreground">
                            My Library
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                        Close
                    </button>
                </div>

                {/* Sidebar Tab Selector */}
                <div className="flex border-b border-border bg-muted/20 p-1 gap-1 shrink-0">
                    <button
                        onClick={() => setActiveTab("images")}
                        className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            activeTab === "images"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                        }`}
                    >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Images</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("icons")}
                        className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            activeTab === "icons"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                        }`}
                    >
                        <Code className="w-3.5 h-3.5" />
                        <span>Icons</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("themes")}
                        className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            activeTab === "themes"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                        }`}
                    >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Themes</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("layouts")}
                        className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            activeTab === "layouts"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                        }`}
                    >
                        <LayoutIcon className="w-3.5 h-3.5" />
                        <span>Layouts</span>
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-grow overflow-y-auto flex flex-col min-h-0">
                    {/* ---------------- IMAGES TAB ---------------- */}
                    {activeTab === "images" && (
                        <div className="flex-1 flex flex-col p-4 gap-4">
                            <div className="flex bg-muted/40 p-0.5 rounded-md border border-border/40 gap-px shrink-0">
                                <button
                                    onClick={() => setImageSubTab("uploads")}
                                    className={`flex-1 py-1 text-[11px] font-semibold rounded-md cursor-pointer transition-all ${
                                        imageSubTab === "uploads"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    My Uploads
                                </button>
                                <button
                                    onClick={() => setImageSubTab("pexels")}
                                    className={`flex-1 py-1 text-[11px] font-semibold rounded-md cursor-pointer transition-all ${
                                        imageSubTab === "pexels"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    Search Pexels
                                </button>
                            </div>

                            {imageSubTab === "uploads" ? (
                                <div className="flex-1 flex flex-col gap-4 min-h-0">
                                    {/* Upload Box */}
                                    <label className="border-2 border-dashed border-border hover:border-primary/50 bg-secondary/10 hover:bg-secondary/20 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group shrink-0 relative overflow-hidden">
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                                            onChange={handleImageUpload}
                                            disabled={isUploadingImage}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                        <span className="text-xs font-semibold text-foreground">
                                            Upload Custom Image
                                        </span>
                                        <span className="text-[10px] text-muted-foreground mt-1">
                                            PNG, JPG, WEBP, or SVG
                                        </span>
                                    </label>

                                    {/* Images List */}
                                    <div className="flex-1 overflow-y-auto min-h-0">
                                        {isLoadingImages ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {Array.from({ length: 4 }).map(
                                                    (_, i) => (
                                                        <div
                                                            key={i}
                                                            className="aspect-[16/9] rounded-md skeleton-sweep border border-border/50"
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        ) : userImages.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {userImages.map((img) => (
                                                    <div
                                                        key={img.id}
                                                        onClick={() =>
                                                            handleSelectImageItem(
                                                                img.url,
                                                                img.name,
                                                            )
                                                        }
                                                        className="relative aspect-[16/9] rounded-md overflow-hidden border border-border hover:border-primary shadow-sm cursor-pointer group bg-muted transition-all"
                                                    >
                                                        <img
                                                            src={img.url}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                            alt={img.name}
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                            <span className="text-[10px] text-white font-bold bg-primary/90 px-2 py-0.5 rounded-full">
                                                                Apply
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={(e) =>
                                                                handleDeleteImage(
                                                                    img.id,
                                                                    e,
                                                                )
                                                            }
                                                            className="absolute top-1.5 right-1.5 p-1 rounded bg-black/60 hover:bg-destructive/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/10"
                                                            title="Delete Image"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-xl">
                                                <span className="text-xs text-muted-foreground">
                                                    No images uploaded yet.
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Search Pexels Tab
                                <div className="flex-grow flex flex-col gap-4 min-h-0">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSearchPexels(pexelsQuery);
                                        }}
                                        className="flex gap-2 shrink-0"
                                    >
                                        <input
                                            type="text"
                                            value={pexelsQuery}
                                            onChange={(e) =>
                                                setPexelsQuery(e.target.value)
                                            }
                                            placeholder="Search Pexels"
                                            className="flex-grow p-2 border border-border rounded-md text-xs bg-background"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSearchingPexels}
                                            className="px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold cursor-pointer disabled:opacity-50 hover:bg-primary/95 transition-colors"
                                        >
                                            {isSearchingPexels
                                                ? "..."
                                                : "Search"}
                                        </button>
                                    </form>
                                    <div className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                                        <span>Photos provided by</span>
                                        <a
                                            href="https://www.pexels.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline font-semibold"
                                        >
                                            Pexels
                                        </a>
                                    </div>

                                    <div className="flex-1 overflow-y-auto min-h-0">
                                        {isSearchingPexels ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {Array.from({ length: 6 }).map(
                                                    (_, i) => (
                                                        <div
                                                            key={i}
                                                            className="aspect-[16/9] rounded-md skeleton-sweep border border-border/50"
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        ) : pexelsResults.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {pexelsResults.map((img, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() =>
                                                            handleSelectImageItem(
                                                                img.imageURL,
                                                                pexelsQuery,
                                                            )
                                                        }
                                                        className="relative aspect-[16/9] rounded-md overflow-hidden border border-border hover:border-primary shadow-sm cursor-pointer group bg-muted transition-colors"
                                                    >
                                                        <img
                                                            src={img.previewURL}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                            alt="Pexels Result"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                                <Search className="w-8 h-8 opacity-20 mb-2" />
                                                <span className="text-xs">
                                                    Search for royalty-free
                                                    images above
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ---------------- ICONS TAB ---------------- */}
                    {activeTab === "icons" && (
                        <div className="flex-1 flex flex-col p-4 gap-4">
                            <div className="flex bg-muted/40 p-0.5 rounded-md border border-border/40 gap-px shrink-0">
                                <button
                                    onClick={() => setIconSubTab("uploads")}
                                    className={`flex-1 py-1 text-[11px] font-semibold rounded-md cursor-pointer transition-all ${
                                        iconSubTab === "uploads"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    Custom Icons
                                </button>
                                <button
                                    onClick={() => setIconSubTab("system")}
                                    className={`flex-1 py-1 text-[11px] font-semibold rounded-md cursor-pointer transition-all ${
                                        iconSubTab === "system"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    Search System
                                </button>
                            </div>

                            {iconSubTab === "uploads" ? (
                                <div className="flex-grow flex flex-col gap-4 min-h-0">
                                    {!showPasteArea ? (
                                        <div className="flex gap-2 shrink-0">
                                            <label className="flex-1 border-2 border-dashed border-border hover:border-primary/50 bg-secondary/10 hover:bg-secondary/20 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group relative">
                                                <input
                                                    type="file"
                                                    accept=".svg, image/png, image/jpeg, image/webp"
                                                    onChange={handleIconUpload}
                                                    disabled={isUploadingIcon}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mb-1" />
                                                <span className="text-xs font-semibold text-foreground">
                                                    Upload SVG / Image File
                                                </span>
                                            </label>

                                            <button
                                                onClick={() =>
                                                    setShowPasteArea(true)
                                                }
                                                className="px-4 border border-border hover:bg-secondary/40 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all gap-1 text-muted-foreground hover:text-foreground"
                                            >
                                                <Code className="w-5 h-5" />
                                                <span className="text-[10px] font-semibold">
                                                    Paste SVG
                                                </span>
                                            </button>
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={handlePasteIconSubmit}
                                            className="border border-border/80 bg-secondary/5 rounded-xl p-3 shrink-0 flex flex-col gap-2.5"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-[11px] font-bold text-foreground">
                                                    Paste SVG XML Markup
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPasteArea(false)
                                                    }
                                                    className="text-[10px] text-muted-foreground hover:text-foreground font-semibold"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Icon Label (e.g. rocket)"
                                                required
                                                value={pastedIconName}
                                                onChange={(e) =>
                                                    setPastedIconName(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full p-1.5 text-xs border border-border bg-background rounded"
                                            />
                                            <textarea
                                                placeholder="<svg ...> ... </svg>"
                                                required
                                                rows={3}
                                                value={pastedSvg}
                                                onChange={(e) =>
                                                    setPastedSvg(e.target.value)
                                                }
                                                className="w-full p-2 text-xs border border-border bg-background rounded font-mono"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isUploadingIcon}
                                                className="w-full py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold cursor-pointer hover:bg-primary/95 transition-colors disabled:opacity-50"
                                            >
                                                Save Custom Icon
                                            </button>
                                        </form>
                                    )}

                                    {/* User Uploaded Custom Icons List */}
                                    <div className="flex-grow overflow-y-auto min-h-0">
                                        {isLoadingIcons ? (
                                            <div className="grid grid-cols-4 gap-3">
                                                {Array.from({ length: 8 }).map(
                                                    (_, i) => (
                                                        <div
                                                            key={i}
                                                            className="aspect-square rounded-md skeleton-sweep border border-border/50"
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        ) : userIcons.length > 0 ? (
                                            <div className="grid grid-cols-4 gap-3">
                                                {userIcons.map((icn) => (
                                                    <div
                                                        key={icn.id}
                                                        onClick={() =>
                                                            handleSelectIconItem(
                                                                icn,
                                                            )
                                                        }
                                                        className="relative aspect-square rounded-xl border border-border/60 hover:border-primary p-2 cursor-pointer group bg-card hover:bg-secondary/15 flex items-center justify-center transition-all"
                                                        title={icn.name}
                                                    >
                                                        {icn.iconType ===
                                                        "svg" ? (
                                                            <div
                                                                className="w-8 h-8 text-primary flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-current [&_svg]:text-current"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: icn.iconContent,
                                                                }}
                                                            />
                                                        ) : (
                                                            <img
                                                                src={
                                                                    icn.iconContent
                                                                }
                                                                className="w-8 h-8 object-contain"
                                                                alt={icn.name}
                                                            />
                                                        )}

                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                                                            <span className="text-[9px] text-white font-bold bg-primary/90 px-1.5 py-0.5 rounded-full">
                                                                Apply
                                                            </span>
                                                        </div>

                                                        <button
                                                            onClick={(e) =>
                                                                handleDeleteIcon(
                                                                    icn.id,
                                                                    e,
                                                                )
                                                            }
                                                            className="absolute -top-1 -right-1 p-0.5 rounded-full bg-black/60 hover:bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/10"
                                                            title="Delete Icon"
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-xl">
                                                <span className="text-xs text-muted-foreground">
                                                    No custom icons saved yet.
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Search System Icons Tab
                                <div className="flex-grow flex flex-col gap-4 min-h-0">
                                    <div className="flex gap-2 shrink-0">
                                        <input
                                            type="text"
                                            value={systemIconQuery}
                                            onChange={(e) =>
                                                setSystemIconQuery(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Search Phosphor icons"
                                            className="flex-grow p-2 border border-border rounded-md text-xs bg-background"
                                        />
                                    </div>

                                    <div className="flex-grow overflow-y-auto min-h-0">
                                        <div className="grid grid-cols-6 gap-2.5">
                                            {filteredSystemIcons.map((name) => {
                                                const IconComponent =
                                                    phosphorIcons[name];
                                                if (!IconComponent) return null;
                                                return (
                                                    <button
                                                        key={name}
                                                        type="button"
                                                        onClick={() =>
                                                            handleSelectSystemIconItem(
                                                                name,
                                                            )
                                                        }
                                                        className="aspect-square flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border transition-colors group p-1.5"
                                                        title={name}
                                                    >
                                                        <IconComponent
                                                            weight="regular"
                                                            className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                                                        />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ---------------- THEMES TAB ---------------- */}
                    {activeTab === "themes" && (
                        <div className="p-6 flex flex-col items-center justify-center text-center h-full gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shrink-0">
                                <Palette className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5 justify-center">
                                    Custom Themes Creator
                                    <span className="text-[9px] font-bold tracking-wide text-primary bg-primary/10 border border-primary/25 px-1.5 py-0.5 rounded-full uppercase">
                                        Locked
                                    </span>
                                </h4>
                                <p className="text-xs text-muted-foreground max-w-[280px]">
                                    Coming soon! Create custom color schemes,
                                    define contrast tokens, specify typography
                                    pairing, and apply them across your
                                    presentation in one click.
                                </p>
                            </div>
                            <div className="border border-border/50 bg-secondary/15 rounded-md p-3 text-left w-full max-w-[280px] flex items-start gap-2.5">
                                <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                <span className="text-[10px] text-muted-foreground leading-normal">
                                    Phase 2 of Library will allow designing
                                    color systems and custom themes.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ---------------- LAYOUTS TAB ---------------- */}
                    {activeTab === "layouts" && (
                        <div className="p-6 flex flex-col items-center justify-center text-center h-full gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shrink-0">
                                <LayoutIcon className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5 justify-center">
                                    Custom Slide Layouts
                                    <span className="text-[9px] font-bold tracking-wide text-primary bg-primary/10 border border-primary/25 px-1.5 py-0.5 rounded-full uppercase">
                                        Locked
                                    </span>
                                </h4>
                                <p className="text-xs text-muted-foreground max-w-[280px]">
                                    Coming soon! Drag-and-drop elements on a
                                    blank canvas to build your own custom slide
                                    layouts and save them to your layouts
                                    library.
                                </p>
                            </div>
                            <div className="border border-border/50 bg-secondary/15 rounded-md p-3 text-left w-full max-w-[280px] flex items-start gap-2.5">
                                <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                <span className="text-[10px] text-muted-foreground leading-normal">
                                    Phase 2 of Library will include the
                                    drag-and-drop custom layout creator.
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
