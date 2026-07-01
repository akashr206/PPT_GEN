"use client";

import React from "react";
import { Navbar } from "@/components/generate/navbar";
import { motion } from "framer-motion";

export default function GenerateLayout({ children }) {
  return (
    <div className="h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-50 font-sans overflow-hidden relative">

      <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Navbar />
        </div>
      </div>

      <main className="h-full w-full flex flex-col relative bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] overflow-hidden">

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/4 -left-[10%] w-[50%] h-[50%] bg-gradient-to-r from-violet-600/30 to-blue-600/30 blur-[130px] rounded-full pointer-events-none z-0 mix-blend-screen transform -rotate-12 dark:opacity-70 opacity-40"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute bottom-1/4 -right-[10%] w-[50%] h-[50%] bg-gradient-to-l from-violet-600/25 to-blue-600/25 blur-[140px] rounded-full pointer-events-none z-0 mix-blend-screen transform rotate-12 dark:opacity-70 opacity-40"
        />

        <div className="flex-1 min-h-0 flex relative z-10 pt-14">
          {children}
        </div>
      </main>
    </div>
  );
}
