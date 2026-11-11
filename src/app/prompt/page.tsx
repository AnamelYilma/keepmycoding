import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PromptWizardPage } from './PromptWizardPage';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Challenge Prompt Generator | KeepCoding',
  description: 'Configure and copy structured prompts to your external AI, then paste your challenge into KeepCoding.',
};

async function PromptContent() {
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
      redirect('/login?next=/prompt');
    }
  }

  return <PromptWizardPage />;
}

export default function PromptRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <PromptContent />
    </Suspense>
  );
}
