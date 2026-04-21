'use client';

import { usePlayer } from '@/lib/player-context';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    X,
    Music,
} from 'lucide-react';

// =============================================================================
// MUSIC PLAYER — Persistent bottom bar
// Renders globally in layout.tsx. Visible only when a track is loaded.
// =============================================================================

function formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
    const {
        currentTrack,
        isPlaying,
        isVisible,
        currentTime,
        duration,
        volume,
        isMuted,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
        toggleMute,
        hidePlayer,
        queue,
        currentIndex,
    } = usePlayer();

    if (!isVisible || !currentTrack) return null;

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/98 backdrop-blur-md border-t border-gray-800 shadow-2xl">
            {/* Progress bar — full width, sits at the very top of the player */}
            <div
                className="w-full h-1 bg-gray-700 cursor-pointer group"
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = (e.clientX - rect.left) / rect.width;
                    seek(ratio * duration);
                }}
            >
                <div
                    className="h-full bg-[#8B9D7F] transition-all relative"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 py-3">

                    {/* Track info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#8B9D7F]/20 flex items-center justify-center flex-shrink-0">
                            <Music className="w-5 h-5 text-[#8B9D7F]" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{currentTrack.title}</p>
                            {currentTrack.featuring && (
                                <p className="text-gray-400 text-xs truncate">ft. {currentTrack.featuring}</p>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={prev}
                            disabled={currentIndex === 0}
                            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                            aria-label="Previous track"
                        >
                            <SkipBack className="w-5 h-5" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 bg-[#8B9D7F] hover:bg-[#7a8c6f] rounded-full flex items-center justify-center transition-colors"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying
                                ? <Pause className="w-5 h-5 text-white" />
                                : <Play className="w-5 h-5 text-white fill-white" />
                            }
                        </button>

                        <button
                            onClick={next}
                            disabled={currentIndex >= queue.length - 1}
                            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                            aria-label="Next track"
                        >
                            <SkipForward className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Time */}
                    <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400 tabular-nums w-20 justify-center">
                        <span>{formatTime(currentTime)}</span>
                        <span>/</span>
                        <span>{formatTime(duration)}</span>
                    </div>

                    {/* Volume — hidden on small screens */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={toggleMute}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={isMuted ? 0 : volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-20 accent-[#8B9D7F] cursor-pointer"
                            aria-label="Volume"
                        />
                    </div>

                    {/* Close */}
                    <button
                        onClick={hidePlayer}
                        className="p-2 text-gray-500 hover:text-white transition-colors ml-1"
                        aria-label="Close player"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
