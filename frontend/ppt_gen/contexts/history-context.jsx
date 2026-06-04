"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const HistoryContext = createContext();

const MOCK_HISTORY = [
    {
        id: "quarterly-review",
        title: "Quarterly Business Review",
        theme: "sunset",
        slides_count: 3,
        slides: [
            {
                title: "Q2 Business Performance",
                subtitle: "Key metrics and strategic initiatives overview.",
                layout: { category: "title", type: "main" },
                presenter: "Akash Ramakrishnan",
                company: "Iota AI",
                date: "June 2026",
            },
            {
                title: "Growth Metrics",
                subtitle:
                    "Analyzing user retention and sales performance over Q2.",
                layout: { category: "stats", type: "grid" },
                items: [
                    {
                        header: "10x Speed",
                        description: "Increase in rendering performance.",
                    },
                    {
                        header: "99% Success",
                        description:
                            "Production pipeline deployment pass rate.",
                    },
                    {
                        header: "24/7 Support",
                        description: "Active system health monitoring.",
                    },
                ],
            },
            {
                title: "Roadmap to Q3",
                subtitle:
                    "Next steps for product enhancements and scaling operations.",
                layout: { category: "timelines", type: "horizontal" },
                items: [
                    {
                        header: "Phase 1: Design",
                        description: "Establish premium design components.",
                    },
                    {
                        header: "Phase 2: Alpha Test",
                        description:
                            "Deploy local testing suite to beta group.",
                    },
                    {
                        header: "Phase 3: Launch",
                        description:
                            "Public deployment on high-speed global CDN.",
                    },
                ],
            },
        ],
    },
    {
        id: "ai-future",
        title: "AI and Future of Web Development",
        theme: "cyberpunk",
        slides_count: 2,
        slides: [
            {
                title: "AI and Future of Web Dev",
                subtitle:
                    "How generative technologies are changing developer workflows.",
                layout: { category: "title", type: "split" },
                presenter: "Akash R.",
                company: "Vercel & DeepMind",
                date: "Q2 2026",
            },
            {
                title: "Core Technologies",
                subtitle:
                    "Crucial stack decisions for next generation AI products.",
                layout: { category: "cards", type: "simple" },
                items: [
                    {
                        header: "React Server Components",
                        description:
                            "Optimizing initial load and streaming HTML.",
                    },
                    {
                        header: "Edge Functions",
                        description:
                            "Low latency executions globally distributed.",
                    },
                ],
            },
        ],
    },
];

export function HistoryProvider({ children }) {
    const { status } = useSession();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = async (forceLoading = false) => {
        if (status !== "authenticated") {
            setIsLoading(false);
            return;
        }

        if (forceLoading || history.length === 0) {
            setIsLoading(true);
        }

        // Simulate network latency
        setTimeout(() => {
            setHistory(MOCK_HISTORY);
            setIsLoading(false);
        }, 500);
    };

    useEffect(() => {
        fetchHistory();
    }, [status]);

    const deletePresentation = async (id) => {
        toast.info("Deleting presentation");

        return new Promise((resolve) => {
            setTimeout(() => {
                setHistory((prev) => prev.filter((p) => p.id !== id));
                toast.success("Presentation deleted");
                resolve(true);
            }, 600);
        });
    };

    return (
        <HistoryContext.Provider
            value={{
                history,
                isLoading,
                deletePresentation,
                refreshHistory: fetchHistory,
            }}
        >
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error("useHistory must be used within a HistoryProvider");
    }
    return context;
}
