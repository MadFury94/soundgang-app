import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import UpcomingShowsSection from "@/components/UpcomingShowsSection";
import VideosGallerySectionWrapper from "@/components/VideosGallerySectionWrapper";
import { PlayerProvider } from "@/lib/player-context";
import MusicPlayer from "@/components/player/MusicPlayer";

// Public site layout — wraps all non-admin pages with Header, Footer, Player
export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PlayerProvider>
            <Header />
            <main className="flex-1 pb-24">{children}</main>
            <VideosGallerySectionWrapper />
            <UpcomingShowsSection />
            <NewsletterSection />
            <Footer />
            <MusicPlayer />
        </PlayerProvider>
    );
}
