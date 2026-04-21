// =============================================================================
// BLOG DATA STORE
// TODO: Replace this static array with an API/DB call when backend is ready
// e.g. export async function getBlogPosts() { return await db.posts.findMany() }
// =============================================================================

export type BlogCategory =
    | 'Industry News'
    | 'Artist Tips'
    | 'Studio Life'
    | 'Music History'
    | 'Marketing'
    | 'Company News';

export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;       // HTML content
    author: string;
    date: string;          // Display date e.g. "December 15, 2024"
    isoDate: string;       // ISO date for sorting e.g. "2024-12-15"
    category: BlogCategory;
    coverImage: string;    // Featured image path or URL
    gradient: string;      // Tailwind gradient (fallback when no image)
    featured: boolean;     // Show on hero slider
}

// TODO: Replace with API call — e.g. fetch('/api/blog')
export const blogPosts: BlogPost[] = [
    {
        id: 1,
        slug: 'rise-of-afrobeats-global-phenomenon',
        title: 'The Rise of Afrobeats: A Global Phenomenon',
        excerpt: 'Exploring how Afrobeats has taken the world by storm and what it means for African artists on the global stage.',
        author: 'SoundGang Team',
        date: 'December 15, 2024',
        isoDate: '2024-12-15',
        category: 'Industry News',
        coverImage: '/blog/afrobeats-rise.jpg',
        gradient: 'from-purple-600 via-pink-500 to-orange-500',
        featured: true,
        content: `<p>Afrobeats has evolved from a regional sound to a global phenomenon, captivating audiences worldwide with its infectious rhythms and vibrant energy.</p>
<h2>The Global Breakthrough</h2>
<p>Over the past decade, Afrobeats has transcended geographical boundaries, with artists leading the charge. These pioneers have not only topped international charts but have also collaborated with global superstars, bringing African music to unprecedented heights.</p>
<h2>Impact on the Music Industry</h2>
<p>The rise of Afrobeats has forced the global music industry to pay attention to African talent. Major record labels are now actively scouting for African artists, and streaming platforms have created dedicated Afrobeats playlists that reach millions of listeners.</p>
<h2>What This Means for African Artists</h2>
<p>For African artists, the global acceptance of Afrobeats represents more than commercial success — it's a cultural victory. At SoundGang, we're proud to be part of this movement.</p>`,
    },
    {
        id: 2,
        slug: '5-tips-for-emerging-artists-nigeria',
        title: '5 Tips for Emerging Artists in Nigeria',
        excerpt: 'Essential advice for up-and-coming musicians looking to break into the Nigerian music industry.',
        author: 'John Doe',
        date: 'December 10, 2024',
        isoDate: '2024-12-10',
        category: 'Artist Tips',
        coverImage: '/blog/artist-tips.jpg',
        gradient: 'from-blue-600 via-cyan-500 to-teal-500',
        featured: false,
        content: `<p>Breaking into the Nigerian music industry can be challenging, but with the right approach and dedication, emerging artists can carve out their own space.</p>
<h2>1. Develop Your Unique Sound</h2>
<p>In a crowded market, authenticity is your greatest asset. Don't try to copy what's already popular — instead, focus on developing a sound that reflects your personality and experiences.</p>
<h2>2. Invest in Quality Production</h2>
<p>Your music is your product, and quality matters. Work with experienced producers and engineers who understand your vision.</p>
<h2>3. Build Your Online Presence</h2>
<p>Social media is crucial for emerging artists. Create consistent content, engage with your audience, and use platforms like Instagram, TikTok, and YouTube to showcase your talent.</p>`,
    },
    {
        id: 3,
        slug: 'behind-the-scenes-soundgang-studios',
        title: 'Behind the Scenes: Recording at SoundGang Studios',
        excerpt: 'Take a look at what goes into creating hit records at our state-of-the-art recording facilities.',
        author: 'Jane Smith',
        date: 'December 5, 2024',
        isoDate: '2024-12-05',
        category: 'Studio Life',
        coverImage: '/blog/studio-life.jpg',
        gradient: 'from-indigo-600 via-purple-500 to-pink-500',
        featured: true,
        content: `<p>Ever wondered what happens behind the scenes when your favorite tracks are being created? Let's take you on a journey through a typical recording session at SoundGang Studios.</p>
<h2>The Setup</h2>
<p>Before any recording begins, our engineers work closely with artists to understand their vision. This pre-production phase is crucial for a smooth recording process.</p>
<h2>The Recording Process</h2>
<p>Our studios are equipped with industry-standard equipment. We believe in giving artists the tools they need to capture their best performance.</p>`,
    },
    {
        id: 4,
        slug: 'evolution-of-nigerian-hip-hop',
        title: 'The Evolution of Nigerian Hip Hop',
        excerpt: 'A deep dive into the history and transformation of hip hop music in Nigeria over the decades.',
        author: 'Mike Johnson',
        date: 'November 28, 2024',
        isoDate: '2024-11-28',
        category: 'Music History',
        coverImage: '/blog/hip-hop-evolution.jpg',
        gradient: 'from-red-600 via-orange-500 to-yellow-500',
        featured: false,
        content: `<p>Nigerian hip hop has undergone a remarkable transformation over the decades, evolving from underground movement to mainstream powerhouse.</p>`,
    },
    {
        id: 5,
        slug: 'build-fanbase-social-media',
        title: 'How to Build Your Fanbase on Social Media',
        excerpt: 'Practical strategies for artists to grow their audience and engage with fans online.',
        author: 'Sarah Williams',
        date: 'November 20, 2024',
        isoDate: '2024-11-20',
        category: 'Marketing',
        coverImage: '/blog/social-media.jpg',
        gradient: 'from-green-600 via-emerald-500 to-teal-500',
        featured: false,
        content: `<p>Building a fanbase in the digital age requires consistency, authenticity, and strategic use of social platforms.</p>`,
    },
    {
        id: 6,
        slug: 'soundgang-year-in-review-2024',
        title: 'SoundGang Year in Review: 2024 Highlights',
        excerpt: 'Celebrating our biggest achievements, releases, and moments from an incredible year.',
        author: 'SoundGang Team',
        date: 'November 15, 2024',
        isoDate: '2024-11-15',
        category: 'Company News',
        coverImage: '/blog/year-review.jpg',
        gradient: 'from-pink-600 via-rose-500 to-red-500',
        featured: false,
        content: `<p>2024 has been an incredible year for SoundGang. From chart-topping releases to sold-out shows, here's a look back at our biggest moments.</p>`,
    },
];

export const blogCategories: BlogCategory[] = [
    'Industry News',
    'Artist Tips',
    'Studio Life',
    'Music History',
    'Marketing',
    'Company News',
];

// Helper: get latest N posts
// TODO: Replace with — await db.posts.findMany({ orderBy: { isoDate: 'desc' }, take: n })
export function getLatestPosts(n = 6): BlogPost[] {
    return [...blogPosts]
        .sort((a, b) => b.isoDate.localeCompare(a.isoDate))
        .slice(0, n);
}

// Helper: get featured posts for hero slider
// TODO: Replace with — await db.posts.findMany({ where: { featured: true } })
export function getFeaturedPosts(): BlogPost[] {
    return blogPosts.filter((p) => p.featured);
}

// Helper: get a single post by slug
// TODO: Replace with — await db.posts.findUnique({ where: { slug } })
export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((p) => p.slug === slug);
}

// Helper: get a single post by id (legacy support)
export function getPostById(id: number): BlogPost | undefined {
    return blogPosts.find((p) => p.id === id);
}
