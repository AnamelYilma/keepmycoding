import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Code2, Terminal, ShieldCheck, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About KeepCoding | Preserving Developer Intuition in the Age of AI',
  description:
    'The story behind KeepCoding: a distraction-free, zero-AI gym where developers keep their problem-solving instincts sharp by writing real code by hand.',
  keywords: [
    'deliberate coding practice',
    'developer intuition',
    'coding practice without AI',
    'programming muscle memory',
    'software engineering craft',
    'KeepCoding about',
  ],
  openGraph: {
    title: 'About KeepCoding | Preserving Developer Intuition in the Age of AI',
    description:
      'Why we built KeepCoding: when AI writes all our code, how do we keep our engineering intuition sharp?',
    url: 'https://keepmecoding.ethiodeploy.app/about',
    type: 'article',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F4F4F5] flex flex-col font-sans selection:bg-[#88BDA4]/25">
      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-[#090A0F]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded-lg"
            aria-label="KeepCoding home"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              <Image
                src="/logo2nd.png"
                alt="KeepCoding logo"
                width={32}
                height={32}
                priority
                className="object-contain w-full h-full drop-shadow-[0_2px_8px_rgba(136,189,164,0.35)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight leading-none">
                KeepCoding
              </span>
              <span className="text-[10px] font-mono tracking-wider text-[#88BDA4] mt-0.5 font-semibold leading-none">
                ZERO-AI GYM
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 text-xs sm:text-sm">
            <Link
              href="/"
              className="text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1.5 px-2 py-1"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span>Home</span>
            </Link>
            <Link
              href="/challenges"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold transition-all shadow-[0_2px_12px_rgba(136,189,164,0.3)]"
            >
              <span>Challenges</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-16">
        {/* Title Section */}
        <section className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.1] text-xs font-mono text-[#88BDA4]">
            <Heart size={12} className="text-[#88BDA4]" aria-hidden="true" />
            <span>OUR STORY & PHILOSOPHY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Why we built KeepCoding: Preserving the human craft of code.
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
            AI tools are writing code faster than ever. But as machines type for us, we noticed something quiet and troubling happening to ourselves and our fellow engineers.
          </p>
        </section>

        {/* Story 1 */}
        <article className="space-y-4 p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-white/[0.08]">
          <div className="flex items-center gap-2.5 text-[#88BDA4] font-mono text-xs uppercase tracking-wider">
            <Code2 size={16} aria-hidden="true" />
            <span>Story 01: The Quiet Loss of Intuition</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            When typing stops, intuition fades.
          </h2>
          <div className="space-y-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <p>
              Every developer remembers the feeling of flow: sitting with an empty editor, wrestling with a boundary condition, holding a mental graph in your head, and feeling the pieces lock into place.
            </p>
            <p>
              In the last two years, coding changed completely. We tab-complete entire functions. We ask chatbots to write our loops. We copy solutions without ever feeling the resistance of the problem.
            </p>
            <p>
              At first, it feels like a superpower. But after six months of tab-completion, a strange fog settles in. When a production bug strikes at 2 AM, or when an interviewer asks us to write a clean algorithm on a blank screen, our fingers freeze. We lost the tactile feeling of code.
            </p>
          </div>
        </article>

        {/* Story 2 */}
        <article className="space-y-4 p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-white/[0.08]">
          <div className="flex items-center gap-2.5 text-[#88BDA4] font-mono text-xs uppercase tracking-wider">
            <Terminal size={16} aria-hidden="true" />
            <span>Story 02: The Musician and the Piano</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            You cannot learn piano by watching an autoplayer.
          </h2>
          <div className="space-y-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <p>
              Imagine a pianist who buys a player piano that plays songs automatically. The songs sound beautiful. But if the pianist never touches the keys, their fingers lose their strength. Their timing dulls.
            </p>
            <p>
              Software engineering is no different. Code is not just text; it is an active physical and mental habit. You understand edge cases because you lived through off-by-one errors. You understand race conditions because you spent hours untangling them.
            </p>
            <p>
              When an AI writes every line, your brain never forms the deep neural pathways that make you an instinctive, reliable engineer.
            </p>
          </div>
        </article>

        {/* Story 3 */}
        <article className="space-y-4 p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-white/[0.08]">
          <div className="flex items-center gap-2.5 text-[#88BDA4] font-mono text-xs uppercase tracking-wider">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Story 03: The Zero-AI Gym</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            A quiet space where your hands do the work.
          </h2>
          <div className="space-y-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <p>
              We did not build KeepCoding to fight against AI. AI is here to stay, and it is a wonderful tool. We built KeepCoding to protect the human developer.
            </p>
            <p>
              Think of KeepCoding as a barbell gym. You do not bring an electric crane to the gym to lift weights for you; the whole point is to feel the weight yourself.
            </p>
            <p>
              In our workspace, there is no AI autocomplete. There are no video lectures to passively watch. There are only real production tasks: token expirations, cache evictions, rate limiters, and idempotency locks. You read the spec, write the solution with your own hands, and submit it to be verified.
            </p>
            <p className="text-[#88BDA4] font-medium pt-2">
              Just 15 minutes a day keeps your intuition razor sharp.
            </p>
          </div>
        </article>

        {/* Final CTA Box */}
        <div className="p-8 rounded-2xl bg-gradient-to-b from-[#131622] to-[#0D0F18] border border-[#88BDA4]/30 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Keep your coding instincts sharp.
            </h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Pick a track, open an isolated workspace, and write code by hand. Free for all developers.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/challenges"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-bold text-sm transition-all shadow-[0_2px_16px_rgba(136,189,164,0.4)]"
            >
              <span>Explore Challenges</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#090A0F] py-8 text-center text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; 2026 KeepCoding. Built for hands-on developers.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Home
            </Link>
            <Link href="/challenges" className="hover:text-zinc-300 transition-colors">
              Challenges
            </Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
