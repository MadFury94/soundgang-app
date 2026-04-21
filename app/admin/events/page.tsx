'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import ContentTable from '@/components/admin/ContentTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EventForm from '@/components/admin/forms/EventForm';
import { adminGetEvents, adminCreateEvent, adminUpdateEvent, adminDeleteEvent } from '@/lib/admin-api';

interface Event {
    id: number; title: string; artist: string; venue: string; date: string; featured: boolean;
    [key: string]: unknown;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<Event | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function load() {
        try { setEvents((await adminGetEvents()) as Event[]); }
        catch (err) { toast.error(err instanceof Error ? err.message : 'Failed to load events'); }
        finally { setLoading(false); }
    }

    useEffect(() => { load(); }, []);

    async function handleSubmit(data: Record<string, unknown>) {
        setSaving(true);
        try {
            if (editItem) { await adminUpdateEvent(editItem.id, data); toast.success('Event updated'); }
            else { await adminCreateEvent(data); toast.success('Event created'); }
            setFormOpen(false); setEditItem(null); await load();
        } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed to save event'); }
        finally { setSaving(false); }
    }

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        try { await adminDeleteEvent(deleteId); toast.success('Event deleted'); setDeleteId(null); await load(); }
        catch (err) { toast.error(err instanceof Error ? err.message : 'Failed to delete event'); }
        finally { setDeleting(false); }
    }

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'artist', label: 'Artist' },
        { key: 'venue', label: 'Venue' },
        { key: 'date', label: 'Date' },
        {
            key: 'featured', label: 'Featured', render: (row: Event) => (
                <Badge variant={row.featured ? 'default' : 'secondary'} style={row.featured ? { backgroundColor: '#8B9D7F' } : {}}>
                    {row.featured ? 'Yes' : 'No'}
                </Badge>
            )
        },
        {
            key: 'actions', label: 'Actions', render: (row: Event) => (
                <div className="flex gap-2">
                    <button onClick={() => { setEditItem(row); setFormOpen(true); }} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <div><h2 className="text-white font-semibold text-xl">Events</h2><p className="text-gray-400 text-sm mt-0.5">{events.length} total</p></div>
                <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: '#8B9D7F' }}>
                    <Plus className="w-4 h-4" /> Add Event
                </button>
            </div>
            <ContentTable columns={columns} data={events} isLoading={loading} emptyMessage="No events yet." />
            <EventForm open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setEditItem(null); }} initialData={editItem} onSubmit={handleSubmit} isLoading={saving} />
            <ConfirmDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }} title="Delete Event" description="Are you sure you want to delete this event?" onConfirm={handleDelete} isLoading={deleting} />
        </div>
    );
}
