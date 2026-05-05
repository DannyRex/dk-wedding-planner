'use client';

import { useState } from 'react';
import { useWeddingStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { Plus, Pencil, Check, Clock } from 'lucide-react';
import type { TimelinePhase, WeddingArea, Owner, TaskStatus } from '@/lib/types';

const AREAS: WeddingArea[] = ['Court Wedding', 'White Wedding', 'Traditional Wedding', 'Pre-Wedding Shoot', 'General'];
const OWNERS: Owner[] = ['Daniel', 'Kelechi', 'Both', 'Bride', 'Groom'];
const STATUSES: TaskStatus[] = ['Not started', 'In progress', 'Completed', 'Blocked'];

const EMPTY: Omit<TimelinePhase, 'id'> = {
  phase: '', targetPeriod: '', keyActions: '', weddingArea: 'General',
  owner: 'Both', status: 'Not started', notes: '', done: false,
};

export default function TimelinePage() {
  const { timeline, updateTimelinePhase, addTimelinePhase } = useWeddingStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TimelinePhase | null>(null);
  const [form, setForm] = useState<Omit<TimelinePhase, 'id'>>(EMPTY);

  function openAdd() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(p: TimelinePhase) { setEditing(p); setForm({ ...p }); setModalOpen(true); }
  function handleSave() {
    if (!form.phase.trim()) return;
    if (editing) { updateTimelinePhase(editing.id, form); } else { addTimelinePhase(form); }
    setModalOpen(false);
  }
  function f(field: keyof typeof form, val: string | boolean) {
    setForm((p) => ({ ...p, [field]: val }));
  }

  const statusDot: Record<string, string> = {
    'Completed': 'bg-emerald-500',
    'In progress': 'bg-gold-400',
    'Not started': 'bg-stone-300',
    'Blocked': 'bg-red-400',
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-champagne-200 px-6 py-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Planning Timeline</h1>
            <p className="text-sm text-stone-400 mt-1">Your calm master roadmap from now to the final celebration</p>
          </div>
          <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Phase</button>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8">
        {timeline.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Clock className="w-10 h-10 text-champagne-300 mb-4" />
            <p className="font-serif text-lg text-stone-500">No timeline phases yet</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-champagne-200 md:left-8" />

            <div className="space-y-4">
              {timeline.map((phase, idx) => (
                <div key={phase.id} className="relative flex gap-6 md:gap-8">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-12 md:w-16 flex flex-col items-center">
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10 mt-1',
                      statusDot[phase.status] || 'bg-stone-300'
                    )}>
                      {phase.done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                  </div>

                  {/* Card */}
                  <div className={cn(
                    'flex-1 card px-5 py-4 mb-2 transition-all',
                    phase.done && 'opacity-60'
                  )}>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Phase {idx + 1}</span>
                          <StatusBadge status={phase.status} />
                        </div>
                        <h3 className="font-serif text-xl font-medium text-stone-800">{phase.phase}</h3>
                        <p className="text-sm text-gold-600 font-medium mt-0.5">{phase.targetPeriod}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => updateTimelinePhase(phase.id, { done: !phase.done, status: !phase.done ? 'Completed' : 'In progress' })}
                          className={cn('w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all',
                            phase.done ? 'bg-emerald-500 border-emerald-500' : 'border-champagne-300 hover:border-gold-400'
                          )}>
                          {phase.done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </button>
                        <button onClick={() => openEdit(phase)} className="btn-ghost p-1.5"><Pencil className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>

                    <p className="text-sm text-stone-600 mt-3 leading-relaxed">{phase.keyActions}</p>

                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className="text-xs text-stone-400">Owner: <span className="text-stone-600 font-medium">{phase.owner}</span></span>
                      <span className="text-xs text-stone-400">Area: <span className="text-stone-600 font-medium">{phase.weddingArea}</span></span>
                    </div>

                    {phase.notes && <p className="text-xs text-stone-400 italic mt-2">{phase.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Phase' : 'Add Phase'} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Phase Name *</label>
              <input className="input" value={form.phase} onChange={(e) => f('phase', e.target.value)} placeholder="e.g. Foundation" />
            </div>
            <div>
              <label className="label">Target Period</label>
              <input className="input" value={form.targetPeriod} onChange={(e) => f('targetPeriod', e.target.value)} placeholder="e.g. Now, 3 months before" />
            </div>
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
            <div className="col-span-2">
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => f('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Key Actions</label>
            <textarea className="input" rows={3} value={form.keyActions} onChange={(e) => f('keyActions', e.target.value)} placeholder="What are the key actions for this phase?" />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={(e) => f('notes', e.target.value)} placeholder="Any notes..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-champagne-100">
          <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">{editing ? 'Save Changes' : 'Add Phase'}</button>
        </div>
      </Modal>
    </div>
  );
}
