"use client";

import React, { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import api from "@/lib/api";

const UserMenu = () => {
    const { data: session } = useSession();
    const [credits, setCredits] = useState(null);

    useEffect(() => {
        if (session?.user?.email) {
            const fetchCredits = async () => {
                try {
                    const data = await api.get("/api/user/credits");
                    setCredits(data.data?.credits);
                } catch (err) {
                    console.error("Failed to fetch credits:", err);
                }
            };
            fetchCredits();
            
            const handleCreditsUpdate = () => fetchCredits();
            window.addEventListener("update-credits", handleCreditsUpdate);
            return () => window.removeEventListener("update-credits", handleCreditsUpdate);
        }
    }, [session?.user?.email]);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="w-7.5 h-7.5 cursor-pointer border border-border/60 hover:opacity-90 transition-opacity">
                    <AvatarImage
                        src={session.user.image}
                        alt={session.user.name || "User"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                        {(session.user.name || session.user.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="bg-popover border-border text-popover-foreground min-w-[200px] rounded-md p-1.5 shadow-2xl z-50"
            >
                <DropdownMenuLabel className="px-2.5 py-2">
                    <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium text-popover-foreground">
                            {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {session.user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                {credits !== null && (
                    <>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem 
                            className="px-2.5 py-1.5 flex justify-between items-center text-sm cursor-pointer"
                            onClick={() => window.dispatchEvent(new CustomEvent("insufficient-credits", { detail: { isManual: true, credits } }))}
                        >
                            <span className="text-foreground">Credits</span>
                            <span className="font-bold text-foreground">{credits}</span>
                        </DropdownMenuItem>
                    </>
                )}
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                    onClick={() => signOut()}
                    className="px-2.5 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive rounded-md cursor-pointer flex items-center gap-2"
                >
                    <LogOut size={16} />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;
