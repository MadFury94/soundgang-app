import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsletterSection from '@/components/NewsletterSection'
import UpcomingShowsSection from '@/components/UpcomingShowsSection'
import VideosGallerySectionWrapper from '@/components/VideosGallerySectionWrapper'
import { PlayerProvider } from '@/lib/player-context'
import MusicPlayer from '@/components/player/MusicPlayer'

export default function SiteLayout() {
  return (
    <PlayerProvider>
      <Header />
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <VideosGallerySectionWrapper />
      <UpcomingShowsSection />
      <NewsletterSection />
      <Footer />
      <MusicPlayer />
    </PlayerProvider>
  )
}
