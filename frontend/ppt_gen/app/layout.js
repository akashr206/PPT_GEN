import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  title: {
    default: "Broadside AI",
    template: "%s | Broadside AI"
  },
  description: "Transform your ideas into beautiful, customized pitch decks and presentations in seconds using Broadside AI. Customize layouts, text, and styles instantly.",
  keywords: ["AI presentation maker", "AI PPT generator", "slide deck generator", "pitch deck builder", "Broadside AI"],
  icons: {
    icon: "/logo.png?v=1",
    shortcut: "/logo.png?v=1",
    apple: "/logo.png?v=1",
  },
  openGraph: {
    title: "Broadside AI",
    description: "Transform your ideas into beautiful, customized pitch decks and presentations in seconds using Broadside AI.",
    siteName: "Broadside AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Broadside AI",
    description: "Transform your ideas into beautiful, customized pitch decks and presentations in seconds using Broadside AI.",
  }
};

import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { HistoryProvider } from "@/contexts/history-context";
import CustomThemesStyles from "@/components/dashboard/CustomThemesStyles";
import BackgroundGrid from "@/components/ui/BackgroundGrid";
import AuthListener from "@/components/auth-listener";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider refetchOnWindowFocus={false}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <HistoryProvider>
              <TooltipProvider>
                {children}
                <CustomThemesStyles />
                <BackgroundGrid />
                <Toaster richColors closeButton position="bottom-right" />
                <AuthListener />
              </TooltipProvider>
            </HistoryProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
