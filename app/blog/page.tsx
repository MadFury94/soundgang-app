import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogPage() {
    const posts = [
        {
            id: 1,
            title: 'The Rise of Afrobeats: A Global Phenomenon',
            excerpt: 'Exploring how Afrobeats has taken the world by storm and what it means for African artists on the global stage.',
            author: 'SoundGang Team',
            date: 'December 15, 2024',
            category: 'Industry News',
            image: '/blog/afrobeats-rise.jpg',
            gradient: 'from-purple-600 via-pink-500 to-orange-500'
        },
        {
            id: 2,
            title: '5 Tips for Emerging Artists in Nigeria',
            excerpt: 'Essential advice for up-and-coming musicians looking to break into the Nigerian music industry.',
            author: 'John Doe',
            date: 'December 10, 2024',
            category: 'Artist Tips',
            image: '/blog/artist-tips.jpg',
            gradient: 'from-blue-600 via-cyan-500 to-teal-500'
        },
        {
            id: 3,
            title: 'Behind the Scenes: Recording at SoundGang Studios',
            excerpt: 'Take a look at what goes into creating hit records at our state-of-the-art recording facilities.',
            author: 'Jane Smith',
            date: 'December 5, 2024',
            category: 'Studio Life',
            image: '/blog/studio-life.jpg',
            gradient: 'from-indigo-600 via-purple-500 to-pink-500'
        },
        {
            id: 4,
            title: 'The Evolution of Nigerian Hip Hop',
            excerpt: 'A deep dive into the history and transformation of hip hop music in Nigeria over the decades.',
            author: 'Mike Johnson',
            date: 'November 28, 2024',
            category: 'Music History',
            image: '/blog/hip-hop-evolution.jpg',
            gradient: 'from-red-600 via-orange-500 to-yellow-500'
        },
        {
            id: 5,
            title: 'How to Build Your Fanbase on Social Media',
            excerpt: 'Practical strategies for artists to grow their audience and engage with fans online.',
            author: 'Sarah Williams',
            date: 'November 20, 2024',
            category: 'Marketing',
            image: '/blog/social-media.jpg',
            gradient: 'from-green-600 via-emerald-500 to-teal-500'
        },
        {
            id: 6,
            title: 'SoundGang Year in Review: 2024 Highlights',
            excerpt: 'Celebrating our biggest achievements, releases, and moments from an incredible year.',
            author: 'SoundGang Team',
            date: 'November 15, 2024',
            category: 'Company News',
            image: '/blog/year-review.jpg',
            gradient: 'from-pink-600 via-rose-500 to-red-500'
        }
    ];

    const categories = ['All', 'Industry News', 'Artist Tips', 'Studio Life', 'Music History', 'Marketing', 'Company News'];

    return (
        <div className="min-h-screen bg-black">
            {/* Page Header */}
            <PageHeader
                title="Blog"
                subtitle="News, insights, and stories from the music industry"
                backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
            />

            {/* Blog Content */}
            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Categories Filter */}
                    <div className="flex flex-wrap gap-3 mb-12 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className="px-6 py-2 rounded-full border border-gray-800 text-white hover:border-[#8B9D7F] hover:bg-[#8B9D7F]/10 transition-colors text-sm font-medium"
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Blog Posts Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.id}`}
                                className="group"
                            >
                                {/* Featured Image */}
                                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-900">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`}>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-6xl opacity-20">📝</span>
                                        </div>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4 bg-[#8B9D7F] px-3 py-1 rounded-full">
                                        <span className="text-xs font-semibold text-white">{post.category}</span>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#8B9D7F] transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {post.excerpt}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            <span>{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{post.date}</span>
                                        </div>
                                    </div>

                                    {/* Read More Link */}
                                    <div className="flex items-center gap-2 text-[#8B9D7F] text-sm font-semibold mt-4 group-hover:gap-3 transition-all">
                                        Read More
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Load More Button */}
                    <div className="text-center mt-16">
                        <button className="border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-lg font-semibold transition-colors">
                            LOAD MORE POSTS
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
