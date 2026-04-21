import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SoundGang - Nigerian Record Label",
  description: "A Nigerian record label dedicated to discovering and amplifying contemporary African music on the global stage.",
};

// Root layout — minimal shell only (html + body).
// Public site chrome (Header, Footer, PlayerProvider) lives in app/(site)/layout.tsx
// Admin chrome lives in app/admin/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-black text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
