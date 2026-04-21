import HeroSliderWrapper from '@/components/HeroSliderWrapper';
import FeaturedArtistsSection from '@/components/FeaturedArtistsSection';
import LatestReleasesSection from '@/components/LatestReleasesSection';
import StreamingPlatformsSection from '@/components/StreamingPlatformsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSliderWrapper />
      <FeaturedArtistsSection />
      <LatestReleasesSection />
      <StreamingPlatformsSection />
    </div>
  );
}
