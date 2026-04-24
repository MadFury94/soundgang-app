'use client';
import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import TrackRow, { TrackData } from '@/components/admin/forms/TrackRow';

interface TrackEditorProps {
    tracks: TrackData[];
    onChange: (tracks: TrackData[]) => void;
}

export default function TrackEditor({ tracks, onChange }: TrackEditorProps) {
    const dragIndex = useRef<number>(-1);
    const [dragOverIndex, setDragOverIndex] = useState<number>(-1);

    function handleAddTrack() {
        onChange([
            ...tracks,
            {
                title: '',
                duration: '0:00',
                featuring: '',
                trackNumber: tracks.length + 1,
                audioUrl: '',
            },
        ]);
    }

    function handleRemove(index: number) {
        const updated = tracks
            .filter((_, i) => i !== index)
            .map((t, i) => ({ ...t, trackNumber: i + 1 }));
        onChange(updated);
    }

    function handleChange(index: number, data: Partial<TrackData>) {
        const updated = tracks.map((t, i) => (i === index ? { ...t, ...data } : t));
        onChange(updated);
    }

    function handleDragStart(index: number) {
        dragIndex.current = index;
    }

    function handleDragOver(e: React.DragEvent, index: number) {
        e.preventDefault();
        setDragOverIndex(index);
    }

    function handleDrop(index: number) {
        const from = dragIndex.current;
        const to = index;
        setDragOverIndex(-1);
        if (from === to || from === -1) return;
        const reordered = [...tracks];
        const [moved] = reordered.splice(from, 1);
        reordered.splice(to, 0, moved);
        onChange(reordered.map((t, i) => ({ ...t, trackNumber: i + 1 })));
        dragIndex.current = -1;
    }

    function handleDragEnd() {
        setDragOverIndex(-1);
        dragIndex.current = -1;
    }

    return (
        <div className="space-y-3">
            {tracks.map((track, index) => (
                <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={handleDragEnd}
                    className={`transition-all ${dragOverIndex === index
                            ? 'border-t-2 border-[#8B9D7F]'
                            : 'border-t-2 border-transparent'
                        }`}
                >
                    <TrackRow
                        track={track}
                        index={index}
                        onChange={handleChange}
                        onRemove={handleRemove}
                    />
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddTrack}
                className="w-full py-2.5 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-[#8B9D7F] text-sm flex items-center justify-center gap-2 transition-colors"
            >
                <Plus className="w-4 h-4" />
                Add Track
            </button>
        </div>
    );
}
