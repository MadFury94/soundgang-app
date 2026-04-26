'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const DEFAULT_CATEGORIES = [
    'News', 'Artist Spotlight', 'Release', 'Industry News',
    'Studio Life', 'Music History', 'Marketing', 'Company News',
];

function generateSlug(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

interface Category {
    id: string;
    name: string;
    slug: string;
    count: number;
}

export default function BlogCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(
        DEFAULT_CATEGORIES.map((name, i) => ({ id: String(i + 1), name, slug: generateSlug(name), count: 0 }))
    );
    const [newName, setNewName] = useState('');
    const [newSlug, setNewSlug] = useState('');
    const [slugManual, setSlugManual] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    function handleNewNameChange(val: string) {
        setNewName(val);
        if (!slugManual) setNewSlug(generateSlug(val));
    }

    function addCategory() {
        if (!newName.trim()) return;
        const slug = newSlug.trim() || generateSlug(newName);
        setCategories((prev) => [...prev, {
            id: Date.now().toString(),
            name: newName.trim(),
            slug,
            count: 0,
        }]);
        setNewName('');
        setNewSlug('');
        setSlugManual(false);
    }

    function deleteCategory(id: string) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
    }

    function startEdit(cat: Category) {
        setEditingId(cat.id);
        setEditName(cat.name);
    }

    function saveEdit(id: string) {
        setCategories((prev) => prev.map((c) =>
            c.id === id ? { ...c, name: editName.trim(), slug: generateSlug(editName) } : c
        ));
        setEditingId(null);
    }

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-white text-2xl font-bold mb-1">Blog Categories</h1>
                <p className="text-gray-400 text-sm">Manage the categories used to organise blog posts</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Add new */}
                <div className="bg-gray-800 rounded-xl p-5 space-y-4">
                    <h2 className="text-white font-semibold">Add New Category</h2>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Name</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => handleNewNameChange(e.target.value)}
                                placeholder="e.g. Artist News"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#8B9D7F]"
                                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Slug</label>
                            <input
                                type="text"
                                value={newSlug}
                                onChange={(e) => { setNewSlug(e.target.value); setSlugManual(true); }}
                                placeholder="artist-news"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#8B9D7F]"
                            />
                        </div>
                        <button
                            onClick={addCategory}
                            disabled={!newName.trim()}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 w-full justify-center"
                            style={{ backgroundColor: '#8B9D7F' }}
                        >
                            <Plus className="w-4 h-4" />
                            Add Category
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-700">
                        <h2 className="text-white font-semibold text-sm">All Categories ({categories.length})</h2>
                    </div>
                    <div className="divide-y divide-gray-700/50 max-h-96 overflow-y-auto">
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 transition-colors group">
                                {editingId === cat.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#8B9D7F]"
                                            autoFocus
                                            onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(cat.id); if (e.key === 'Escape') setEditingId(null); }}
                                        />
                                        <button onClick={() => saveEdit(cat.id)} className="p-1 text-[#8B9D7F] hover:text-white">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:text-white">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{cat.name}</p>
                                            <p className="text-gray-500 text-xs">{cat.slug}</p>
                                        </div>
                                        <span className="text-gray-500 text-xs">{cat.count}</span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEdit(cat)} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => deleteCategory(cat.id)} className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-400/10">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
