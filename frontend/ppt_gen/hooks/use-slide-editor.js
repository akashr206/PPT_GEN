import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useHistoryStore } from "@/contexts/history-context";

// --- BSP Helper Functions ---

const createSplit = (direction, first, second) => ({
    id: `split_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    type: "split",
    direction,
    splitRatio: 50,
    first,
    second
});

export const buildAutoBSP = (contentBlocks) => {
    if (!contentBlocks || contentBlocks.length === 0) return { type: "leaf", id: `block_${Date.now()}`, blockType: "content", items: [] };
    if (contentBlocks.length === 1) return { ...contentBlocks[0], type: "leaf" };
    if (contentBlocks.length === 2) return createSplit("horizontal", 
        { ...contentBlocks[0], type: "leaf" }, 
        { ...contentBlocks[1], type: "leaf" }
    );
    if (contentBlocks.length === 3) return createSplit("horizontal",
        { ...contentBlocks[0], type: "leaf" },
        createSplit("vertical", { ...contentBlocks[1], type: "leaf" }, { ...contentBlocks[2], type: "leaf" })
    );
    return createSplit("horizontal",
        createSplit("vertical", { ...contentBlocks[0], type: "leaf" }, { ...contentBlocks[2], type: "leaf" }),
        createSplit("vertical", { ...contentBlocks[1], type: "leaf" }, { ...contentBlocks[3], type: "leaf" })
    );
};

const fixTreeTypes = (node) => {
    if (!node) return null;
    if (node.type === "split") {
        return {
            ...node,
            first: fixTreeTypes(node.first),
            second: fixTreeTypes(node.second)
        };
    }
    if (node.type !== "leaf") {
        return { ...node, type: "leaf", blockType: node.type };
    }
    return node;
};

const createNewBlock = () => ({
    id: `block_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    type: "leaf",
    blockType: "content",
    align: "left",
    layout: { category: "text", type: "large" },
    items: [
        { header: "New Point", description: "Details here" }
    ]
});

export const denormalizeSlide = (slide) => {
    if (!slide) return slide;
    const blocks = [];
    if (slide.header) {
        blocks.push({ ...slide.header, type: "header" });
    }
    
    const extractLeaves = (node) => {
        if (!node) return;
        if (node.type === "leaf" || node.type === "content") {
            const { type, blockType, ...rest } = node;
            blocks.push({ ...rest, type: "content" });
        } else if (node.type === "split") {
            extractLeaves(node.first);
            extractLeaves(node.second);
        }
    };
    
    if (slide.contentTree) {
        if (Array.isArray(slide.contentTree)) {
             slide.contentTree.forEach(b => blocks.push({ ...b, type: "content" }));
        } else {
             extractLeaves(slide.contentTree);
        }
    } else if (slide.blocks) {
        return slide;
    }
    
    const { contentTree, header, ...rest } = slide;
    return { ...rest, blocks };
};

export const normalizeSlides = (slides) => {
    return slides.map(slide => {
        let blocks = slide.blocks || [];
        let currentSlide = { ...slide };
        
        if (Array.isArray(currentSlide.contentTree)) {
            blocks = [...blocks, ...currentSlide.contentTree.map(b => ({ ...b, type: "content" }))];
            delete currentSlide.contentTree;
        }

        if (currentSlide.contentTree) {
            return { ...currentSlide, contentTree: fixTreeTypes(currentSlide.contentTree) };
        }

        const headerBlock = currentSlide.header || blocks.find(b => b.type === "header") || null;
        const contentBlocks = blocks.filter(b => b.type === "content");
        
        const contentTree = buildAutoBSP(contentBlocks);

        const newSlide = { ...currentSlide, header: headerBlock, contentTree };
        delete newSlide.blocks;
        return newSlide;
    });
};

