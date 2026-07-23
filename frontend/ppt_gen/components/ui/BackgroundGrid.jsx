"use client";

import { usePathname } from "next/navigation";

export default function BackgroundGrid() {
    const pathname = usePathname();

    // Do not show the static grid on the landing page
    if (pathname === "/") {
        return null;
    }

    return (
        <>
            {/* Light Mode dot grid background */}
            <div
                className="pointer-events-none fixed inset-0 z-1 dark:hidden"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.15) 1.5px, transparent 0)",
                    backgroundSize: "32px 32px",
                }}
            />
            {/* Dark Mode dot grid background */}
            <div
                className="pointer-events-none fixed inset-0 z-1 hidden dark:block"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1.5px, transparent 0)",
                    backgroundSize: "32px 32px",
                }}
            />
        </>
    );
}
