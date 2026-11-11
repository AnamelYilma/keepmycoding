import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import ChallengeCreatorPage from './ChallengeCreatorPage';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Create a Challenge | KeepCoding',
  description: 'Turn a real coding problem or technique into a practice challenge.',
};

async function ChallengeCreatorContent() {
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
      redirect('/login?next=/challenges/create');
    }
  }

  return <ChallengeCreatorPage />;
}

export default function ChallengeCreatorRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <ChallengeCreatorContent />
    </Suspense>
  );
}
