import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export default function VisualShowcase() {
  return (
    <section className="py-20 sm:py-28 bg-[#090A0F] relative border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#12151e] border border-white/[0.12] p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center shadow-2xl relative overflow-hidden">
          
          {/* Left Column: Bold Typography & Visual Contrast (7 of 12 cols) */}
          <div className="lg:col-span-7 space-y-7">
            <div className="space-y-2.5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                Built for Muscle Memory. <br />
                <span className="text-[#88BDA4]">Code you can write in the dark.</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-lg">
                AI writes boilerplate. KeepCoding trains your instincts for when production breaks.
              </p>
            </div>

            {/* Fast-Scannable Contrast */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-[#090A0F] border border-white/[0.08] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                  <XCircle size={13} className="text-rose-400 shrink-0" aria-hidden="true" />
                  <span className="font-bold">PASSIVE AUTOCOMPLETE</span>
                </div>
                <p className="text-xs text-zinc-400 font-sans">
                  Ghost code. Illusion of mastery.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141724] border border-[#88BDA4]/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#88BDA4]">
                  <CheckCircle2 size={13} className="text-[#88BDA4] shrink-0" aria-hidden="true" />
                  <span className="font-bold">ACTIVE ZERO-AI GYM</span>
                </div>
                <p className="text-xs text-zinc-300 font-sans">
                  Hand-written logic. Durable reflexes.
                </p>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="pt-1">
              <Link
                href="/challenges"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#88BDA4] hover:bg-[#9cd1b8] text-[#090A0F] font-semibold text-xs sm:text-sm shadow-lg shadow-[#88BDA4]/20 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4]"
              >
                <span>Launch Practice Studio</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Artwork (5 of 12 cols) */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/images/taking-control.png"
                alt="Developer taking control"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12151e] via-transparent to-transparent opacity-60" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
