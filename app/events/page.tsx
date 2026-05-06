'use client';

import { useState } from 'react';
import { useWeddingStore } from '@/lib/store';
import Modal from '@/components/ui/Modal';
import { Pencil, Calendar, MapPin, Sparkles, Shirt, Users, StickyNote, PlaneTakeoff } from 'lucide-react';
import type { EventDetail } from '@/lib/types';

const EVENT_META: Record<string, { accent: string; accentText: string; headerBg: string; dotColor: string }> = {
  'Court Wedding': {
    accent: 'border-champagne-300',
    accentText: 'text-champagne-800',
    headerBg: 'from-champagne-50 to-ivory-100',
    dotColor: '#F0DFC8',
  },
  'White Wedding': {
    accent: 'border-ivory-300',
    accentText: 'text-stone-700',
    headerBg: 'from-ivory-100 to-white',
    dotColor: '#FAF7F0',
  },
  'Traditional Wedding': {
    accent: 'border-burgundy-200',
    accentText: 'text-burgundy-700',
    headerBg: 'from-burgundy-50 to-gold-50',
    dotColor: '#6B2D3E',
  },
  'Pre-Wedding Shoot': {
    accent: 'border-gold-200',
    accentText: 'text-gold-700',
    headerBg: 'from-gold-50 to-champagne-50',
    dotColor: '#C4943A',
  },
};

const FIELD_GROUPS = [
  {
    label: 'Event',
    icon: Calendar,
    fields: [
      { key: 'date', label: 'Confirmed Date', type: 'date', placeholder: '' },
      { key: 'venue', label: 'Venue / Location', type: 'text', placeholder: 'Where is this happening?' },
      { key: 'palette', label: 'Colour Palette', type: 'text', placeholder: 'e.g. Ivory · Champagne · White' },
    ],
  },
  {
    label: "Bride's Look",
    icon: Sparkles,
    fields: [
      { key: 'brideOutfit', label: 'Dress / Outfit', type: 'textarea', placeholder: 'Designer, style, colour, silhouette…' },
      { key: 'brideHairstyle', label: 'Hairstyle', type: 'textarea', placeholder: 'e.g. Updo with loose curls, braids, natural…' },
      { key: 'brideMakeup', label: 'Makeup', type: 'text', placeholder: 'e.g. Soft glam, dewy skin, bold lip…' },
      { key: 'brideAccessories', label: 'Accessories', type: 'text', placeholder: 'Jewellery, veil, headpiece, shoes…' },
    ],
  },
  {
    label: "Groom's Look",
    icon: Shirt,
    fields: [
      { key: 'groomOutfit', label: 'Suit / Outfit', type: 'textarea', placeholder: 'e.g. Navy slim-fit suit, agbada, kaftan…' },
      { key: 'groomShoes', label: 'Shoes', type: 'text', placeholder: 'e.g. Oxford tan leather, white sneakers…' },
      { key: 'groomAccessories', label: 'Accessories', type: 'text', placeholder: 'Tie, pocket square, watch, cufflinks…' },
    ],
  },
  {
    label: 'Guest Dress Code',
    icon: Users,
    fields: [
      { key: 'guestDressCode', label: 'Dress Code', type: 'text', placeholder: 'e.g. Cocktail, Black tie, Smart casual…' },
      { key: 'guestColour', label: 'Colour Direction', type: 'text', placeholder: 'e.g. Shades of ivory and champagne' },
    ],
  },
  {
    label: 'Travel & Flights',
    icon: PlaneTakeoff,
    fields: [
      { key: 'flightFrom', label: 'Departing From', type: 'text', placeholder: 'e.g. London Heathrow (LHR)' },
      { key: 'flightTo', label: 'Flying To', type: 'text', placeholder: 'e.g. Lagos (LOS)' },
      { key: 'airline', label: 'Airline', type: 'text', placeholder: 'e.g. British Airways' },
      { key: 'flightNumber', label: 'Flight Number', type: 'text', placeholder: 'e.g. BA075' },
      { key: 'departureDate', label: 'Departure Date', type: 'date', placeholder: '' },
      { key: 'departureTime', label: 'Departure Time', type: 'time', placeholder: '' },
      { key: 'bookingRef', label: 'Booking Reference', type: 'text', placeholder: 'e.g. X4K9TQ' },
      { key: 'returnNotes', label: 'Return Flight Notes', type: 'textarea', placeholder: 'Return airline, flight no., date, time…' },
    ],
  },
  {
    label: 'Notes',
    icon: StickyNote,
    fields: [
      { key: 'notes', label: 'Additional Notes', type: 'textarea', placeholder: 'Anything else to remember for this event…' },
    ],
  },
] as const;

