'use client';

import { useEffect } from 'react';
import { useWeddingStore } from '@/lib/store';
import { supabase, WEDDING_ID } from '@/lib/supabase';
import type { WeddingData } from '@/lib/types';

export default function StoreInitializer() {
  const initStore = useWeddingStore((s) => s.initStore);
  const applyRemoteData = useWeddingStore((s) => s._applyRemoteData);

  useEffect(() => {
    // Load data from Supabase on mount
    initStore();

    // Real-time subscription — fires when the other person saves
    const channel = supabase
      .channel('wedding-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wedding_data',
          filter: `id=eq.${WEDDING_ID}`,
        },
        (payload) => {
          applyRemoteData(payload.new.data as Partial<WeddingData>);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
