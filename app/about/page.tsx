import PageHeader from '@/components/PageHeader';
import { Music, Users, Calendar, Award, Target, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    const services = [
        {
            icon: <Users className="w-8 h-8" />,
            title: 'Artist Management',
            description: 'Comprehensive career development and strategic guidance for our talented roster'
        },
        {
            icon: <Music className="w-8 h-8" />,
            title: 'Record Label',
            description: 'Professional recording, production, and distribution services'
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: 'Booking Agency',
            description: 'Connecting artists with venues and opportunities worldwide'
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: 'Concert Production',
            description: 'World-class event planning and execution for unforgettable experiences'
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: 'Promotion & Publicity',
            description: 'Strategic marketing campaigns to amplify your voice'
        }
    ];

    const stats = [
        { number: '2001', label: 'Founded' },
        { number: '15+', label: 'Artists' },
        { number: '50M+', label: 'Streams' },
        { number: '100+', label: 'Releases' }
    ];

    const values = [
        {
            icon: <Heart className="w-6 h-6" />,
            title: 'Passion for Music',
            description: 'We live and breathe music. Every note, every beat, every lyric matters to us.'
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: 'Artist First',
            description: 'Our artists are at the heart of everything we do. Their success is our success.'
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: 'Innovation',
            description: 'We embrace new technologies and approaches to stay ahead in the industry.'
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: 'Excellence',
            description: 'We maintain the highest standards in everything from production to promotion.'
        }
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Page Header */}
            <PageHeader
                title="About Us"
                subtitle="Crafting the future of African music"
                backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
            />

            {/* Our Story Section */}
            <section className="py-20 lg:py-32 bg-black text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">Our Story</h2>
                        <div className="h-1 w-20 bg-[#8B9D7F] mx-auto mb-8"></div>
                    </div>

                    <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                        <p>
                            SoundGang is a music company founded in 2001 and based in Lagos, Nigeria. We're an artist management company, a record label, a booking agency, a concert producer and a promotion & publicity agency.
                        </p>
                        <p>
                            A talent-studded & fast rising music & entertainment company, widely dubbed as the future of the music & entertainment industry.
                        </p>
                        <p className="text-[#8B9D7F] italic text-xl">
                            "It's so cool to pick up the guitar and create something that didn't exist 5 minutes ago. You can write something that no ones ever heard before. It's music at your fingertips."
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-[#1a1a1a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl lg:text-5xl font-bold text-[#8B9D7F] mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-400 text-sm lg:text-base">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="py-20 lg:py-32 bg-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">What We Do</h2>
                        <div className="h-1 w-20 bg-[#8B9D7F] mx-auto mb-6"></div>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            We provide comprehensive music industry services to help artists reach their full potential
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 hover:border-[#8B9D7F] transition-all duration-300 group"
                            >
                                <div className="w-16 h-16 bg-[#8B9D7F]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#8B9D7F]/20 transition-colors">
                                    <div className="text-[#8B9D7F]">
                                        {service.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-[#8B9D7F] transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-20 lg:py-32 bg-[#1a1a1a] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">Our Values</h2>
                        <div className="h-1 w-20 bg-[#8B9D7F] mx-auto mb-6"></div>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-[#8B9D7F] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <div className="text-white">
                                        {value.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32 bg-black text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        Ready to Join the Movement?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Whether you're an artist looking for representation or a fan wanting to stay connected, we'd love to hear from you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/submit"
                            className="bg-[#8B9D7F] hover:bg-[#7a8c6f] text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                        >
                            SUBMIT YOUR MUSIC
                        </Link>
                        <Link
                            href="/contact"
                            className="border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                        >
                            GET IN TOUCH
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
