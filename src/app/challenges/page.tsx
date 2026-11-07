import type { Metadata } from 'next';
import ChallengeLibraryPage from './ChallengeLibraryPage';

export const metadata: Metadata = {
  title: 'Challenge Library | KeepCoding',
  description: 'Find, create, and practice coding challenges.',
};

export default function ChallengesRoute() {
  return <ChallengeLibraryPage />;
}
