import { Suspense } from 'react';
import type { Metadata } from 'next';
import AuthFrame from '@/app/auth/AuthFrame';
import AuthForm from '@/app/auth/AuthForm';

export const metadata: Metadata = { title: 'Choose a new password | KeepCoding' };

export default function ResetPasswordPage() {
  return (
    <AuthFrame mode="reset">
      <Suspense fallback={<div className="text-sm text-zinc-400">Loading form...</div>}>
        <AuthForm mode="reset" />
      </Suspense>
    </AuthFrame>
  );
}
