import { useEffect, useState } from 'react';
import { getVideos } from '@/lib/api';
import VideosGallerySection from './VideosGallerySection';
import type { Video } from '@/lib/data/videos';

export default function VideosGallerySectionWrapper() {
    const [videos, setVideos] = useState<Video[]>([]);

    useEffect(() => {
        getVideos().then(setVideos);
    }, []);

    return <VideosGallerySection videos={videos} />;
}
