import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { getLatestPosts, blogCategories } from '@/lib/data/blog';

// TODO: When backend is ready, make this async and fetch from API
export default function BlogPage() {
    // TODO: Replace with — const posts = await getLatestPosts() (API call)
    const posts = getLatestPosts();

    return (
        <div className="min-h-screen bg-black">
            <PageHeader
                title="Blog"
                subtitle="News, insights, and stories from the music industry"
                backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
            />

            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category filter */}
                    <div className="flex flex-wrap gap-3 mb-12 justify-center">
                        <button className="px-6 py-2 rounded-full border border-[#8B9D7F] bg-[#8B9D7F]/10 text-white text-sm font-medium">
                            All
                        </button>
                        {blogCategories.map((cat) => (
                            <button
                                key={cat}
                                className="px-6 py-2 rounded-full border border-gray-800 text-white hover:border-[#8B9D7F] hover:bg-[#8B9D7F]/10 transition-colors text-sm font-medium"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Posts grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.id}`} className="group">
                                {/* Featured image */}
                                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-900">
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`}
                                        style={
                                            post.coverImage
                                                ? { backgroundImage: `url(${post.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                                : undefined
                                        }
                                    >
                                        {!post.coverImage && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-6xl opacity-20">📝</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-4 left-4 bg-[#8B9D7F] px-3 py-1 rounded-full">
                                        <span className="text-xs font-semibold text-white">{post.category}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#8B9D7F] transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

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

                                <div className="flex items-center gap-2 text-[#8B9D7F] text-sm font-semibold mt-4 group-hover:gap-3 transition-all">
                                    Read More
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </Link>
                        ))}
                    </div>

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
