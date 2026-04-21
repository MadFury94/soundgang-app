import Link from 'next/link';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

// Mock blog data - in production, fetch from database/CMS
const blogPosts = {
    '1': {
        id: 1,
        title: 'The Rise of Afrobeats: A Global Phenomenon',
        excerpt: 'Exploring how Afrobeats has taken the world by storm and what it means for African artists on the global stage.',
        author: 'SoundGang Team',
        date: 'December 15, 2024',
        category: 'Industry News',
        gradient: 'from-purple-600 via-pink-500 to-orange-500',
        content: '<p>Afrobeats has evolved from a regional sound to a global phenomenon, captivating audiences worldwide with its infectious rhythms and vibrant energy. This genre, rooted in West African musical traditions, has become one of the most influential forces in contemporary music.</p><h2>The Global Breakthrough</h2><p>Over the past decade, Afrobeats has transcended geographical boundaries, with artists like Burna Boy, Wizkid, and Davido leading the charge. These pioneers have not only topped international charts but have also collaborated with global superstars, bringing African music to unprecedented heights.</p><p>The genre\'s success can be attributed to its unique blend of traditional African rhythms, highlife, funk, and contemporary pop elements. This fusion creates a sound that is both familiar and fresh, appealing to diverse audiences across continents.</p><h2>Impact on the Music Industry</h2><p>The rise of Afrobeats has forced the global music industry to pay attention to African talent. Major record labels are now actively scouting for African artists, and streaming platforms have created dedicated Afrobeats playlists that reach millions of listeners.</p><p>This shift has opened doors for emerging artists and created new opportunities for collaboration between African and international musicians. The genre\'s influence can be heard in mainstream pop, hip-hop, and R&B tracks worldwide.</p><h2>What This Means for African Artists</h2><p>For African artists, the global acceptance of Afrobeats represents more than commercial success—it\'s a cultural victory. It validates African creativity and provides a platform for storytelling that resonates with global audiences while maintaining authentic African roots.</p><p>At SoundGang, we\'re proud to be part of this movement, supporting artists who are pushing boundaries and taking African music to the world stage. The future of Afrobeats is bright, and we\'re excited to see where this journey takes us.</p>'
    },
    '2': {
        id: 2,
        title: '5 Tips for Emerging Artists in Nigeria',
        excerpt: 'Essential advice for up-and-coming musicians looking to break into the Nigerian music industry.',
        author: 'John Doe',
        date: 'December 10, 2024',
        category: 'Artist Tips',
        gradient: 'from-blue-600 via-cyan-500 to-teal-500',
        content: '<p>Breaking into the Nigerian music industry can be challenging, but with the right approach and dedication, emerging artists can carve out their own space. Here are five essential tips to help you on your journey.</p><h2>1. Develop Your Unique Sound</h2><p>In a crowded market, authenticity is your greatest asset. Don\'t try to copy what\'s already popular—instead, focus on developing a sound that reflects your personality and experiences. Study the greats, but find your own voice.</p><h2>2. Invest in Quality Production</h2><p>Your music is your product, and quality matters. Work with experienced producers and engineers who understand your vision. At SoundGang Studios, we\'ve seen how professional production can transform a good song into a hit.</p><h2>3. Build Your Online Presence</h2><p>Social media is crucial for emerging artists. Create consistent content, engage with your audience, and use platforms like Instagram, TikTok, and YouTube to showcase your talent. Your online presence is often the first impression potential fans will have.</p><h2>4. Network Strategically</h2><p>The Nigerian music industry thrives on relationships. Attend industry events, collaborate with other artists, and build genuine connections with producers, DJs, and industry professionals. Your network can open doors that talent alone cannot.</p><h2>5. Stay Persistent and Patient</h2><p>Success rarely happens overnight. Stay committed to your craft, learn from setbacks, and keep pushing forward. Every successful artist you admire faced rejection and challenges—what sets them apart is their persistence.</p><p>Remember, the journey is as important as the destination. Focus on growth, stay true to your art, and the success will follow.</p>'
    },
    '3': {
        id: 3,
        title: 'Behind the Scenes: Recording at SoundGang Studios',
        excerpt: 'Take a look at what goes into creating hit records at our state-of-the-art recording facilities.',
        author: 'Jane Smith',
        date: 'December 5, 2024',
        category: 'Studio Life',
        gradient: 'from-indigo-600 via-purple-500 to-pink-500',
        content: '<p>Ever wondered what happens behind the scenes when your favorite tracks are being created? Let\'s take you on a journey through a typical recording session at SoundGang Studios.</p><h2>The Setup</h2><p>Before any recording begins, our engineers work closely with artists to understand their vision. We discuss the sound they\'re aiming for, the mood of the track, and any specific requirements. This pre-production phase is crucial for a smooth recording process.</p><h2>The Recording Process</h2><p>Our studios are equipped with industry-standard equipment including Neumann microphones, SSL consoles, and a range of vintage and modern outboard gear. We believe in giving artists the tools they need to capture their best performance.</p><p>During recording, we create a comfortable environment where artists can focus on their craft. Whether it\'s adjusting the lighting, temperature, or providing refreshments, we ensure every detail supports the creative process.</p><h2>Production and Mixing</h2><p>After recording, our producers and mixing engineers work their magic. This is where the raw recordings are transformed into polished tracks. We use a combination of analog warmth and digital precision to achieve the perfect sound.</p><h2>The Final Touch</h2><p>Mastering is the final step, where we ensure the track sounds great across all playback systems—from club speakers to earbuds. Our mastering engineers have years of experience and understand the nuances of different genres.</p><p>At SoundGang Studios, we\'re not just recording music—we\'re helping artists bring their creative visions to life. Every session is a collaboration, and we\'re honored to be part of so many musical journeys.</p>'
    }
};

