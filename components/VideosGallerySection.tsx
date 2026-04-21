'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import WaveDivider from './WaveDivider';
import { getAllVideos, type Video } from '@/lib/data/videos';

// TODO: When backend is ready, fetch videos from API and pass as prop
export default function VideosGallerySection() {
    // TODO: Replace with — const videos = await getAllVideos() (API call)
    const videos = getAllVideos();
    const [selectedVideo, setSelectedVideo] = useState<Video>(videos[0]);

    return (
        <section className="bg-black text-white">
            <WaveDivider />

            <div className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-[350px_1fr] gap-8">
                        {/* Sidebar */}
                        <div>
                            <div className="mb-8">
                                <h2 className="text-3xl lg:text-4xl font-bold mb-2">VIDEOS</h2>
                                <div className="h-1 w-20 bg-[#8B9D7F]" />
                            </div>

                            <div className="space-y-4">
                                {videos.map((video) => (
                                    <button
                                        key={video.id}
                                        onClick={() => setSelectedVideo(video)}
                                        className={`w-full text-left p-4 rounded-lg border transition-all ${selectedVideo.id === video.id
                                                ? 'bg-[#8B9D7F]/10 border-[#8B9D7F]'
                                                : 'bg-[#1a1a1a] border-gray-800 hover:border-[#8B9D7F]'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-10 h-10 bg-[#8B9D7F]/20 rounded-full flex items-center justify-center">
                                                    <Play className="w-5 h-5 text-[#8B9D7F]" fill="currentColor" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg mb-1 truncate">{video.title}</h3>
                                                <p className="text-sm text-gray-400">{video.artist}</p>
                                                <p className="text-xs text-gray-500 mt-1">{video.date}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Player */}
                        <div>
                            <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800">
                                <div className="bg-black/50 p-4 border-b border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                            <span className="text-black font-bold text-sm">SG</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{selectedVideo.title}</h3>
                                            <p className="text-sm text-gray-400">{selectedVideo.artist}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative aspect-video bg-black">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                                        title={selectedVideo.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-2xl font-bold mb-2">{selectedVideo.title}</h3>
                                <p className="text-gray-400">{selectedVideo.artist} • {selectedVideo.date}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
