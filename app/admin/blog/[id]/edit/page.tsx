'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import NextDynamic from 'next/dynamic';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { adminGetBlogPosts, adminUpdateBlogPost, adminUploadImage, adminGetArtists } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

const EditorJsEditor = NextDynamic(() => import('@/components/admin/EditorJsEditor'), { ssr: false });

const CATEGORIES = [
    'News', 'Artist Spotlight', 'Release', 'Industry News',
    'Studio Life', 'Music History', 'Marketing', 'Company News',
];

function generateSlug(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

interface Post {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    category: string;
    coverImage: string;
    featured: boolean;
    publishedAt?: string;
    artistId?: number | null;
}

export default function EditBlogPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = Number(params.id);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [slugManual, setSlugManual] = useState(false);
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('SoundGang');
    const [category, setCategory] = useState('News');
    const [coverUrl, setCoverUrl] = useState('');
    const [featured, setFeatured] = useState(false);
    const [published, setPublished] = useState(true);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [artistTag, setArtistTag] = useState('');
    const [artists, setArtists] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        adminGetArtists()
            .then((data) => setArtists(data as { id: number; name: string }[]))
            .catch(() => { /* non-critical */ });
    }, []);

    useEffect(() => {
        adminGetBlogPosts()
            .then((posts) => {
                const post = (posts as Post[]).find((p) => p.id === postId);
                if (!post) { setNotFound(true); return; }
                setTitle(post.title);
                setSlug(post.slug);
                setExcerpt(post.excerpt);
                setContent(post.content);
                setAuthor(post.author);
                setCategory(post.category);
                setCoverUrl(post.coverImage ?? '');
                setFeatured(post.featured);
                setPublished(true);
                setArtistTag(post.artistId == null ? '' : String(post.artistId));
            })
            .catch(() => setError('Failed to load post'))
            .finally(() => setLoading(false));
    }, [postId]);

    function handleTitleChange(val: string) {
        setTitle(val);
        if (!slugManual) setSlug(generateSlug(val));
    }

    async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingCover(true);
        try {
            const key = `blog-cover-${Date.now()}`;
            const result = await adminUploadImage(file, key);
            setCoverUrl(result.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploadingCover(false);
        }
    }

    async function handleSave(publishState: boolean) {
        if (!title.trim()) { setError('Title is required'); return; }
        setSaving(true);
        setError('');
        try {
            await adminUpdateBlogPost(postId, {
                title: title.trim(),
                slug: slug.trim(),
                excerpt: excerpt.trim(),
                content,
                author: author.trim() || 'SoundGang',
                category,
                cover_url: coverUrl,
                gradient: 'from-gray-700 via-gray-800 to-black',
                featured: featured ? 1 : 0,
                published: publishState ? 1 : 0,
                artist_id: artistTag === '' ? null : Number(artistTag),
            });
            router.push('/admin/blog');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save post');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#8B9D7F' }} />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-400 mb-4">Post not found.</p>
                <Link href="/admin/blog" className="text-[#8B9D7F] hover:underline">Back to posts</Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/blog" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-white text-xl font-bold">Edit Post</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        <EyeOff className="w-4 h-4" />
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                        style={{ backgroundColor: '#8B9D7F' }}
                    >
                        {saving ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                        Update
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-[1fr_280px] gap-6">
                {/* Main editor */}
                <div className="space-y-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Post title"
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-white text-2xl font-bold placeholder-gray-600 focus:outline-none focus:border-[#8B9D7F] transition-colors"
                    />

                    <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2">
                        <span className="text-gray-500 text-sm">Permalink:</span>
                        <span className="text-gray-500 text-sm">/blog/</span>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                            className="flex-1 bg-transparent text-[#8B9D7F] text-sm focus:outline-none"
                        />
                    </div>

                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Short excerpt..."
                        rows={2}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#8B9D7F] transition-colors resize-none"
                    />

                    {/* Editor.js — only renders when content is loaded */}
                    <div className="bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 min-h-[500px]">
                        {!loading && (
                            <EditorJsEditor
                                key={postId} // remount when post changes
                                value={content}
                                onChange={setContent}
                                placeholder="Start writing..."
                            />
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="bg-gray-800 rounded-xl p-4 space-y-3">
                        <h3 className="text-white font-semibold text-sm">Publish</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Status</span>
                            <button
                                onClick={() => setPublished(!published)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${published ? 'text-white' : 'bg-gray-700 text-gray-400'}`}
                                style={published ? { backgroundColor: '#8B9D7F' } : {}}
                            >
                                {published ? 'Published' : 'Draft'}
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Featured</span>
                            <button
                                onClick={() => setFeatured(!featured)}
                                className={`w-10 h-5 rounded-full transition-colors relative ${featured ? '' : 'bg-gray-700'}`}
                                style={featured ? { backgroundColor: '#8B9D7F' } : {}}
                            >
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 space-y-3">
                        <h3 className="text-white font-semibold text-sm">Category</h3>
                        <div className="space-y-1.5">
                            {CATEGORIES.map((cat) => (
                                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={cat}
                                        checked={category === cat}
                                        onChange={() => setCategory(cat)}
                                        className="accent-[#8B9D7F]"
                                    />
                                    <span className="text-gray-300 text-sm">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 space-y-2">
                        <h3 className="text-white font-semibold text-sm">Author</h3>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#8B9D7F]"
                        />
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 space-y-2">
                        <h3 className="text-white font-semibold text-sm">Tag</h3>
                        <select
                            value={artistTag}
                            onChange={(e) => setArtistTag(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#8B9D7F]"
                        >
                            <option value="">SoundGang</option>
                            {[...artists]
                                .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
                                .map((a) => (
                                    <option key={a.id} value={String(a.id)}>{a.name}</option>
                                ))}
                        </select>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 space-y-3">
                        <h3 className="text-white font-semibold text-sm">Cover Image</h3>
                        {coverUrl && (
                            <img src={coverUrl} alt="Cover" className="w-full aspect-video object-cover rounded-lg" />
                        )}
                        <input
                            type="url"
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                            placeholder="Paste image URL..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#8B9D7F] placeholder-gray-600"
                        />
                        <div className="text-center text-gray-500 text-xs">or</div>
                        <label className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-[#8B9D7F] transition-colors text-gray-400 text-sm">
                            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploadingCover} />
                            {uploadingCover ? 'Uploading...' : 'Upload to R2'}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