export default function BlogPostPage({ params }: { params: { id: string } }) {
    const post = blogPosts[params.id as keyof typeof blogPosts];

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`}>
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
                    {/* Back Button */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>

                    {/* Category Badge */}
                    <div className="mb-4">
                        <span className="bg-[#8B9D7F] px-4 py-2 rounded-full text-sm font-semibold text-white">
                            {post.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-white/80">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="text-sm">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{post.date}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="py-16 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Share Buttons */}
                    <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-800">
                        <span className="text-gray-400 text-sm font-semibold">SHARE:</span>
                        <button
                            className="p-2 rounded-full border border-gray-800 text-gray-400 hover:border-[#8B9D7F] hover:text-[#8B9D7F] transition-colors"
                            aria-label="Share on Facebook"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 rounded-full border border-gray-800 text-gray-400 hover:border-[#8B9D7F] hover:text-[#8B9D7F] transition-colors"
                            aria-label="Share on Twitter"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 rounded-full border border-gray-800 text-gray-400 hover:border-[#8B9D7F] hover:text-[#8B9D7F] transition-colors"
                            aria-label="Share on LinkedIn"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 rounded-full border border-gray-800 text-gray-400 hover:border-[#8B9D7F] hover:text-[#8B9D7F] transition-colors"
                            aria-label="Copy link"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Article Body */}
                    <div
                        className="prose prose-invert prose-lg max-w-none
                            prose-headings:text-white prose-headings:font-bold
                            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                            prose-a:text-[#8B9D7F] prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>

            {/* Related Posts */}
            <section className="py-16 lg:py-24 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-12">Related Posts</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {Object.values(blogPosts)
                            .filter(p => p.id !== post.id)
                            .slice(0, 3)
                            .map((relatedPost) => (
                                <Link
                                    key={relatedPost.id}
                                    href={`/blog/${relatedPost.id}`}
                                    className="group"
                                >
                                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-900">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${relatedPost.gradient}`}>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-6xl opacity-20">📝</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 left-4 bg-[#8B9D7F] px-3 py-1 rounded-full">
                                            <span className="text-xs font-semibold text-white">{relatedPost.category}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#8B9D7F] transition-colors line-clamp-2">
                                        {relatedPost.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-2">
                                        {relatedPost.excerpt}
                                    </p>
                                </Link>
                            ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
