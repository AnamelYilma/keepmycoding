import type { Metadata } from 'next';
import { Suspense } from 'react';
import StudioPage from './StudioPage';

export const metadata: Metadata = {
  title: 'KeepCoding Studio',
  description: 'Generate, paste, and solve a deliberate coding challenge.',
};

export default function StudioRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090A0F] text-zinc-100 flex items-center justify-center font-mono text-sm text-zinc-400">
          Loading workspace...
        </div>
      }
    >
      <StudioPage />
    </Suspense>
  );
}
