'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { WeddingData, BudgetItem, Task, Vendor, Guest, TimelinePhase, Decision, ChecklistItem, EventDetail } from './types';
import { initialBudget, initialTasks, initialTimeline, initialDecisions, initialChecklist, initialEvents } from './initial-data';
import { supabase, WEDDING_ID } from './supabase';

interface WeddingStore extends WeddingData {
  initialized: boolean;

  // Budget
  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;

  // Tasks
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskDone: (id: string) => void;

  // Vendors
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  // Guests
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;

  // Timeline
  updateTimelinePhase: (id: string, updates: Partial<TimelinePhase>) => void;
  addTimelinePhase: (phase: Omit<TimelinePhase, 'id'>) => void;

  // Decisions
  addDecision: (decision: Omit<Decision, 'id'>) => void;
  updateDecision: (id: string, updates: Partial<Decision>) => void;
  deleteDecision: (id: string) => void;

  // Checklist
  toggleChecklistItem: (id: string) => void;
  addChecklistItem: (item: Omit<ChecklistItem, 'id'>) => void;
  updateChecklistItem: (id: string, updates: Partial<ChecklistItem>) => void;
  deleteChecklistItem: (id: string) => void;

  // Events
  updateEvent: (id: string, updates: Partial<EventDetail>) => void;

  // Supabase lifecycle
  initStore: () => Promise<void>;
  _applyRemoteData: (data: Partial<WeddingData>) => void;

  // Import / Export
  importData: (data: Partial<WeddingData>) => void;
  exportData: () => WeddingData;
}

// ─── Supabase sync helpers ────────────────────────────────────────────────────

function extractData(s: WeddingStore): WeddingData {
  return {
    budget: s.budget,
    tasks: s.tasks,
    vendors: s.vendors,
    guests: s.guests,
    timeline: s.timeline,
    decisions: s.decisions,
    checklist: s.checklist,
    events: s.events,
    lastUpdated: s.lastUpdated,
    updatedBy: s.updatedBy,
  };
}

async function pushToSupabase(data: WeddingData) {
  const { error } = await supabase
    .from('wedding_data')
    .upsert({ id: WEDDING_ID, data, updated_at: new Date().toISOString() });
  if (error) console.error('[Supabase sync]', error.message);
}

let syncTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleSync(get: () => WeddingStore) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => pushToSupabase(extractData(get())), 600);
}

// ─── Store ────────────────────────────────────────────────────────────────────

function touch(state: Partial<WeddingStore>) {
  state.lastUpdated = new Date().toISOString();
}

const INITIAL_DATA: WeddingData = {
  budget: initialBudget,
  tasks: initialTasks,
  vendors: [],
  guests: [],
  timeline: initialTimeline,
  decisions: initialDecisions,
  checklist: initialChecklist,
  events: initialEvents,
  lastUpdated: new Date().toISOString(),
  updatedBy: '',
};

