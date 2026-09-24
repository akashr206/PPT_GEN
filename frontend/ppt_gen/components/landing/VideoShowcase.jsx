"use client";

import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function VideoShowcase() {
    const [isMuted, setIsMuted] = useState(true);

    return (
        <section className="relative z-10 w-full h-screen max-w-7xl 2xl:max-w-330 mx-auto px-4">
            <div className="relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 100 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="group/video"
                >
                    <div className="relative aspect-video transform-[translateZ(0)]">
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
                </motion.div>
            </div>
        </section>
    );
}
