import Link from 'next/link';

interface ArtistEmptyStateProps {
    section: 'releases' | 'events' | 'blog' | 'videos';
}

const SECTION_CONFIG: Record<
    ArtistEmptyStateProps['section'],
    { message: string; href: string; linkText: string }
> = {
    releases: {
        message: "This artist doesn't have any releases yet.",
        href: '/releases',
        linkText: 'View all releases',
    },
    events: {
        message: "This artist doesn't have any upcoming events.",
        href: '/events',
        linkText: 'View all events',
    },
    blog: {
        message: "This artist doesn't have any posts yet.",
        href: '/blog',
        linkText: 'View all posts',
    },
    videos: {
        // No public /videos page exists — fall back to /releases
        message: "This artist doesn't have any videos yet.",
        href: '/releases',
        linkText: 'View all videos',
    },
};

export default function ArtistEmptyState({ section }: ArtistEmptyStateProps) {
    const { message, href, linkText } = SECTION_CONFIG[section];

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-400 mb-3">{message}</p>
            <Link href={href} className="text-[#8B9D7F] hover:underline text-sm">
                {linkText}
            </Link>
        </div>
    );
}
