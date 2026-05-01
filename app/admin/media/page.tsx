'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Music, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Copy } from 'lucide-react';
import { adminUploadAudio, adminUploadImage } from '@/lib/admin-api';

type UploadType = 'audio' | 'image';
type InputMode = 'file' | 'url';

interface UploadResult {
    url: string;
    key: string;
    type: UploadType;
    name: string;
}

export default function MediaLibraryPage() {
    const [activeTab, setActiveTab] = useState<UploadType>('audio');
    const [inputMode, setInputMode] = useState<InputMode>('file');
    const [urlInput, setUrlInput] = useState('');
    const [keyInput, setKeyInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState<UploadResult[]>([]);
    const [copied, setCopied] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    function generateKey(filename: string): string {
        const base = filename.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
        return `${base}-${Date.now()}`;
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        setUploading(true);

        try {
            const key = keyInput.trim() || generateKey(file.name);
            let uploadedUrl: string;

            if (activeTab === 'audio') {
                if (!file.type.startsWith('audio/')) {
                    setError('Please select an audio file (MP3, WAV, etc.)');
                    return;
                }
                const res = await adminUploadAudio(file, key);
                uploadedUrl = res.url;
            } else {
                if (!file.type.startsWith('image/')) {
                    setError('Please select an image file (JPG, PNG, WebP, etc.)');
                    return;
                }
                if (file.size > 5 * 1024 * 1024) {
                    setError('Image must be under 5MB.');
                    return;
                }
                const res = await adminUploadImage(file, key);
                uploadedUrl = res.url;
            }

            setResults((prev) => [{ url: uploadedUrl, key, type: activeTab, name: file.name }, ...prev]);
            setKeyInput('');
            if (fileRef.current) fileRef.current.value = '';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    }

    function handleUrlSave() {
        if (!urlInput.trim()) return;
        const name = urlInput.split('/').pop() ?? urlInput;
        setResults((prev) => [{ url: urlInput.trim(), key: name, type: activeTab, name }, ...prev]);
        setUrlInput('');
    }

    async function copyToClipboard(url: string) {
        await navigator.clipboard.writeText(url);
        setCopied(url);
        setTimeout(() => setCopied(null), 2000);
    }

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-white text-2xl font-bold mb-1">Media Library</h1>
                <p className="text-gray-400 text-sm">Upload music, images, and videos to R2 or save external links</p>
            </div>

            {/* Type tabs */}
            <div className="flex gap-2">
                {(['audio', 'image'] as UploadType[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => { setActiveTab(t); setError(''); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t ? 'text-white' : 'text-gray-400 bg-gray-800 hover:text-white'}`}
                        style={activeTab === t ? { backgroundColor: '#8B9D7F' } : {}}
                    >
                        {t === 'audio' ? <Music className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                        {t === 'audio' ? 'Audio / Music' : 'Images'}
                    </button>
                ))}
            </div>

            {/* Input mode toggle */}
            <div className="bg-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex gap-3 border-b border-gray-700 pb-4">
                    <button
                        onClick={() => setInputMode('file')}
                        className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${inputMode === 'file' ? 'border-[#8B9D7F] text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                    >
                        <Upload className="w-4 h-4" />
                        Upload File to R2
                    </button>
                    <button
                        onClick={() => setInputMode('url')}
                        className={`flex items-center gap-2 text-sm font-medium pb-1 border-b-2 transition-colors ${inputMode === 'url' ? 'border-[#8B9D7F] text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                    >
                        <LinkIcon className="w-4 h-4" />
                        Save External URL
                    </button>
                </div>

                {inputMode === 'file' ? (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">
                                Custom filename key (optional — auto-generated if blank)
                            </label>
                            <input
                                type="text"
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                placeholder={`e.g. ${activeTab === 'audio' ? 'gang-gang-multilord' : 'multilord-cover'}`}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F]"
                            />
                        </div>

                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? 'border-gray-700 opacity-60' : 'border-gray-700 hover:border-[#8B9D7F]'}`}>
                            <input
                                ref={fileRef}
                                type="file"
                                accept={activeTab === 'audio' ? 'audio/*' : 'image/*'}
                                onChange={handleFileUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                            {uploading ? (
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#8B9D7F' }} />
                                    <span className="text-sm">Uploading to R2...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                    {activeTab === 'audio' ? <Music className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                                    <span className="text-sm">Click to select {activeTab === 'audio' ? 'audio file' : 'image'}</span>
                                    <span className="text-xs text-gray-500">
                                        {activeTab === 'audio' ? 'MP3, WAV, AAC, FLAC' : 'JPG, PNG, WebP, GIF — max 5MB'}
                                    </span>
                                </div>
                            )}
                        </label>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">
                                External URL (Cloudinary, YouTube, or any direct link)
                            </label>
                            <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder={activeTab === 'audio' ? 'https://res.cloudinary.com/.../audio.mp3' : 'https://res.cloudinary.com/.../image.jpg'}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F]"
                            />
                        </div>
                        <button
                            onClick={handleUrlSave}
                            disabled={!urlInput.trim()}
                            className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
                            style={{ backgroundColor: '#8B9D7F' }}
                        >
                            Save URL
                        </button>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-5">
                    <h2 className="text-white font-semibold mb-4">Uploaded / Saved URLs</h2>
                    <p className="text-gray-400 text-xs mb-4">Copy these URLs and paste them into the relevant Artist, Release, or Blog form fields.</p>
                    <div className="space-y-3">
                        {results.map((r, i) => (
                            <div key={i} className="flex items-center gap-3 bg-gray-900 rounded-lg px-4 py-3">
                                <div className="flex-shrink-0">
                                    {r.type === 'audio' ? (
                                        <Music className="w-5 h-5 text-[#8B9D7F]" />
                                    ) : (
                                        <ImageIcon className="w-5 h-5 text-[#8B9D7F]" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{r.name}</p>
                                    <p className="text-gray-400 text-xs truncate">{r.url}</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(r.url)}
                                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                    style={{ backgroundColor: copied === r.url ? '#22c55e22' : '#8B9D7F22', color: copied === r.url ? '#22c55e' : '#8B9D7F' }}
                                >
                                    {copied === r.url ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied === r.url ? 'Copied!' : 'Copy URL'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
