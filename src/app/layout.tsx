import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Redux/providers";
import { Toaster } from 'react-hot-toast';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Graph Visualizer - Interactive Graph Algorithms & Data Structures",
  description:
    "Explore and visualize graph algorithms like Dijkstra, BFS, DFS, and more with an interactive and intuitive interface. Perfect for students, developers, and educators.",
  keywords: [
    "Graph Visualizer",
    "Graph Algorithms",
    "Dijkstra Algorithm",
    "BFS",
    "DFS",
    "Shortest Path",
    "Algorithm Visualization",
    "Data Structures",
  ],
  openGraph: {
    title: "Graph Visualizer - Interactive Graph Algorithms",
    description:
      "Learn and visualize graph algorithms like BFS, and DFS with an interactive UI.",
    url: "https://graph-visualizer-olive.vercel.app/",
    type: "website",
    images: [
      {
        url: "https://graph-visualizer-olive.vercel.app/preview-image.jpg",
        width: 1200,
        height: 630,
        alt: "Graph Visualizer Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Graph Visualizer",
    description:
      "Visualize and understand graph algorithms interactively, including Dijkstra, BFS, and DFS.",
    images: ["https://graph-visualizer-olive.vercel.app/preview-image.jpg"],
  },
  other: {
    "google-site-verification": "95FWZE7lhGpVZAXZutVAxKzagytj_A1-wTMXRxm-kGM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="bottom-right" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
