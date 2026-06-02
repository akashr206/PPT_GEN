"use client";

import React from "react";

export function HeroSection({user}) {
    return (
        <div className="text-center mb-12 transition-all">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                Hello <span className="text-transparent bg-clip-text bg-linear-to-b from-black to-red-500 dark:from-white">{user ? user : "User"}</span>
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight mb-5 text-zinc-800 dark:text-zinc-100/90">
                What will we present today?
            </h2>
        </div>
    );
}
