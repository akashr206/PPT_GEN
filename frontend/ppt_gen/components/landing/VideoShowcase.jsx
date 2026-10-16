"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function VideoShowcase() {
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(".video-container", 
        {
            y: 100,
            opacity: 0,
            scale: 0.95,
        },
        {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative my-10 z-10 w-full max-w-7xl 2xl:max-w-330 mx-auto px-4">
            <div className="relative">
                <div className="group/video video-container">
                    <div className="relative aspect-video transform-[translateZ(0)] rounded-[1.25rem] overflow-hidden border border-white/10 shadow-2xl bg-white/[0.02]">
                        <video
                            src="/broadside-ai-info.webm"
                            className="w-full h-full object-contain rounded-xl"
                            autoPlay
                            muted={isMuted}
                            loop
                            playsInline
                            controls={false}
                        />
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover/video:opacity-100"
                        >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
