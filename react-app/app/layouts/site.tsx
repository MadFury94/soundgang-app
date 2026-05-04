import { Outlet } from 'react-router'
import Header from '../../src/components/Header'
import Footer from '../../src/components/Footer'
import NewsletterSection from '../../src/components/NewsletterSection'
import UpcomingShowsSection from '../../src/components/UpcomingShowsSection'
import VideosGallerySectionWrapper from '../../src/components/VideosGallerySectionWrapper'
import { PlayerProvider } from '../../src/lib/player-context'
import MusicPlayer from '../../src/components/player/MusicPlayer'

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
