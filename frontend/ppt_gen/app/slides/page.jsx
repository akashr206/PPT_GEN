"use client";
import React, { useState } from "react";
import Slide from "@/components/templates/Slide";
import { extractSlideData } from "@/utils/extractor";
import { Button } from "@/components/ui/button";

const page = () => {
    const [theme, setTheme] = useState("sunset");
    const [category, setCategory] = useState("bullets");
    const [type, setType] = useState("standard");
    
    const slideBase = {
        title: "Web Platform Stats",
        subtitle: "Key performance cccccccsc sdsdd sdsdsdsdindicators and system architectural milestones.",
    };

    const defaultItems = [
        {
            header: "99% Success",
            description: "Software test suites passing successfully on all build pipelines.",
        },
        {
            header: "10x Speed",
            description: "Compilation performance benchmark improvements using Turbopack builds.",
        },
        {
            header: "24/7 Support",
            description: "Always-on automated server log auditing and health monitoring support.",
        },
        {
            header: "150+ Icons",
            description: "Standard SVG presentation shapes and vector shapes library built-in.",
        },
        {
            header: "5 Core Themes",
            description: "Premium curated color palettes and modern geometric typography choices.",
        },
        {
            header: "0.2s Latency",
            description: "Average edge network response times for API content extraction requests.",
        },
        {
            header: "10 Points Max",
            description: "Responsive auto-fitting layouts that scale down text sizes dynamically.",
        },
        {
            header: "100% Native",
            description: "PowerPoint-native shape compile rendering with absolute positioning ratios.",
        }
    ];

    // Generate 8 test slides with item counts from 1 up to 8 dynamically
    const slides = Array.from({ length: 8 }, (_, idx) => ({
        ...slideBase,
        items: defaultItems.slice(0, idx + 1)
    }));

    // Dedicated dataset for title layouts
    const titleSlidesData = [
        {
            title: "Scaling Edge Platforms",
            subtitle: "Architectural strategies for high-throughput, low-latency globally distributed systems.",
            presenter: "Akash Ramakrishnan",
            company: "Vercel & DeepMind",
            date: "June 2026"
        },
        {
            title: "Next-Gen Web Rendering",
            subtitle: "How React Server Components and streaming HTML are reshaping modern application workflows.",
            presenter: "Dr. Akash R.",
            company: "WebDev Corp",
            date: "Q2 2026"
        },
        {
            title: "Technical Architecture Overview",
            subtitle: "A comprehensive analysis of deployment pipelines, caching policies, and database replication.",
            presenter: "Lead Developer",
            company: "Global Tech Systems",
            date: "June 4, 2026"
        }
    ];

    const currentSlides = category === "title" ? titleSlidesData : slides;

    const handleExtract = async () => {
        const slideElements = document.getElementsByClassName("slide");

        const allSlidesData = await Promise.all(
            Array.from(slideElements).map(async (element) => {
                return await extractSlideData(element);
            }),
        );
        const res = await fetch("http://localhost:8000/api/convert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ slides: allSlidesData }),
        });
    };

    return (
        <div className="pb-20">
            {/* Slide Selection Controller Floating Panel */}
            <div className="w-full flex flex-col max-w-5xl mx-auto gap-6 my-6 p-6 border rounded-lg bg-card text-card-foreground shadow-sm fixed top-0 z-10 left-1/2 -translate-x-1/2">
                <h3 className="text-lg font-semibold mb-2">Presentation Controller</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Theme</label>
                        <select 
                            value={theme} 
                            onChange={(e) => setTheme(e.target.value)}
                            className="w-full p-2 border rounded-md bg-background"
                        >
                            <option value="default">Default (Modern Light)</option>
                            <option value="dark">Dark Mode</option>
                            <option value="corporate">Corporate</option>
                            <option value="creative">Creative</option>
                            <option value="elegant">Elegant</option>
                            <option value="playful">Playful</option>
                            <option value="nature">Nature</option>
                            <option value="cyberpunk">Cyberpunk</option>
                            <option value="sunset">Sunset</option>
                            <option value="ocean">Ocean</option>
                            <option value="minimalist">Minimalist</option>
                            <option value="lavender">Lavender (Poppins)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Layout Category</label>
                        <select 
                            value={category} 
                            onChange={(e) => {
                                const newCat = e.target.value;
                                setCategory(newCat);
                                setType(
                                    newCat === "bullets" ? "standard" : 
                                    newCat === "cards" ? "simple" : 
                                    newCat === "stats" ? "grid" : 
                                    newCat === "timelines" ? "vertical" : "main"
                                );
                            }}
                            className="w-full p-2 border rounded-md bg-background"
                        >
                            <option value="bullets">Bullets</option>
                            <option value="cards">Cards</option>
                            <option value="stats">Stats</option>
                            <option value="timelines">Timelines</option>
                            <option value="title">Title Slides</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Layout Type</label>
                        <select 
                            value={type} 
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-2 border rounded-md bg-background"
                        >
                            {category === "bullets" ? (
                                <>
                                    <option value="standard">Standard</option>
                                    <option value="big">Big (Numbered)</option>
                                    <option value="grid">Grid (Square)</option>
                                    <option value="timeline">Timeline</option>
                                </>
                            ) : category === "cards" ? (
                                <>
                                    <option value="simple">Simple Cards</option>
                                    <option value="leftAccent">Left Accent Cards</option>
                                    <option value="numbered">Numbered Cards</option>
                                    <option value="filled">Filled Highlight Cards</option>
                                </>
                            ) : category === "stats" ? (
                                <>
                                    <option value="grid">Grid Metrics</option>
                                    <option value="row">Horizontal Row Metrics</option>
                                    <option value="callout">Hero Callout Split</option>
                                </>
                            ) : category === "timelines" ? (
                                <>
                                    <option value="vertical">Vertical Timeline</option>
                                    <option value="horizontal">Horizontal Timeline</option>
                                    <option value="alternating">Alternating Timeline</option>
                                </>
                            ) : (
                                <>
                                    <option value="main">Minimal Centered</option>
                                    <option value="split">Split Screen Accent</option>
                                    <option value="section">Section Divider</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            <div className="w-full pt-52 flex flex-col max-w-5xl mx-auto gap-10">
                {currentSlides.map((e, i) => {
                    const slideContent = {
                        ...e,
                        theme: theme,
                        layout: { category: category, type: type }
                    };
                    
                    // If layout is stats callout, shift the first item to the separate 'hero' field
                    if (category === "stats" && type === "callout") {
                        slideContent.hero = e.items?.[0];
                        slideContent.items = e.items?.slice(1);
                    }
                    
                    return (
                        <Slide 
                            key={i} 
                            slide_content={slideContent} 
                        />
                    );
                })}

                <Button onClick={handleExtract}>Generate Slide</Button>
            </div>
        </div>
    );
};

export default page;
