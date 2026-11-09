import { Suspense } from 'react';
import type { Metadata } from 'next';
import ChallengeLibraryPage from './ChallengeLibraryPage';

export const metadata: Metadata = {
  title: 'Challenge Library | KeepCoding',
  description: 'Find, create, and practice coding challenges.',
};

export default function ChallengesRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-zinc-400 p-8 text-center text-sm">
          Loading library...
        </div>
      }
    >
      <ChallengeLibraryPage />
    </Suspense>
  );
}
