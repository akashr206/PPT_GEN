"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SilkyAurora() {
    const containerRef = useRef(null);

    useGSAP(() => {
        // Master timeline for entry
        gsap.to(containerRef.current, {
            opacity: 1,
            duration: 3,
            delay: 1,
            ease: "power2.out"
        });

        // Continuous animations for blobs
        gsap.to(".aurora-blob-1", {
            xPercent: 10,
            yPercent: -5,
            rotation: 5,
            scale: 1.1,
            duration: 7.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(".aurora-blob-2", {
            xPercent: -15,
            yPercent: 10,
            rotation: -10,
            scale: 1.15,
            duration: 9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1
        });

        gsap.to(".aurora-blob-3", {
            xPercent: 15,
            yPercent: -15,
            rotation: 15,
            scale: 1.2,
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2
        });
    }, { scope: containerRef });

    return (
        <div 
            className="absolute bottom-0 left-[50%] -translate-x-1/2 w-[100vw] h-[800px] pointer-events-none z-0"
            style={{ WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)" }}
        >
            {/* Top and Bottom gradient fade to blend with background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-20" />
            
            {/* Matte Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.04] z-30 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

            <div
                ref={containerRef}
                className="absolute -bottom-[30%] left-[-10%] right-[-10%] h-[150%] flex items-center justify-center opacity-0 blur-[80px] z-10"
            >
                <div
                    className="aurora-blob-1 absolute w-[60%] h-[50%] bg-[#4f46e5]/40 rounded-[100%] left-[10%] top-[20%]"
                />
                <div
                    className="aurora-blob-2 absolute w-[55%] h-[60%] bg-[#7c3aed]/30 rounded-[100%] right-[10%] top-[10%]"
                />
                <div
                    className="aurora-blob-3 absolute w-[70%] h-[50%] bg-[#2563eb]/30 rounded-[100%] left-[20%] bottom-[10%]"
                />
            </div>
        </div>
    );
}