type FieldKey = keyof EventDetail;

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return (
    <div>
      <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">{label}</p>
      <p className="text-sm text-stone-300 italic">Not set yet</p>
    </div>
  );
  return (
    <div>
      <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">{label}</p>
      <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export default function EventsPage() {
  const { events, updateEvent } = useWeddingStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventDetail | null>(null);

  const editing = events.find((e) => e.id === editingId) ?? null;

  function openEdit(ev: EventDetail) {
    setEditingId(ev.id);
    setForm({ ...ev });
  }

  function handleSave() {
    if (!form) return;
    updateEvent(form.id, form);
    setEditingId(null);
    setForm(null);
  }

  function f(key: FieldKey, val: string) {
    setForm((p) => p ? { ...p, [key]: val } : p);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-champagne-200 px-6 py-6">
        <h1 className="page-title">Event Details</h1>
        <p className="text-sm text-stone-400 mt-1">
          Dates, looks, dress codes and travel for each ceremony — all in one place.
        </p>
      </div>

      <div className="px-4 md:px-6 py-6 grid md:grid-cols-2 gap-5">
        {events.map((ev) => {
          const meta = EVENT_META[ev.weddingArea] ?? EVENT_META['Court Wedding'];
          const hasDate = !!ev.date;
          const hasFlight = !!(ev.flightFrom || ev.flightTo || ev.airline || ev.flightNumber || ev.departureDate);

          return (
            <div key={ev.id} className="card overflow-hidden flex flex-col">
              {/* Card header */}
              <div className={`bg-gradient-to-br ${meta.headerBg} px-5 pt-5 pb-4 border-b border-champagne-100`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: meta.dotColor }} />
                    <h2 className="font-serif text-xl font-medium text-stone-800">{ev.weddingArea}</h2>
                  </div>
                  <button
                    onClick={() => openEdit(ev)}
                    className="btn-ghost py-1 px-2 text-xs flex-shrink-0"
                    aria-label={`Edit ${ev.weddingArea}`}
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>

                {/* Date + palette pill row */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="flex items-center gap-1.5 bg-white/70 border border-champagne-200 rounded-full px-3 py-1">
                    <Calendar className="w-3 h-3 text-gold-500" />
                    <span className="text-xs font-medium text-stone-600">
                      {hasDate ? new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date TBC'}
                    </span>
                  </div>
                  {ev.palette && (
                    <div className="flex items-center gap-1.5 bg-white/70 border border-champagne-200 rounded-full px-3 py-1">
                      <span className="text-xs text-stone-500">{ev.palette}</span>
                    </div>
                  )}
                </div>

                {ev.venue && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-500">
                    <MapPin className="w-3 h-3 text-stone-400 flex-shrink-0" />
                    {ev.venue}
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="px-5 py-4 flex-1 space-y-5">
                {/* Bride */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Bride</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 pl-5">
                    <DetailRow label="Dress / Outfit" value={ev.brideOutfit} />
                    <DetailRow label="Hairstyle" value={ev.brideHairstyle} />
                    <DetailRow label="Makeup" value={ev.brideMakeup} />
                    <DetailRow label="Accessories" value={ev.brideAccessories} />
                  </div>
                </div>

                <div className="border-t border-champagne-100" />

                {/* Groom */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Shirt className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Groom</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 pl-5">
                    <DetailRow label="Suit / Outfit" value={ev.groomOutfit} />
                    <DetailRow label="Shoes" value={ev.groomShoes} />
                    <DetailRow label="Accessories" value={ev.groomAccessories} />
                  </div>
                </div>

                <div className="border-t border-champagne-100" />

                {/* Guests */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Guests</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 pl-5">
                    <DetailRow label="Dress Code" value={ev.guestDressCode} />
                    <DetailRow label="Colour Direction" value={ev.guestColour} />
                  </div>
                </div>

                <div className="border-t border-champagne-100" />

                {/* Travel */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <PlaneTakeoff className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Travel</span>
                  </div>
                  {hasFlight ? (
                    <div className="pl-5 space-y-3">
                      {/* Outbound summary pill */}
                      <div className="flex flex-wrap items-center gap-2">
                        {(ev.flightFrom || ev.flightTo) && (
                          <div className="flex items-center gap-1.5 bg-champagne-50 border border-champagne-200 rounded-full px-3 py-1">
                            <PlaneTakeoff className="w-3 h-3 text-gold-500" />
                            <span className="text-xs font-medium text-stone-600">
                              {ev.flightFrom}{ev.flightFrom && ev.flightTo ? ' → ' : ''}{ev.flightTo}
                            </span>
                          </div>
                        )}
                        {ev.airline && (
                          <span className="text-xs text-stone-500">{ev.airline}</span>
                        )}
                        {ev.flightNumber && (
                          <span className="text-xs font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">{ev.flightNumber}</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {ev.departureDate && (
                          <DetailRow
                            label="Departure"
                            value={`${new Date(ev.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}${ev.departureTime ? ' · ' + ev.departureTime : ''}`}
                          />
                        )}
                        {ev.bookingRef && <DetailRow label="Booking Ref" value={ev.bookingRef} />}
                      </div>
                      {ev.returnNotes && <DetailRow label="Return" value={ev.returnNotes} />}
                    </div>
                  ) : (
                    <div className="pl-5">
                      <p className="text-sm text-stone-300 italic">Not set yet</p>
                    </div>
                  )}
                </div>

                {ev.notes && (
                  <>
                    <div className="border-t border-champagne-100" />
                    <div className="pl-5">
                      <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-1">Notes</p>
                      <p className="text-sm text-stone-500 leading-relaxed italic">{ev.notes}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      <Modal
        open={!!editingId && !!form}
        onClose={() => { setEditingId(null); setForm(null); }}
        title={editing ? `Edit — ${editing.weddingArea}` : ''}
        size="lg"
      >
        {form && (
          <div className="space-y-6">
            {FIELD_GROUPS.map(({ label, icon: Icon, fields }) => (
              <div key={label}>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-champagne-100">
                  <Icon className="w-4 h-4 text-gold-400" />
                  <span className="text-sm font-semibold text-stone-600 uppercase tracking-wider">{label}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fields.map(({ key, label: fLabel, type, placeholder }) => (
                    <div key={key} className={type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="label">{fLabel}</label>
                      {type === 'textarea' ? (
                        <textarea
                          className="input"
                          rows={3}
                          value={(form[key as FieldKey] as string) ?? ''}
                          onChange={(e) => f(key as FieldKey, e.target.value)}
                          placeholder={placeholder}
                        />
                      ) : (
                        <input
                          className="input"
                          type={type}
                          value={(form[key as FieldKey] as string) ?? ''}
                          onChange={(e) => f(key as FieldKey, e.target.value)}
                          placeholder={placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-4 border-t border-champagne-100">
              <button onClick={() => { setEditingId(null); setForm(null); }} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary">Save Details</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
