'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Wallet, CheckSquare, Users, Store,
  Clock, FileText, ListChecks, Heart, Menu, X, Download, Upload
} from 'lucide-react';
import { useState } from 'react';
import { useWeddingStore } from '@/lib/store';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/budget', label: 'Budget', icon: Wallet },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/checklist', label: 'Checklist', icon: ListChecks },
  { href: '/vendors', label: 'Vendors', icon: Store },
  { href: '/guests', label: 'Guest List', icon: Users },
  { href: '/timeline', label: 'Timeline', icon: Clock },
  { href: '/decisions', label: 'Decisions', icon: FileText },
];

const areas = [
  { label: 'Court', color: 'bg-champagne-300' },
  { label: 'White', color: 'bg-ivory-200' },
  { label: 'Traditional', color: 'bg-burgundy-500' },
  { label: 'Pre-Wedding', color: 'bg-gold-400' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { exportData, importData } = useWeddingStore();

  function handleExport() {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dk-wedding-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          importData(data);
        } catch { alert('Invalid file format.'); }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
          <span className="font-serif text-lg font-medium text-stone-700 tracking-wide">D & K</span>
        </div>
        <p className="text-xs text-stone-400 leading-relaxed">Wedding Planner</p>
        <div className="flex gap-1 mt-3">
          {areas.map((a) => (
            <div key={a.label} className={cn('h-1.5 flex-1 rounded-full', a.color)} title={a.label} />
          ))}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5" aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-gold-50 text-gold-700 border border-gold-200 shadow-sm'
                  : 'text-stone-500 hover:bg-ivory-100 hover:text-stone-700'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-gold-500' : 'text-stone-400')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sync / export */}
      <div className="px-3 pb-6 pt-4 border-t border-champagne-200 mt-4">
        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium px-3 mb-2">Sync Data</p>
        <button onClick={handleExport} className="btn-ghost w-full justify-start text-xs mb-1">
          <Download className="w-3.5 h-3.5" /> Export JSON
        </button>
        <button onClick={handleImport} className="btn-ghost w-full justify-start text-xs">
          <Upload className="w-3.5 h-3.5" /> Import JSON
        </button>
        <p className="text-xs text-stone-400 mt-2 px-3 leading-relaxed">
          Share the JSON file with each other to stay in sync.
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-white border-r border-champagne-200 flex-shrink-0">
        <NavContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-champagne-200 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
          <span className="font-serif text-base font-medium text-stone-700">D & K</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-stone-500 hover:bg-ivory-100"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm" />
          <aside
            className="absolute top-0 left-0 h-full w-64 bg-white flex flex-col shadow-luxury-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-14 flex items-center justify-end px-4 border-b border-champagne-200">
              <button onClick={() => setMobileOpen(false)} className="p-2 text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <NavContent />
            </div>
          </aside>
        </div>
      )}

      {/* Mobile top padding spacer */}
      <div className="lg:hidden h-14 flex-shrink-0" />
    </>
  );
}
