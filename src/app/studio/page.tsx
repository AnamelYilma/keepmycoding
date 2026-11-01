import type { Metadata } from 'next';
import StudioPage from './StudioPage';

export const metadata: Metadata = {
  title: 'KeepCoding Studio',
  description: 'Generate, paste, and solve a deliberate coding challenge.',
};

export default function StudioRoute() {
  return <StudioPage />;
}
