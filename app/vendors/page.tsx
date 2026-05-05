'use client';

import { useState, useMemo } from 'react';
import { useWeddingStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { AreaBadge, StatusBadge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Pencil, Trash2, Store, Phone, Mail } from 'lucide-react';
import type { Vendor, WeddingArea } from '@/lib/types';

const AREAS: WeddingArea[] = ['Court Wedding', 'White Wedding', 'Traditional Wedding', 'Pre-Wedding Shoot', 'General'];
const STATUSES = ['Shortlisted', 'Contacted', 'Quoted', 'Deposit paid', 'Booked', 'Completed', 'Not pursuing'];

const EMPTY: Omit<Vendor, 'id'> = {
  vendor: '', service: '', weddingArea: 'General', contactName: '',
  phoneEmail: '', quote: 0, paid: 0, status: 'Shortlisted', followUpDate: '', notes: '',
};

export default function VendorsPage() {
  const { vendors, addVendor, updateVendor, deleteVendor } = useWeddingStore();
  const [filter, setFilter] = useState<WeddingArea | 'All'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [form, setForm] = useState<Omit<Vendor, 'id'>>(EMPTY);

  const filtered = useMemo(
    () => filter === 'All' ? vendors : vendors.filter((v) => v.weddingArea === filter),
    [vendors, filter]
  );

  function openAdd() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(v: Vendor) { setEditing(v); setForm({ ...v }); setModalOpen(true); }
  function handleSave() {
    if (!form.vendor.trim()) return;
    if (editing) { updateVendor(editing.id, form); } else { addVendor(form); }
    setModalOpen(false);
  }
  function f(field: keyof typeof form, val: string | number) {
    setForm((p) => ({ ...p, [field]: val }));
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-champagne-200 px-6 py-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Vendor Directory</h1>
            <p className="text-sm text-stone-400 mt-1">Contacts, quotes, payments and notes in one place</p>
          </div>
          <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Vendor</button>
        </div>
        {/* Filters */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {(['All', ...AREAS] as const).map((a) => (
            <button key={a} onClick={() => setFilter(a)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filter === a ? 'bg-gold-400 text-white border-gold-400' : 'bg-white text-stone-500 border-champagne-300 hover:border-gold-300'}`}
            >{a}</button>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-6 py-6">
        {filtered.length === 0 ? (
          <EmptyState icon={Store} title="No vendors yet" description="Add your first vendor to start building your supplier list."
            action={<button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Vendor</button>} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((vendor) => (
              <div key={vendor.id} className="card px-5 py-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-stone-800">{vendor.vendor}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">{vendor.service}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(vendor)} className="btn-ghost p-1.5"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { if (confirm('Delete vendor?')) deleteVendor(vendor.id); }} className="btn-danger p-1.5"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <AreaBadge area={vendor.weddingArea} />
                  <StatusBadge status={vendor.status} />
                </div>

                {vendor.contactName && (
                  <p className="text-sm text-stone-600">{vendor.contactName}</p>
                )}
                {vendor.phoneEmail && (
                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    {vendor.phoneEmail.includes('@') ? <Mail className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                    <span className="truncate">{vendor.phoneEmail}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-champagne-100">
                  <div>
                    <p className="text-xs text-stone-400">Quote</p>
                    <p className="text-sm font-medium text-stone-700 font-serif">{formatCurrency(vendor.quote)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">Paid</p>
                    <p className="text-sm font-medium text-emerald-600 font-serif">{formatCurrency(vendor.paid)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">Balance</p>
                    <p className="text-sm font-medium text-burgundy-600 font-serif">{formatCurrency(vendor.quote - vendor.paid)}</p>
                  </div>
                  {vendor.followUpDate && (
                    <div>
                      <p className="text-xs text-stone-400">Follow-up</p>
                      <p className="text-sm text-stone-600">{vendor.followUpDate}</p>
                    </div>
                  )}
                </div>

                {vendor.notes && <p className="text-xs text-stone-400 italic">{vendor.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Vendor' : 'Add Vendor'} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Vendor Name *</label>
              <input className="input" value={form.vendor} onChange={(e) => f('vendor', e.target.value)} placeholder="e.g. Blossom Photography" />
            </div>
            <div>
              <label className="label">Service</label>
              <input className="input" value={form.service} onChange={(e) => f('service', e.target.value)} placeholder="e.g. Photography" />
            </div>
            <div>
              <label className="label">Wedding Area</label>
              <select className="input" value={form.weddingArea} onChange={(e) => f('weddingArea', e.target.value)}>
                {AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => f('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Contact Name</label>
              <input className="input" value={form.contactName} onChange={(e) => f('contactName', e.target.value)} placeholder="Contact person" />
            </div>
            <div>
              <label className="label">Phone / Email</label>
              <input className="input" value={form.phoneEmail} onChange={(e) => f('phoneEmail', e.target.value)} placeholder="Phone or email" />
            </div>
            <div>
              <label className="label">Quote (£)</label>
              <input className="input" type="number" min="0" value={form.quote || ''} onChange={(e) => f('quote', Number(e.target.value))} placeholder="0" />
            </div>
            <div>
              <label className="label">Amount Paid (£)</label>
              <input className="input" type="number" min="0" value={form.paid || ''} onChange={(e) => f('paid', Number(e.target.value))} placeholder="0" />
            </div>
            <div>
              <label className="label">Follow-up Date</label>
              <input className="input" type="date" value={form.followUpDate} onChange={(e) => f('followUpDate', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={(e) => f('notes', e.target.value)} placeholder="Any notes..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-champagne-100">
          <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">{editing ? 'Save Changes' : 'Add Vendor'}</button>
        </div>
      </Modal>
    </div>
  );
}
