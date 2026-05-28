import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export const metadata = {
  title: {
    default: "iota AI",
    template: "%s | iota AI"
  },
  description: "Transform your ideas into beautiful, customized pitch decks and presentations in seconds using iota AI. Customize layouts, text, and styles instantly.",
  keywords: ["AI presentation maker", "AI PPT generator", "slide deck generator", "pitch deck builder", "iota AI"],
  icons: {
    icon: "/logo.png?v=1",
    shortcut: "/logo.png?v=1",
    apple: "/logo.png?v=1",
  },
  openGraph: {
    title: "iota AI",
    description: "Transform your ideas into beautiful, customized pitch decks and presentations in seconds using iota AI.",
    siteName: "iota AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "iota AI",
    description: "Transform your ideas into beautiful, customized pitch decks and presentations in seconds using iota AI.",
  }
};

import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { HistoryProvider } from "@/contexts/history-context";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <HistoryProvider>
              <TooltipProvider>
                {children}
                <Toaster richColors closeButton position="bottom-right" />
              </TooltipProvider>
            </HistoryProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
