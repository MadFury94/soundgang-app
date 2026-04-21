'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { generateSlug } from '@/lib/admin-utils';

const CATEGORIES = ['News', 'Music', 'Events', 'Artist Spotlight', 'Industry', 'Culture'];

interface BlogPostFormData {
    title: string; slug: string; excerpt: string; content: string; author: string;
    category: string; coverUrl: string; gradient: string; featured: boolean; published: boolean;
}

const defaultForm: BlogPostFormData = {
    title: '', slug: '', excerpt: '', content: '', author: 'SoundGang',
    category: 'News', coverUrl: '', gradient: 'from-gray-700 via-gray-800 to-black',
    featured: false, published: true,
};

interface BlogPostFormProps {
    open: boolean; onOpenChange: (open: boolean) => void;
    initialData?: Record<string, unknown> | null;
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    isLoading?: boolean;
}

export default function BlogPostForm({ open, onOpenChange, initialData, onSubmit, isLoading }: BlogPostFormProps) {
    const [form, setForm] = useState<BlogPostFormData>(defaultForm);

    useEffect(() => {
        if (initialData) {
            setForm({
                title: String(initialData.title ?? ''), slug: String(initialData.slug ?? ''),
                excerpt: String(initialData.excerpt ?? ''), content: String(initialData.content ?? ''),
                author: String(initialData.author ?? 'SoundGang'), category: String(initialData.category ?? 'News'),
                coverUrl: String(initialData.coverImage ?? ''),
                gradient: String(initialData.gradient ?? 'from-gray-700 via-gray-800 to-black'),
                featured: Boolean(initialData.featured), published: initialData.published !== false,
            });
        } else {
            setForm(defaultForm);
        }
    }, [initialData, open]);

    function set(key: keyof BlogPostFormData, value: unknown) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleTitleChange(title: string) {
        set('title', title);
        if (!initialData) set('slug', generateSlug(title));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit({
            title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content,
            author: form.author, category: form.category, cover_url: form.coverUrl,
            gradient: form.gradient, featured: form.featured ? 1 : 0, published: form.published ? 1 : 0,
        });
    }

    const inputClass = 'w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F]';
    const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">{initialData ? 'Edit Post' : 'Add Post'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Title *</label><input className={inputClass} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required /></div>
                        <div><label className={labelClass}>Slug *</label><input className={inputClass} value={form.slug} onChange={(e) => set('slug', e.target.value)} required /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Author</label><input className={inputClass} value={form.author} onChange={(e) => set('author', e.target.value)} /></div>
                        <div>
                            <label className={labelClass}>Category</label>
                            <select className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value)}>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div><label className={labelClass}>Excerpt</label><textarea className={inputClass} rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} /></div>
                    <div><label className={labelClass}>Content</label><textarea className={inputClass} rows={8} value={form.content} onChange={(e) => set('content', e.target.value)} /></div>
                    <ImageUploadField label="Cover Image URL" value={form.coverUrl} onChange={(v) => set('coverUrl', v)} />
                    <div><label className={labelClass}>Gradient</label><input className={inputClass} value={form.gradient} onChange={(e) => set('gradient', e.target.value)} /></div>
                    <div className="flex gap-6">
                        <div className="flex items-center gap-3"><Switch checked={form.featured} onCheckedChange={(v) => set('featured', v)} /><label className="text-sm text-gray-300">Featured</label></div>
                        <div className="flex items-center gap-3"><Switch checked={form.published} onCheckedChange={(v) => set('published', v)} /><label className="text-sm text-gray-300">Published</label></div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm transition-colors">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50" style={{ backgroundColor: '#8B9D7F' }}>
                            {isLoading ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