export const updateNode = (node, targetId, updater) => {
    if (!node) return node;
    if (node.id === targetId || (node.type === "header" && node.id === targetId)) {
        return updater(node);
    }
    if (node.type === "leaf" || node.type === "content") return node;
    
    const newFirst = updateNode(node.first, targetId, updater);
    const newSecond = updateNode(node.second, targetId, updater);
    if (newFirst === node.first && newSecond === node.second) return node;
    return { ...node, first: newFirst, second: newSecond };
};

export const deleteNode = (node, targetId) => {
    if (!node) return null;
    if (node.id === targetId) return null;
    if (node.type === "leaf" || node.type === "content") return node;
    
    const newFirst = deleteNode(node.first, targetId);
    const newSecond = deleteNode(node.second, targetId);

    if (!newFirst && !newSecond) return null;
    if (!newFirst) return newSecond;
    if (!newSecond) return newFirst;

    if (newFirst === node.first && newSecond === node.second) return node;
    return { ...node, first: newFirst, second: newSecond };
};

export const countLeaves = (node) => {
    if (!node) return 0;
    if (node.type === "leaf" || node.type === "content") return 1;
    return countLeaves(node.first) + countLeaves(node.second);
};

export const splitLargestLeaf = (node, newLeaf) => {
    const queue = [{ n: node, path: [] }];
    let targetPath = null;
    while (queue.length > 0) {
        const { n, path } = queue.shift();
        if (n.type === "leaf" || n.type === "content") {
            targetPath = path;
            break;
        }
        if (n.first) queue.push({ n: n.first, path: [...path, 'first'] });
        if (n.second) queue.push({ n: n.second, path: [...path, 'second'] });
    }

    if (!targetPath) return node;

    const splitAtPath = (currentNode, pathIndex, currentPath) => {
        if (pathIndex === currentPath.length) {
            const direction = currentPath.length % 2 === 0 ? "horizontal" : "vertical";
            return createSplit(direction, currentNode, newLeaf);
        }
        const dir = currentPath[pathIndex];
        return {
            ...currentNode,
            [dir]: splitAtPath(currentNode[dir], pathIndex + 1, currentPath)
        };
    };

    return splitAtPath(node, 0, targetPath);
};

export const splitSpecificLeaf = (node, targetId, direction, newLeaf) => {
    if (!node) return node;
    if (node.type === "leaf" || node.type === "content") {
        if (node.id === targetId) {
            const splitDirection = (direction === 'top' || direction === 'bottom') ? 'vertical' : 'horizontal';
            const isFirst = (direction === 'top' || direction === 'left');
            return createSplit(splitDirection, isFirst ? newLeaf : node, isFirst ? node : newLeaf);
        }
        return node;
    }
    const newFirst = splitSpecificLeaf(node.first, targetId, direction, newLeaf);
    const newSecond = splitSpecificLeaf(node.second, targetId, direction, newLeaf);
    if (newFirst === node.first && newSecond === node.second) return node;
    return { ...node, first: newFirst, second: newSecond };
};


// --- Hook ---

