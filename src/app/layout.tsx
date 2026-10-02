import type { Metadata, Viewport } from "next";
import { inter, poppins } from "@/lib/fonts";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GSAPProvider } from "@/components/gsap-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { CommandPalette } from "@/components/command-palette";
import { ScrollProgress } from "@/components/scroll-progress";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  appleWebApp: { capable: true, title: "Lior Zafrir", statusBarStyle: "black-translucent" },
  metadataBase: new URL("https://liorzafrir.vercel.app"),
  title: "Lior Zafrir - AI Engineer & Full-Stack Developer",
  description:
    "Portfolio of Lior Zafrir, AI Engineer and Biomedical Engineering graduate (Tel Aviv University): autonomous scraping bots, LLM agents, 3D web apps, full-stack SaaS and biomedical signal processing.",
  keywords: [
    "Lior Zafrir",
    "AI Engineer",
    "LLM Agents",
    "Web Scraping",
    "Automation",
    "Biomedical Engineering",
    "Portfolio",
    "Signal Processing",
    "DSP",
    "AI",
    "Machine Learning",
    "Full-Stack Development",
    "React",
    "Next.js",
    "Medical Devices",
    "YOLOv8",
    "PyTorch",
  ],
  authors: [{ name: "Lior Zafrir" }],
  openGraph: {
    title: "Lior Zafrir - Engineering Portfolio",
    description:
      "Explore my portfolio featuring projects in signal processing, medical device innovation, AI, and full-stack software development.",
    url: "https://liorzafrir.vercel.app",
    siteName: "Lior Zafrir Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lior Zafrir - Engineering Portfolio",
    description:
      "AI Engineer building autonomous bots, LLM agents, 3D web apps and full-stack platforms.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white">
        <MotionProvider>
          <a
            href="#projects"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-indigo-600 focus:text-white"
          >
            Skip to projects
          </a>
          <ScrollProgress />
          <CustomCursor />
          <GSAPProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </GSAPProvider>
          <CommandPalette />
        </MotionProvider>
      </body>
    </html>
  );
}
