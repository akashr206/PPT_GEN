"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-zinc-50 font-sans relative overflow-hidden flex flex-col">
            {/* Background effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
            
            <nav className="relative z-10 p-6 max-w-4xl mx-auto w-full flex items-center">
                <Link href="/">
                    <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 gap-2 px-4 rounded-full">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Button>
                </Link>
            </nav>

            <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-6 py-12 md:py-20 text-white/80">
                <div className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-white/50">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>

                <div className="space-y-10 prose prose-invert max-w-none">
                    <section>
                        <h2 className="text-2xl font-medium text-white mb-4">1. Information We Collect</h2>
                        <p className="leading-relaxed text-white/70">
                            We collect information you provide directly to us, such as when you create or modify your account, request customer support, or communicate with us. This includes your name, email address, and authentication data (via Google OAuth). 
                        </p>
                        <p className="leading-relaxed text-white/70 mt-4">
                            Additionally, we collect the prompts and content you submit to the Service to generate presentations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-medium text-white mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2 text-white/70">
                            <li>To provide, maintain, and improve our Service.</li>
                            <li>To generate and deliver the presentations you request via our AI engine.</li>
                            <li>To manage your account and track your credit balance.</li>
                            <li>To send you technical notices, updates, and support messages.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-medium text-white mb-4">3. Data Storage and Security</h2>
                        <p className="leading-relaxed text-white/70">
                            We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. Your data is stored securely in our databases, and authentication is handled by standard secure OAuth providers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-medium text-white mb-4">4. Sharing of Information</h2>
                        <p className="leading-relaxed text-white/70">
                            We do not sell your personal information. We may share your information only in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-white/70">
                            <li>With third-party vendors, such as cloud hosting providers and AI API providers (e.g., Google Gemini), strictly for the purpose of operating the Service.</li>
                            <li>To comply with legal obligations, enforce our terms, or protect our rights and property.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-medium text-white mb-4">5. Third-Party Services</h2>
                        <p className="leading-relaxed text-white/70">
                            Our Service utilizes third-party AI models to process prompts and generate content. The data sent to these models is processed in accordance with their respective privacy policies. Please avoid submitting sensitive or confidential personal data in your prompts.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-medium text-white mb-4">6. Your Rights</h2>
                        <p className="leading-relaxed text-white/70">
                            Depending on your location, you may have the right to access, update, or delete your personal information. If you wish to delete your account or exercise any data rights, please contact us at the email provided below.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-white/10">
                        <h2 className="text-2xl font-medium text-white mb-4">7. Contact Us</h2>
                        <p className="leading-relaxed text-white/70">
                            If you have any questions about this Privacy Policy or our data practices, please contact us at: <a href="mailto:akashr6514@gmail.com" className="text-blue-400 hover:text-blue-300">akashr6514@gmail.com</a>
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full border-t border-white/10 bg-black/20 backdrop-blur-lg py-8 mt-auto">
                <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Broadside AI" className="w-5 h-5 invert opacity-80" />
                        <span className="text-white/80 font-medium tracking-tight text-sm">Broadside AI</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-white/50">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <a href="mailto:akashr6514@gmail.com" className="hover:text-white transition-colors">Contact</a>
                    </div>
                    <p className="text-white/40 text-sm">© {new Date().getFullYear()} Broadside AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
