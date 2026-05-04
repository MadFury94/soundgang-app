// =============================================================================
// SEO Utilities
// Centralised metadata helpers for all pages.
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soundgang.ng';
const SITE_NAME = 'SoundGang';
const DEFAULT_DESCRIPTION = 'SoundGang is Nigeria\'s premier record label, discovering and amplifying the brightest talents in contemporary African music.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export interface SeoProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'music.album' | 'profile';
    noIndex?: boolean;
}

export function buildMetadata({
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_OG_IMAGE,
    url = SITE_URL,
    type = 'website',
    noIndex = false,
}: SeoProps = {}) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Nigeria's Premier Record Label`;

    return {
        title: fullTitle,
        description,
        metadataBase: new URL(SITE_URL),
        alternates: { canonical: url },
        robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE_NAME,
            images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
            type,
            locale: 'en_NG',
        },
        twitter: {
            card: 'summary_large_image' as const,
            title: fullTitle,
            description,
            images: [image],
            site: '@soundgang',
            creator: '@soundgang',
        },
    };
}

export function buildArtistJsonLd(artist: {
    name: string;
    bio: string;
    image: string;
    slug: string;
    genre: string;
    social: { spotify?: string; instagram?: string; twitter?: string };
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'MusicGroup',
        name: artist.name,
        description: artist.bio,
        image: artist.image,
        url: `${SITE_URL}/artists/${artist.slug}`,
        genre: artist.genre,
        sameAs: [
            artist.social.spotify,
            artist.social.instagram,
            artist.social.twitter,
        ].filter(Boolean),
    };
}

export function buildBlogJsonLd(post: {
    title: string;
    excerpt: string;
    coverImage: string;
    author: string;
    publishedAt: string;
    slug: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage || DEFAULT_OG_IMAGE,
        author: { '@type': 'Organization', name: post.author },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/soundgang-logo.png` },
        },
        datePublished: post.publishedAt,
        url: `${SITE_URL}/blog/${post.slug}`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    };
}

export function buildOrganizationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/soundgang-logo.png`,
        description: DEFAULT_DESCRIPTION,
        sameAs: [
            'https://instagram.com/soundgang',
            'https://twitter.com/soundgang',
            'https://youtube.com/@soundgang',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            url: `${SITE_URL}/contact`,
        },
    };
}

export { SITE_URL, SITE_NAME };
