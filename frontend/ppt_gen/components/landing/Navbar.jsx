"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";
import { signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function Navbar({ session, status, onSignIn }) {
    const router = useRouter();

    const navRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(navRef.current, 
        {
            y: -100,
            opacity: 0,
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 1.8,
            ease: "power3.out",
        });
    }, { scope: navRef });

    return (
        <nav
            ref={navRef}
            className="relative z-50 flex items-center justify-between p-6 max-w-7xl 2xl:max-w-[1536px] w-full mx-auto"
        >
            <div className="flex items-center gap-3">
                <Link
                    href="/"
                    className="font-semibold text-xl tracking-tight flex items-center gap-2.5"
                >
                    <img
                        src="/logo.png"
                        alt="Broadside AI Logo"
                        className="h-6 w-6 object-contain invert"
                    />
                    <span>Broadside AI</span>
                </Link>
            </div>
            <div className="flex items-center gap-4">
                {status === "authenticated" ? (
                    <div className="flex gap-2 items-center">
                        <Button
                            variant="ghost"
                            className="items-center hover:bg-accent-foreground p-2"
                            onClick={() => router.push("/dashboard")}
                        >
                            <LayoutDashboard className="w-4 h-4 mr-1" />
                            Dashboard
                        </Button>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all">
                                    {session?.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        (
                                            session?.user?.name ||
                                            session?.user?.email ||
                                            "U"
                                        )
                                            .charAt(0)
                                            .toUpperCase()
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="bg-[#121218] border-white/10 text-white min-w-[200px] rounded-md p-1.5 shadow-2xl"
                            >
                                <DropdownMenuLabel className="px-2.5 py-2">
                                    <div className="flex flex-col space-y-0.5">
                                        <p className="text-sm font-medium text-white">
                                            {session?.user?.name}
                                        </p>
                                        <p className="text-xs text-white/50 truncate">
                                            {session?.user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="px-2.5 py-2 text-red-400 focus:bg-red-500/10 focus:text-red-400 rounded-md cursor-pointer flex items-center gap-2"
                                >
                                    <LogOut size={16} />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <Button
                        onClick={onSignIn}
                        className="rounded-md bg-white text-black hover:bg-white/90 px-6 font-medium cursor-pointer"
                    >
                        Sign In
                    </Button>
                )}
            </div>
        </nav>
    );
}
