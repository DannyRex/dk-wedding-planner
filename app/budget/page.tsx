'use client';

import { useState, useMemo } from 'react';
import { useWeddingStore } from '@/lib/store';
import { formatCurrency, cn } from '@/lib/utils';
import { AreaBadge, StatusBadge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Pencil, Trash2, Wallet, Filter } from 'lucide-react';
import type { BudgetItem, WeddingArea, PaymentStatus } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const AREAS: WeddingArea[] = ['Court Wedding', 'White Wedding', 'Traditional Wedding', 'Pre-Wedding Shoot', 'General'];
const PAYMENT_STATUSES: PaymentStatus[] = ['Unpaid', 'Deposit paid', 'Fully paid', 'Overdue'];
const CATEGORIES = ['Outfit', 'Venue', 'Catering', 'Photography', 'Florals', 'Beauty', 'Decor', 'Entertainment', 'Stationery', 'Legal/Admin', 'Logistics', 'Other'];

const EMPTY_ITEM: Omit<BudgetItem, 'id'> = {
  item: '', weddingArea: 'General', category: 'Other', estimatedBudget: 0,
  actualCost: 0, paid: 0, paymentStatus: 'Unpaid', paymentDue: '', vendor: '', notes: '',
};

export default function BudgetPage() {
  const { budget, addBudgetItem, updateBudgetItem, deleteBudgetItem } = useWeddingStore();
  const [filter, setFilter] = useState<WeddingArea | 'All'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetItem | null>(null);
  const [form, setForm] = useState<Omit<BudgetItem, 'id'>>(EMPTY_ITEM);

  const filtered = useMemo(
    () => filter === 'All' ? budget : budget.filter((b) => b.weddingArea === filter),
    [budget, filter]
  );

  const totals = useMemo(() => ({
    estimated: filtered.reduce((s, b) => s + (b.estimatedBudget || 0), 0),
    actual: filtered.reduce((s, b) => s + (b.actualCost || 0), 0),
    paid: filtered.reduce((s, b) => s + (b.paid || 0), 0),
    balance: filtered.reduce((s, b) => s + ((b.estimatedBudget || 0) - (b.paid || 0)), 0),
  }), [filtered]);

  function openAdd() { setEditing(null); setForm(EMPTY_ITEM); setModalOpen(true); }
  function openEdit(item: BudgetItem) { setEditing(item); setForm({ ...item }); setModalOpen(true); }

  function handleSave() {
    if (!form.item.trim()) return;
    if (editing) {
      updateBudgetItem(editing.id, form);
    } else {
      addBudgetItem({ ...form, id: uuidv4() } as BudgetItem);
    }
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    if (confirm('Delete this budget item?')) deleteBudgetItem(id);
  }

  function f(field: keyof typeof form, val: string | number) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-champagne-200 px-6 py-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Budget Tracker</h1>
            <p className="text-sm text-stone-400 mt-1">Track every deposit, balance and payment status</p>
          </div>
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Estimated', value: formatCurrency(totals.estimated), color: 'text-stone-700' },
            { label: 'Actual Cost', value: formatCurrency(totals.actual), color: 'text-stone-700' },
            { label: 'Paid', value: formatCurrency(totals.paid), color: 'text-emerald-600' },
            { label: 'Balance', value: formatCurrency(totals.balance), color: 'text-burgundy-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-ivory-50 rounded-xl px-4 py-3 border border-champagne-200">
              <p className="text-xs text-stone-400 uppercase tracking-wide">{label}</p>
              <p className={cn('font-serif text-xl font-medium mt-0.5', color)}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          {(['All', ...AREAS] as const).map((a) => (
            <button key={a}
              onClick={() => setFilter(a)}
              className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-all',
                filter === a ? 'bg-gold-400 text-white border-gold-400' : 'bg-white text-stone-500 border-champagne-300 hover:border-gold-300'
              )}
            >{a}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="px-4 md:px-6 py-6">
        {filtered.length === 0 ? (
          <EmptyState icon={Wallet} title="No budget items yet" description="Add your first item to start tracking costs." action={<button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Item</button>} />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr>
                    {['Item', 'Area', 'Category', 'Estimated', 'Actual', 'Paid', 'Balance', 'Status', 'Vendor', ''].map((h) => (
                      <th key={h} className="table-header">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-ivory-50 transition-colors">
                      <td className="table-cell font-medium text-stone-800">{item.item}</td>
                      <td className="table-cell"><AreaBadge area={item.weddingArea} /></td>
                      <td className="table-cell text-stone-500">{item.category}</td>
                      <td className="table-cell font-mono">{formatCurrency(item.estimatedBudget)}</td>
                      <td className="table-cell font-mono">{formatCurrency(item.actualCost)}</td>
                      <td className="table-cell font-mono text-emerald-600">{formatCurrency(item.paid)}</td>
                      <td className="table-cell font-mono text-burgundy-600">{formatCurrency(item.estimatedBudget - item.paid)}</td>
                      <td className="table-cell"><StatusBadge status={item.paymentStatus} /></td>
                      <td className="table-cell text-stone-500">{item.vendor || '—'}</td>
                      <td className="table-cell">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(item)} className="btn-ghost p-1.5" aria-label="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(item.id)} className="btn-danger p-1.5" aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
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

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Budget Item' : 'Add Budget Item'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Item Name *</label>
            <input className="input" value={form.item} onChange={(e) => f('item', e.target.value)} placeholder="e.g. White wedding dress" />
          </div>
          <div>
            <label className="label">Wedding Area</label>
            <select className="input" value={form.weddingArea} onChange={(e) => f('weddingArea', e.target.value as WeddingArea)}>
              {AREAS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => f('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Estimated Budget (£)</label>
            <input className="input" type="number" min="0" value={form.estimatedBudget || ''} onChange={(e) => f('estimatedBudget', Number(e.target.value))} placeholder="0" />
          </div>
          <div>
            <label className="label">Actual Cost (£)</label>
            <input className="input" type="number" min="0" value={form.actualCost || ''} onChange={(e) => f('actualCost', Number(e.target.value))} placeholder="0" />
          </div>
          <div>
            <label className="label">Amount Paid (£)</label>
            <input className="input" type="number" min="0" value={form.paid || ''} onChange={(e) => f('paid', Number(e.target.value))} placeholder="0" />
          </div>
          <div>
            <label className="label">Payment Status</label>
            <select className="input" value={form.paymentStatus} onChange={(e) => f('paymentStatus', e.target.value as PaymentStatus)}>
              {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Payment Due Date</label>
            <input className="input" type="date" value={form.paymentDue} onChange={(e) => f('paymentDue', e.target.value)} />
          </div>
          <div>
            <label className="label">Vendor</label>
            <input className="input" value={form.vendor} onChange={(e) => f('vendor', e.target.value)} placeholder="Vendor name" />
          </div>
          <div className="md:col-span-2">
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={(e) => f('notes', e.target.value)} placeholder="Any notes..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-champagne-100">
          <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">
            {editing ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
