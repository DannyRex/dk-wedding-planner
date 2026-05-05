import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { WeddingArea } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(amount);
}

export function areaColor(area: WeddingArea): string {
  switch (area) {
    case 'Court Wedding': return 'bg-champagne-100 text-champagne-800 border-champagne-200';
    case 'White Wedding': return 'bg-ivory-100 text-ivory-800 border-ivory-200';
    case 'Traditional Wedding': return 'bg-burgundy-50 text-burgundy-800 border-burgundy-200';
    case 'Pre-Wedding Shoot': return 'bg-gold-50 text-gold-800 border-gold-200';
    default: return 'bg-stone-100 text-stone-700 border-stone-200';
  }
}

export function areaAccent(area: WeddingArea): string {
  switch (area) {
    case 'Court Wedding': return '#E8D5B7';
    case 'White Wedding': return '#FAF7F0';
    case 'Traditional Wedding': return '#6B2D3E';
    case 'Pre-Wedding Shoot': return '#C4943A';
    default: return '#D6CFC4';
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'In progress': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Not started': return 'bg-stone-100 text-stone-600 border-stone-200';
    case 'Blocked': return 'bg-red-50 text-red-700 border-red-200';
    case 'Fully paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Deposit paid': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Unpaid': return 'bg-stone-100 text-stone-600 border-stone-200';
    case 'Overdue': return 'bg-red-50 text-red-700 border-red-200';
    case 'Accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Declined': return 'bg-red-50 text-red-700 border-red-200';
    case 'Pending': return 'bg-stone-100 text-stone-600 border-stone-200';
    case 'Maybe': return 'bg-amber-50 text-amber-700 border-amber-200';
    default: return 'bg-stone-100 text-stone-600 border-stone-200';
  }
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case 'High': return 'bg-red-50 text-red-700 border-red-200';
    case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Low': return 'bg-stone-100 text-stone-500 border-stone-200';
    default: return 'bg-stone-100 text-stone-500 border-stone-200';
  }
}
