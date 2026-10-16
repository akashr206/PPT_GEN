"use client";

import { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import InteractiveDotGrid from "@/components/ui/InteractiveDotGrid";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import VideoShowcase from "@/components/landing/VideoShowcase";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import LoginModal from "@/components/landing/LoginModal";

export default function LandingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const [slides, setSlides] = useState(6);
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    const loaderRef = useRef(null);
    const logoRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.to(logoRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            ease: "power2.inOut",
            delay: 0.8 // Show logo for a bit longer
        });
        tl.to(loaderRef.current, {
            y: "-100%",
            duration: 1.2,
            ease: "power3.inOut"
        });
    }, { scope: loaderRef });

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        let animationId;

        function raf(time) {
            lenis.raf(time);
            animationId = requestAnimationFrame(raf);
        }

        animationId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(animationId);
            lenis.destroy();
        };
    }, []);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [session, status, router]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (prompt.trim()) {
            const targetUrl = `/generate?prompt=${encodeURIComponent(prompt)}&slides=${slides}`;
            if (status === "authenticated") {
                router.push(targetUrl);
            } else {
                setShowLoginModal(true);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-50 font-sans selection:bg-blue-500/30 relative overflow-hidden flex flex-col">
            {/* Awwwards Style Initial Loader Overlay */}
            <div
                ref={loaderRef}
                className="fixed inset-0 z-[100] bg-black flex items-center justify-center origin-top"
            >
                <div
                    ref={logoRef}
                    className="flex items-center gap-3"
                >
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 invert" />
                    <span className="text-white font-medium tracking-tight text-xl">Broadside AI</span>
                </div>
            </div>


            <InteractiveDotGrid
                spacing={28}
                dotRadius={1.2}
                repelRadius={200}
                maxRepel={30}
                className="[mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_95%)]"
            />

            {/* Navigation */}
            <Navbar
                session={session}
                status={status}
                onSignIn={() => setShowLoginModal(true)}
            />

            {/* Main Content Sections with uniform vertical spacing */}
            <div className="flex flex-col">
                <Hero
                    prompt={prompt}
                    setPrompt={setPrompt}
                    slides={slides}
                    setSlides={setSlides}
                    onSearch={handleSearch}
                />

                <VideoShowcase />

                <Features />
            </div>

            <Footer />

            <LoginModal
                isOpen={showLoginModal}
                onClose={setShowLoginModal}
                prompt={prompt}
                slides={slides}
            />
        </div>
    );
}
