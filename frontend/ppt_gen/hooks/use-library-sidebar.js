import { useState, useEffect, useCallback } from "react";

/**
 * Manages the unified Library Sidebar state (open/close, active tab, icon callback).
 * Isolated so that opening/closing the sidebar doesn't cascade re-renders
 * into the slide viewer.
 */
export function useLibrarySidebar() {
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [libraryActiveTab, setLibraryActiveTab] = useState("images");
    const [imageEditContext, setImageEditContext] = useState(null);
    const [libraryIconCallback, setLibraryIconCallback] = useState(null);

    // Listen for global events from deeply nested components (e.g. EditableIcon)
    useEffect(() => {
        const handleOpenLibraryEvent = (e) => {
            const { tab, onSelectIcon } = e.detail;
            setLibraryActiveTab(tab || "images");
            if (onSelectIcon) {
                setLibraryIconCallback(() => onSelectIcon);
            } else {
                setLibraryIconCallback(null);
            }
            setIsLibraryOpen(true);
        };
        window.addEventListener("trigger-open-library", handleOpenLibraryEvent);
        return () =>
            window.removeEventListener("trigger-open-library", handleOpenLibraryEvent);
    }, []);

    const handleSelectSidebarIcon = useCallback(
        (iconName) => {
            if (libraryIconCallback) {
                libraryIconCallback(iconName);
            }
        },
        [libraryIconCallback],
    );

    /** Open the library sidebar in image-edit mode */
    const openLibraryForImage = useCallback((context) => {
        setImageEditContext(context);
        setLibraryActiveTab("images");
        setIsLibraryOpen(true);
    }, []);

    /** Open the library sidebar in browse mode (no specific edit context) */
    const openLibrary = useCallback(() => {
        setLibraryActiveTab("images");
        setLibraryIconCallback(null);
        setImageEditContext(null);
        setIsLibraryOpen(true);
    }, []);

    const closeLibrary = useCallback(() => {
        setIsLibraryOpen(false);
        setImageEditContext(null);
        setLibraryIconCallback(null);
    }, []);

    return {
        isLibraryOpen,
        libraryActiveTab,
        imageEditContext,
        libraryIconCallback,
        openLibrary,
        openLibraryForImage,
        closeLibrary,
        handleSelectSidebarIcon,
    };
}
