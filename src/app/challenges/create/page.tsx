import type { Metadata } from 'next';
import ChallengeCreatorPage from './ChallengeCreatorPage';

export const metadata: Metadata = {
  title: 'Create a Challenge | KeepCoding',
  description: 'Turn a real coding problem or technique into a practice challenge.',
};

export default function ChallengeCreatorRoute() {
  return <ChallengeCreatorPage />;
}
