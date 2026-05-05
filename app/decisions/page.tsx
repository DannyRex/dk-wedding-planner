'use client';

import { useState } from 'react';
import { useWeddingStore } from '@/lib/store';
import { AreaBadge, StatusBadge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import type { Decision, WeddingArea, Owner } from '@/lib/types';

const AREAS: WeddingArea[] = ['Court Wedding', 'White Wedding', 'Traditional Wedding', 'Pre-Wedding Shoot', 'General'];
const OWNERS: Owner[] = ['Daniel', 'Kelechi', 'Both'];
const STATUSES = ['Decided', 'Pending', 'Reviewing', 'Completed'];

const EMPTY: Omit<Decision, 'id'> = {
  date: new Date().toISOString().split('T')[0],
  decision: '', weddingArea: 'General', whyWeChoseIt: '',
  owner: 'Both', status: 'Decided', notes: '',
};

export default function DecisionsPage() {
  const { decisions, addDecision, updateDecision, deleteDecision } = useWeddingStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Decision | null>(null);
  const [form, setForm] = useState<Omit<Decision, 'id'>>(EMPTY);

  function openAdd() { setEditing(null); setForm({ ...EMPTY, date: new Date().toISOString().split('T')[0] }); setModalOpen(true); }
  function openEdit(d: Decision) { setEditing(d); setForm({ ...d }); setModalOpen(true); }
  function handleSave() {
    if (!form.decision.trim()) return;
    if (editing) { updateDecision(editing.id, form); } else { addDecision(form); }
    setModalOpen(false);
  }
  function f(field: keyof typeof form, val: string) {
    setForm((p) => ({ ...p, [field]: val }));
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-champagne-200 px-6 py-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Decision Log</h1>
            <p className="text-sm text-stone-400 mt-1">Record decisions once so you do not have to scroll through old chats</p>
          </div>
          <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Log Decision</button>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6">
        {decisions.length === 0 ? (
          <EmptyState icon={FileText} title="No decisions logged yet" description="Record your agreed choices here to keep everything in one place."
            action={<button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Log Decision</button>} />
        ) : (
          <div className="space-y-4">
            {decisions.map((d) => (
              <div key={d.id} className="card px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <AreaBadge area={d.weddingArea} />
                      <StatusBadge status={d.status} />
                      <span className="text-xs text-stone-400">{d.owner}</span>
                      {d.date && <span className="text-xs text-stone-400">{d.date}</span>}
                    </div>
                    <h3 className="font-serif text-lg font-medium text-stone-800">{d.decision}</h3>
                    {d.whyWeChoseIt && (
                      <div className="mt-3 pl-4 border-l-2 border-gold-200">
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-1">Why we chose it</p>
                        <p className="text-sm text-stone-600 leading-relaxed">{d.whyWeChoseIt}</p>
                      </div>
                    )}
                    {d.notes && <p className="text-xs text-stone-400 italic mt-2">{d.notes}</p>}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(d)} className="btn-ghost p-1.5"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { if (confirm('Delete this decision?')) deleteDecision(d.id); }} className="btn-danger p-1.5"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Decision' : 'Log a Decision'} size="md">
        <div className="space-y-4">
          <div>
            <label className="label">Decision *</label>
            <input className="input" value={form.decision} onChange={(e) => f('decision', e.target.value)} placeholder="What did you decide?" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Wedding Area</label>
              <select className="input" value={form.weddingArea} onChange={(e) => f('weddingArea', e.target.value)}>
                {AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Owner</label>
              <select className="input" value={form.owner} onChange={(e) => f('owner', e.target.value)}>
                {OWNERS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => f('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input className="input" type="date" value={form.date} onChange={(e) => f('date', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Why We Chose It</label>
            <textarea className="input" rows={3} value={form.whyWeChoseIt} onChange={(e) => f('whyWeChoseIt', e.target.value)} placeholder="Explain the reasoning behind this decision..." />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={(e) => f('notes', e.target.value)} placeholder="Any additional notes..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-champagne-100">
          <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">{editing ? 'Save Changes' : 'Log Decision'}</button>
        </div>
      </Modal>
    </div>
  );
}
