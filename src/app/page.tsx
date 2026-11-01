import type { Metadata } from 'next';
import LandingPageTwo from './landing-page-2/LandingPageTwo';

export const metadata: Metadata = {
  title: 'KeepCoding | Hands-on Coding Practice',
  description: 'Choose a coding challenge, write the solution yourself, and review a test-by-test evaluation.',
};

export default function HomePage() {
  return <LandingPageTwo />;
}
