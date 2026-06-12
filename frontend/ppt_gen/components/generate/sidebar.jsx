"use client";

import React, { useState, useEffect } from "react";
import {
    Menu,
    Plus,
    MessageSquare,
    Sparkles,
    User,
    LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/generate/theme-toggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHistory } from "@/contexts/history-context";

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { data: session, status } = useSession();
    const { history, isLoading: isLoadingHistory } = useHistory();
    const pathname = usePathname();

    return (
        <aside
            className={`${
                isCollapsed ? "w-[72px]" : "w-64"
            } border-r border-border bg-sidebar hidden md:flex flex-col backdrop-blur-xl transition-all duration-300 ease-in-out`}
        >
            <div
                className={`p-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}
            >
                {!isCollapsed && (
                    <div className="flex items-center gap-2.5 font-semibold text-lg transition-all duration-300 whitespace-nowrap overflow-hidden">
                        <img
                            src="/logo.png"
                            alt="iota AI Logo"
                            className="w-8 h-8 object-contain flex-shrink-0 dark:invert"
                        />
                        <span className="tracking-tight text-sidebar-foreground">
                            iota AI
                        </span>
                    </div>
                )}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <Menu size={18} />
                        </Button>
                    </TooltipTrigger>
                    {isCollapsed && (
                        <TooltipContent side="right">
                            Expand Menu
                        </TooltipContent>
                    )}
                </Tooltip>
            </div>

            <div className="px-4 py-2 flex justify-center">
                {isCollapsed ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" asChild>
                                <Link href="/generate">
                                    <Plus size={18} />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            New Presentation
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <Button className="w-full justify-start" asChild>
                        <Link href="/generate">
                            <Plus size={16} />
                            New Presentation
                        </Link>
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-1 px-2 py-4 mt-2">
                {!isCollapsed && (
                    <div className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 transition-all duration-300 whitespace-nowrap overflow-hidden">
                        Recent
                    </div>
                )}
                <nav className="space-y-1">
                    {!isCollapsed && isLoadingHistory && (
                        <div className="space-y-4 px-3 py-1">
                            <Skeleton className="h-5 w-full bg-muted/20 rounded-md " />
                            <Skeleton className="h-5 w-11/12 bg-muted/20 rounded-md" />
                            <Skeleton className="h-5 w-5/6 bg-muted/20 rounded-md" />
                        </div>
                    )}
                    {!isCollapsed &&
                        !isLoadingHistory &&
                        history.map((item) => (
                            <Button
                                key={item.id}
                                variant="ghost"
                                asChild
                                className="w-full justify-start gap-3 px-3 font-normal text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors group"
                            >
                                <Link href={`/generate/${item.id}/view`}>
                                    <span className="truncate">
                                        {item.title || "Untitled"}
                                    </span>
                                </Link>
                            </Button>
                        ))}
                    {!isCollapsed &&
                        !isLoadingHistory &&
                        history.length === 0 &&
                        status === "authenticated" && (
                            <div className="px-3 py-6 flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                                    <Sparkles
                                        size={16}
                                        className="text-muted-foreground"
                                    />
                                </div>
                                <p className="text-sm font-medium text-foreground mb-1">
                                    No presentations
                                </p>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Create your first presentation to see it
                                    here.
                                </p>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="w-full text-xs"
                                    asChild
                                >
                                    <Link href="/generate">Create PPT</Link>
                                </Button>
                            </div>
                        )}
                </nav>
            </ScrollArea>

            <div className="p-4 border-t flex border-border items-center bg-card gap-2 transition-all duration-300">
                {session?.user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex w-full hover:bg-accent/80 cursor-pointer rounded-md gap-2 p-2 items-center">
                                <Avatar className="w-7 h-7 cursor-pointer border border-border transition-all">
                                    <AvatarImage
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                    />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                                        {(
                                            session.user.name ||
                                            session.user.email ||
                                            "U"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {!isCollapsed && (
                                    <p className="text-foreground">
                                        {session.user.name}
                                    </p>
                                )}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-popover border-border text-popover-foreground min-w-[200px] rounded-xl p-1.5 shadow-2xl"
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
                                className="px-2.5 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive rounded-md cursor-pointer flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                <span>Sign out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex w-full rounded-md gap-2 p-2 items-center">
                        <Skeleton className="w-7 h-7 rounded-full" />
                        {!isCollapsed && <Skeleton className="h-4 w-20" />}
                    </div>
                )}
                {!isCollapsed && <ThemeToggle />}
            </div>
        </aside>
    );
}
