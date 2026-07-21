import React from "react";
import HeaderBlock from "./HeaderBlock";
import ContentBlock from "./ContentBlock";
import SlideLayout from "./layouts/SlideLayout";
import BlockResizer from "./BlockResizer";
import MacroImage from "./MacroImage";
import { Plus } from "lucide-react";
import Image from "next/image";
import "./global-slide.css";
import "./themes.css";

const BSPRenderer = ({ node, ...props }) => {
    const [localRatio, setLocalRatio] = React.useState(null);
    if (!node) return null;

    if (node.type === "leaf" || node.type === "content") {
        return <ContentBlock block={node} blockId={node.id} {...props} />;
    }

    if (node.type === "split") {
        const activeRatio = localRatio !== null ? localRatio : (node.splitRatio || 50);
        const isHorizontal = node.direction === "horizontal";
        
        return (
            <div className={`flex w-full h-full flex-1 min-h-0 min-w-0 ${isHorizontal ? "flex-row" : "flex-col"}`}>
                <div style={{ flexBasis: `${activeRatio}%` }} className="relative flex shrink min-h-0 min-w-0 ">
                    <BSPRenderer node={node.first} {...props} />
                </div>
                {!props.readOnly && (
                    <BlockResizer
                        direction={node.direction}
                        initialSplitRatio={activeRatio}
                        onResize={(newRatio) => setLocalRatio(newRatio)}
                        onResizeEnd={(newRatio) => {
                            if (props.onUpdateBlock) props.onUpdateBlock(node.id, 'splitRatio', newRatio);
                            setLocalRatio(null);
                        }}
                        isContentBlock={true}
                    />
                )}
                <div style={{ flexBasis: `${100 - activeRatio}%` }} className="relative flex shrink min-h-0 min-w-0">
                    <BSPRenderer node={node.second} {...props} />
                </div>
            </div>
        );
    }
    return null;
};