export function useSlideEditor(initialPptData, isBusy) {
    const [pptData, setPptData] = useState(initialPptData || null);
    const [activeSlideIndex, setActiveSlideIndex] = useState(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const slideParam = params.get("slide");
            if (slideParam !== null) {
                const index = parseInt(slideParam, 10);
                if (!isNaN(index) && index >= 0) {
                    return index;
                }
            }
        }
        return 0;
    });
    const [editableSlides, setEditableSlides] = useState([]);
    const [past, setPast] = useState([]);
    const [future, setFuture] = useState([]);
    const isFirstLoadRef = useRef(true);

    const editableSlidesRef = useRef(editableSlides);
    const pastRef = useRef(past);
    const futureRef = useRef(future);
    const activeSlideIndexRef = useRef(activeSlideIndex);

    useEffect(() => {
        if (initialPptData && initialPptData !== pptData && isFirstLoadRef.current) {
            setPptData(initialPptData);
        }
    }, [initialPptData, pptData]);

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

    useEffect(() => {
        if (pptData?.slides && isFirstLoadRef.current) {
            setEditableSlides(normalizeSlides(JSON.parse(JSON.stringify(pptData.slides))));
            isFirstLoadRef.current = false;
        }
    }, [pptData]);

    const updateSlidesState = useCallback((newSlides) => {
        setPast((prev) => [
            ...prev,
            JSON.parse(JSON.stringify(editableSlidesRef.current)),
        ]);
        setFuture([]);
        setEditableSlides(newSlides);
        setPptData((prev) => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                slides: newSlides,
            };
            // Instantly update the first slide preview, title, and theme in the history store
            const firstSlide = newSlides[0];
            const title = firstSlide?.header?.title || prev.title;
            const theme = prev.theme;
            useHistoryStore.getState().updateFirstSlide(prev.id, firstSlide, title, theme);
            return updated;
        });
    }, []);

    const handleUndo = useCallback(() => {
        if (isBusy) return;
        const currentPast = pastRef.current;
        if (currentPast.length === 0) return;

        const previous = currentPast[currentPast.length - 1];

        const currentSlides = editableSlidesRef.current;
        let diffIndex = -1;
        if (currentSlides && previous) {
            for (let i = 0; i < Math.min(currentSlides.length, previous.length); i++) {
                if (JSON.stringify(currentSlides[i]) !== JSON.stringify(previous[i])) {
                    diffIndex = i;
                    break;
                }
            }
            if (diffIndex === -1) {
                diffIndex = Math.min(previous.length - 1, Math.max(0, Math.min(currentSlides.length, previous.length)));
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

        if (activeSlideIndexRef.current !== diffIndex) {
            setActiveSlideIndex(diffIndex);
            setTimeout(() => {
                executeUndo();
            }, 300);
        } else {
            executeUndo();
        }
    }, [isBusy]);

    const handleRedo = useCallback(() => {
        if (isBusy) return;
        const currentFuture = futureRef.current;
        if (currentFuture.length === 0) return;

        const next = currentFuture[0];

        const currentSlides = editableSlidesRef.current;
        let diffIndex = -1;
        if (currentSlides && next) {
            for (let i = 0; i < Math.min(currentSlides.length, next.length); i++) {
                if (JSON.stringify(currentSlides[i]) !== JSON.stringify(next[i])) {
                    diffIndex = i;
                    break;
                }
            }
            if (diffIndex === -1) {
                diffIndex = Math.min(next.length - 1, Math.max(0, Math.min(currentSlides.length, next.length)));
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

        if (activeSlideIndexRef.current !== diffIndex) {
            setActiveSlideIndex(diffIndex);
            setTimeout(() => {
                executeRedo();
            }, 300);
        } else {
            executeRedo();
        }
    }, [isBusy]);

    const handleLayoutChange = useCallback((category, type) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;

        const updatedSlides = [...slides];
        updatedSlides[activeSlideIndexRef.current] = {
            ...updatedSlides[activeSlideIndexRef.current],
            layout: {
                category: category,
                type: type,
            },
        };

        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    const handleUpdateBlock = useCallback((blockId, field, value) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];

        // Check if it's the header block
        if (slide.header && slide.header.id === blockId) {
            updatedSlides[activeSlideIndexRef.current] = { 
                ...slide, 
                header: { ...slide.header, [field]: value }
            };
        } else if (slide.contentTree) {
            // Otherwise traverse BSP tree
            const updatedTree = updateNode(slide.contentTree, blockId, (node) => ({
                ...node,
                [field]: value
            }));
            updatedSlides[activeSlideIndexRef.current] = { ...slide, contentTree: updatedTree };
        }
        
        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    const handleDeleteBlock = useCallback((blockId) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];

        if (slide.header && slide.header.id === blockId) {
            updatedSlides[activeSlideIndexRef.current] = { ...slide, header: null };
        } else if (slide.contentTree) {
            const updatedTree = deleteNode(slide.contentTree, blockId);
            updatedSlides[activeSlideIndexRef.current] = { ...slide, contentTree: updatedTree };
        }
        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    const handleReplaceBlock = useCallback((blockId, newBlockData) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];

        if (slide.contentTree) {
            const updatedTree = updateNode(slide.contentTree, blockId, (node) => ({
                ...newBlockData,
                id: node.id // preserve the ID
            }));
            updatedSlides[activeSlideIndexRef.current] = { ...slide, contentTree: updatedTree };
            updateSlidesState(updatedSlides);
        }
    }, [isBusy, updateSlidesState]);

    const createNewBlock = () => ({
        id: `block_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        type: "leaf",
        blockType: "content", // explicitly differentiate from header/split
        align: "left",
        layout: { category: "text", type: "large" },
        items: [
            { header: "New Point", description: "Details about this point" }
        ]
    });

    const handleAddBlock = useCallback((customBlockData = null) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];

        if (countLeaves(slide.contentTree) >= 4) {
            import("sonner").then(({ toast }) => toast.error("Maximum 4 blocks allowed per slide"));
            return;
        }

        // Ignore React synthetic events passed accidentally
        if (customBlockData && customBlockData.nativeEvent) {
            customBlockData = null;
        }

        let newBlock = customBlockData
            ? JSON.parse(JSON.stringify(customBlockData))
            : createNewBlock();
            
        newBlock.id = `block_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        let updatedTree = slide.contentTree;

        if (!updatedTree) {
            updatedTree = newBlock;
        } else {
            updatedTree = splitLargestLeaf(updatedTree, newBlock);
        }

        updatedSlides[activeSlideIndexRef.current] = { ...slide, contentTree: updatedTree };
        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    const handleSplitBlock = useCallback((blockId, direction, customBlockData = null) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];

        if (countLeaves(slide.contentTree) >= 4) {
            import("sonner").then(({ toast }) => toast.error("Maximum 4 blocks allowed per slide"));
            return;
        }

        let newBlock = customBlockData 
            ? JSON.parse(JSON.stringify(customBlockData)) 
            : createNewBlock();
            
        newBlock.id = `block_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const updatedTree = splitSpecificLeaf(slide.contentTree, blockId, direction, newBlock);

        updatedSlides[activeSlideIndexRef.current] = { ...slide, contentTree: updatedTree };
        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    const handleUpdateItem = useCallback((blockId, itemIndex, field, value) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];
        if (!slide.contentTree) return;

        const updatedTree = updateNode(slide.contentTree, blockId, (node) => {
            const updatedItems = [...(node.items || [])];
            const cat = node.layout?.category?.toLowerCase();
            const isIconBlock = cat === "icons" || cat === "icon";
            const additionalProps = {};
            if (field === "header" && isIconBlock) {
                additionalProps.iconKeywords = value;
            }

            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                [field]: value,
                ...additionalProps
            };
            return { ...node, items: updatedItems };
        });

        updatedSlides[activeSlideIndexRef.current] = { ...slide, contentTree: updatedTree };
        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    // Omit handleSplitSlide for now as it's complex for BSP. We could flatten first.
    const handleSplitSlide = useCallback((slideIndex, splitIndex) => {
        toast.error("Slide splitting is temporarily disabled in BSP mode.");
    }, []);

    const handleAddItemAtIndex = useCallback((blockId, itemIndex, direction) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];
        if (!slide.contentTree) return;

        const updatedTree = updateNode(slide.contentTree, blockId, (node) => {
            const newItem = { header: "New Item", description: "New Description" };
            const newItems = [...(node.items || [])];
            if (direction === 'before') {
                newItems.splice(itemIndex, 0, newItem);
            } else {
                newItems.splice(itemIndex + 1, 0, newItem);
            }
            return { ...node, items: newItems };
        });

        updatedSlides[activeSlideIndexRef.current] = { ...slide, contentTree: updatedTree };
        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    const handleDeleteItem = useCallback((blockId, itemIndex) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];
        if (!slide.contentTree) return;

        let shouldDeleteBlock = false;
        let updatedTree = updateNode(slide.contentTree, blockId, (node) => {
            const items = node.items || [];
            if (items.length <= 1) {
                shouldDeleteBlock = true;
                return node; // don't change, we will delete the whole block
            }
            const newItems = items.filter((_, idx) => idx !== itemIndex);
            return { ...node, items: newItems };
        });

        if (shouldDeleteBlock) {
            updatedTree = deleteNode(updatedTree, blockId);
        }

        updatedSlides[activeSlideIndexRef.current] = { ...slide, contentTree: updatedTree };
        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    const handleUpdateSlide = useCallback((field, value) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;

        const updatedSlides = [...slides];
        updatedSlides[activeSlideIndexRef.current] = {
            ...updatedSlides[activeSlideIndexRef.current],
            [field]: value,
        };

        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    const handleAddSlide = useCallback((index) => {
        if (isBusy) return;
        const newSlide = {
            type: "normal",
            header: {
                id: `header_${Date.now()}`,
                type: "header",
                title: "Click to edit title",
                subtitle: "Add a compelling subtitle or key takeaway",
                align: "left"
            },
            contentTree: {
                id: `block_${Date.now()}`,
                type: "leaf",
                blockType: "content",
                align: "left",
                layout: { category: "bullets", type: "simple" },
                items: [
                    { header: "First key point", description: "Add supporting details or metrics here" },
                    { header: "Second key point", description: "Expand on the concept with clear evidence" },
                    { header: "Third key point", description: "Conclude with an actionable takeaway" }
                ]
            }
        };
        const updatedSlides = [...editableSlidesRef.current];
        const insertIndex = typeof index === "number" ? index : activeSlideIndexRef.current + 1;
        updatedSlides.splice(insertIndex, 0, newSlide);
        updateSlidesState(updatedSlides);
        setActiveSlideIndex(insertIndex);
    }, [isBusy, updateSlidesState]);

    const handleDeleteSlide = useCallback((index) => {
        if (isBusy) return;
        const currentSlides = editableSlidesRef.current;
        const targetIndex = typeof index === "number" ? index : activeSlideIndexRef.current;
        
        if (!currentSlides || currentSlides.length <= 1) {
            toast.error("A presentation must have at least one slide.");
            return;
        }

        const updatedSlides = currentSlides.filter((_, idx) => idx !== targetIndex);
        updateSlidesState(updatedSlides);

        const activeIndex = activeSlideIndexRef.current;
        if (activeIndex >= updatedSlides.length) {
            setActiveSlideIndex(Math.max(0, updatedSlides.length - 1));
        } else if (activeIndex > targetIndex) {
            setActiveSlideIndex(activeIndex - 1);
        }
    }, [isBusy, updateSlidesState]);

    const handleMoveSlide = useCallback((fromIndex, toIndex) => {
        if (isBusy) return;
        const currentSlides = editableSlidesRef.current;
        if (fromIndex === toIndex || toIndex < 0 || toIndex >= currentSlides.length) return;
        
        const updatedSlides = [...currentSlides];
        const [movedSlide] = updatedSlides.splice(fromIndex, 1);
        updatedSlides.splice(toIndex, 0, movedSlide);
        updateSlidesState(updatedSlides);

        const activeIndex = activeSlideIndexRef.current;
        if (activeIndex === fromIndex) {
            setActiveSlideIndex(toIndex);
        } else if (activeIndex > fromIndex && activeIndex <= toIndex) {
            setActiveSlideIndex(activeIndex - 1);
        } else if (activeIndex < fromIndex && activeIndex >= toIndex) {
            setActiveSlideIndex(activeIndex + 1);
        }
    }, [isBusy, updateSlidesState]);

    return {
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
        handleLayoutChange,
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
    };
}
