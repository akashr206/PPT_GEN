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
                params: { q: query }
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
            const isUrl = imageEditContext.currentQuery && (imageEditContext.currentQuery.startsWith("http://") || imageEditContext.currentQuery.startsWith("https://"));
            const initialQuery = isUrl ? "" : (imageEditContext.currentQuery || "");
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
                    <span className="text-[10px] text-muted-foreground">Select an image from Pexels</span>
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
                        placeholder="Search Pexels..."
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
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="aspect-[16/9] rounded-lg skeleton-sweep border border-border/50" />
                        ))}
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {searchResults.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => onSelectImage(img.imageURL, searchQuery)}
                                className="relative aspect-[16/9] rounded-lg overflow-hidden border border-border hover:border-blue-500 shadow-sm cursor-pointer group bg-muted transition-colors"
                            >
                                <img
                                    src={img.previewURL}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    alt="Search result"
                                />
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <span className="text-xs text-muted-foreground">No images found. Try a different query.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
