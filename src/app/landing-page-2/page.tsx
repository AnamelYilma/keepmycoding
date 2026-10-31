import type { Metadata } from 'next';
import LandingPageTwo from './LandingPageTwo';

export const metadata: Metadata = {
  title: 'KeepCoding | The Practice Loop',
  description:
    'Deliberate coding practice: work through a challenge by hand, then review clear evaluation feedback.',
};

export default function LandingPageTwoRoute() {
  return <LandingPageTwo />;
}
