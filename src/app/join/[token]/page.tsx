import type { Metadata } from 'next';
import { Suspense } from 'react';
import JoinPage from './JoinPage';

export const metadata: Metadata = {
  title: 'Join Practice Challenge | KeepCoding',
  description: 'Accept an invitation to practice a deliberate coding challenge.',
};

async function JoinContent({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <JoinPage token={token} />;
}

export default function JoinRoute({ params }: { params: Promise<{ token: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center font-mono text-sm text-zinc-400">
          Loading invitation...
        </div>
      }
    >
      <JoinContent params={params} />
    </Suspense>
  );
}
