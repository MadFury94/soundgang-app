'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import WaveDivider from './WaveDivider';

export default function HeroSection() {
    return (
        <section className="relative bg-[#1a1a1a] text-white overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B9D7F]/10 via-transparent to-transparent pointer-events-none"></div>

            <div className="relative py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-[#8B9D7F] text-sm">★</span>
                                <span className="text-sm font-medium tracking-wider uppercase">AFRICAN BEATS</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                                Crafting <span className="text-[#8B9D7F]">Sound</span>
                                <br />
                                Culture
                            </h1>

                            <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
                                SoundGang is Nigeria's premier record label, discovering and amplifying the brightest talents in contemporary African music.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-12">
                                <Link
                                    href="/artists"
                                    className="bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                                >
                                    EXPLORE ARTISTS
                                </Link>
                                <Link
                                    href="/releases"
                                    className="border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                                >
                                    VIEW RELEASES
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8">
                                <div>
                                    <div className="text-4xl font-bold mb-1">15+</div>
                                    <div className="text-gray-400 text-sm">Artists</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold mb-1">50M+</div>
                                    <div className="text-gray-400 text-sm">Streams</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold mb-1">5+</div>
                                    <div className="text-gray-400 text-sm">Years</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Music Player */}
                        <div className="relative">
                            {/* Music Player Card */}
                            <div className="relative bg-[#2a2a2a] rounded-2xl p-6 shadow-2xl">
                                {/* Album Art / Visual */}
                                <div className="relative aspect-square rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500">
                                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Play className="w-10 h-10 text-white" fill="white" />
                                            </div>
                                            <p className="text-white text-sm font-medium">Latest Release</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Now Playing Info */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 bg-[#8B9D7F] rounded-full animate-pulse"></div>
                                        <span className="text-gray-400 text-sm">Now Playing</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">Solid 4 Life</h3>
                                    <p className="text-gray-400">SoundGang Compilation</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                                        <span>2:15</span>
                                        <span>5:00</span>
                                    </div>
                                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#8B9D7F] rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                                        <Play className="w-4 h-4" fill="white" />
                                        PLAY
                                    </button>
                                    <a
                                        href="https://wildstream.ng"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 border-2 border-gray-600 hover:border-[#8B9D7F] text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
