'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Mic2, Disc3, Calendar, FileText, Video, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import StatCard from '@/components/admin/StatCard';
import {
    adminGetArtists,
    adminGetReleases,
    adminGetEvents,
    adminGetBlogPosts,
    adminGetVideos,
} from '@/lib/admin-api';

interface Release {
    id: number;
    title: string;
    artist: string;
    type: string;
    coverImage?: string;
    releaseDate?: string;
}

interface Event {
    id: number;
    title: string;
    venue: string;
    date: string;
    isoDate?: string;
}

export default function DashboardPage() {
    const [counts, setCounts] = useState({ artists: 0, releases: 0, events: 0, blog: 0, videos: 0 });
    const [recentReleases, setRecentReleases] = useState<Release[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        async function load() {
            const results = await Promise.allSettled([
                adminGetArtists(),
                adminGetReleases(),
                adminGetEvents(),
                adminGetBlogPosts(),
                adminGetVideos(),
            ]);

            const [artists, releases, events, blog, videos] = results;

            const newErrors: Record<string, string> = {};
            const newCounts = { artists: 0, releases: 0, events: 0, blog: 0, videos: 0 };

            if (artists.status === 'fulfilled') newCounts.artists = artists.value.length;
            else newErrors.artists = 'Failed to load artists';

            if (releases.status === 'fulfilled') {
                newCounts.releases = releases.value.length;
                setRecentReleases((releases.value as Release[]).slice(0, 4));
            } else newErrors.releases = 'Failed to load releases';

            if (events.status === 'fulfilled') {
                newCounts.events = events.value.length;
                const now = new Date().toISOString();
                const upcoming = (events.value as Event[])
                    .filter((e) => (e.isoDate ?? '') >= now)
                    .slice(0, 3);
                setUpcomingEvents(upcoming);
            } else newErrors.events = 'Failed to load events';

            if (blog.status === 'fulfilled') newCounts.blog = blog.value.length;
            else newErrors.blog = 'Failed to load blog posts';

            if (videos.status === 'fulfilled') newCounts.videos = videos.value.length;
            else newErrors.videos = 'Failed to load videos';

            setCounts(newCounts);
            setErrors(newErrors);
        }
        load();
    }, []);

    const quickActions = [
        { href: '/admin/artists', label: 'Add Artist', icon: Mic2 },
        { href: '/admin/releases', label: 'Add Release', icon: Disc3 },
        { href: '/admin/events', label: 'Add Event', icon: Calendar },
        { href: '/admin/blog', label: 'Add Post', icon: FileText },
        { href: '/admin/videos', label: 'Add Video', icon: Video },
    ];

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Stat Cards */}
            <div>
                <h2 className="text-white font-semibold text-lg mb-4">Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <StatCard icon={Mic2} label="Artists" count={counts.artists} />
                    <StatCard icon={Disc3} label="Releases" count={counts.releases} />
                    <StatCard icon={Calendar} label="Events" count={counts.events} />
                    <StatCard icon={FileText} label="Blog Posts" count={counts.blog} />
                    <StatCard icon={Video} label="Videos" count={counts.videos} />
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-white font-semibold text-lg mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    {quickActions.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                            style={{ backgroundColor: '#8B9D7F' }}
                        >
                            <Plus className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Releases */}
                <div className="bg-gray-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Recent Releases</h2>
                        <Link href="/admin/releases" className="text-sm text-gray-400 hover:text-white transition-colors">
                            View all
                        </Link>
                    </div>
                    {errors.releases ? (
                        <p className="text-red-400 text-sm">{errors.releases}</p>
                    ) : recentReleases.length === 0 ? (
                        <p className="text-gray-500 text-sm">No releases yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentReleases.map((r) => (
                                <div key={r.id} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex-shrink-0 overflow-hidden">
                                        {r.coverImage ? (
                                            <Image
                                                src={r.coverImage}
                                                alt={r.title}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Disc3 className="w-5 h-5 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{r.title}</p>
                                        <p className="text-gray-400 text-xs">{r.artist} · {r.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Events */}
                <div className="bg-gray-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Upcoming Events</h2>
                        <Link href="/admin/events" className="text-sm text-gray-400 hover:text-white transition-colors">
                            View all
                        </Link>
                    </div>
                    {errors.events ? (
                        <p className="text-red-400 text-sm">{errors.events}</p>
                    ) : upcomingEvents.length === 0 ? (
                        <p className="text-gray-500 text-sm">No upcoming events.</p>
                    ) : (
                        <div className="space-y-3">
                            {upcomingEvents.map((e) => (
                                <div key={e.id} className="flex items-start gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: '#8B9D7F22' }}
                                    >
                                        <Calendar className="w-5 h-5" style={{ color: '#8B9D7F' }} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{e.title}</p>
                                        <p className="text-gray-400 text-xs">{e.venue} · {e.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
