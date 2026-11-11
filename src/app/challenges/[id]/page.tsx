import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import ChallengeDetailsPage from './ChallengeDetailsPage';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Challenge Details | KeepCoding',
};

async function ChallengeDetailsContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
      redirect(`/login?next=${encodeURIComponent(`/challenges/${id}`)}`);
    }
  }

  return <ChallengeDetailsPage id={id} />;
}

export default function ChallengeDetailsRoute({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090A0F]" />}>
      <ChallengeDetailsContent params={params} />
    </Suspense>
  );
}
