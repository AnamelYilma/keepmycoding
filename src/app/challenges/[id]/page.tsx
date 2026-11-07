import type { Metadata } from 'next';
import ChallengeDetailsPage from './ChallengeDetailsPage';

export const metadata: Metadata = {
  title: 'Challenge Details | KeepCoding',
};

export default async function ChallengeDetailsRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChallengeDetailsPage id={id} />;
}
