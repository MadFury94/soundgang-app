import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import WaveDivider from './WaveDivider';

export default function UpcomingShowsSection() {
    const shows = [
        {
            id: 1,
            artist: 'Multirod',
            venue: 'Eko Hotel & Suites',
            location: 'Lagos, Nigeria',
            date: 'Dec 15, 2024',
            time: '8:00 PM',
            ticketUrl: '/contact'
        },
        {
            id: 2,
            artist: 'Killa Vybz',
            venue: 'Terra Kulture',
            location: 'Lagos, Nigeria',
            date: 'Dec 22, 2024',
            time: '7:00 PM',
            ticketUrl: '/contact'
        },
        {
            id: 3,
            artist: 'SoundGang All Stars',
            venue: 'Freedom Park',
            location: 'Lagos, Nigeria',
            date: 'Dec 31, 2024',
            time: '9:00 PM',
            ticketUrl: '/contact'
        }
    ];

    return (
        <section className="bg-black text-white">
            {/* Top Wave Divider */}
            <WaveDivider />

            <div className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-2">UPCOMING SHOWS</h2>
                            <div className="h-1 w-32 bg-[#8B9D7F]"></div>
                        </div>
                        <select className="bg-[#1a1a1a] border border-gray-800 text-white px-6 py-3 rounded-lg focus:outline-none focus:border-[#8B9D7F] transition-colors">
                            <option>All artists</option>
                            <option>Multirod</option>
                            <option>Killa Vybz</option>
                            <option>SoundGang All Stars</option>
                        </select>
                    </div>

                    {/* Shows List */}
                    {shows.length > 0 ? (
                        <div className="space-y-6">
                            {shows.map((show) => (
                                <div
                                    key={show.id}
                                    className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 lg:p-8 hover:border-[#8B9D7F] transition-colors group"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                        {/* Show Info */}
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2 group-hover:text-[#8B9D7F] transition-colors">
                                                    {show.artist}
                                                </h3>
                                                <p className="text-xl text-gray-300">{show.venue}</p>
                                            </div>

                                            <div className="flex flex-wrap gap-6 text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-5 h-5 text-[#8B9D7F]" />
                                                    <span>{show.date} • {show.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-5 h-5 text-[#8B9D7F]" />
                                                    <span>{show.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ticket Button */}
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
                            <p className="text-xl text-gray-400">
                                NO UPCOMING EVENTS SCHEDULED YET. STAY TUNED!
                            </p>
                        </div>
                    )}

                    {/* View All Events Link */}
                    {shows.length > 0 && (
                        <div className="text-center mt-12">
                            <Link
                                href="/events"
                                className="inline-flex items-center gap-2 text-[#8B9D7F] hover:text-[#7a8c6f] font-semibold transition-colors"
                            >
                                VIEW ALL EVENTS
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
