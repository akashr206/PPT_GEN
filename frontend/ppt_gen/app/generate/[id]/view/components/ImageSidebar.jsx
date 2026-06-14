"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function ImageSidebar({
    isOpen,
    isBusy,
    imageEditContext,
    onSelectImage,
    onClose,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = useCallback(async (query) => {
        if (!query || query.trim() === "") {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const res = await api.get(`/api/ppt/images/search`, {
                params: { q: query },
            });
            if (res?.success && res.data) {
                setSearchResults(res.data);
            } else {
                setSearchResults([]);
            }
        } catch (err) {
            console.error("Failed to search images for sidebar:", err);
            setSearchResults([]);
            toast.error("Failed to load images from Pexels.");
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen && imageEditContext) {
            const isUrl =
                imageEditContext.currentQuery &&
                (imageEditContext.currentQuery.startsWith("http://") ||
                    imageEditContext.currentQuery.startsWith("https://"));
            const initialQuery = isUrl
                ? ""
                : imageEditContext.currentQuery || "";
            setSearchQuery(initialQuery);
            setSearchResults([]);
            if (initialQuery) {
                handleSearch(initialQuery);
            }
        }
    }, [isOpen, imageEditContext, handleSearch]);

    if (!isOpen || isBusy) return null;

    return (
        <div className="w-[360px] md:w-[400px] border-l border-border bg-card flex flex-col shrink-0 animate-in slide-in-from-right duration-200">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-secondary/25">
                <div className="flex flex-col">
                    <h3 className="font-bold text-sm">Edit Slide Image</h3>
                    <span className="text-[10px] text-muted-foreground">
                        Select an image from Pexels
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="px-2.5 py-1 text-xs font-semibold rounded-md hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                    Close
                </button>
            </div>

            {/* Search Bar & Credits */}
            <div className="p-4 border-b border-border shrink-0 flex flex-col gap-2">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch(searchQuery);
                    }}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Pexels"
                        className="flex-grow p-2 border border-border rounded-md text-xs bg-background"
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold cursor-pointer disabled:opacity-50 hover:bg-primary/95 transition-colors"
                    >
                        {isSearching ? "..." : "Search"}
                    </button>
                </form>

                <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                    <span>Photos provided by</span>
                    <a
                        href="https://www.pexels.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline inline-flex items-center gap-0.5 font-semibold"
                    >
                        Pexels
                    </a>
                </div>
            </div>

            {/* Grid of Search Results */}
            <div className="flex-grow overflow-y-auto p-4">
                {isSearching ? (
                    <div className="w-full overflow-hidden">
                        <div className="columns-2 gap-3">
                            <div className="aspect-[4/3] rounded-lg skeleton-sweep border border-border/30 mb-3 break-inside-avoid h-[100px]" />
                            <div className="aspect-[3/4] rounded-lg skeleton-sweep border border-border/30 mb-3 break-inside-avoid h-[130px]" />
                            <div className="aspect-video rounded-lg skeleton-sweep border border-border/30 mb-3 break-inside-avoid h-[80px]" />
                            <div className="aspect-[3/2] rounded-lg skeleton-sweep border border-border/30 mb-3 break-inside-avoid h-[95px]" />
                        </div>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="columns-2 gap-3">
                        {searchResults.map((img, i) => (
                            <div
                                key={i}
                                onClick={() =>
                                    onSelectImage(img.imageURL, img.alt || searchQuery || "Pexels Photo")
                                }
                                className="break-inside-avoid relative overflow-hidden rounded-lg bg-card border border-border/40 hover:border-primary/45 group transition-all duration-300 hover:shadow-md mb-3 cursor-pointer"
                            >
                                {/* Image */}
                                <img
                                    src={img.previewURL}
                                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
                                    alt="Search result"
                                    loading="lazy"
                                />

                                {/* Floating default title badge */}
                                <div className="absolute bottom-1.5 left-1.5 right-1.5 backdrop-blur-md bg-black/65 border border-white/5 rounded px-2 py-1 flex items-center justify-between text-white transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-1.5 pointer-events-none z-10">
                                    <span className="text-[9px] font-medium truncate max-w-[85%]">
                                        {img.alt || searchQuery || "Pexels Photo"}
                                    </span>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-300 p-2 flex flex-col justify-between pointer-events-none z-20">
                                    {/* Center check indicator (Apply) */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        {/* Icon container */}
                                        <div className="w-7 h-7 rounded-full bg-primary/95 text-primary-foreground flex items-center justify-center shadow-lg border border-white/15 scale-90 group-hover:scale-100 transition-transform duration-300">
                                            <span className="text-sm font-bold">+</span>
                                        </div>
                                    </div>

                                    {/* Bottom text */}
                                    <span className="text-[9px] font-semibold text-white truncate w-full pt-1.5 border-t border-white/10 mt-auto">
                                        {img.alt || "Select Photo"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <span className="text-xs text-muted-foreground">
                            No images found. Try a different query.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
