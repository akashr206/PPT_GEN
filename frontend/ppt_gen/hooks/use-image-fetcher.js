import { useState, useEffect, useRef, useCallback } from "react";
import { useMediaStore } from "@/hooks/use-media-store";

const MACRO_IMAGE_TYPES = [
    "full-image",
    "split-left-image",
    "split-right-image",
    "top-image-banner",
];

const isRealUrl = (str) =>
    str &&
    (str.startsWith("http://") ||
        str.startsWith("https://") ||
        str.startsWith("data:") ||
        str.startsWith("/") ||
        str.startsWith("blob:"));

const preLoadImage = (url) => {
    if (!url) return;
    const img = new Image();
    img.src = url;
};

/**
 * Manages all image-fetching logic for slides.
 * Isolated so that image state changes (fetchedImages, imageLoading) only
 * cause re-renders in consumers of resolveSlideContent, not the whole page.
 *
 * @param {object} opts
 * @param {Array}  opts.editableSlides
 * @param {function} opts.setEditableSlides
 * @param {function} opts.setPptData
 * @param {number}   opts.activeSlideIndex
 * @param {function} opts.updateSlidesState
 */
export function useImageFetcher({
    editableSlides,
    setEditableSlides,
    setPptData,
    activeSlideIndex,
    updateSlidesState,
}) {
    const [fetchedImages, setFetchedImages] = useState({});
    const [imageLoading, setImageLoading] = useState({});
    const fetchQueueRef = useRef(new Set());

    const searchImagesStore = useMediaStore((state) => state.searchImages);

    const fetchImage = useCallback(async (key, query) => {
        setImageLoading((prev) => ({ ...prev, [key]: true }));
        let finalImageUrl = null;
        try {
            const data = await searchImagesStore(query);
            if (data && data.length > 0) {
                finalImageUrl = data[0].imageURL;
                setFetchedImages((prev) => ({ ...prev, [key]: finalImageUrl }));
            } else {
                throw new Error("No images found in search results");
            }
        } catch (err) {
            console.error(`Failed to fetch image for key ${key}:`, err);
            finalImageUrl = `https://picsum.photos/seed/${encodeURIComponent(query)}/800/600`;
            setFetchedImages((prev) => ({ ...prev, [key]: finalImageUrl }));
        } finally {
            setImageLoading((prev) => ({ ...prev, [key]: false }));

            if (finalImageUrl) {
                preLoadImage(finalImageUrl);
                const keyParts = key.split("_");
                const sIndex = parseInt(keyParts[1], 10);

                const updateSlideImage = (slidesList) => {
                    if (!slidesList || !slidesList[sIndex]) return slidesList;
                    const updated = [...slidesList];
                    if (keyParts.length === 2) {
                        updated[sIndex] = {
                            ...updated[sIndex],
                            image: finalImageUrl,
                            imageDescription: query,
                        };
                    } else if (keyParts.length === 4 && keyParts[2] === "item") {
                        const iIndex = parseInt(keyParts[3], 10);
                        if (updated[sIndex].items && updated[sIndex].items[iIndex]) {
                            const updatedItems = [...updated[sIndex].items];
                            updatedItems[iIndex] = {
                                ...updatedItems[iIndex],
                                image: finalImageUrl,
                                imageDescription: query,
                            };
                            updated[sIndex] = { ...updated[sIndex], items: updatedItems };
                        }
                    }
                    return updated;
                };

                setEditableSlides((prev) => updateSlideImage(prev));
                setPptData((prev) => {
                    if (!prev || !prev.slides) return prev;
                    return { ...prev, slides: updateSlideImage(prev.slides) };
                });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-queue image fetches when slides are loaded/streamed
    useEffect(() => {
        if (!editableSlides || editableSlides.length === 0) return;

        editableSlides.forEach((slide, sIndex) => {
            // --- Macro slide types ---
            if (MACRO_IMAGE_TYPES.includes(slide.type)) {
                const sKey = `slide_${sIndex}`;
                if (isRealUrl(slide.image)) return;
                if (fetchQueueRef.current.has(sKey)) return;
                const query = slide.imageDescription || slide.image;
                if (!query) return;
                fetchQueueRef.current.add(sKey);
                fetchImage(sKey, query);
                return;
            }

            // --- Block-layout image slides ---
            const isImageCategory =
                slide.layout?.category === "images" ||
                slide.layout?.category === "image";
            if (!isImageCategory) return;

            const lType = slide.layout?.type;

            if (lType === "split" || lType === "overlay") {
                const sKey = `slide_${sIndex}`;
                const hasUrl = isRealUrl(slide.image);
                const query = hasUrl ? null : slide.imageDescription || slide.image;
                if (query && !fetchQueueRef.current.has(sKey)) {
                    fetchQueueRef.current.add(sKey);
                    fetchImage(sKey, query);
                }
            } else if (lType === "grid") {
                if (slide.items) {
                    slide.items.forEach((item, iIndex) => {
                        const itemKey = `slide_${sIndex}_item_${iIndex}`;
                        const hasUrl = isRealUrl(item.image);
                        const query = hasUrl ? null : item.imageDescription || item.image;
                        if (query && !fetchQueueRef.current.has(itemKey)) {
                            fetchQueueRef.current.add(itemKey);
                            fetchImage(itemKey, query);
                        }
                    });
                }
            }
        });
    }, [editableSlides, fetchImage]);

    /** Merge fetchedImages / imageLoading into a slide object for rendering */
    const resolveSlideContent = useCallback(
        (slide, index) => {
            if (!slide) return null;
            const resolved = { ...slide };
            const sKey = `slide_${index}`;

            if (fetchedImages[sKey]) resolved.image = fetchedImages[sKey];
            if (imageLoading[sKey]) resolved.imageLoading = true;

            if (resolved.items) {
                resolved.items = resolved.items.map((item, itemIdx) => {
                    const itemKey = `slide_${index}_item_${itemIdx}`;
                    const newItem = { ...item };
                    if (fetchedImages[itemKey]) newItem.image = fetchedImages[itemKey];
                    if (imageLoading[itemKey]) newItem.imageLoading = true;
                    return newItem;
                });
            }
            return resolved;
        },
        [fetchedImages, imageLoading],
    );

    /** Open the library sidebar in image-edit mode (wired via page.jsx callback) */
    const handleEditImage = useCallback((context, openLibrary) => {
        if (openLibrary) openLibrary(context);
    }, []);

    /** Apply an image chosen from the library sidebar to the current slide */
    const handleSelectSidebarImage = useCallback(
        (imageUrl, queryStr, imageEditContext) => {
            if (!imageEditContext || !editableSlides || !editableSlides[activeSlideIndex]) return;

            const updatedSlides = [...editableSlides];
            const slide = { ...updatedSlides[activeSlideIndex] };

            if (imageEditContext.type === "slide") {
                slide.image = imageUrl;
                slide.imageDescription = queryStr;
            } else if (
                imageEditContext.type === "item" &&
                imageEditContext.itemIndex !== undefined
            ) {
                const itemIndex = imageEditContext.itemIndex;
                if (slide.items && slide.items[itemIndex]) {
                    slide.items = [...slide.items];
                    slide.items[itemIndex] = {
                        ...slide.items[itemIndex],
                        image: imageUrl,
                        imageDescription: queryStr,
                    };
                }
            }

            updatedSlides[activeSlideIndex] = slide;

            const cacheKey =
                imageEditContext.type === "slide"
                    ? `slide_${activeSlideIndex}`
                    : `slide_${activeSlideIndex}_item_${imageEditContext.itemIndex}`;

            setFetchedImages((prev) => ({ ...prev, [cacheKey]: imageUrl }));
            updateSlidesState(updatedSlides);
        },
        [editableSlides, activeSlideIndex, updateSlidesState],
    );

    return {
        resolveSlideContent,
        handleEditImage,
        handleSelectSidebarImage,
    };
}
