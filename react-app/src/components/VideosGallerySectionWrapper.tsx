import { getVideos } from '@/lib/api';
import VideosGallerySection from './VideosGallerySection';

export default async function VideosGallerySectionWrapper() {
    const videos = await getVideos();
    return <VideosGallerySection videos={videos} />;
}
