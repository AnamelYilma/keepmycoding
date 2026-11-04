import type { Metadata } from 'next';
import MarketingNav from '@/components/marketing/MarketingNav';
import HeroSection from '@/components/marketing/HeroSection';
import ValuePillars from '@/components/marketing/ValuePillars';
import WhyHandCoding from '@/components/marketing/WhyHandCoding';
import TrackGrid from '@/components/marketing/TrackGrid';
import CurriculumProgression from '@/components/marketing/CurriculumProgression';
import DeliberatePracticeCTA from '@/components/marketing/DeliberatePracticeCTA';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export const metadata: Metadata = {
  title: 'KeepCoding | Keep your coding intuition sharp',
  description:
    'AI tools write code for you every day. KeepCoding is where you build real muscle memory by solving production challenges by hand in an isolated browser workspace.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F4F4F5] flex flex-col font-sans selection:bg-[#88BDA4]/25" id="top">
      <main className="flex-1">
        <HeroSection nav={<MarketingNav />} />
        <ValuePillars />
        <WhyHandCoding />
        <TrackGrid />
        <CurriculumProgression />
        <DeliberatePracticeCTA />
      </main>
      <MarketingFooter />
    </div>
  );
}
