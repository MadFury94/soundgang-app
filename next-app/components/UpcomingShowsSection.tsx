import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import WaveDivider from './WaveDivider';
import { getUpcomingEvents } from '@/lib/api';

export default async function UpcomingShowsSection() {
    const shows = await getUpcomingEvents();

    return (
        <section className="bg-black text-white">
            <WaveDivider />

            <div className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section header — stacks on mobile, side-by-side on desktop */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-16">
                        <div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">UPCOMING SHOWS</h2>
                            <div className="h-1 w-32 bg-[#8B9D7F]" />
                        </div>
                        <select className="w-full sm:w-auto bg-[#1a1a1a] border border-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#8B9D7F] transition-colors text-sm">
                            <option>All artists</option>
                            {shows.map((s) => (
                                <option key={s.id}>{s.artist}</option>
                            ))}
                        </select>
                    </div>

                    {shows.length > 0 ? (
                        <div className="space-y-6">
                            {shows.map((show) => (
                                <div
                                    key={show.id}
                                    className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 lg:p-8 hover:border-[#8B9D7F] transition-colors group"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2 group-hover:text-[#8B9D7F] transition-colors">
                                                    {show.artist}
                                                </h3>
                                                <p className="text-xl text-gray-300">{show.venue}</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-gray-400 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-[#8B9D7F] flex-shrink-0" />
                                                    <span>{show.date} • {show.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-[#8B9D7F] flex-shrink-0" />
                                                    <span>{show.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href={show.ticketUrl}
                                            className="inline-flex items-center justify-center gap-2 bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap"
                                        >
                                            GET TICKETS
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-xl text-gray-400">NO UPCOMING EVENTS SCHEDULED YET. STAY TUNED!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
