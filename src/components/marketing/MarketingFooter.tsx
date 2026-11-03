import Link from 'next/link';
import Image from 'next/image';
import { Code2, ArrowUp } from 'lucide-react';

export default function MarketingFooter() {
  return (
    <footer className="bg-[#090A0F] border-t border-white/[0.08] text-zinc-400 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded-lg" aria-label="KeepCoding home">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="KeepCoding logo"
                  width={32}
                  height={32}
                  className="object-contain w-full h-full drop-shadow-[0_2px_8px_rgba(136,189,164,0.35)]"
                />
              </div>
              <span className="text-base font-semibold text-white tracking-tight">
                KeepCoding
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Deliberate, hands-on coding practice. Retain your engineering muscle memory by solving production problems by hand in an isolated browser workspace.
            </p>
          </div>

          {/* Navigation links */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 block">
              Navigation
            </span>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#tracks" className="hover:text-white transition-colors">
                  Practice Tracks
                </a>
              </li>
              <li>
                <Link href="/prompt" className="hover:text-white transition-colors">
                  Prompt Wizard
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-white transition-colors">
                  Practice Studio
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Tracks list */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 block">
              Practice Tracks
            </span>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/studio" className="hover:text-white transition-colors">
                  Track 01: Identity &amp; Access
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-white transition-colors">
                  Track 02: Interactive UI &amp; State
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-white transition-colors">
                  Track 03: APIs &amp; Persistence
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-white transition-colors">
                  Track 04: Data Security
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom divider and copyright */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="text-zinc-400">
            <span>&copy; 2026 KeepCoding. Zero tracking. Practice data remains in your local browser.</span>
          </div>

          <a 
            href="#top" 
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded px-1 py-0.5"
          >
            <span>Back to top</span>
            <ArrowUp size={12} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
