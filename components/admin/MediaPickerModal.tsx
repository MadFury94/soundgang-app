'use client';
import { useEffect, useState } from 'react';
import { Music, Loader2, AlertCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { adminGetMedia, MediaObject } from '@/lib/admin-api';

interface MediaPickerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultType: 'image' | 'audio' | 'all';
    onSelect: (url: string) => void;
}

type FilterType = 'all' | 'image' | 'audio';

function formatSize(bytes: number): string {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    if (bytes >= 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${bytes} B`;
}

function filename(key: string): string {
    return key.split('/').pop() ?? key;
}

export default function MediaPickerModal({
    open,
    onOpenChange,
    defaultType,
    onSelect,
}: MediaPickerModalProps) {
    const [filter, setFilter] = useState<FilterType>(
        defaultType === 'all' ? 'all' : defaultType
    );
    const [files, setFiles] = useState<MediaObject[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchFiles(type: FilterType) {
        setLoading(true);
        setError(null);
        try {
            const apiType = type === 'all' ? 'all' : type;
            const data = await adminGetMedia(apiType);
            setFiles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load media');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open) {
            const initial: FilterType = defaultType === 'all' ? 'all' : defaultType;
            setFilter(initial);
            fetchFiles(initial);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function handleFilterChange(type: FilterType) {
        setFilter(type);
        fetchFiles(type);
    }

    function handleSelect(file: MediaObject) {
        onSelect(file.url);
        onOpenChange(false);
    }

    const filterButtons: { label: string; value: FilterType }[] = [
        { label: 'All', value: 'all' },
        { label: 'Images', value: 'image' },
        { label: 'Audio', value: 'audio' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-white">Browse Media</DialogTitle>
                </DialogHeader>

                {/* Filter controls */}
                <div className="flex gap-2 pt-1">
                    {filterButtons.map((btn) => (
                        <button
                            key={btn.value}
                            type="button"
                            onClick={() => handleFilterChange(btn.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === btn.value
                                    ? 'text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                            style={filter === btn.value ? { backgroundColor: '#8B9D7F' } : {}}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* Content area */}
                <div className="flex-1 overflow-y-auto min-h-0 mt-2">
                    {loading && (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    )}

                    {!loading && error && (
                        <div className="flex flex-col items-center justify-center h-40 gap-3">
                            <AlertCircle className="w-6 h-6 text-red-400" />
                            <p className="text-red-400 text-sm">{error}</p>
                            <button
                                type="button"
                                onClick={() => fetchFiles(filter)}
                                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && files.length === 0 && (
                        <div className="flex items-center justify-center h-40">
                            <p className="text-gray-500 text-sm">No files found</p>
                        </div>
                    )}

                    {!loading && !error && files.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-2">
                            {files.map((file) => (
                                <button
                                    key={file.key}
                                    type="button"
                                    onClick={() => handleSelect(file)}
                                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-[#8B9D7F] rounded-lg p-3 text-left transition-colors group"
                                >
                                    {/* Thumbnail / icon */}
                                    <div className="w-full aspect-square rounded-md overflow-hidden bg-gray-900 mb-2 flex items-center justify-center">
                                        {file.contentType.startsWith('image/') ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={file.url}
                                                alt={filename(file.key)}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Music className="w-8 h-8 text-gray-500" />
                                        )}
                                    </div>

                                    {/* Filename */}
                                    <p className="text-white text-xs font-medium truncate leading-tight">
                                        {filename(file.key)}
                                    </p>

                                    {/* Meta row */}
                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                        <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                                            {file.contentType.split('/')[1] ?? file.contentType}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatSize(file.size)}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
