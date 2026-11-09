import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import MarketingNav from '@/components/marketing/MarketingNav';
import HeroSection from '@/components/marketing/HeroSection';
import ValuePillars from '@/components/marketing/ValuePillars';
import VisualShowcase from '@/components/marketing/VisualShowcase';
import TrackGrid from '@/components/marketing/TrackGrid';
import DeliberatePracticeCTA from '@/components/marketing/DeliberatePracticeCTA';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const instant = false;

export const metadata: Metadata = {
  title: 'KeepCoding | Keep your coding intuition sharp',
  description:
    'AI tools write code for you every day. KeepCoding is where you build real muscle memory by solving production challenges by hand in an isolated browser workspace.',
};

export default async function HomePage() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        redirect('/challenges');
      }
    } catch {
      // Continue to guest landing if unauthenticated or session check fails
    }
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F4F4F5] flex flex-col font-sans selection:bg-[#88BDA4]/25" id="top">
      <main className="flex-1">
        <HeroSection nav={<MarketingNav />} />
        <ValuePillars />
        <VisualShowcase />
        <TrackGrid />
        <DeliberatePracticeCTA />
      </main>
      <MarketingFooter />
    </div>
  );
}
