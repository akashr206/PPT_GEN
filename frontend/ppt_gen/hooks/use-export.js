import { useState, useEffect } from "react";
import { toast } from "sonner";
import { extractSlideData } from "@/utils/extractor";
import api from "@/lib/api";

/**
 * Manages PDF and PPTX export logic.
 * Isolated so that toggling isGeneratingPDF / isExtractingPPTX doesn't
 * cascade re-renders into the slide viewer.
 *
 * @param {object} opts
 * @param {Array}  opts.editableSlides
 * @param {object} opts.pptData
 * @param {function} opts.resolveSlideContent
 */
export function useExport({ editableSlides, pptData }) {
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [isExtractingPPTX, setIsExtractingPPTX] = useState(false);

    // PDF generation — fires when isGeneratingPDF flips to true
    useEffect(() => {
        if (!isGeneratingPDF) return;

        let active = true;

        const generate = async () => {
            const toastId = toast.loading("Preparing slides for high-res PDF export");

            // Give browser time to render the hidden slides
            await new Promise((resolve) => setTimeout(resolve, 800));
            if (!active) return;

            try {
                const { jsPDF } = await import("jspdf");
                const html2canvas = (await import("html2canvas-pro")).default;

                const pdf = new jsPDF({
                    orientation: "landscape",
                    unit: "px",
                    format: [1280, 720],
                });

                for (let i = 0; i < editableSlides.length; i++) {
                    if (!active) return;

                    const element = document.getElementById(`pdf-slide-${i}`);
                    if (!element) {
                        console.error(`Element pdf-slide-${i} not found`);
                        continue;
                    }

                    const canvas = await html2canvas(element, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        width: 1280,
                        height: 720,
                        windowWidth: 1280,
                        windowHeight: 720,
                    });

                    if (!active) return;
                    const imgData = canvas.toDataURL("image/jpeg", 0.95);

                    if (i > 0) pdf.addPage([1280, 720], "landscape");
                    pdf.addImage(imgData, "JPEG", 0, 0, 1280, 720);
                }

                if (!active) return;
                pdf.save(`${pptData?.title || "presentation"}.pdf`);
                toast.success("PDF Downloaded successfully!");
            } catch (err) {
                console.error("PDF generation failed:", err);
                if (active) toast.error("Failed to generate PDF. Please try again.");
            } finally {
                toast.dismiss(toastId);
                if (active) setIsGeneratingPDF(false);
            }
        };

        generate();
        return () => { active = false; };
    }, [isGeneratingPDF, editableSlides, pptData]);

    const handleDownloadAsPPT = async () => {
        const toastId = toast.loading("Preparing slides for PowerPoint export");
        setIsExtractingPPTX(true);

        // Give the browser time to render the hidden slides at full size (1280x720)
        await new Promise((resolve) => setTimeout(resolve, 800));

        try {
            const allSlidesData = [];
            for (let i = 0; i < editableSlides.length; i++) {
                const element = document.getElementById(`pptx-slide-${i}`);
                if (!element) {
                    throw new Error(
                        `Failed to find off-screen slide container for slide ${i + 1}`,
                    );
                }
                const slideData = await extractSlideData(element.firstChild || element);
                allSlidesData.push(slideData);
            }

            const blob = await api.post(
                "/api/ppt/convert",
                { slides: allSlidesData },
                { responseType: "blob" },
            );
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${pptData?.title || "presentation"}.pptx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            toast.success("PPTX downloaded successfully!");
        } catch (err) {
            console.error("Failed to convert slides to PowerPoint:", err);
            toast.error("Failed to export slides to PPTX");
        } finally {
            setIsExtractingPPTX(false);
            toast.dismiss(toastId);
        }
    };

    return {
        isGeneratingPDF,
        isExtractingPPTX,
        setIsGeneratingPDF,
        handleDownloadAsPPT,
    };
}
