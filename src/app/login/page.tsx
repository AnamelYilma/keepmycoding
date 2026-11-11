import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthFrame from '@/app/auth/AuthFrame';
import AuthForm from '@/app/auth/AuthForm';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Sign in | KeepCoding' };

async function LoginContent() {
  let currentUser = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      currentUser = user;
    } catch {
      // Continue to login if unauthenticated or session check fails
    }
  }

  if (currentUser) {
    redirect('/challenges');
  }

  return (
    <AuthFrame mode="login">
      <Suspense fallback={<div className="text-sm text-zinc-400">Loading form...</div>}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthFrame>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090A0F]" />}>
      <LoginContent />
    </Suspense>
  );
}
