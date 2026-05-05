'use client';

import { useState } from 'react';
import { useWeddingStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { PriorityBadge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { Plus, Pencil, Trash2, Check, ListChecks } from 'lucide-react';
import type { ChecklistItem, WeddingArea, Priority } from '@/lib/types';

const AREAS: WeddingArea[] = ['Court Wedding', 'White Wedding', 'Traditional Wedding', 'Pre-Wedding Shoot', 'General'];
const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

const AREA_ORDER: WeddingArea[] = ['Court Wedding', 'White Wedding', 'Traditional Wedding', 'Pre-Wedding Shoot', 'General'];
const AREA_COLORS: Record<WeddingArea, string> = {
  'Court Wedding': 'text-champagne-800 border-champagne-300 bg-champagne-50',
  'White Wedding': 'text-stone-700 border-champagne-200 bg-ivory-50',
  'Traditional Wedding': 'text-burgundy-700 border-burgundy-200 bg-burgundy-50',
  'Pre-Wedding Shoot': 'text-gold-700 border-gold-200 bg-gold-50',
  'General': 'text-stone-600 border-stone-200 bg-stone-50',
};

const EMPTY: Omit<ChecklistItem, 'id'> = {
  done: false, item: '', weddingArea: 'General', priority: 'Medium', deadline: '', notes: '',
};

export default function ChecklistPage() {
  const { checklist, toggleChecklistItem, addChecklistItem, updateChecklistItem, deleteChecklistItem } = useWeddingStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ChecklistItem | null>(null);
  const [form, setForm] = useState<Omit<ChecklistItem, 'id'>>(EMPTY);

  const done = checklist.filter((c) => c.done).length;
  const pct = checklist.length ? Math.round((done / checklist.length) * 100) : 0;

  const grouped = AREA_ORDER.map((area) => ({
    area,
    items: checklist.filter((c) => c.weddingArea === area),
  })).filter((g) => g.items.length > 0);

  function openAdd() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(c: ChecklistItem) { setEditing(c); setForm({ ...c }); setModalOpen(true); }
  function handleSave() {
    if (!form.item.trim()) return;
    if (editing) { updateChecklistItem(editing.id, form); } else { addChecklistItem(form); }
    setModalOpen(false);
  }
  function f(field: keyof typeof form, val: string | boolean) {
    setForm((p) => ({ ...p, [field]: val }));
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-champagne-200 px-6 py-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Checklist</h1>
            <p className="text-sm text-stone-400 mt-1">{done} of {checklist.length} items ticked off · {pct}% complete</p>
          </div>
          <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Item</button>
        </div>
        {/* Progress */}
        <div className="mt-4">
          <div className="h-2.5 bg-champagne-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gold-400 transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 space-y-6">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ListChecks className="w-10 h-10 text-champagne-300 mb-4" />
            <p className="font-serif text-lg text-stone-500">Nothing here yet</p>
          </div>
        ) : grouped.map(({ area, items }) => {
          const areaClasses = AREA_COLORS[area];
          const areaDone = items.filter((c) => c.done).length;
          return (
            <div key={area}>
              <div className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-3', areaClasses)}>
                {area} · {areaDone}/{items.length}
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id}
                    className={cn('card px-5 py-3.5 flex items-center gap-4 transition-all', item.done && 'opacity-50')}
                  >
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className={cn(
                        'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                        item.done ? 'bg-emerald-500 border-emerald-500' : 'border-champagne-300 hover:border-gold-400'
                      )}
                      aria-label={item.done ? 'Uncheck' : 'Check'}
                    >
                      {item.done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <span className={cn('text-sm font-medium text-stone-800', item.done && 'line-through text-stone-400')}>
                        {item.item}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <PriorityBadge priority={item.priority} />
                        {item.deadline && <span className="text-xs text-stone-400">By {item.deadline}</span>}
                        {item.notes && <span className="text-xs text-stone-400 italic truncate">{item.notes}</span>}
                      </div>
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(item)} className="btn-ghost p-1.5"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { if (confirm('Remove item?')) deleteChecklistItem(item.id); }} className="btn-danger p-1.5"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Checklist Item' : 'Add Checklist Item'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Item *</label>
            <input className="input" value={form.item} onChange={(e) => f('item', e.target.value)} placeholder="What needs to be done?" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Wedding Area</label>
              <select className="input" value={form.weddingArea} onChange={(e) => f('weddingArea', e.target.value)}>
                {AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={(e) => f('priority', e.target.value)}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Deadline</label>
            <input className="input" type="date" value={form.deadline} onChange={(e) => f('deadline', e.target.value)} />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={(e) => f('notes', e.target.value)} placeholder="Any notes..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-champagne-100">
          <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">{editing ? 'Save Changes' : 'Add Item'}</button>
        </div>
      </Modal>
    </div>
  );
}
