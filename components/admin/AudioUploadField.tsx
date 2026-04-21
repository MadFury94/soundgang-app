'use client';
import { useState, useRef } from 'react';
import { Music, Upload } from 'lucide-react';
import { adminUploadAudio } from '@/lib/admin-api';

interface AudioUploadFieldProps {
    label?: string;
    value: string;
    onChange: (url: string) => void;
    placeholder?: string;
}

export default function AudioUploadField({
    label = 'Audio',
    value,
    onChange,
    placeholder = 'https://...',
}: AudioUploadFieldProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);
        setUploading(true);
        try {
            const key = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const result = await adminUploadAudio(file, key);
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
                <div className="flex-1 flex items-center gap-2 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2">
                    <Music className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                    />
                </div>
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
                    accept="audio/*"
                    className="hidden"
                    onChange={handleFile}
                />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
    );
}
