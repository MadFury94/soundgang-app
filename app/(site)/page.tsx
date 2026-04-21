import HeroSliderWrapper from '@/components/HeroSliderWrapper';
import FeaturedArtistsSection from '@/components/FeaturedArtistsSection';
import LatestReleasesSection from '@/components/LatestReleasesSection';
import StreamingPlatformsSection from '@/components/StreamingPlatformsSection';
import { buildMetadata, buildOrganizationJsonLd } from '@/lib/seo';

export const metadata = buildMetadata();

export default function Home() {
  const jsonLd = buildOrganizationJsonLd();
  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSliderWrapper />
      <FeaturedArtistsSection />
      <LatestReleasesSection />
      <StreamingPlatformsSection />
    </div>
  );
}
