'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import ContentTable from '@/components/admin/ContentTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EventForm from '@/components/admin/forms/EventForm';
import { useAuth } from '@/hooks/useAuth';
import {
    adminGetEventsByArtist,
    adminCreateEvent,
    adminUpdateEvent,
    adminDeleteEvent,
} from '@/lib/admin-api';

interface Event {
    id: number;
    title: string;
    artist: string;
    venue: string;
    date: string;
    featured: boolean;
    [key: string]: unknown;
}

export default function PortalEventsPage() {
    const { user, isLoading } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<Event | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function load(artistId: number) {
        try {
            setEvents((await adminGetEventsByArtist(artistId)) as Event[]);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to load events');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isLoading && user?.artist_id) {
            load(user.artist_id);
        } else if (!isLoading) {
            setLoading(false);
        }
    }, [isLoading, user]);

    async function handleSubmit(data: Record<string, unknown>) {
        if (!user?.artist_id) return;
        setSaving(true);
        try {
            const payload = { ...data, artist_id: user.artist_id };
            if (editItem) {
                await adminUpdateEvent(editItem.id, payload);
                toast.success('Event updated');
            } else {
                await adminCreateEvent(payload);
                toast.success('Event created');
            }
            setFormOpen(false);
            setEditItem(null);
            await load(user.artist_id);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to save event');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteId || !user?.artist_id) return;
        setDeleting(true);
        try {
            await adminDeleteEvent(deleteId);
            toast.success('Event deleted');
            setDeleteId(null);
            await load(user.artist_id);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete event');
        } finally {
            setDeleting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#8B9D7F] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user?.artist_id) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-400 text-sm">Your account is not linked to an artist yet. Please contact the admin.</p>
            </div>
        );
    }

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'artist', label: 'Artist' },
        { key: 'venue', label: 'Venue' },
        { key: 'date', label: 'Date' },
        {
            key: 'featured',
            label: 'Featured',
            render: (row: Event) => (
                <Badge variant={row.featured ? 'default' : 'secondary'} style={row.featured ? { backgroundColor: '#8B9D7F' } : {}}>
                    {row.featured ? 'Yes' : 'No'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row: Event) => (
                <div className="flex gap-2">
                    <button onClick={() => { setEditItem(row); setFormOpen(true); }} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-white font-semibold text-xl">Events</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{events.length} total</p>
                </div>
                <button
                    onClick={() => { setEditItem(null); setFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: '#8B9D7F' }}
                >
                    <Plus className="w-4 h-4" /> Add Event
                </button>
            </div>

            <ContentTable columns={columns} data={events} isLoading={loading} emptyMessage="No events yet." />

            <EventForm
                open={formOpen}
                onOpenChange={(open) => { setFormOpen(open); if (!open) setEditItem(null); }}
                initialData={editItem}
                onSubmit={handleSubmit}
                isLoading={saving}
            />

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => { if (!open) setDeleteId(null); }}
                title="Delete Event"
                description="Are you sure you want to delete this event?"
                onConfirm={handleDelete}
                isLoading={deleting}
            />
        </div>
    );
}
