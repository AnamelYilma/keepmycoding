import type { Metadata } from 'next';
import { Suspense } from 'react';
import ChallengeDetailsPage from './ChallengeDetailsPage';

export const metadata: Metadata = {
  title: 'Challenge Details | KeepCoding',
};

async function ChallengeDetailsContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChallengeDetailsPage id={id} />;
}

export default function ChallengeDetailsRoute({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090A0F]" />}>
      <ChallengeDetailsContent params={params} />
    </Suspense>
  );
}
