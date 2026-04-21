'use client';
import { Trash2, GripVertical } from 'lucide-react';
import AudioUploadField from '@/components/admin/AudioUploadField';

export interface TrackData {
    id?: number;
    title: string;
    duration: string;
    featuring: string;
    trackNumber: number;
    audioUrl: string;
}

interface TrackRowProps {
    track: TrackData;
    index: number;
    onChange: (index: number, data: Partial<TrackData>) => void;
    onRemove: (index: number) => void;
}

export default function TrackRow({ track, index, onChange, onRemove }: TrackRowProps) {
    const inputClass = 'w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#8B9D7F]';

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-3">
            <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <span className="text-gray-400 text-sm font-medium">Track {index + 1}</span>
                <div className="flex-1" />
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="p-1 rounded text-gray-500 hover:text-red-400 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Track Title *</label>
                    <input
                        className={inputClass}
                        value={track.title}
                        onChange={(e) => onChange(index, { title: e.target.value })}
                        placeholder="Track title"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Duration</label>
                    <input
                        className={inputClass}
                        value={track.duration}
                        onChange={(e) => onChange(index, { duration: e.target.value })}
                        placeholder="3:45"
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs text-gray-400 mb-1">Featuring (optional)</label>
                <input
                    className={inputClass}
                    value={track.featuring}
                    onChange={(e) => onChange(index, { featuring: e.target.value })}
                    placeholder="ft. Artist Name"
                />
            </div>
            <AudioUploadField
                label="Audio File"
                value={track.audioUrl}
                onChange={(url) => onChange(index, { audioUrl: url })}
            />
        </div>
    );
}
