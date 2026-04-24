'use client';

import {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';
interface Track {
    id: number;
    title: string;
    duration: string;
    audioUrl: string;
    featuring?: string;
    releaseTitle?: string;
    coverImage?: string;
    artist?: string;
}

// =============================================================================
// PLAYER CONTEXT
// Provides global music player state across the entire app.
// Wrap the app with <PlayerProvider> in layout.tsx.
// =============================================================================

interface PlayerState {
    queue: Track[];           // Current playlist/queue
    currentIndex: number;     // Index of the currently playing track
    isPlaying: boolean;
    currentTime: number;      // Seconds elapsed
    duration: number;         // Total track duration in seconds
    volume: number;           // 0–1
    isMuted: boolean;
    isVisible: boolean;       // Whether the player bar is shown
}

interface PlayerContextValue extends PlayerState {
    // Actions
    play: (track: Track, queue?: Track[]) => void;  // Play a specific track (optionally set a new queue)
    pause: () => void;
    resume: () => void;
    togglePlay: () => void;
    next: () => void;
    prev: () => void;
    seek: (time: number) => void;
    setVolume: (vol: number) => void;
    toggleMute: () => void;
    setQueue: (tracks: Track[]) => void;
    hidePlayer: () => void;
    currentTrack: Track | null;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [queue, setQueueState] = useState<Track[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const currentTrack = queue[currentIndex] ?? null;

    // Initialise audio element once on client
    useEffect(() => {
        const audio = new Audio();
        audio.volume = 0.8;
        audioRef.current = audio;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onDurationChange = () => setDuration(audio.duration || 0);
        const onEnded = () => {
            setCurrentIndex((i) => {
                const next = i + 1;
                if (next < queue.length) {
                    return next;
                }
                setIsPlaying(false);
                return i;
            });
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('durationchange', onDurationChange);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('durationchange', onDurationChange);
            audio.removeEventListener('ended', onEnded);
            audio.pause();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-load all tracks into the queue on mount so the player bar is visible
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://soundgang-api.onochieazukaeme.workers.dev';
        fetch(`${apiUrl}/api/playlist`)
            .then((res) => res.json())
            .then((data: unknown) => {
                const tracks = data as Track[];
                if (tracks.length > 0) {
                    setQueueState(tracks);
                    setCurrentIndex(0);
                    setIsVisible(true);
                }
            })
            .catch(() => { /* silent fail — player stays hidden */ });
    }, []);

    // When currentIndex or queue changes, load the new track
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentTrack) return;

        audio.src = currentTrack.audioUrl;
        audio.load();
        setCurrentTime(0);
        setDuration(0);

        if (isPlaying) {
            audio.play().catch(() => setIsPlaying(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, queue]);

    // Sync play/pause state with audio element
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.play().catch(() => setIsPlaying(false));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // Sync volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const play = useCallback((track: Track, newQueue?: Track[]) => {
        const targetQueue = newQueue ?? queue;
        const idx = targetQueue.findIndex((t) => t.id === track.id);

        if (newQueue) setQueueState(newQueue);
        setCurrentIndex(idx >= 0 ? idx : 0);
        setIsPlaying(true);
        setIsVisible(true);
    }, [queue]);

    const pause = useCallback(() => setIsPlaying(false), []);
    const resume = useCallback(() => setIsPlaying(true), []);
    const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

    const next = useCallback(() => {
        setCurrentIndex((i) => Math.min(i + 1, queue.length - 1));
        setIsPlaying(true);
    }, [queue.length]);

    const prev = useCallback(() => {
        const audio = audioRef.current;
        // If more than 3s in, restart current track; otherwise go to previous
        if (audio && audio.currentTime > 3) {
            audio.currentTime = 0;
        } else {
            setCurrentIndex((i) => Math.max(i - 1, 0));
        }
        setIsPlaying(true);
    }, []);

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    const setVolume = useCallback((vol: number) => {
        setVolumeState(vol);
        setIsMuted(false);
    }, []);

    const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

    const setQueue = useCallback((tracks: Track[]) => {
        setQueueState(tracks);
        setCurrentIndex(0);
    }, []);

    const hidePlayer = useCallback(() => setIsVisible(false), []);

    return (
        <PlayerContext.Provider
            value={{
                queue,
                currentIndex,
                isPlaying,
                currentTime,
                duration,
                volume,
                isMuted,
                isVisible,
                currentTrack,
                play,
                pause,
                resume,
                togglePlay,
                next,
                prev,
                seek,
                setVolume,
                toggleMute,
                setQueue,
                hidePlayer,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

// Hook — use this in any component to access the player
export function usePlayer(): PlayerContextValue {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>');
    return ctx;
}
