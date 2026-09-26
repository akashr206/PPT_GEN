"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SilkyAurora() {
    return (
        <div 
            className="absolute bottom-0 left-[50%] -translate-x-1/2 w-[100vw] h-[800px] pointer-events-none z-0"
            style={{ WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)" }}
        >
            {/* Top and Bottom gradient fade to blend with background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-20" />
            
            {/* Matte Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.04] z-30 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, delay: 1 }}
                className="absolute -bottom-[30%] left-[-10%] right-[-10%] h-[150%] flex items-center justify-center opacity-70 blur-[80px] z-10"
            >
                <motion.div
                    animate={{
                        x: ['0%', '10%', '-5%', '0%'],
                        y: ['0%', '-5%', '5%', '0%'],
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 0.9, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute w-[60%] h-[50%] bg-[#4f46e5]/40 rounded-[100%] left-[10%] top-[20%]"
                />
                <motion.div
                    animate={{
                        x: ['0%', '-15%', '10%', '0%'],
                        y: ['0%', '10%', '-10%', '0%'],
                        rotate: [0, -10, 5, 0],
                        scale: [1, 1.15, 0.85, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                    className="absolute w-[55%] h-[60%] bg-[#7c3aed]/30 rounded-[100%] right-[10%] top-[10%]"
                />
                <motion.div
                    animate={{
                        x: ['0%', '15%', '-15%', '0%'],
                        y: ['0%', '-15%', '10%', '0%'],
                        rotate: [0, 15, -10, 0],
                        scale: [1, 1.1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                    className="absolute w-[70%] h-[50%] bg-[#2563eb]/30 rounded-[100%] left-[20%] bottom-[10%]"
                />
            </motion.div>
        </div>
    );
}
