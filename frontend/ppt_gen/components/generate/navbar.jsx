"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/generate/theme-toggle";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <div className="w-full bg-transparent sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-2">
            <div className="max-w-5xl mx-auto h-14 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-full px-6 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
                <div className="flex items-center">
                    <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold text-base hover:opacity-90 transition-opacity">
                        <img src="/logo.png" alt="iota AI Logo" className="w-6.5 h-6.5 object-contain dark:invert" />
                        <span className="tracking-tight text-foreground font-medium">iota AI</span>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`text-xs font-medium h-8 rounded-full px-3.5 gap-1.5 flex items-center border border-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer ${
                                pathname === "/dashboard" 
                                    ? "text-foreground font-semibold bg-black/[0.03] dark:bg-white/[0.05] border-black/5 dark:border-white/5" 
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <LayoutDashboard size={13} />
                            <span>Dashboard</span>
                        </Button>
                    </Link>

                    <ThemeToggle />
                    
                    {session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="w-7.5 h-7.5 cursor-pointer border border-border/60 hover:opacity-90 transition-opacity">
                                    <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                                        {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="bg-popover border-border text-popover-foreground min-w-[200px] rounded-xl p-1.5 shadow-2xl z-50"
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
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="px-2.5 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg cursor-pointer flex items-center gap-2"
                                >
                                    <LogOut size={16} />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="w-7.5 h-7.5 rounded-full bg-muted flex items-center justify-center">
                            <User size={14} className="text-muted-foreground" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
