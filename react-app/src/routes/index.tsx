import HeroSliderWrapper from '@/components/HeroSliderWrapper'
import FeaturedArtistsSection from '@/components/FeaturedArtistsSection'
import LatestReleasesSection from '@/components/LatestReleasesSection'
import StreamingPlatformsSection from '@/components/StreamingPlatformsSection'
import { Helmet } from 'react-helmet-async'
import { buildOrganizationJsonLd } from '@/lib/seo'

export default function HomePage() {
  const jsonLd = buildOrganizationJsonLd()
  
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>SoundGang - Nigerian Record Label</title>
        <meta 
          name="description" 
          content="A Nigerian record label dedicated to discovering and amplifying contemporary African music on the global stage." 
        />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      
      <HeroSliderWrapper />
      <FeaturedArtistsSection />
      <LatestReleasesSection />
      <StreamingPlatformsSection />
    </div>
  )
}
