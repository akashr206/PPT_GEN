"use client";

import React, { useEffect, useRef } from "react";

export default function InteractiveDotGrid({
    spacing = 28,
    dotRadius = 1.2,
    repelRadius = 140,
    maxRepel = 45,
    className = "",
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId;
        let width = 0;
        let height = 0;
        let dots = [];

        let mouse = { x: -1000, y: -1000 };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        const initDots = () => {
            const dpr = window.devicePixelRatio || 1;
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);

            dots = [];
            const cols = Math.ceil(width / spacing) + 2;
            const rows = Math.ceil(height / spacing) + 2;

            const offsetX = (width - (cols - 1) * spacing) / 2;
            const offsetY = (height - (rows - 1) * spacing) / 2;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x0 = offsetX + c * spacing;
                    const y0 = offsetY + r * spacing;
                    dots.push({
                        x0,
                        y0,
                        x: x0,
                        y: y0,
                        targetX: x0,
                        targetY: y0,
                    });
                }
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                const dx = dot.x0 - mouse.x;
                const dy = dot.y0 - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let alpha = 0.25;

                if (dist < repelRadius && dist > 0) {
                    const force = Math.pow((repelRadius - dist) / repelRadius, 1.3);
                    const angle = Math.atan2(dy, dx);
                    const repelDist = force * maxRepel;

                    dot.targetX = dot.x0 + Math.cos(angle) * repelDist;
                    dot.targetY = dot.y0 + Math.sin(angle) * repelDist;
                    alpha += force * 0.5;
                } else {
                    dot.targetX = dot.x0;
                    dot.targetY = dot.y0;
                }

                // Smooth interpolation for elastic bounce-back
                dot.x += (dot.targetX - dot.x) * 0.12;
                dot.y += (dot.targetY - dot.y) * 0.12;

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        initDots();
        render();

        window.addEventListener("resize", initDots);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", initDots);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [spacing, dotRadius, repelRadius, maxRepel]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-0 ${className}`}
        />
    );
}
