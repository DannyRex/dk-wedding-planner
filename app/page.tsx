'use client';

import { useWeddingStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Heart, TrendingUp, CheckCircle2, Users, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const AREAS = ['Court Wedding', 'White Wedding', 'Traditional Wedding', 'Pre-Wedding Shoot'] as const;

const AREA_META: Record<string, { paletteHex: string[]; tagline: string }> = {
  'Court Wedding': { paletteHex: ['#FAF7F0', '#F0DFC8', '#FFFFFF'], tagline: 'Soft, elegant and classic civil ceremony' },
  'White Wedding': { paletteHex: ['#FAF7F0', '#F0DFC8', '#FFFFFF'], tagline: 'Timeless bridal softness with champagne accents' },
  'Traditional Wedding': { paletteHex: ['#6B2D3E', '#C4943A'], tagline: 'Rich, regal, celebratory and cultural' },
  'Pre-Wedding Shoot': { paletteHex: ['#FAF7F0', '#C4943A'], tagline: 'Look 1: ivory/champagne — Look 2: burgundy/gold' },
};

export default function DashboardPage() {
  const { budget, tasks, guests, checklist } = useWeddingStore();

  const totalBudget = budget.reduce((s, b) => s + (b.estimatedBudget || 0), 0);
  const totalPaid = budget.reduce((s, b) => s + (b.paid || 0), 0);
  const totalBalance = totalBudget - totalPaid;
  const tasksDone = tasks.filter((t) => t.done).length;
  const tasksTotal = tasks.length;
  const tasksPercent = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0;
  const checklistDone = checklist.filter((c) => c.done).length;
  const checklistPercent = checklist.length ? Math.round((checklistDone / checklist.length) * 100) : 0;
  const totalGuests = guests.filter((g) => g.invited).length;

  const areaStats = AREAS.map((area) => {
    const items = budget.filter((b) => b.weddingArea === area);
    const est = items.reduce((s, b) => s + (b.estimatedBudget || 0), 0);
    const paid = items.reduce((s, b) => s + (b.paid || 0), 0);
    const areaTasks = tasks.filter((t) => t.weddingArea === area);
    const tasksDoneArea = areaTasks.filter((t) => t.done).length;
    const pct = est > 0 ? Math.round((paid / est) * 100) : 0;
    const taskPct = areaTasks.length ? Math.round((tasksDoneArea / areaTasks.length) * 100) : 0;
    return { area, est, paid, balance: est - paid, pct, taskPct, tasksTotal: areaTasks.length, tasksDone: tasksDoneArea };
  });

  const stats = [
    { label: 'Total Budget', value: formatCurrency(totalBudget), sub: 'Estimated spend', icon: TrendingUp, color: 'text-gold-500' },
    { label: 'Total Paid', value: formatCurrency(totalPaid), sub: totalBudget > 0 ? `${Math.round((totalPaid / totalBudget) * 100)}% of budget` : '—', icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Remaining', value: formatCurrency(totalBalance), sub: 'Still to pay', icon: Calendar, color: 'text-burgundy-500' },
    { label: 'Tasks Done', value: `${tasksPercent}%`, sub: `${tasksDone} of ${tasksTotal} tasks`, icon: CheckCircle2, color: 'text-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ivory-100 via-champagne-50 to-ivory-100 border-b border-champagne-200">
        <div className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #C4943A18 0%, transparent 50%), radial-gradient(circle at 20% 80%, #6B2D3E0C 0%, transparent 50%)' }}
        />
        <div className="relative px-6 py-12 md:py-16">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
            <span className="text-xs font-medium text-gold-600 uppercase tracking-widest">Wedding Planner</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-800 mb-2">
            Daniel <span className="text-gold-400 italic">&</span> Kelechi
          </h1>
          <p className="text-stone-500 text-sm md:text-base font-light leading-relaxed max-w-lg">
            Court · Traditional · White Wedding — one place to plan it all, beautifully.
          </p>
          <div className="flex items-center gap-3 mt-6 flex-wrap">
            {[
              { name: 'Ivory', hex: '#FAF7F0' }, { name: 'Champagne', hex: '#F0DFC8' },
              { name: 'White', hex: '#FFFFFF' }, { name: 'Burgundy', hex: '#6B2D3E' }, { name: 'Warm Gold', hex: '#C4943A' },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full border border-stone-200 shadow-sm" style={{ backgroundColor: s.hex }} />
                <span className="text-xs text-stone-400">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="px-4 md:px-8 py-8 max-w-6xl space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="card px-5 py-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">{label}</p>
                <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
              </div>
              <p className="font-serif text-2xl font-medium text-stone-800">{value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-ivory-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-stone-400" />
            </div>
            <div>
              <p className="font-serif text-2xl font-medium text-stone-800">{totalGuests}</p>
              <p className="text-xs text-stone-400">Guests invited</p>
            </div>
            <Link href="/guests" className="ml-auto btn-ghost text-xs">View <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="card px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-ivory-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-stone-400" />
            </div>
            <div>
              <p className="font-serif text-2xl font-medium text-stone-800">{checklistPercent}%</p>
              <p className="text-xs text-stone-400">Checklist done</p>
            </div>
            <Link href="/checklist" className="ml-auto btn-ghost text-xs">View <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </div>

        {/* Wedding area breakdown */}
        <div>
          <h2 className="section-title mb-4">Wedding Areas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {areaStats.map(({ area, est, paid, balance, pct, taskPct, tasksTotal: tt, tasksDone: td }) => {
              const meta = AREA_META[area];
              const isTraditional = area === 'Traditional Wedding';
              return (
                <div key={area} className="card overflow-hidden">
                  <div className="px-5 pt-5 pb-4"
                    style={{ background: isTraditional ? 'linear-gradient(135deg, #6B2D3E08 0%, #C4943A08 100%)' : 'linear-gradient(135deg, #FAF7F008 0%, #F0DFC808 100%)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-serif text-lg font-medium text-stone-800">{area}</h3>
                        <p className="text-xs text-stone-400 mt-0.5">{meta.tagline}</p>
                      </div>
                      <div className="flex gap-1">
                        {meta.paletteHex.map((hex) => (
                          <div key={hex} className="w-4 h-4 rounded-full border border-stone-200" style={{ backgroundColor: hex }} />
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-stone-400 mb-1"><span>Budget paid</span><span>{pct}%</span></div>
                      <div className="h-1.5 bg-champagne-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%`, background: isTraditional ? '#6B2D3E' : '#C4943A' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-stone-400 mb-1"><span>Tasks done</span><span>{td}/{tt}</span></div>
                      <div className="h-1.5 bg-champagne-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-400 transition-all duration-700" style={{ width: `${Math.min(taskPct, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-champagne-100 border-t border-champagne-100">
                    {[{ label: 'Budget', val: formatCurrency(est) }, { label: 'Paid', val: formatCurrency(paid) }, { label: 'Balance', val: formatCurrency(balance) }].map(({ label, val }) => (
                      <div key={label} className="px-4 py-3 text-center">
                        <p className="text-xs text-stone-400 mb-0.5">{label}</p>
                        <p className="text-sm font-medium text-stone-700 font-serif">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="section-title mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: '/budget', label: 'Track Budget', desc: 'Costs & payments' },
              { href: '/tasks', label: 'Manage Tasks', desc: 'To-dos by phase' },
              { href: '/vendors', label: 'Vendors', desc: 'Contacts & quotes' },
              { href: '/timeline', label: 'Timeline', desc: 'Planning phases' },
            ].map(({ href, label, desc }) => (
              <Link key={href} href={href} className="card px-4 py-4 hover:shadow-luxury-lg hover:border-gold-300 transition-all duration-200 group">
                <p className="text-sm font-medium text-stone-700 group-hover:text-gold-600 transition-colors">{label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
                <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all mt-2" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