const Slide = ({
    slide_content,
    onUpdateSlide,
    onUpdateBlock,
    onReplaceBlock,
    onDeleteBlock,
    onAddBlock,
    onUpdateItem,
    onDeleteItem,
    onAddItem,
    theme,
    onEditImage,
    onSplitBlock,
    slideIndex,
    textSizes,
}) => {
    slide_content = slide_content || {};
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
        if (!slide_content) return null;
        if (macroType === "full-image") return null;

        return (
            <div className="flex flex-col gap-[1cqw] w-full h-full p-[3cqw] relative">
                {slide_content.header && (
                    <HeaderBlock
                        key={slide_content.header.id || 'header'}
                        block={slide_content.header}
                        onUpdateBlock={onUpdateBlock ? (f, v) => onUpdateBlock(slide_content.header.id, f, v) : undefined}
                        onDeleteBlock={onDeleteBlock ? () => onDeleteBlock(slide_content.header.id) : undefined}
                        readOnly={!onUpdateSlide}
                        textSizes={textSizes}
                    />
                )}
                
                <div className="flex flex-row w-full flex-1 min-h-0 relative items-stretch">
                    <BSPRenderer
                        node={slide_content.contentTree}
                        onUpdateBlock={onUpdateBlock}
                        onReplaceBlock={onReplaceBlock}
                        onDeleteBlock={onDeleteBlock}
                        onAddBlock={onAddBlock}
                        onSplitBlock={onSplitBlock}
                        onUpdateItem={onUpdateItem}
                        onDeleteItem={onDeleteItem}
                        onAddItem={onAddItem}
                        theme={theme || slide_content.theme}
                        onEditImage={onEditImage}
                        readOnly={!onUpdateSlide}
                        textSizes={textSizes}
                    />
                </div>
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
                        onEditImage={onEditImage ? () => onEditImage({ type: "slide", currentQuery: slide_content.imageDescription || slide_content.imagePrompt }) : undefined}
                        readOnly={!onUpdateSlide}
                        focusPoint={slide_content.imageFocus}
                        onUpdateFocus={(val) => onUpdateSlide && onUpdateSlide("imageFocus", val)}
                    />
                </div>
            );
        }

        if (macroType === "split-left-image") {
            return (
                <div className="flex w-full h-full">
                    <div
                        style={{ width: `${imageSize}%` }}
                        className="relative shrink-0 border-r border-border/10"
                    >
                        <MacroImage
                            imageUrl={imageUrl}
                            imageLoading={slide_content.imageLoading}
                            onEditImage={onEditImage ? () => onEditImage({ type: "slide", currentQuery: slide_content.imageDescription || slide_content.imagePrompt }) : undefined}
                            readOnly={!onUpdateSlide}
                            focusPoint={slide_content.imageFocus}
                            onUpdateFocus={(val) => onUpdateSlide && onUpdateSlide("imageFocus", val)}
                        />
                    </div>
                    {!!onUpdateSlide && (
                        <BlockResizer
                            direction="horizontal"
                            initialSplitRatio={imageSize}
                            onResize={(newRatio) => setLocalImageSize(newRatio)}
                            onResizeEnd={(newRatio) =>
                                onUpdateSlide && onUpdateSlide("imageSize", newRatio)
                            }
                        />
                    )}
                    <div
                        className="relative flex flex-col min-w-0 flex-1"
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
                        className="relative flex flex-col min-w-0 flex-1"
                    >
                        {renderBlocks()}
                    </div>
                    {!!onUpdateSlide && (
                        <BlockResizer
                            direction="horizontal"
                            initialSplitRatio={100 - imageSize}
                            onResize={(newRatio) => setLocalImageSize(100 - newRatio)}
                            onResizeEnd={(newRatio) =>
                                onUpdateSlide && onUpdateSlide("imageSize", 100 - newRatio)
                            }
                        />
                    )}
                    <div
                        style={{ width: `${imageSize}%` }}
                        className="relative shrink-0 border-l border-border/10"
                    >
                        <MacroImage
                            imageUrl={imageUrl}
                            imagePrompt={slide_content.imagePrompt}
                            imageLoading={slide_content.imageLoading}
                            onEditImage={onEditImage ? () => onEditImage({ type: "slide", currentQuery: slide_content.imageDescription || slide_content.imagePrompt }) : undefined}
                            readOnly={!onUpdateSlide}
                            focusPoint={slide_content.imageFocus}
                            onUpdateFocus={(val) => onUpdateSlide && onUpdateSlide("imageFocus", val)}
                        />
                    </div>
                </div>
            );
        }

        if (macroType === "top-image-banner") {
            return (
                <div className="flex flex-col w-full h-full">
                    <div
                        style={{ height: `${imageSize}%` }}
                        className="relative shrink-0 border-b border-border/10"
                    >
                        <MacroImage
                            imageUrl={imageUrl}
                            imagePrompt={slide_content.imagePrompt}
                            imageLoading={slide_content.imageLoading}
                            onEditImage={onEditImage ? () => onEditImage({ type: "slide", currentQuery: slide_content.imageDescription || slide_content.imagePrompt }) : undefined}
                            readOnly={!onUpdateSlide}
                            focusPoint={slide_content.imageFocus}
                            onUpdateFocus={(val) => onUpdateSlide && onUpdateSlide("imageFocus", val)}
                        />
                    </div>
                    {!!onUpdateSlide && (
                        <BlockResizer
                            direction="vertical"
                            initialSplitRatio={imageSize}
                            onResize={(newRatio) => setLocalImageSize(newRatio)}
                            onResizeEnd={(newRatio) =>
                                onUpdateSlide && onUpdateSlide("imageSize", newRatio)
                            }
                        />
                    )}
                    <div
                        className="relative flex flex-col min-h-0 flex-1"
                    >
                        {renderBlocks()}
                    </div>
                </div>
            );
        }



        // normal, agenda, closing - render blocks normally
        return renderBlocks();
    };

    return (
        <div
            className="slide flex flex-col theme-container group/slide bg-theme-bg text-theme-fg relative"
            data-theme={theme || slide_content.theme}
            style={textSizes ? {
                '--text-title': `${textSizes.title}cqw`,
                '--text-subtitle': `${textSizes.subtitle}cqw`,
                '--text-heading': `${textSizes.heading}cqw`,
                '--text-description': `${textSizes.description}cqw`
            } : {}}
        >
            {!slide_content.header && !!onUpdateSlide && (
                <div className="absolute top-[1.5cqw] left-[1.5cqw] z-40 transition-opacity opacity-0 group-hover/slide:opacity-100 pointer-events-auto">
                    <button
                        onClick={() => onUpdateSlide("header", { id: "header", type: "header", title: "New Title", subtitle: "New Subtitle", align: "left" })}
                        className="flex items-center gap-[0.5cqw] text-[1.2cqw] bg-background/95 border border-border/50 px-[0.8cqw] py-[0.3cqw] rounded-sm shadow-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors cursor-pointer"
                        title="Add Header"
                    >
                        <Plus className="w-[1.4cqw] h-[1.4cqw]" />
                        <span>Add Header</span>
                    </button>
                </div>
            )}
            <div className="slide-content">{renderMacroShell()}</div>
        </div>
    );
};

export default Slide;
