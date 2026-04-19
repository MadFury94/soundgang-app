import HeroSection from '@/components/HeroSection';
import FeaturedArtistsSection from '@/components/FeaturedArtistsSection';
import LatestReleasesSection from '@/components/LatestReleasesSection';
import StreamingPlatformsSection from '@/components/StreamingPlatformsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedArtistsSection />
      <LatestReleasesSection />
      <StreamingPlatformsSection />
    </div>
  );
}
