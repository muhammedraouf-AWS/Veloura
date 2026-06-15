import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Veloura — Fine Fragrances",
    template: "%s | Veloura",
  },
  description:
    "Discover premium fragrances curated for the discerning nose. Explore our collection of luxury perfumes for every occasion.",
  keywords: ["perfume", "fragrance", "luxury", "scent", "cologne", "eau de parfum"],
  openGraph: {
    type: "website",
    siteName: "Veloura",
    title: {
      default: "Veloura — Fine Fragrances",
      template: "%s | Veloura",
    },
    description:
      "Discover premium fragrances curated for the discerning nose. Explore our collection of luxury perfumes for every occasion.",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Veloura — Fine Fragrances",
      template: "%s | Veloura",
    },
    description:
      "Discover premium fragrances curated for the discerning nose. Explore our collection of luxury perfumes for every occasion.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased font-sans">
        <AppProviders>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
          <CartDrawer />
        </AppProviders>
      </body>
    </html>
  );
}
