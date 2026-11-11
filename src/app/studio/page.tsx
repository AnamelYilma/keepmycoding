import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import StudioPage from './StudioPage';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'KeepCoding Studio',
  description: 'Generate, paste, and solve a deliberate coding challenge.',
};

async function StudioContent() {
  let currentUser = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      currentUser = user;
    } catch {
      // ignore
    }

    if (!currentUser) {
      redirect('/login?next=/studio');
    }
  }

  return <StudioPage />;
}

export default function StudioRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090A0F] text-zinc-100 flex items-center justify-center font-mono text-sm text-zinc-400">
          Loading workspace...
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}
