'use client';
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { adminUploadImage } from '@/lib/admin-api';
import { validateImageFile } from '@/lib/admin-utils';
import Image from 'next/image';

interface ImageUploadFieldProps {
    label?: string;
    value: string;
    onChange: (url: string) => void;
    placeholder?: string;
}

export default function ImageUploadField({
    label = 'Image',
    value,
    onChange,
    placeholder = 'https://...',
}: ImageUploadFieldProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);

        const validation = validateImageFile(file);
        if (!validation.valid) {
            setError(validation.error ?? 'Invalid file.');
            return;
        }

        setUploading(true);
        try {
            const key = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const result = await adminUploadImage(file, key);
            onChange(result.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed.');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    }

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F]"
                />
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleFile}
                />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            {value && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-700 group">
                    <Image
                        src={value}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3 text-white" />
                    </button>
                </div>
            )}
        </div>
    );
}
