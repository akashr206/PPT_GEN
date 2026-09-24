"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function LoginModal({ isOpen, onClose, prompt, slides }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[380px] bg-[#0c0c12]/95 border-white/10 text-white rounded-lg p-6 shadow-2xl backdrop-blur-md select-none flex flex-col gap-0"
                showCloseButton={true}
            >
                <DialogHeader className="flex flex-col items-center text-center pb-4">
                    <img
                        src="/logo.png"
                        alt="Broadside AI Logo"
                        className="w-14 h-14 object-contain invert"
                    />
                    <DialogTitle className="text-xl font-bold text-white tracking-tight">
                        Sign in to Broadside AI
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 text-xs mt-1 px-4 leading-normal">
                        Sign in to design your presentation and customize
                        slides in real-time.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2.5 pt-2">
                    <Button
                        onClick={() => {
                            const targetUrl = `/generate?prompt=${encodeURIComponent(prompt)}&slides=${slides}`;
                            signIn("google", { callbackUrl: targetUrl });
                        }}
                        className="w-full rounded-md bg-white text-black hover:bg-white/90 font-medium py-5 gap-2 cursor-pointer shadow-lg flex items-center justify-center text-sm"
                    >
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                            <path
                                fill="#EA4335"
                                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.61 14.99 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z"
                            />
                            <path
                                fill="#4285F4"
                                d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.82 2.96c2.24-2.07 3.59-5.11 3.59-8.75z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.24 14.45c-.23-.69-.36-1.43-.36-2.2c0-.77.13-1.51.36-2.2L1.39 7.56C.5 9.35 0 11.35 0 13.5c0 2.15.5 4.15 1.39 5.94l3.85-2.99z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.82-2.96c-1.06.71-2.42 1.13-4.14 1.13-3.34 0-5.86-2.21-6.87-5.21H1.28v3.08C3.28 20.33 7.26 23 12 23z"
                            />
                        </svg>
                        <span>Continue with Google</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => onClose(false)}
                        className="w-full rounded-md border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white font-medium py-5 cursor-pointer text-sm bg-transparent"
                    >
                        Cancel
                    </Button>

                    <p className="text-center text-[11px] text-zinc-500 mt-4 leading-relaxed">
                        By continuing, you agree to our{" "}
                        <Link
                            href="/terms"
                            className="text-zinc-300 hover:text-white underline underline-offset-2"
                        >
                            Terms of Service
                        </Link>{" "}
                        and Privacy Policy.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
