import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative z-10 w-full border-t border-white/10 bg-black/20 backdrop-blur-lg py-12 mt-auto">
            <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <img
                        src="/logo.png"
                        alt="Broadside AI"
                        className="w-6 h-6 invert opacity-80"
                    />
                    <span className="text-white/80 font-medium tracking-tight">
                        Broadside AI
                    </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-white/50">
                    <Link href="/terms" className="hover:text-white transition-colors">
                        Terms of Service
                    </Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">
                        Privacy Policy
                    </Link>
                    <a href="mailto:akashr6514@gmail.com" className="hover:text-white transition-colors">
                        Contact
                    </a>
                </div>
                <p className="text-white/40 text-sm">
                    © {new Date().getFullYear()} Broadside AI. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
