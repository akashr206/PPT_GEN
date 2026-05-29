"use client";
import React from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { motion, AnimatePresence } from "framer-motion";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PDFViewer({ pdfUrl, pageNumber, numPages, setPageNumber, setNumPages }) {
  const [direction, setDirection] = React.useState(1);
  const containerRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          const availableWidth = width < 640 ? width - 12 : width - 32; 
          const availableHeight = height; 
          
          const widthConstrainedByHeight = availableHeight * (16 / 9);
          const targetWidth = Math.min(availableWidth, widthConstrainedByHeight);
          
          setScale(targetWidth / 1280);
        }
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
    setDirection(1);
  }

  const handleNext = () => {
    setDirection(1);
    setPageNumber(p => p + 1);
  };

  const handlePrev = () => {
    setDirection(-1);
    setPageNumber(p => p - 1);
  };

  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && numPages && pageNumber < numPages) {
      handleNext();
    }
    if (isRightSwipe && pageNumber > 1) {
      handlePrev();
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        if (numPages && pageNumber < numPages) {
          handleNext();
        }
      } else if (e.key === "ArrowLeft") {
        if (pageNumber > 1) {
          handlePrev();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageNumber, numPages]);

  const variants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 30 : -30
    }),
    animate: {
      opacity: 1,
      x: 0
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -30 : 30
    })
  };

  return (
    <div 
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="flex-1 flex flex-col items-center justify-center bg-background/50 rounded-xl sm:rounded-2xl border border-border overflow-hidden relative pb-12 pt-2 sm:pb-16 sm:pt-4 w-full h-full select-none"
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<Loader2 className="animate-spin text-primary my-20" size={40} />}
        error={<p className="text-destructive">Failed to load PDF file.</p>}
        className="w-full h-full flex flex-col items-center justify-center"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={pageNumber} 
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full h-full flex items-center justify-center relative"
          >
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div 
                style={{
                  width: 1280,
                  height: 720,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center'
                }}
                className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] rounded-lg overflow-hidden border border-border bg-white ring-1 ring-border flex items-center justify-center shrink-0"
              >
                <Page 
                  width={1280}
                  pageNumber={pageNumber} 
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Document>
      
      {numPages && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/90 px-2.5 py-1 rounded-full border border-border backdrop-blur-md z-20">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-foreground hover:bg-accent"
            disabled={pageNumber <= 1} 
            onClick={handlePrev}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs font-medium text-foreground min-w-[45px] text-center select-none">
            {pageNumber} / {numPages}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-foreground hover:bg-accent"
            disabled={pageNumber >= numPages} 
            onClick={handleNext}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
