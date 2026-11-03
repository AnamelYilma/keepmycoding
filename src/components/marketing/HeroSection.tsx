'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import InteractiveHeroWorkbench from './InteractiveHeroWorkbench';
import MarketingNav from './MarketingNav';

interface HeroSectionProps {
  nav?: React.ReactNode;
}

export default function HeroSection({ nav }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 1400, h: 800 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const { pathD, w_tl, h_tl, w_tr, h_tr, w_bl, h_bl } = useMemo(() => {
    const W = size.w;
    const H = size.h;
    const R = 36; // outer corner radius
    const r = 26; // notch curve radius

    // Notches sizing based on percentages with sensible min/max bounds
    const w_tl_calc = Math.max(220, Math.min(340, Math.round(W * 0.17)));
    const h_tl_calc = Math.max(68, Math.min(96, Math.round(H * 0.11)));

    const w_tr_calc = Math.max(220, Math.min(360, Math.round(W * 0.22)));
    const h_tr_calc = Math.max(68, Math.min(96, Math.round(H * 0.11)));

    const w_bl_calc = Math.max(320, Math.min(520, Math.round(W * 0.30)));
    const h_bl_calc = Math.max(220, Math.min(360, Math.round(H * 0.32)));

    // Continuous closed SVG path outlining the image and tracing all 3 notches with exact arcs
    const d = [
      // 1. Start on left vertical edge just below the top-left notch
      'M', 0, (h_tl_calc + r),
      // 2. Down left edge to bottom-left notch meet point
      'L', 0, (H - h_bl_calc - r),
      // 3. Concave arc curving into bottom-left notch top edge
      'A', r, r, 0, 0, 0, r, (H - h_bl_calc),
      // 4. Horizontal top edge of bottom-left notch
      'L', (w_bl_calc - r), (H - h_bl_calc),
      // 5. Convex arc at bottom-left notch inner corner
      'A', r, r, 0, 0, 1, w_bl_calc, (H - h_bl_calc + r),
      // 6. Vertical right edge of bottom-left notch
      'L', w_bl_calc, (H - r),
      // 7. Concave arc curving to container bottom edge
      'A', r, r, 0, 0, 0, (w_bl_calc + r), H,
      // 8. Horizontal bottom edge to outer bottom-right corner
      'L', (W - R), H,
      // 9. Outer convex bottom-right corner
      'A', R, R, 0, 0, 0, W, (H - R),
      // 10. Vertical right edge up to top-right notch meet point
      'L', W, (h_tr_calc + r),
      // 11. Concave arc curving into top-right notch bottom edge
      'A', r, r, 0, 0, 0, (W - r), h_tr_calc,
      // 12. Horizontal bottom edge of top-right notch
      'L', (W - w_tr_calc + r), h_tr_calc,
      // 13. Convex arc at top-right notch inner corner
      'A', r, r, 0, 0, 1, (W - w_tr_calc), (h_tr_calc - r),
      // 14. Vertical left edge of top-right notch
      'L', (W - w_tr_calc), r,
      // 15. Concave arc curving to container top edge
      'A', r, r, 0, 0, 0, (W - w_tr_calc - r), 0,
      // 16. Horizontal top edge to top-left notch meet point
      'L', (w_tl_calc + r), 0,
      // 17. Concave arc curving into top-left notch right edge
      'A', r, r, 0, 0, 0, w_tl_calc, r,
      // 18. Vertical right edge of top-left notch
      'L', w_tl_calc, (h_tl_calc - r),
      // 19. Convex arc at top-left notch inner corner
      'A', r, r, 0, 0, 1, (w_tl_calc - r), h_tl_calc,
      // 20. Horizontal bottom edge of top-left notch
      'L', r, h_tl_calc,
      // 21. Concave arc curving back to left edge
      'A', r, r, 0, 0, 0, 0, (h_tl_calc + r),
      'Z'
    ].join(' ');

    return {
      pathD: d,
      w_tl: w_tl_calc,
      h_tl: h_tl_calc,
      w_tr: w_tr_calc,
      h_tr: h_tr_calc,
      w_bl: w_bl_calc,
      h_bl: h_bl_calc
    };
  }, [size]);

  return (
    <>
      {/* 1. HERO VIEWPORT: ONE large rounded image shape with 14px gap in 100svh */}
      <section className="relative w-full h-[100svh] min-h-[580px] p-[14px] bg-[#090A0F] overflow-hidden">
        {/* Container ref for exact pixel calculation */}
        <div
          ref={containerRef}
          className="relative w-full h-full bg-[#090A0F] overflow-hidden select-none"
        >
          {/* SVG Definitions for clipping path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-0"
            width={size.w}
            height={size.h}
            aria-hidden="true"
          >
            <defs>
              <clipPath id="hero-mask-shape" clipPathUnits="userSpaceOnUse">
                <path d={pathD} />
              </clipPath>
            </defs>
          </svg>

          {/* Full-bleed image clipped by the exact irregular SVG path */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              clipPath: 'url(#hero-mask-shape)',
              WebkitClipPath: 'url(#hero-mask-shape)'
            }}
          >
            <Image
              src="/images/hero-climber.png"
              alt="Carve Your Code."
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
          </div>

          {/* Continuous thin mint line (1.5px stroke) tracing the entire mask shape and all curves */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            aria-hidden="true"
          >
            <path
              d={pathD}
              fill="none"
              stroke="rgba(136, 189, 164, 0.55)"
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>

          {/* Top Notches (Logo + Auth) & Centered Floating Nav */}
          {nav || <MarketingNav topLeftWidth={w_tl} topRightWidth={w_tr} />}

          {/* BOTTOM-LEFT NOTCH: Sits on solid #090A0F, minimal content, 2 clean lines */}
          <div
            className="absolute bottom-0 left-0 z-20 flex flex-col justify-end p-5 sm:p-7 lg:p-8 pointer-events-auto"
            style={{
              width: `${w_bl}px`,
              height: `${h_bl}px`
            }}
          >
            {/* Headline: Exactly 2 clean non-wrapping lines */}
            <h1 className="text-[clamp(28px,3.2vw,50px)] font-extrabold tracking-tight leading-[1.06]">
              <span className="text-[#F4F4F5] block whitespace-nowrap">Carve Your</span>
              <span className="text-[#88BDA4] block whitespace-nowrap">Code.</span>
            </h1>

            {/* ONE button: Start Practicing */}
            <div className="mt-4 sm:mt-5">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold text-xs sm:text-sm shadow-[0_2px_16px_rgba(136,189,164,0.35)] transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
              >
                <span>Start Practicing</span>
                <span
                  className="w-4 h-4 rounded-full bg-[#090A0F] text-[#88BDA4] flex items-center justify-center text-[9px] font-bold"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Preview Seated Below Hero (Clean, Minimalist) */}
      <section
        id="interactive-preview"
        className="relative py-16 sm:py-24 bg-[#090A0F] border-t border-white/[0.08] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-2.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F4F4F5]">
              Try running a test before entering the studio
            </h2>
          </div>

          <div className="pt-2 max-w-5xl mx-auto">
            <InteractiveHeroWorkbench />
          </div>
        </div>
      </section>
    </>
  );
}
