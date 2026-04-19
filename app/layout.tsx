import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import UpcomingShowsSection from "@/components/UpcomingShowsSection";
import VideosGallerySection from "@/components/VideosGallerySection";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SoundGang - Nigerian Record Label",
  description: "A Nigerian record label dedicated to discovering and amplifying contemporary African music on the global stage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <VideosGallerySection />
        <UpcomingShowsSection />
        <NewsletterSection />
        <Footer />
      </body>
    </html>
  );
}
