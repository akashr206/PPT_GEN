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
    const [fetchedIcons, setFetchedIcons] = useState({});
    const [iconLoading, setIconLoading] = useState({});
    const fetchQueueRef = useRef(new Set());
    const lastQueryRef = useRef({}); // { [itemKey]: lastSearchedQuery }
    const fetchTimeoutRef = useRef({});

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
                    
                    const blockMatch = key.match(/slide_\d+_block_(.+)_item_(\d+)_image/);
                    const itemMatch = !blockMatch ? key.match(/slide_\d+_item_(\d+)_image/) : null;

                    if (!key.includes("_block_") && !key.includes("_item_")) {
                        updated[sIndex] = {
                            ...updated[sIndex],
                            image: finalImageUrl,
                            imageDescription: query,
                        };
                    } else if (blockMatch) {
                        const blockId = blockMatch[1];
                        const iIndex = parseInt(blockMatch[2], 10);
                        const updateTree = (node) => {
                            if (!node) return null;
                            if (node.id === blockId) {
                                if (node.items && node.items[iIndex]) {
                                    const newItems = [...node.items];
                                    newItems[iIndex] = {
                                        ...newItems[iIndex],
                                        image: finalImageUrl,
                                        imageDescription: query
                                    };
                                    return { ...node, items: newItems };
                                }
                                return node;
                            }
                            if (node.type === "split") {
                                return {
                                    ...node,
                                    first: updateTree(node.first),
                                    second: updateTree(node.second)
                                };
                            }
                            return node;
                        };
                        updated[sIndex] = {
                            ...updated[sIndex],
                            contentTree: updateTree(updated[sIndex].contentTree)
                        };
                    } else if (itemMatch) {
                        const iIndex = parseInt(itemMatch[1], 10);
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

    const searchIconsStore = useMediaStore((state) => state.searchIcons);

    const fetchIcon = useCallback(async (key, query) => {
        setIconLoading((prev) => ({ ...prev, [key]: true }));
        try {
            const data = await searchIconsStore(query);
            let finalIconName = "Star";
            if (data && data.length > 0) {
                finalIconName = data[0].name;
            }
            setFetchedIcons((prev) => ({ ...prev, [key]: finalIconName }));

            const sIndex = parseInt(key.split("_")[1], 10);
            const match = key.match(/slide_\d+_block_(.+)_item_(\d+)_icon/);
            const blockId = match ? match[1] : null;
            const iIndex = match ? parseInt(match[2], 10) : null;

            const updateSlideIcon = (slidesList) => {
                if (!slidesList || !slidesList[sIndex]) return slidesList;
                const updated = [...slidesList];

                const updateTree = (node) => {
                    if (!node) return null;
                    if (node.id === blockId) {
                        if (node.items && node.items[iIndex]) {
                            const newItems = [...node.items];
                            newItems[iIndex] = {
                                ...newItems[iIndex],
                                icon: finalIconName,
                                iconQuery: query,
                            };
                            return { ...node, items: newItems };
                        }
                        return node;
                    }
                    if (node.type === "split") {
                        return {
                            ...node,
                            first: updateTree(node.first),
                            second: updateTree(node.second),
                        };
                    }
                    return node;
                };

                updated[sIndex] = {
                    ...updated[sIndex],
                    contentTree: updateTree(updated[sIndex].contentTree),
                };
                return updated;
            };

            setEditableSlides((prev) => updateSlideIcon(prev));
            setPptData((prev) => {
                if (!prev || !prev.slides) return prev;
                return { ...prev, slides: updateSlideIcon(prev.slides) };
            });
        } catch (err) {
            console.error(`Failed to fetch icon for key ${key}:`, err);
        } finally {
            setIconLoading((prev) => ({ ...prev, [key]: false }));
        }
    }, [searchIconsStore, setEditableSlides, setPptData]);

    // Auto-queue image and icon fetches when slides are loaded, streamed, or edited
    useEffect(() => {
        if (!editableSlides || editableSlides.length === 0) return;

        editableSlides.forEach((slide, sIndex) => {
            // --- Macro slide types ---
            if (MACRO_IMAGE_TYPES.includes(slide.type)) {
                const sKey = `slide_${sIndex}`;
                if (isRealUrl(slide.image)) return;
                const query = slide.imageDescription || slide.image;
                if (!query) return;
                
                const isFetching = imageLoading[sKey];
                const isTimeoutPending = !!fetchTimeoutRef.current[sKey];
                const queryChanged = lastQueryRef.current[sKey] !== query;
                
                if (!isFetching) {
                    if (queryChanged) {
                        lastQueryRef.current[sKey] = query;
                        if (fetchTimeoutRef.current[sKey]) clearTimeout(fetchTimeoutRef.current[sKey]);
                        fetchTimeoutRef.current[sKey] = setTimeout(() => {
                            fetchTimeoutRef.current[sKey] = null;
                            fetchImage(sKey, query);
                        }, 1000);
                    } else if (!isTimeoutPending) {
                        fetchTimeoutRef.current[sKey] = setTimeout(() => {
                            fetchTimeoutRef.current[sKey] = null;
                            fetchImage(sKey, query);
                        }, 100);
                    }
                }
                return;
            }

            // --- Block-layout content blocks ---
            const traverseTreeForFetch = (node) => {
                if (!node) return;
                if (node.type === "leaf" || node.type === "content" || node.blockType === "content") {
                    const cat = node.layout?.category?.toLowerCase();
                    const type = node.layout?.type?.toLowerCase();

                    // 1. Fetch relevant images if layout requires them
                    const isImageCategory =
                        cat === "images" ||
                        cat === "image" ||
                        ((cat === "cards" || cat === "card") && type === "image");
                    if (isImageCategory && node.items) {
                        node.items.forEach((item, iIndex) => {
                            const itemKey = `slide_${sIndex}_block_${node.id}_item_${iIndex}_image`;
                            const hasUrl = isRealUrl(item.image);
                            const query = item.imageDescription || item.header || "";
                            if (query) {
                                if (hasUrl && !lastQueryRef.current[itemKey]) {
                                    lastQueryRef.current[itemKey] = query;
                                }
                                const shouldFetch = !hasUrl;
                                const isFetching = imageLoading[itemKey];
                                const isTimeoutPending = !!fetchTimeoutRef.current[itemKey];
                                const queryChanged = lastQueryRef.current[itemKey] !== query;
                                
                                if (shouldFetch && !isFetching) {
                                    if (queryChanged) {
                                        lastQueryRef.current[itemKey] = query;
                                        if (fetchTimeoutRef.current[itemKey]) clearTimeout(fetchTimeoutRef.current[itemKey]);
                                        fetchTimeoutRef.current[itemKey] = setTimeout(() => {
                                            fetchTimeoutRef.current[itemKey] = null;
                                            fetchImage(itemKey, query);
                                        }, 1000);
                                    } else if (!isTimeoutPending) {
                                        fetchTimeoutRef.current[itemKey] = setTimeout(() => {
                                            fetchTimeoutRef.current[itemKey] = null;
                                            fetchImage(itemKey, query);
                                        }, 100);
                                    }
                                }
                            }
                        });
                    }

                    const isIconCategory = cat === "icons" || cat === "icon";
                    if (isIconCategory && node.items) {
                        node.items.forEach((item, iIndex) => {
                            const itemKey = `slide_${sIndex}_block_${node.id}_item_${iIndex}_icon`;
                            const query = item.iconKeywords || item.header || "";
                            if (query) {
                                if (item.icon && !lastQueryRef.current[itemKey]) {
                                    lastQueryRef.current[itemKey] = query;
                                }
                                const shouldFetch = !item.icon;
                                const isFetching = iconLoading[itemKey];
                                const isTimeoutPending = !!fetchTimeoutRef.current[itemKey];
                                const queryChanged = lastQueryRef.current[itemKey] !== query;
                                
                                if (shouldFetch && !isFetching) {
                                    if (queryChanged) {
                                        lastQueryRef.current[itemKey] = query;
                                        if (fetchTimeoutRef.current[itemKey]) clearTimeout(fetchTimeoutRef.current[itemKey]);
                                        fetchTimeoutRef.current[itemKey] = setTimeout(() => {
                                            fetchTimeoutRef.current[itemKey] = null;
                                            fetchIcon(itemKey, query);
                                        }, 1000);
                                    } else if (!isTimeoutPending) {
                                        fetchTimeoutRef.current[itemKey] = setTimeout(() => {
                                            fetchTimeoutRef.current[itemKey] = null;
                                            fetchIcon(itemKey, query);
                                        }, 100);
                                    }
                                }
                            }
                        });
                    }
                } else if (node.type === "split") {
                    traverseTreeForFetch(node.first);
                    traverseTreeForFetch(node.second);
                }
            };

            traverseTreeForFetch(slide.contentTree);
        });
    }, [editableSlides, fetchImage, fetchIcon]);

    /** Merge fetchedImages / imageLoading / fetchedIcons / iconLoading into a slide object for rendering */
    const resolveSlideContent = useCallback(
        (slide, index) => {
            if (!slide) return null;
            const resolved = { ...slide };
            const sKey = `slide_${index}`;

            if (fetchedImages[sKey]) resolved.image = fetchedImages[sKey];
            if (imageLoading[sKey]) resolved.imageLoading = true;

            const traverseAndResolve = (node) => {
                if (!node) return null;
                if (node.type === "leaf" || node.type === "content" || node.blockType === "content") {
                    const resolvedNode = { ...node };
                    if (resolvedNode.items) {
                        resolvedNode.items = resolvedNode.items.map((item, itemIdx) => {
                            const itemImageKey = `slide_${index}_block_${node.id}_item_${itemIdx}_image`;
                            const itemIconKey = `slide_${index}_block_${node.id}_item_${itemIdx}_icon`;
                            const newItem = { ...item };
                            if (fetchedImages[itemImageKey]) newItem.image = fetchedImages[itemImageKey];
                            if (imageLoading[itemImageKey]) newItem.imageLoading = true;
                            if (fetchedIcons[itemIconKey]) newItem.icon = fetchedIcons[itemIconKey];
                            if (iconLoading[itemIconKey]) newItem.iconLoading = true;
                            return newItem;
                        });
                    }
                    return resolvedNode;
                } else if (node.type === "split") {
                    return {
                        ...node,
                        first: traverseAndResolve(node.first),
                        second: traverseAndResolve(node.second)
                    };
                }
                return node;
            };

            if (resolved.contentTree) {
                resolved.contentTree = traverseAndResolve(resolved.contentTree);
            }

            if (resolved.items) {
                resolved.items = resolved.items.map((item, itemIdx) => {
                    const itemImageKey = `slide_${index}_item_${itemIdx}_image`;
                    const itemIconKey = `slide_${index}_item_${itemIdx}_icon`;
                    const newItem = { ...item };
                    if (fetchedImages[itemImageKey]) newItem.image = fetchedImages[itemImageKey];
                    if (imageLoading[itemImageKey]) newItem.imageLoading = true;
                    if (fetchedIcons[itemIconKey]) newItem.icon = fetchedIcons[itemIconKey];
                    if (iconLoading[itemIconKey]) newItem.iconLoading = true;
                    return newItem;
                });
            }
            return resolved;
        },
        [fetchedImages, imageLoading, fetchedIcons, iconLoading],
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
                if (imageEditContext.blockId) {
                    const blockId = imageEditContext.blockId;
                    const updateTree = (node) => {
                        if (!node) return null;
                        if (node.id === blockId) {
                            if (node.items && node.items[itemIndex]) {
                                const newItems = [...node.items];
                                newItems[itemIndex] = {
                                    ...newItems[itemIndex],
                                    image: imageUrl,
                                    imageDescription: queryStr,
                                };
                                return { ...node, items: newItems };
                            }
                            return node;
                        }
                        if (node.type === "split") {
                            return { ...node, first: updateTree(node.first), second: updateTree(node.second) };
                        }
                        return node;
                    };
                    slide.contentTree = updateTree(slide.contentTree);
                } else if (slide.items && slide.items[itemIndex]) {
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
                    : imageEditContext.blockId
                    ? `slide_${activeSlideIndex}_block_${imageEditContext.blockId}_item_${imageEditContext.itemIndex}_image`
                    : `slide_${activeSlideIndex}_item_${imageEditContext.itemIndex}_image`;

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
