import type { MetaFunction } from 'react-router'
import HeroSliderWrapper from '../../src/components/HeroSliderWrapper'
import FeaturedArtistsSection from '../../src/components/FeaturedArtistsSection'
import LatestReleasesSection from '../../src/components/LatestReleasesSection'
import StreamingPlatformsSection from '../../src/components/StreamingPlatformsSection'
import { buildOrganizationJsonLd } from '../../src/lib/seo'

export const meta: MetaFunction = () => {
  const jsonLd = buildOrganizationJsonLd()

  return [
    { title: 'SoundGang - Nigerian Record Label' },
    {
      name: 'description',
      content: 'A Nigerian record label dedicated to discovering and amplifying contemporary African music on the global stage.'
    },
    {
      tagName: 'script',
      type: 'application/ld+json',
      children: JSON.stringify(jsonLd)
    }
  ]
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSliderWrapper />
      <FeaturedArtistsSection />
      <LatestReleasesSection />
      <StreamingPlatformsSection />
    </div>
  )
}
