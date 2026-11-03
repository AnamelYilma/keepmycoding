'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface MarketingNavProps {
  topRightWidth?: number;
  topLeftWidth?: number;
}

export default function MarketingNav({
  topRightWidth,
  topLeftWidth,
}: MarketingNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute inset-0 pointer-events-none z-20">
      {/* 1. TOP-LEFT NOTCH (Logo): Inside top-left notch on solid #090A0F */}
      <div
        className="absolute top-0 left-0 flex items-center pl-4 sm:pl-6 pr-4 pointer-events-auto h-[68px] sm:h-[72px]"
        style={{
          width: topLeftWidth ? `${topLeftWidth}px` : '17%',
          minWidth: '220px',
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded-lg"
          aria-label="KeepCoding home"
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Image
              src="/logo2nd.png"
              alt="KeepCoding logo"
              width={32}
              height={32}
              priority
              className="object-contain w-full h-full drop-shadow-[0_2px_8px_rgba(136,189,164,0.35)]"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm sm:text-base font-bold text-[#F4F4F5] tracking-tight leading-none">
              KeepCoding
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#88BDA4] mt-1 leading-none">
              ZERO-AI GYM
            </span>
          </div>
        </Link>
      </div>

      {/* 2. TOP-MIDDLE: Floating nav pill sitting directly on the image */}
      <nav
        className="hidden md:flex items-center gap-5 lg:gap-7 absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 pointer-events-auto px-5 py-2 rounded-full bg-[#11131A]/75 border border-white/[0.08] shadow-lg backdrop-blur-xl"
        aria-label="Main navigation"
      >
        <a
          href="#how-it-works"
          className="text-xs sm:text-sm font-medium text-[#F4F4F5]/90 hover:text-[#88BDA4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded-md px-1 py-0.5"
        >
          Why Hand-Code
        </a>
        <a
          href="#tracks"
          className="text-xs sm:text-sm font-medium text-[#F4F4F5]/90 hover:text-[#88BDA4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded-md px-1 py-0.5"
        >
          4 Tracks
        </a>
        <Link
          href="/prompt"
          className="text-xs sm:text-sm font-medium text-[#F4F4F5]/90 hover:text-[#88BDA4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded-md px-1 py-0.5"
        >
          Prompt Wizard
        </Link>
        <Link
          href="/studio"
          className="text-xs sm:text-sm font-medium text-[#F4F4F5]/90 hover:text-[#88BDA4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded-md px-1 py-0.5"
        >
          Practice Studio
        </Link>
      </nav>

      {/* 3. TOP-RIGHT NOTCH: Log in + Sign up inside top-right notch on solid #090A0F */}
      <div
        className="absolute top-0 right-0 flex items-center justify-end gap-3 sm:gap-4 pr-4 sm:pr-6 pointer-events-auto h-[68px] sm:h-[72px]"
        style={{
          width: topRightWidth ? `${topRightWidth}px` : '22%',
          minWidth: '220px',
        }}
      >
        <div className="hidden sm:flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-medium text-[#F4F4F5] hover:text-[#88BDA4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded-md px-1.5 py-1"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold text-xs sm:text-sm transition-all shadow-[0_2px_12px_rgba(136,189,164,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
          >
            <span>Sign up</span>
            <span className="w-4 h-4 rounded-full bg-[#090A0F] text-[#88BDA4] flex items-center justify-center text-[9px] font-bold" aria-hidden="true">↗</span>
          </Link>
        </div>

        {/* Mobile: Sign up + Hamburger */}
        <div className="sm:hidden flex items-center gap-2">
          <Link
            href="/signup"
            className="px-3 py-1.5 rounded-full bg-[#88BDA4] text-[#090A0F] text-xs font-semibold"
          >
            Sign up
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl bg-[#11131A] border border-white/[0.1] text-[#F4F4F5] hover:text-[#88BDA4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-20 mx-4 rounded-2xl border border-white/[0.1] bg-[#090A0F]/95 backdrop-blur-2xl p-4 shadow-2xl pointer-events-auto space-y-3">
          <div className="space-y-1">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-medium text-[#F4F4F5] hover:text-white hover:bg-[#11131A] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              Why Hand-Code
            </a>
            <a
              href="#tracks"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-medium text-[#F4F4F5] hover:text-white hover:bg-[#11131A] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              4 Tracks
            </a>
            <Link
              href="/prompt"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-medium text-[#F4F4F5] hover:text-white hover:bg-[#11131A] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              Prompt Wizard
            </Link>
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center px-3 py-2 text-sm font-medium text-[#F4F4F5] hover:text-white hover:bg-[#11131A] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              Practice Studio
            </Link>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] flex items-center text-sm font-medium text-[#F4F4F5] hover:text-[#88BDA4] px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] rounded-md"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#88BDA4] text-[#090A0F] text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
            >
              <span>Sign up</span>
              <span className="w-4 h-4 rounded-full bg-[#090A0F] text-[#88BDA4] flex items-center justify-center text-[9px] font-bold" aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
