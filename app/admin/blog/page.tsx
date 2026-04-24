'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import ContentTable from '@/components/admin/ContentTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { adminGetBlogPosts, adminDeleteBlogPost } from '@/lib/admin-api';

interface BlogPost {
    id: number; title: string; author: string; category: string; publishedAt: string; featured: boolean;
    [key: string]: unknown;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    async function load() {
        try { setPosts((await adminGetBlogPosts()) as BlogPost[]); }
        catch (err) { toast.error(err instanceof Error ? err.message : 'Failed to load posts'); }
        finally { setLoading(false); }
    }

    useEffect(() => { load(); }, []);

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await adminDeleteBlogPost(deleteId);
            toast.success('Post deleted');
            setDeleteId(null);
            await load();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete post');
        } finally {
            setDeleting(false);
        }
    }

    const columns = [
        {
            key: 'title', label: 'Title', render: (row: BlogPost) => (
                <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate max-w-xs">{row.title}</p>
                    <p className="text-gray-500 text-xs">{row.category}</p>
                </div>
            )
        },
        { key: 'author', label: 'Author' },
        {
            key: 'publishedAt', label: 'Published', render: (row: BlogPost) => (
                <span className="text-gray-400 text-sm">
                    {row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : '—'}
                </span>
            )
        },
        {
            key: 'featured', label: 'Featured', render: (row: BlogPost) => (
                <Badge variant={row.featured ? 'default' : 'secondary'} style={row.featured ? { backgroundColor: '#8B9D7F' } : {}}>
                    {row.featured ? 'Yes' : 'No'}
                </Badge>
            )
        },
        {
            key: 'actions', label: 'Actions', render: (row: BlogPost) => (
                <div className="flex gap-2">
                    {/* Edit — opens full Editor.js page */}
                    <Link
                        href={`/admin/blog/${row.id}/edit`}
                        className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        title="Edit post"
                    >
                        <Pencil className="w-4 h-4" />
                    </Link>
                    {/* Preview on site */}
                    <Link
                        href={`/blog/${row.id}`}
                        target="_blank"
                        className="p-1.5 rounded text-gray-400 hover:text-[#8B9D7F] hover:bg-gray-700 transition-colors"
                        title="View on site"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => setDeleteId(row.id)}
                        className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                        title="Delete post"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-white font-semibold text-xl">Blog Posts</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{posts.length} total</p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                    style={{ backgroundColor: '#8B9D7F' }}
                >
                    <Plus className="w-4 h-4" />
                    Add New Post
                </Link>
            </div>

            <ContentTable columns={columns} data={posts} isLoading={loading} emptyMessage="No blog posts yet. Click 'Add New Post' to get started." />

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => { if (!open) setDeleteId(null); }}
                title="Delete Post"
                description="Are you sure you want to delete this post? This cannot be undone."
                onConfirm={handleDelete}
                isLoading={deleting}
            />
        </div>
    );
}
