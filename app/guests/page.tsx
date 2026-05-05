'use client';

import { useState, useMemo } from 'react';
import { useWeddingStore } from '@/lib/store';
import { AreaBadge, StatusBadge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Pencil, Trash2, Users, Check } from 'lucide-react';
import type { Guest, WeddingArea, RSVPStatus } from '@/lib/types';

const AREAS: WeddingArea[] = ['Court Wedding', 'White Wedding', 'Traditional Wedding', 'Pre-Wedding Shoot', 'General'];
const RSVP_STATUSES: RSVPStatus[] = ['Pending', 'Accepted', 'Declined', 'Maybe'];

const EMPTY: Omit<Guest, 'id'> = {
  guestName: '', side: 'Both', weddingArea: 'White Wedding', invited: true,
  rsvp: 'Pending', adults: 1, children: 0, tableGroup: '', gift: false, contact: '', notes: '',
};

export default function GuestsPage() {
  const { guests, addGuest, updateGuest, deleteGuest } = useWeddingStore();
  const [filterArea, setFilterArea] = useState<WeddingArea | 'All'>('All');
  const [filterSide, setFilterSide] = useState<'All' | 'Daniel' | 'Kelechi' | 'Both'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [form, setForm] = useState<Omit<Guest, 'id'>>(EMPTY);

  const filtered = useMemo(() => guests.filter((g) =>
    (filterArea === 'All' || g.weddingArea === filterArea) &&
    (filterSide === 'All' || g.side === filterSide)
  ), [guests, filterArea, filterSide]);

  const stats = useMemo(() => ({
    total: filtered.length,
    invited: filtered.filter((g) => g.invited).length,
    accepted: filtered.filter((g) => g.rsvp === 'Accepted').length,
    declined: filtered.filter((g) => g.rsvp === 'Declined').length,
    pending: filtered.filter((g) => g.rsvp === 'Pending').length,
    totalAdults: filtered.reduce((s, g) => s + (g.adults || 0), 0),
    totalChildren: filtered.reduce((s, g) => s + (g.children || 0), 0),
  }), [filtered]);

  function openAdd() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(g: Guest) { setEditing(g); setForm({ ...g }); setModalOpen(true); }
  function handleSave() {
    if (!form.guestName.trim()) return;
    if (editing) { updateGuest(editing.id, form); } else { addGuest(form); }
    setModalOpen(false);
  }
  function f(field: keyof typeof form, val: string | number | boolean) {
    setForm((p) => ({ ...p, [field]: val }));
  }

  const rsvpColor: Record<RSVPStatus, string> = {
    'Accepted': 'text-emerald-600',
    'Declined': 'text-red-500',
    'Pending': 'text-stone-400',
    'Maybe': 'text-amber-500',
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-champagne-200 px-6 py-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Guest List</h1>
            <p className="text-sm text-stone-400 mt-1">Track invites, RSVPs and guest details</p>
          </div>
          <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Guest</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-5">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Invited', value: stats.invited },
            { label: 'Accepted', value: stats.accepted },
            { label: 'Declined', value: stats.declined },
            { label: 'Pending', value: stats.pending },
            { label: 'Adults', value: stats.totalAdults },
          ].map(({ label, value }) => (
            <div key={label} className="bg-ivory-50 rounded-xl px-3 py-2 border border-champagne-200 text-center">
              <p className="font-serif text-xl font-medium text-stone-800">{value}</p>
              <p className="text-xs text-stone-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <select className="input py-1.5 text-xs w-auto pr-8"
            value={filterArea} onChange={(e) => setFilterArea(e.target.value as WeddingArea | 'All')}>
            <option value="All">All Areas</option>
            {AREAS.map((a) => <option key={a}>{a}</option>)}
          </select>
          <select className="input py-1.5 text-xs w-auto pr-8"
            value={filterSide} onChange={(e) => setFilterSide(e.target.value as typeof filterSide)}>
            <option value="All">Both Sides</option>
            <option>Daniel</option>
            <option>Kelechi</option>
            <option>Both</option>
          </select>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No guests yet" description="Start building your guest list for each wedding."
            action={<button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Guest</button>} />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr>
                    {['Guest', 'Side', 'Area', 'Invited', 'RSVP', 'Adults', 'Children', 'Table', 'Gift', ''].map((h) => (
                      <th key={h} className="table-header">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((g) => (
                    <tr key={g.id} className="hover:bg-ivory-50 transition-colors">
                      <td className="table-cell font-medium text-stone-800">{g.guestName}</td>
                      <td className="table-cell text-stone-500 text-xs">{g.side}</td>
                      <td className="table-cell"><AreaBadge area={g.weddingArea} /></td>
                      <td className="table-cell">
                        {g.invited ? <Check className="w-4 h-4 text-emerald-500" /> : <span className="text-stone-300">—</span>}
                      </td>
                      <td className="table-cell">
                        <span className={`text-sm font-medium ${rsvpColor[g.rsvp]}`}>{g.rsvp}</span>
                      </td>
                      <td className="table-cell text-center">{g.adults}</td>
                      <td className="table-cell text-center">{g.children}</td>
                      <td className="table-cell text-stone-500">{g.tableGroup || '—'}</td>
                      <td className="table-cell">
                        {g.gift ? <Check className="w-4 h-4 text-gold-400" /> : <span className="text-stone-300">—</span>}
                      </td>
                      <td className="table-cell">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(g)} className="btn-ghost p-1.5"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => { if (confirm('Remove guest?')) deleteGuest(g.id); }} className="btn-danger p-1.5"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Guest' : 'Add Guest'} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Guest Name *</label>
              <input className="input" value={form.guestName} onChange={(e) => f('guestName', e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label className="label">Side</label>
              <select className="input" value={form.side} onChange={(e) => f('side', e.target.value)}>
                {['Daniel', 'Kelechi', 'Both'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Wedding Area</label>
              <select className="input" value={form.weddingArea} onChange={(e) => f('weddingArea', e.target.value)}>
                {AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="label">RSVP Status</label>
              <select className="input" value={form.rsvp} onChange={(e) => f('rsvp', e.target.value)}>
                {RSVP_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Table / Group</label>
              <input className="input" value={form.tableGroup} onChange={(e) => f('tableGroup', e.target.value)} placeholder="e.g. Table 3" />
            </div>
            <div>
              <label className="label">Adults</label>
              <input className="input" type="number" min="0" value={form.adults} onChange={(e) => f('adults', Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Children</label>
              <input className="input" type="number" min="0" value={form.children} onChange={(e) => f('children', Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Contact</label>
              <input className="input" value={form.contact} onChange={(e) => f('contact', e.target.value)} placeholder="Phone or email" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.invited} onChange={(e) => f('invited', e.target.checked)} className="w-4 h-4 accent-gold-400 rounded" />
              <span className="text-sm text-stone-600">Invited</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.gift} onChange={(e) => f('gift', e.target.checked)} className="w-4 h-4 accent-gold-400 rounded" />
              <span className="text-sm text-stone-600">Gift received</span>
            </label>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={(e) => f('notes', e.target.value)} placeholder="Dietary needs, special requests..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-champagne-100">
          <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">{editing ? 'Save Changes' : 'Add Guest'}</button>
        </div>
      </Modal>
    </div>
  );
}
