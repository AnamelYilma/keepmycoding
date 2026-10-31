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
      const reducedMotion = mediaQuery?.matches ?? false;
      setState((current) => ({
        ...current,
        prefersReducedMotion: reducedMotion,
        activeStage: reducedMotion ? 'read' : current.activeStage,
        progress: reducedMotion ? 0 : current.progress,
      }));
    };

    const updateProgress = () => {
      frameId = null;
      if (mediaQuery?.matches) {
        return;
      }

      const loopElement = document.getElementById('loop');
      if (!loopElement) return;

      const loopTop = loopElement.getBoundingClientRect().top + window.scrollY;
      const loopHeight = loopElement.offsetHeight - window.innerHeight;
      const progress = loopHeight > 0 ? (window.scrollY - loopTop) / loopHeight : 0;
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
    updateReducedMotion();
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
