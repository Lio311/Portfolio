import type { Metadata } from "next";
import { inter, poppins } from "@/lib/fonts";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GSAPProvider } from "@/components/gsap-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lior Zafrir - Biomedical Engineer & Full-Stack Developer",
  description:
    "Portfolio of Lior Zafrir — Biomedical Engineering student at Tel Aviv University specializing in Signal Processing (DSP), AI/ML, Medical Devices, and Full-Stack Web Development.",
  keywords: [
    "Lior Zafrir",
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
      "Biomedical Engineering student showcasing innovative projects in AI, signal processing, and full-stack web development.",
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
        <GSAPProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </GSAPProvider>
      </body>
    </html>
  );
}
