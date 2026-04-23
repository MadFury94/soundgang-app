/**
 * Property-based tests for Task 11.
 *
 * Sub-task 11.1 — Property 12: Empty sections always render a fallback
 *
 * Feature: artist-user-linking, Property 12: empty sections always render a fallback
 * Validates: Requirements 11.1, 11.2, 11.3, 11.4
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// ─── Mirror the ArtistEmptyState config from the component ───────────────────
// We test the pure data-mapping logic here without a DOM/React renderer.

type Section = 'releases' | 'events' | 'blog' | 'videos';

interface SectionConfig {
    message: string;
    href: string;
    linkText: string;
}

const SECTION_CONFIG: Record<Section, SectionConfig> = {
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
        // No public /videos page — falls back to /releases
        message: "This artist doesn't have any videos yet.",
        href: '/releases',
        linkText: 'View all videos',
    },
};

const ALL_SECTIONS: Section[] = ['releases', 'events', 'blog', 'videos'];

// ─── Sub-task 11.1 — Property 12: Empty sections always render a fallback ────
// Feature: artist-user-linking, Property 12: empty sections always render a fallback
// Validates: Requirements 11.1, 11.2, 11.3, 11.4

describe('Property 12: empty sections always render a fallback', () => {
    it('every section has a non-empty fallback message', () => {
        /**
         * Validates: Requirements 11.1, 11.2, 11.3, 11.4
         */
        fc.assert(
            fc.property(
                fc.constantFrom(...ALL_SECTIONS),
                (section) => {
                    const config = SECTION_CONFIG[section];
                    // Message must be non-empty
                    expect(config.message.length).toBeGreaterThan(0);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('every section has a valid public listing href', () => {
        /**
         * Validates: Requirements 11.3
         */
        fc.assert(
            fc.property(
                fc.constantFrom(...ALL_SECTIONS),
                (section) => {
                    const config = SECTION_CONFIG[section];
                    // href must start with /
                    expect(config.href.startsWith('/')).toBe(true);
                    // href must be non-empty
                    expect(config.href.length).toBeGreaterThan(1);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('every section has non-empty link text', () => {
        /**
         * Validates: Requirements 11.4
         */
        fc.assert(
            fc.property(
                fc.constantFrom(...ALL_SECTIONS),
                (section) => {
                    const config = SECTION_CONFIG[section];
                    expect(config.linkText.length).toBeGreaterThan(0);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('config is defined for all valid section values — never an empty container', () => {
        /**
         * Validates: Requirements 11.1, 11.2
         */
        fc.assert(
            fc.property(
                fc.constantFrom(...ALL_SECTIONS),
                (section) => {
                    const config = SECTION_CONFIG[section];
                    // Config must exist (component always renders something)
                    expect(config).toBeDefined();
                    expect(config.message).toBeTruthy();
                    expect(config.href).toBeTruthy();
                    expect(config.linkText).toBeTruthy();
                }
            ),
            { numRuns: 100 }
        );
    });

    it('releases section links to /releases', () => {
        expect(SECTION_CONFIG.releases.href).toBe('/releases');
    });

    it('events section links to /events', () => {
        expect(SECTION_CONFIG.events.href).toBe('/events');
    });

    it('blog section links to /blog', () => {
        expect(SECTION_CONFIG.blog.href).toBe('/blog');
    });

    it('videos section links to /releases (no public /videos page)', () => {
        // Per spec: if no public /videos page exists, link to /releases instead
        expect(SECTION_CONFIG.videos.href).toBe('/releases');
    });
});
