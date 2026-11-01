'use client';

import { useEffect, useState } from 'react';
import { getInstrumentStage } from './instrument-stages';
import type { InstrumentStageId } from './instrument-stages';

interface InstrumentTimeline {
  activeStage: InstrumentStageId;
  progress: number;
  prefersReducedMotion: boolean;
}

export function useInstrumentTimeline(targetId: string): InstrumentTimeline {
  const [timeline, setTimeline] = useState<InstrumentTimeline>({
    activeStage: 'read',
    progress: 0,
    prefersReducedMotion:
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });

  useEffect(() => {
    const mediaQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    let frameId: number | null = null;

    const setReducedMotion = () => {
      const reduced = mediaQuery?.matches ?? false;
      setTimeline((current) => ({
        ...current,
        prefersReducedMotion: reduced,
        activeStage: reduced ? 'read' : current.activeStage,
        progress: reduced ? 0 : current.progress,
      }));
    };

    const update = () => {
      frameId = null;
      if (mediaQuery?.matches) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      const start = target.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(1, target.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / travel));

      setTimeline((current) => ({
        ...current,
        progress,
        activeStage: getInstrumentStage(progress),
      }));
    };

    const onScroll = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    mediaQuery?.addEventListener('change', setReducedMotion);
    setReducedMotion();
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      mediaQuery?.removeEventListener('change', setReducedMotion);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [targetId]);

  return timeline;
}