export const useWeddingStore = create<WeddingStore>()((set, get) => ({
  ...INITIAL_DATA,
  initialized: false,

  // ── Supabase init ─────────────────────────────────────────────────────────
  initStore: async () => {
    const { data, error } = await supabase
      .from('wedding_data')
      .select('data')
      .eq('id', WEDDING_ID)
      .single();

    if (error || !data) {
      // First run — seed Supabase with initial data
      await pushToSupabase(INITIAL_DATA);
      set({ initialized: true });
    } else {
      const remote = data.data as Partial<WeddingData>;
      set({
        budget: remote.budget ?? INITIAL_DATA.budget,
        tasks: remote.tasks ?? INITIAL_DATA.tasks,
        vendors: remote.vendors ?? [],
        guests: remote.guests ?? [],
        timeline: remote.timeline ?? INITIAL_DATA.timeline,
        decisions: remote.decisions ?? INITIAL_DATA.decisions,
        checklist: remote.checklist ?? INITIAL_DATA.checklist,
        events: remote.events ?? INITIAL_DATA.events,
        lastUpdated: remote.lastUpdated ?? INITIAL_DATA.lastUpdated,
        updatedBy: remote.updatedBy ?? '',
        initialized: true,
      });
    }
  },

  // Apply remote realtime update without triggering a sync back
  _applyRemoteData: (data) => {
    set((s) => ({ ...s, ...data }));
  },

  // ── Budget ────────────────────────────────────────────────────────────────
  addBudgetItem: (item) => {
    set((s) => { touch(s); return { budget: [...s.budget, { ...item, id: uuidv4() }] }; });
    scheduleSync(get);
  },
  updateBudgetItem: (id, updates) => {
    set((s) => { touch(s); return { budget: s.budget.map((b) => b.id === id ? { ...b, ...updates } : b) }; });
    scheduleSync(get);
  },
  deleteBudgetItem: (id) => {
    set((s) => { touch(s); return { budget: s.budget.filter((b) => b.id !== id) }; });
    scheduleSync(get);
  },

  // ── Tasks ─────────────────────────────────────────────────────────────────
  addTask: (task) => {
    set((s) => { touch(s); return { tasks: [...s.tasks, { ...task, id: uuidv4() }] }; });
    scheduleSync(get);
  },
  updateTask: (id, updates) => {
    set((s) => { touch(s); return { tasks: s.tasks.map((t) => t.id === id ? { ...t, ...updates } : t) }; });
    scheduleSync(get);
  },
  deleteTask: (id) => {
    set((s) => { touch(s); return { tasks: s.tasks.filter((t) => t.id !== id) }; });
    scheduleSync(get);
  },
  toggleTaskDone: (id) => {
    set((s) => { touch(s); return { tasks: s.tasks.map((t) => t.id === id ? { ...t, done: !t.done, status: !t.done ? 'Completed' : 'In progress' } : t) }; });
    scheduleSync(get);
  },

  // ── Vendors ───────────────────────────────────────────────────────────────
  addVendor: (vendor) => {
    set((s) => { touch(s); return { vendors: [...s.vendors, { ...vendor, id: uuidv4() }] }; });
    scheduleSync(get);
  },
  updateVendor: (id, updates) => {
    set((s) => { touch(s); return { vendors: s.vendors.map((v) => v.id === id ? { ...v, ...updates } : v) }; });
    scheduleSync(get);
  },
  deleteVendor: (id) => {
    set((s) => { touch(s); return { vendors: s.vendors.filter((v) => v.id !== id) }; });
    scheduleSync(get);
  },

  // ── Guests ────────────────────────────────────────────────────────────────
  addGuest: (guest) => {
    set((s) => { touch(s); return { guests: [...s.guests, { ...guest, id: uuidv4() }] }; });
    scheduleSync(get);
  },
  updateGuest: (id, updates) => {
    set((s) => { touch(s); return { guests: s.guests.map((g) => g.id === id ? { ...g, ...updates } : g) }; });
    scheduleSync(get);
  },
  deleteGuest: (id) => {
    set((s) => { touch(s); return { guests: s.guests.filter((g) => g.id !== id) }; });
    scheduleSync(get);
  },

  // ── Timeline ──────────────────────────────────────────────────────────────
  updateTimelinePhase: (id, updates) => {
    set((s) => { touch(s); return { timeline: s.timeline.map((p) => p.id === id ? { ...p, ...updates } : p) }; });
    scheduleSync(get);
  },
  addTimelinePhase: (phase) => {
    set((s) => { touch(s); return { timeline: [...s.timeline, { ...phase, id: uuidv4() }] }; });
    scheduleSync(get);
  },

  // ── Decisions ─────────────────────────────────────────────────────────────
  addDecision: (decision) => {
    set((s) => { touch(s); return { decisions: [...s.decisions, { ...decision, id: uuidv4() }] }; });
    scheduleSync(get);
  },
  updateDecision: (id, updates) => {
    set((s) => { touch(s); return { decisions: s.decisions.map((d) => d.id === id ? { ...d, ...updates } : d) }; });
    scheduleSync(get);
  },
  deleteDecision: (id) => {
    set((s) => { touch(s); return { decisions: s.decisions.filter((d) => d.id !== id) }; });
    scheduleSync(get);
  },

  // ── Checklist ─────────────────────────────────────────────────────────────
  toggleChecklistItem: (id) => {
    set((s) => { touch(s); return { checklist: s.checklist.map((c) => c.id === id ? { ...c, done: !c.done } : c) }; });
    scheduleSync(get);
  },
  addChecklistItem: (item) => {
    set((s) => { touch(s); return { checklist: [...s.checklist, { ...item, id: uuidv4() }] }; });
    scheduleSync(get);
  },
  updateChecklistItem: (id, updates) => {
    set((s) => { touch(s); return { checklist: s.checklist.map((c) => c.id === id ? { ...c, ...updates } : c) }; });
    scheduleSync(get);
  },
  deleteChecklistItem: (id) => {
    set((s) => { touch(s); return { checklist: s.checklist.filter((c) => c.id !== id) }; });
    scheduleSync(get);
  },

  // ── Events ────────────────────────────────────────────────────────────────
  updateEvent: (id, updates) => {
    set((s) => { touch(s); return { events: s.events.map((e) => e.id === id ? { ...e, ...updates } : e) }; });
    scheduleSync(get);
  },

  // ── Import / Export ───────────────────────────────────────────────────────
  importData: (data) => {
    set((s) => ({ ...s, ...data, lastUpdated: new Date().toISOString() }));
    // Immediate sync — bypass debounce
    if (syncTimer) { clearTimeout(syncTimer); syncTimer = null; }
    pushToSupabase(extractData(get()));
  },
  exportData: () => extractData(get()),
}));
