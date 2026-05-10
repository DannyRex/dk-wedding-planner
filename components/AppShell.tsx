'use client';

import { useWeddingStore } from '@/lib/store';
import { Heart } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const initialized = useWeddingStore((s) => s.initialized);

  if (!initialized) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-6 h-6 text-gold-400 fill-gold-400 mx-auto mb-3 animate-pulse" />
          <p className="text-sm text-stone-400 font-medium">Loading your wedding planner…</p>
        </div>
      </main>
    );
  }

  return <main className="flex-1 overflow-auto">{children}</main>;
}
