import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

export function useSlideEditor(initialPptData, isBusy) {
    const [pptData, setPptData] = useState(initialPptData || null);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
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
            setEditableSlides(JSON.parse(JSON.stringify(pptData.slides)));
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
        setPptData((prev) => ({
            ...prev,
            slides: newSlides,
        }));
    }, []);

    const handleUndo = useCallback(() => {
        if (isBusy) return;
        const currentPast = pastRef.current;
        if (currentPast.length === 0) return;

        const previous = currentPast[currentPast.length - 1];

        // Find modified slide index to set as active
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

        // Find modified slide index to set as active
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

    const handleUpdateBlock = useCallback((blockIndex, field, value) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];
        if (!slide.blocks) return;

        const updatedBlocks = [...slide.blocks];
        updatedBlocks[blockIndex] = {
            ...updatedBlocks[blockIndex],
            [field]: value,
        };

        updatedSlides[activeSlideIndexRef.current] = { ...slide, blocks: updatedBlocks };
        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    const handleDeleteBlock = useCallback((blockIndex) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];
        if (!slide.blocks) return;

        const updatedBlocks = slide.blocks.filter((_, idx) => idx !== blockIndex);
        
        // Space recovery: strip custom 'width' from all remaining blocks
        const recoveredBlocks = updatedBlocks.map((b) => {
            const newBlock = { ...b };
            delete newBlock.width;
            return newBlock;
        });

        updatedSlides[activeSlideIndexRef.current] = { ...slide, blocks: recoveredBlocks };
        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    const handleAddBlock = useCallback((insertIndex) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];
        const currentBlocks = slide.blocks || [];

        if (currentBlocks.length >= 6) {
            toast.error("Maximum 6 blocks allowed per slide");
            return;
        }

        const newBlock = {
            id: `block_${Date.now()}`,
            type: "content",
            align: "left",
            layout: { category: "bullets", type: "simple" },
            items: [
                { header: "New Point", description: "Details about this point" }
            ]
        };

        let newBlocks = [...currentBlocks];
        if (typeof insertIndex === 'number' && insertIndex >= 0 && insertIndex <= currentBlocks.length) {
            newBlocks.splice(insertIndex, 0, newBlock);
        } else {
            newBlocks.push(newBlock);
        }

        updatedSlides[activeSlideIndexRef.current] = { 
            ...slide, 
            blocks: newBlocks 
        };
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

    const handleUpdateItem = useCallback((blockIndex, itemIndex, field, value) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];
        if (!slide.blocks || !slide.blocks[blockIndex]) return;

        const updatedBlocks = [...slide.blocks];
        const updatedItems = [...(updatedBlocks[blockIndex].items || [])];

        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            [field]: value,
        };

        updatedBlocks[blockIndex] = {
            ...updatedBlocks[blockIndex],
            items: updatedItems,
        };

        updatedSlides[activeSlideIndexRef.current] = { ...slide, blocks: updatedBlocks };
        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    const handleSplitSlide = useCallback((slideIndex, splitIndex) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[slideIndex]) return;

        const originalSlide = slides[slideIndex];
        const blocksToSplit = originalSlide.blocks.slice(splitIndex);
        const remainingBlocks = originalSlide.blocks.slice(0, splitIndex);

        if (blocksToSplit.length === 0) return;

        const newSlide = {
            ...JSON.parse(JSON.stringify(originalSlide)),
            id: `slide_${Date.now()}`,
            blocks: blocksToSplit,
        };

        const updatedSlides = [...slides];
        updatedSlides[slideIndex] = {
            ...originalSlide,
            blocks: remainingBlocks,
        };

        updatedSlides.splice(slideIndex + 1, 0, newSlide);

        updateSlidesState(updatedSlides);
        setActiveSlideIndex(slideIndex + 1);
        toast.success("Slide split successfully");
    }, [isBusy, updateSlidesState]);

    const handleAddItemAtIndex = useCallback((blockIndex, itemIndex, direction) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];
        if (!slide.blocks || !slide.blocks[blockIndex]) return;

        const updatedBlocks = [...slide.blocks];
        const items = updatedBlocks[blockIndex].items || [];

        const newItem = {
            header: "New Item",
            description: "New Description"
        };

        const newItems = [...items];
        if (direction === 'before') {
            newItems.splice(itemIndex, 0, newItem);
        } else {
            newItems.splice(itemIndex + 1, 0, newItem);
        }

        updatedBlocks[blockIndex] = {
            ...updatedBlocks[blockIndex],
            items: newItems,
        };

        updatedSlides[activeSlideIndexRef.current] = { ...slide, blocks: updatedBlocks };
        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState]);

    const handleDeleteItem = useCallback((blockIndex, itemIndex) => {
        if (isBusy) return;
        const slides = editableSlidesRef.current;
        if (!slides || !slides[activeSlideIndexRef.current]) return;
        const updatedSlides = [...slides];
        const slide = updatedSlides[activeSlideIndexRef.current];
        if (!slide.blocks || !slide.blocks[blockIndex]) return;

        const updatedBlocks = [...slide.blocks];
        const items = updatedBlocks[blockIndex].items || [];

        if (items.length <= 1) {
            handleDeleteBlock(blockIndex);
            return;
        }

        const newItems = items.filter((_, idx) => idx !== itemIndex);

        updatedBlocks[blockIndex] = {
            ...updatedBlocks[blockIndex],
            items: newItems,
        };

        updatedSlides[activeSlideIndexRef.current] = { ...slide, blocks: updatedBlocks };
        updateSlidesState(updatedSlides);
    }, [isBusy, updateSlidesState, handleDeleteBlock]);

    const handleAddSlide = useCallback((index) => {
        if (isBusy) return;
        const newSlide = {
            type: "normal",
            blocks: [
                {
                    id: "h1",
                    type: "header",
                    title: "New Slide",
                    subtitle: "Add description...",
                    align: "left"
                },
                {
                    id: "c1",
                    type: "content",
                    align: "left",
                    layout: { category: "bullets", type: "standard" },
                    items: [
                        { header: "Point 1", description: "Details about this point" },
                        { header: "Point 2", description: "Details about this point" },
                    ]
                }
            ]
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
        handleUpdateSlide,
        handleUpdateItem,
        handleSplitSlide,
        handleAddItemAtIndex,
        handleDeleteItem,
        handleAddSlide,
        handleDeleteSlide,
        handleMoveSlide,
        // Expose refs for stale-closure-safe access in external hooks
        editableSlidesRef,
        activeSlideIndexRef,
    };
}
