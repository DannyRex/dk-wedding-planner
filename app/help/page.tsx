'use client';

import Link from 'next/link';
import {
  Heart, LayoutDashboard, Wallet, CheckSquare, ListChecks,
  Store, Users, Clock, FileText, Download, Upload, ArrowRight,
} from 'lucide-react';

const sections = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    href: '/',
    color: 'text-gold-500',
    bg: 'bg-gold-50',
    border: 'border-gold-200',
    description: 'Your home base. See total budget, payments, task progress, and a per-wedding-area breakdown at a glance. Use the colour swatches as a reminder of your palette for each ceremony.',
    tips: [
      'Numbers update in real time as you fill in Budget and Tasks.',
      'Click any "View →" card to jump straight to that section.',
    ],
  },
  {
    icon: Wallet,
    title: 'Budget Tracker',
    href: '/budget',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    description: 'The master spend sheet. Every cost — from registry fees to florals — lives here with its estimated budget, actual cost, how much you\'ve paid, and what\'s still outstanding.',
    tips: [
      'Click "Add Item" to log a new cost. Fill in Estimated Budget when you first plan it, then update Actual Cost and Paid as money moves.',
      'Use the filter pills (All · Court · White · Traditional · Pre-Wedding) to focus on one ceremony at a time.',
      'The Payment Status field ("Unpaid", "Deposit paid", "Fully paid", "Overdue") helps you see at a glance what needs attention.',
      'Balance is auto-calculated as Estimated Budget minus Paid.',
    ],
  },
  {
    icon: CheckSquare,
    title: 'Tasks',
    href: '/tasks',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    description: 'All the to-dos, assigned to Daniel, Kelechi, or Both. Each task has a status, priority, deadline, and wedding area so nothing slips through the cracks.',
    tips: [
      'Click the circle on the left of any task to mark it done — the status updates to "Completed" automatically.',
      'Filter by owner to see only your tasks: Daniel filters to his list, Kelechi to hers.',
      'Set Priority to High for anything that blocks other tasks (e.g. confirm venue before booking caterer).',
    ],
  },
  {
    icon: ListChecks,
    title: 'Checklist',
    href: '/checklist',
    color: 'text-stone-600',
    bg: 'bg-stone-50',
    border: 'border-stone-200',
    description: 'A simpler tick-off list for common milestones, grouped by ceremony. Great for a quick daily check — "what still needs a tick?"',
    tips: [
      'Tick an item by clicking the checkbox. Ticked items fade out and the progress bar fills.',
      'Add your own items with "Add Item" — pick the area and priority.',
      'The progress bar at the top shows overall completion across all areas.',
    ],
  },
  {
    icon: Store,
    title: 'Vendors',
    href: '/vendors',
    color: 'text-burgundy-600',
    bg: 'bg-burgundy-50',
    border: 'border-burgundy-200',
    description: 'Your supplier directory. One card per vendor with their contact details, quote, how much you\'ve paid, and current status (Shortlisted → Booked → Completed).',
    tips: [
      'Log vendors as soon as you start getting quotes — even if you haven\'t decided yet. Set Status to "Shortlisted".',
      'Update Status to "Booked" once a deposit is paid so you can see what\'s confirmed vs. still open.',
      'The Balance column (quote minus paid) tells you how much you still owe each supplier.',
    ],
  },
  {
    icon: Users,
    title: 'Guest List',
    href: '/guests',
    color: 'text-champagne-800',
    bg: 'bg-champagne-50',
    border: 'border-champagne-300',
    description: 'Every guest across all three ceremonies, with RSVP status, side (Daniel / Kelechi / Both), table group, and head count.',
    tips: [
      'Add guests early — the Dashboard shows the running total of invited guests.',
      'Use the Side filter to see Daniel\'s guests vs. Kelechi\'s separately when splitting responsibilities.',
      'Update RSVP to "Accepted" or "Declined" as replies come in. The stats at the top update automatically.',
      'The Children column helps your caterer plan head count correctly.',
    ],
  },
  {
    icon: Clock,
    title: 'Timeline',
    href: '/timeline',
    color: 'text-gold-600',
    bg: 'bg-gold-50',
    border: 'border-gold-200',
    description: 'Six planning phases from Foundation (now) to Final Month. Think of it as the big-picture roadmap — each phase groups a cluster of related tasks.',
    tips: [
      'Tick the circle next to a phase to mark it complete. This doesn\'t affect individual tasks, but gives a high-level progress view.',
      'Add custom phases if your wedding has unique milestones (e.g. "Destination Recce Trip").',
      'Use the Notes field to record decisions or blockers specific to each phase.',
    ],
  },
  {
    icon: FileText,
    title: 'Decisions',
    href: '/decisions',
    color: 'text-stone-600',
    bg: 'bg-stone-50',
    border: 'border-stone-200',
    description: 'A running log of agreed choices — colours, venues, suppliers, outfits — so you never have to scroll back through old chats to remember what you decided.',
    tips: [
      'Log a decision as soon as you agree on something, even informally.',
      'The "Why we chose it" field is valuable — future-you will thank past-you for recording the reasoning.',
      'Set Status to "Completed" once a decision is fully acted on (e.g. deposit paid, contract signed).',
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-champagne-200 px-6 py-8">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
          <span className="text-xs font-medium text-gold-600 uppercase tracking-widest">How to use it</span>
        </div>
        <h1 className="page-title">Guide</h1>
        <p className="text-stone-400 text-sm mt-1 max-w-xl">
          A quick walkthrough of every section so you and Kelechi can hit the ground running.
        </p>
      </div>

      <div className="px-4 md:px-8 py-8 max-w-3xl space-y-6">

        {/* Quick start */}
        <div className="card px-6 py-6">
          <h2 className="section-title mb-4">Quick start — 5 steps</h2>
          <ol className="space-y-3">
            {[
              { n: '1', text: 'Open Budget and enter your estimated spend for each item — even rough figures are useful.' },
              { n: '2', text: 'Open Tasks and set deadlines and owners (Daniel / Kelechi / Both) for your highest-priority to-dos.' },
              { n: '3', text: 'Add your first vendors as you start reaching out for quotes.' },
              { n: '4', text: 'Build the Guest List together — Daniel adds his side, Kelechi adds hers.' },
              { n: '5', text: 'Check the Dashboard weekly. Watch the budget bars and task percentages move as you make progress.' },
            ].map(({ n, text }) => (
              <li key={n} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-400 text-white text-xs font-semibold flex items-center justify-center">
                  {n}
                </span>
                <p className="text-sm text-stone-600 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Sync box */}
        <div className="card px-6 py-5 border-champagne-300"
          style={{ background: 'linear-gradient(135deg, #FAF7F0 0%, #F0DFC8 100%)' }}>
          <h2 className="section-title mb-3">Staying in sync — Daniel & Kelechi</h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            All data is saved privately in your browser (localStorage). To share edits between you both, use the Export / Import buttons at the bottom of the left sidebar.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/70 rounded-xl p-4 border border-champagne-200">
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-4 h-4 text-gold-500" />
                <span className="text-sm font-medium text-stone-700">Export JSON</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Downloads a snapshot file of all your data. Send it to your partner via WhatsApp, email, or AirDrop.
              </p>
            </div>
            <div className="bg-white/70 rounded-xl p-4 border border-champagne-200">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-4 h-4 text-gold-500" />
                <span className="text-sm font-medium text-stone-700">Import JSON</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Load a snapshot file your partner sent you. This replaces your local data with theirs — always import the most recent file.
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-4 leading-relaxed">
            <strong>Tip:</strong> Agree on a rhythm — e.g. whoever makes changes exports and sends the file that evening. The "last updated" timestamp on the Dashboard shows when data was last saved.
          </p>
        </div>

        {/* Section guides */}
        <h2 className="section-title pt-2">Section by section</h2>

        {sections.map(({ icon: Icon, title, href, color, bg, border, description, tips }) => (
          <div key={title} className="card overflow-hidden">
            <div className="px-6 pt-5 pb-4">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-medium text-stone-800">{title}</h3>
                    <Link href={href} className="text-xs text-gold-500 hover:text-gold-600 flex items-center gap-0.5 transition-colors">
                      Open <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <p className="text-sm text-stone-500 leading-relaxed mt-1">{description}</p>
                </div>
              </div>

              <ul className="space-y-1.5 pl-12">
                {tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-stone-600 leading-relaxed">
                    <span className="text-gold-400 flex-shrink-0 mt-0.5">·</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Footer note */}
        <div className="text-center py-4">
          <Heart className="w-4 h-4 text-gold-400 fill-gold-400 mx-auto mb-2" />
          <p className="text-sm text-stone-400">
            Wishing you a beautiful celebration — court, traditional and white.
          </p>
        </div>
      </div>
    </div>
  );
}
