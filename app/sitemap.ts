import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { artists } from '@/lib/data/artists';
import { blogPosts } from '@/lib/data/blog';
import { releases } from '@/lib/data/releases';

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages: MetadataRoute.Sitemap = [
        { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${SITE_URL}/artists`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${SITE_URL}/releases`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ];

    const artistPages: MetadataRoute.Sitemap = artists.map((a) => ({
        url: `${SITE_URL}/artists/${a.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
        url: `${SITE_URL}/blog/${p.id}`,
        lastModified: new Date(p.isoDate),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const releasePages: MetadataRoute.Sitemap = releases.map((r) => ({
        url: `${SITE_URL}/releases/${r.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...artistPages, ...blogPages, ...releasePages];
}
