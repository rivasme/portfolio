import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = {
  viewportFit: "cover",
};
import { Inter, JetBrains_Mono, Turret_Road } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const turretRoad = Turret_Road({
  variable: "--font-turret",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ramble | David Rivas, Product Designer",
    template: "%s · ramble",
  },
  description:
    "Product designer with 10+ years in UX strategy, design systems, brand identity, and AI-native product design.",
  keywords: ["product design", "UX", "design systems", "AI", "UI designer"],
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "ramble | David Rivas, Product Designer",
    description:
      "Product designer with 10+ years in UX strategy, design systems, brand identity, and AI-native product design.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${turretRoad.variable} dark`}
    >
      <body className="h-dvh overflow-hidden bg-accent text-foreground antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
