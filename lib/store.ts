'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { WeddingData, BudgetItem, Task, Vendor, Guest, TimelinePhase, Decision, ChecklistItem, EventDetail } from './types';
import { initialBudget, initialTasks, initialTimeline, initialDecisions, initialChecklist, initialEvents } from './initial-data';

interface WeddingStore extends WeddingData {
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

  // Import / Export
  importData: (data: Partial<WeddingData>) => void;
  exportData: () => WeddingData;
}

function touch(state: WeddingStore) {
  state.lastUpdated = new Date().toISOString();
}

export const useWeddingStore = create<WeddingStore>()(
  persist(
    (set, get) => ({
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

      // Budget
      addBudgetItem: (item) =>
        set((s) => { touch(s); return { budget: [...s.budget, { ...item, id: uuidv4() }] }; }),
      updateBudgetItem: (id, updates) =>
        set((s) => { touch(s); return { budget: s.budget.map((b) => b.id === id ? { ...b, ...updates } : b) }; }),
      deleteBudgetItem: (id) =>
        set((s) => { touch(s); return { budget: s.budget.filter((b) => b.id !== id) }; }),

      // Tasks
      addTask: (task) =>
        set((s) => { touch(s); return { tasks: [...s.tasks, { ...task, id: uuidv4() }] }; }),
      updateTask: (id, updates) =>
        set((s) => { touch(s); return { tasks: s.tasks.map((t) => t.id === id ? { ...t, ...updates } : t) }; }),
      deleteTask: (id) =>
        set((s) => { touch(s); return { tasks: s.tasks.filter((t) => t.id !== id) }; }),
      toggleTaskDone: (id) =>
        set((s) => { touch(s); return { tasks: s.tasks.map((t) => t.id === id ? { ...t, done: !t.done, status: !t.done ? 'Completed' : 'In progress' } : t) }; }),

      // Vendors
      addVendor: (vendor) =>
        set((s) => { touch(s); return { vendors: [...s.vendors, { ...vendor, id: uuidv4() }] }; }),
      updateVendor: (id, updates) =>
        set((s) => { touch(s); return { vendors: s.vendors.map((v) => v.id === id ? { ...v, ...updates } : v) }; }),
      deleteVendor: (id) =>
        set((s) => { touch(s); return { vendors: s.vendors.filter((v) => v.id !== id) }; }),

      // Guests
      addGuest: (guest) =>
        set((s) => { touch(s); return { guests: [...s.guests, { ...guest, id: uuidv4() }] }; }),
      updateGuest: (id, updates) =>
        set((s) => { touch(s); return { guests: s.guests.map((g) => g.id === id ? { ...g, ...updates } : g) }; }),
      deleteGuest: (id) =>
        set((s) => { touch(s); return { guests: s.guests.filter((g) => g.id !== id) }; }),

      // Timeline
      updateTimelinePhase: (id, updates) =>
        set((s) => { touch(s); return { timeline: s.timeline.map((p) => p.id === id ? { ...p, ...updates } : p) }; }),
      addTimelinePhase: (phase) =>
        set((s) => { touch(s); return { timeline: [...s.timeline, { ...phase, id: uuidv4() }] }; }),

      // Decisions
      addDecision: (decision) =>
        set((s) => { touch(s); return { decisions: [...s.decisions, { ...decision, id: uuidv4() }] }; }),
      updateDecision: (id, updates) =>
        set((s) => { touch(s); return { decisions: s.decisions.map((d) => d.id === id ? { ...d, ...updates } : d) }; }),
      deleteDecision: (id) =>
        set((s) => { touch(s); return { decisions: s.decisions.filter((d) => d.id !== id) }; }),

      // Checklist
      toggleChecklistItem: (id) =>
        set((s) => { touch(s); return { checklist: s.checklist.map((c) => c.id === id ? { ...c, done: !c.done } : c) }; }),
      addChecklistItem: (item) =>
        set((s) => { touch(s); return { checklist: [...s.checklist, { ...item, id: uuidv4() }] }; }),
      updateChecklistItem: (id, updates) =>
        set((s) => { touch(s); return { checklist: s.checklist.map((c) => c.id === id ? { ...c, ...updates } : c) }; }),
      deleteChecklistItem: (id) =>
        set((s) => { touch(s); return { checklist: s.checklist.filter((c) => c.id !== id) }; }),

      // Events
      updateEvent: (id, updates) =>
        set((s) => { touch(s); return { events: s.events.map((e) => e.id === id ? { ...e, ...updates } : e) }; }),

      // Import / Export
      importData: (data) =>
        set((s) => ({ ...s, ...data, lastUpdated: new Date().toISOString() })),
      exportData: () => {
        const s = get();
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
      },
    }),
    { name: 'dk-wedding-planner' }
  )
);
