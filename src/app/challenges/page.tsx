import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ChallengeLibraryPage from './ChallengeLibraryPage';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Challenge Library | KeepCoding',
  description: 'Find, create, and practice coding challenges.',
};

async function ChallengeLibraryContent() {
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
      redirect('/login?next=/challenges');
    }
  }

  return <ChallengeLibraryPage />;
}

export default function ChallengesRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-zinc-400 p-8 text-center text-sm">
          Loading library...
        </div>
      }
    >
      <ChallengeLibraryContent />
    </Suspense>
  );
}
