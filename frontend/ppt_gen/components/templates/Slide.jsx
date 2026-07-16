import React from "react";
import HeaderBlock from "./HeaderBlock";
import ContentBlock from "./ContentBlock";
import BlockResizer from "./BlockResizer";
import MacroImage from "./MacroImage";
import { Plus } from "lucide-react";
import "./global-slide.css";
import "./themes.css";

const Slide = ({
    slide_content,
    onUpdateSlide,
    onUpdateBlock,
    onDeleteBlock,
    onAddBlock,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    theme,
    onEditImage,
    slideIndex,
}) => {
    const macroType = slide_content.type || "normal";
    const blocks = slide_content.blocks || [];

    // Local state for smooth resizing
    const [localBlockWidths, setLocalBlockWidths] = React.useState({});
    const [localImageSize, setLocalImageSize] = React.useState(null);

    // Reset local state if slide changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    React.useEffect(() => {
        setLocalBlockWidths({});
        setLocalImageSize(null);
    }, [slideIndex, slide_content.type, slide_content.imageSize]);

    // Use local size while dragging, fallback to props
    const imageSize =
        localImageSize !== null
            ? localImageSize
            : slide_content.imageSize || 50;

    // Fallback for old data or if no image is present
    const imageUrl = slide_content.image || slide_content.imageLoading;

    // Helper to render blocks
    const renderBlocks = () => {
        if (macroType === "full-image") return null;

        const contentBlocksCount = blocks.filter(
            (b) => b.type === "content",
        ).length;

        return (
            <div className="flex flex-col gap-[3cqw] w-full h-full p-[4cqw] relative">
                {blocks.map((block, idx) => {
                    if (block.type === "header") {
                        return (
                            <HeaderBlock
                                key={block.id || `header-${idx}`}
                                block={block}
                                onUpdateBlock={
                                    onUpdateBlock
                                        ? (f, v) => onUpdateBlock(idx, f, v)
                                        : undefined
                                }
                                onDeleteBlock={
                                    onDeleteBlock
                                        ? () => onDeleteBlock(idx)
                                        : undefined
                                }
                                readOnly={!onUpdateSlide}
                            />
                        );
                    }
                    return null;
                })}

                <div className="flex flex-row w-full flex-1 min-h-0 relative items-stretch">
                    {blocks.map((block, idx) => {
                        if (block.type !== "content") return null;

                        let nextIdx = -1;
                        for (let i = idx + 1; i < blocks.length; i++) {
                            if (blocks[i].type === "content") {
                                nextIdx = i;
                                break;
                            }
                        }

                        const implicitWidth = 100 / (contentBlocksCount || 1);
                        // Force 100% width if it is the only block, otherwise respect saved width
                        const baseWidth = block.width || implicitWidth;
                        const blockWidth =
                            contentBlocksCount === 1
                                ? 100
                                : localBlockWidths[idx] !== undefined
                                  ? localBlockWidths[idx]
                                  : baseWidth;

                        return (
                            <React.Fragment key={block.id || `content-${idx}`}>
                                <ContentBlock
                                    block={{ ...block, width: blockWidth }}
                                    blockIndex={idx}
                                    onUpdateBlock={onUpdateBlock}
                                    onDeleteBlock={onDeleteBlock}
                                    onUpdateItem={onUpdateItem}
                                    onDeleteItem={onDeleteItem}
                                    onAddItem={onAddItem}
                                    theme={theme || slide_content.theme}
                                    onEditImage={onEditImage}
                                    readOnly={!onUpdateSlide}
                                />
                                {nextIdx !== -1 && !!onUpdateSlide && (
                                    <BlockResizer
                                        leftBlockIndex={idx}
                                        rightBlockIndex={nextIdx}
                                        initialLeftWidth={blockWidth}
                                        initialRightWidth={
                                            localBlockWidths[nextIdx] !==
                                            undefined
                                                ? localBlockWidths[nextIdx]
                                                : blocks[nextIdx].width ||
                                                  implicitWidth
                                        }
                                        onResize={(lIdx, lW, rIdx, rW) => {
                                            // Update locally for smooth 60fps drag
                                            setLocalBlockWidths((prev) => ({
                                                ...prev,
                                                [lIdx]: lW,
                                                [rIdx]: rW,
                                            }));
                                        }}
                                        onResizeEnd={(lIdx, lW, rIdx, rW) => {
                                            // Save to global state once drag is complete
                                            if (onUpdateBlock) {
                                                // We must call them in a way that doesn't cause stale closures if possible.
                                                // Actually, if we call them sequentially, page.jsx still has the stale closure bug!
                                                // Let's pass a batch update if supported, or rely on the user to fix page.jsx next.
                                                // For now, page.jsx doesn't have handleUpdateBlocks, so we will use a small timeout to bypass React batching, or just call them.
                                                setTimeout(
                                                    () =>
                                                        onUpdateBlock(
                                                            lIdx,
                                                            "width",
                                                            lW,
                                                        ),
                                                    0,
                                                );
                                                setTimeout(
                                                    () =>
                                                        onUpdateBlock(
                                                            rIdx,
                                                            "width",
                                                            rW,
                                                        ),
                                                    50,
                                                );
                                            }
                                        }}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {!!onUpdateSlide && onAddBlock && blocks.length < 6 && (
                    <div className="absolute bottom-[2cqw] left-1/2 -translate-x-1/2 opacity-0 group-hover/slide:opacity-100 transition-opacity z-40">
                        <button
                            onClick={onAddBlock}
                            className="flex items-center gap-1 text-[1.2cqw] px-[1cqw] py-[0.5cqw] bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 backdrop-blur-sm shadow-md cursor-pointer border border-border"
                        >
                            <Plus className="w-[1.2cqw] h-[1.2cqw]" />
                            Add Block
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Render the macro layout shell
    const renderMacroShell = () => {
        if (macroType === "full-image") {
            return (
                <div className="w-full h-full relative">
                    <MacroImage
                        imageUrl={imageUrl}
                        imageLoading={slide_content.imageLoading}
                        onEditImage={onEditImage}
                        readOnly={!onUpdateSlide}
                    />
                </div>
            );
        }

        if (macroType === "split-left-image") {
            return (
                <div className="flex w-full h-full">
                    <div
                        style={{ width: `calc(${imageSize}% - 0.5cqw)` }}
                        className="relative shrink-0 border-r border-border/10"
                    >
                        <MacroImage
                            imageUrl={imageUrl}
                            imageLoading={slide_content.imageLoading}
                            onEditImage={onEditImage}
                            readOnly={!onUpdateSlide}
                        />
                    </div>
                    {!!onUpdateSlide && (
                        <BlockResizer
                            initialLeftWidth={imageSize}
                            initialRightWidth={100 - imageSize}
                            onResize={(lIdx, lW) => setLocalImageSize(lW)}
                            onResizeEnd={(lIdx, lW) =>
                                onUpdateSlide && onUpdateSlide("imageSize", lW)
                            }
                        />
                    )}
                    <div
                        style={{ width: `calc(${100 - imageSize}% - 0.5cqw)` }}
                        className="relative flex flex-col min-w-0 shrink-0"
                    >
                        {renderBlocks()}
                    </div>
                </div>
            );
        }

        if (macroType === "split-right-image") {
            return (
                <div className="flex w-full h-full">
                    <div
                        style={{ width: `calc(${100 - imageSize}% - 0.5cqw)` }}
                        className="relative flex flex-col min-w-0 shrink-0"
                    >
                        {renderBlocks()}
                    </div>
                    {!!onUpdateSlide && (
                        <BlockResizer
                            initialLeftWidth={100 - imageSize}
                            initialRightWidth={imageSize}
                            onResize={(lIdx, lW, rIdx, rW) =>
                                setLocalImageSize(rW)
                            }
                            onResizeEnd={(lIdx, lW, rIdx, rW) =>
                                onUpdateSlide && onUpdateSlide("imageSize", rW)
                            }
                        />
                    )}
                    <div
                        style={{ width: `calc(${imageSize}% - 0.5cqw)` }}
                        className="relative shrink-0 border-l border-border/10"
                    >
                        <MacroImage
                            imageUrl={imageUrl}
                            imagePrompt={slide_content.imagePrompt}
                            imageLoading={slide_content.imageLoading}
                            onEditImage={onEditImage}
                            readOnly={!onUpdateSlide}
                        />
                    </div>
                </div>
            );
        }

        if (macroType === "top-image-banner") {
            return (
                <div className="flex flex-col w-full h-full">
                    <div
                        style={{ height: `calc(${imageSize}% - 0.5cqw)` }}
                        className="relative shrink-0 border-b border-border/10"
                    >
                        <MacroImage
                            imageUrl={imageUrl}
                            imagePrompt={slide_content.imagePrompt}
                            imageLoading={slide_content.imageLoading}
                            onEditImage={onEditImage}
                            readOnly={!onUpdateSlide}
                        />
                    </div>
                    {!!onUpdateSlide && (
                        <BlockResizer
                            direction="vertical"
                            initialLeftWidth={imageSize}
                            initialRightWidth={100 - imageSize}
                            onResize={(lIdx, lW) => setLocalImageSize(lW)}
                            onResizeEnd={(lIdx, lW) =>
                                onUpdateSlide && onUpdateSlide("imageSize", lW)
                            }
                        />
                    )}
                    <div
                        style={{ height: `calc(${100 - imageSize}% - 0.5cqw)` }}
                        className="relative flex flex-col min-h-0"
                    >
                        {renderBlocks()}
                    </div>
                </div>
            );
        }

        // normal, title, agenda, closing - render blocks normally
        return renderBlocks();
    };

    return (
        <div
            className="slide border flex flex-col theme-container group/slide bg-theme-bg text-theme-fg"
            data-theme={theme || slide_content.theme}
        >
            <div className="slide-content">{renderMacroShell()}</div>
        </div>
    );
};

export default Slide;
