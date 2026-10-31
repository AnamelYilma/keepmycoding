'use client';

import { useEffect, useState } from 'react';
import { getStageForProgress, LandingStageId } from './landing-stages';

interface PracticeLoopState {
  activeStage: LandingStageId;
  progress: number;
  prefersReducedMotion: boolean;
}

function getInitialReducedMotionPreference() {
  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function usePracticeLoop(): PracticeLoopState {
  const [state, setState] = useState<PracticeLoopState>({
    activeStage: 'read',
    progress: 0,
    prefersReducedMotion: getInitialReducedMotionPreference(),
  });

  useEffect(() => {
    const mediaQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    let frameId: number | null = null;

    const updateReducedMotion = () => {
      setState((current) => ({
        ...current,
        prefersReducedMotion: mediaQuery?.matches ?? false,
      }));
    };

    const updateProgress = () => {
      frameId = null;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      const boundedProgress = Math.max(0, Math.min(1, progress));

      setState((current) => ({
        ...current,
        progress: boundedProgress,
        activeStage: getStageForProgress(boundedProgress),
      }));
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    mediaQuery?.addEventListener('change', updateReducedMotion);
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery?.removeEventListener('change', updateReducedMotion);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return state;
}
