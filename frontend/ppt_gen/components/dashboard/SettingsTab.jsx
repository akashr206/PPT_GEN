"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SettingsTab() {
    const { data: session } = useSession();

    return (
        <div className="w-full bg-card/25 dark:bg-zinc-950/10 border border-border/50 rounded-2xl p-6 min-h-[500px] flex flex-col gap-6 backdrop-blur-md shadow-xs">
            <div>
                <h3 className="text-lg font-bold text-foreground">
                    Account & Workspace Settings
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-light">
                    Manage your presentation workspace settings and user profile preferences.
                </p>
            </div>
            <div className="border border-border/40 rounded-lg p-5 bg-muted/10 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border/20 pb-4">
                    <div>
                        <p className="text-xs font-semibold text-foreground">
                            Workspace Name
                        </p>
                        <p className="text-[11px] text-muted-foreground font-light">
                            The display name for your AI presentation workspace.
                        </p>
                    </div>
                    <input
                        type="text"
                        className="p-2 border border-border rounded-md bg-background text-xs w-full sm:max-w-xs focus:ring-1 focus:ring-primary focus:outline-none"
                        defaultValue="My AI Presentations Space"
                    />
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border/20 pb-4">
                    <div>
                        <p className="text-xs font-semibold text-foreground">
                            Default Export Format
                        </p>
                        <p className="text-[11px] text-muted-foreground font-light">
                            Set your default downloaded file type preference.
                        </p>
                    </div>
                    <select className="p-2 border border-border rounded-md bg-background text-xs w-full sm:max-w-xs focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer">
                        <option>PowerPoint (.pptx)</option>
                        <option>PDF Document (.pdf)</option>
                    </select>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                        <p className="text-xs font-semibold text-foreground">
                            Profile Information
                        </p>
                        <p className="text-[11px] text-muted-foreground font-light">
                            Logged in as {session?.user?.name || session?.user?.email}.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs cursor-pointer"
                    >
                        Manage Account
                    </Button>
                </div>
            </div>
        </div>
    );
}
