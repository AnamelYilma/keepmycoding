import type { Metadata } from 'next';
import { Suspense } from 'react';
import ChallengeCreatorPage from './ChallengeCreatorPage';

export const metadata: Metadata = {
  title: 'Create a Challenge | KeepCoding',
  description: 'Turn a real coding problem or technique into a practice challenge.',
};

export default function ChallengeCreatorRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <ChallengeCreatorPage />
    </Suspense>
  );
}
