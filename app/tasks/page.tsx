'use client';

import { useState, useMemo } from 'react';
import { useWeddingStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { AreaBadge, StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Pencil, Trash2, CheckSquare, Check } from 'lucide-react';
import type { Task, WeddingArea, Owner, TaskStatus, Priority } from '@/lib/types';

const AREAS: WeddingArea[] = ['Court Wedding', 'White Wedding', 'Traditional Wedding', 'Pre-Wedding Shoot', 'General'];
const OWNERS: Owner[] = ['Daniel', 'Kelechi', 'Both', 'Bride', 'Groom'];
const STATUSES: TaskStatus[] = ['Not started', 'In progress', 'Completed', 'Blocked'];
const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

const EMPTY: Omit<Task, 'id'> = {
  task: '', weddingArea: 'General', category: '', owner: 'Both',
  deadline: '', status: 'Not started', priority: 'Medium', dependency: '', done: false, notes: '',
};

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskDone } = useWeddingStore();
  const [filterArea, setFilterArea] = useState<WeddingArea | 'All'>('All');
  const [filterOwner, setFilterOwner] = useState<Owner | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'All'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<Omit<Task, 'id'>>(EMPTY);

  const filtered = useMemo(() => tasks.filter((t) =>
    (filterArea === 'All' || t.weddingArea === filterArea) &&
    (filterOwner === 'All' || t.owner === filterOwner) &&
    (filterStatus === 'All' || t.status === filterStatus)
  ), [tasks, filterArea, filterOwner, filterStatus]);

  const done = filtered.filter((t) => t.done).length;

  function openAdd() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(t: Task) { setEditing(t); setForm({ ...t }); setModalOpen(true); }

  function handleSave() {
    if (!form.task.trim()) return;
    if (editing) { updateTask(editing.id, form); } else { addTask(form); }
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
            <h1 className="page-title">Task Tracker</h1>
            <p className="text-sm text-stone-400 mt-1">{done} of {filtered.length} tasks completed</p>
          </div>
          <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Task</button>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-champagne-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gold-400 transition-all duration-700"
              style={{ width: `${filtered.length ? (done / filtered.length) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div>
            <select className="input py-1.5 text-xs w-auto pr-8"
              value={filterArea} onChange={(e) => setFilterArea(e.target.value as WeddingArea | 'All')}>
              <option value="All">All Areas</option>
              {AREAS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <select className="input py-1.5 text-xs w-auto pr-8"
              value={filterOwner} onChange={(e) => setFilterOwner(e.target.value as Owner | 'All')}>
              <option value="All">All Owners</option>
              {OWNERS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <select className="input py-1.5 text-xs w-auto pr-8"
              value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'All')}>
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6">
        {filtered.length === 0 ? (
          <EmptyState icon={CheckSquare} title="No tasks yet" description="Add tasks to stay on top of your planning."
            action={<button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Task</button>} />
        ) : (
          <div className="space-y-2">
            {filtered.map((task) => (
              <div key={task.id}
                className={cn('card px-5 py-4 flex items-start gap-4 transition-all duration-150', task.done && 'opacity-60')}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTaskDone(task.id)}
                  className={cn(
                    'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all',
                    task.done ? 'bg-emerald-500 border-emerald-500' : 'border-champagne-300 hover:border-gold-400'
                  )}
                  aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium text-stone-800', task.done && 'line-through text-stone-400')}>{task.task}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <AreaBadge area={task.weddingArea} />
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                    <span className="text-xs text-stone-400">{task.owner}</span>
                    {task.deadline && <span className="text-xs text-stone-400">Due: {task.deadline}</span>}
                  </div>
                  {task.notes && <p className="text-xs text-stone-400 mt-1">{task.notes}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(task)} className="btn-ghost p-1.5" aria-label="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm('Delete task?')) deleteTask(task.id); }} className="btn-danger p-1.5" aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Task' : 'Add Task'} size="md">
        <div className="space-y-4">
          <div>
            <label className="label">Task *</label>
            <input className="input" value={form.task} onChange={(e) => f('task', e.target.value)} placeholder="What needs to be done?" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Wedding Area</label>
              <select className="input" value={form.weddingArea} onChange={(e) => f('weddingArea', e.target.value)}>
                {AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <input className="input" value={form.category} onChange={(e) => f('category', e.target.value)} placeholder="e.g. Venue" />
            </div>
            <div>
              <label className="label">Owner</label>
              <select className="input" value={form.owner} onChange={(e) => f('owner', e.target.value)}>
                {OWNERS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={(e) => f('priority', e.target.value)}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => f('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Deadline</label>
              <input className="input" type="date" value={form.deadline} onChange={(e) => f('deadline', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={(e) => f('notes', e.target.value)} placeholder="Any notes..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-champagne-100">
          <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">{editing ? 'Save Changes' : 'Add Task'}</button>
        </div>
      </Modal>
    </div>
  );
}
