'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export type Placement = 'bottom' | 'top';

interface AutoPositionOptions {
  preferredPlacement?: Placement;
  offset?: number;
  minHeight?: number;
  maxHeight?: number;
}

export function useAutoPosition(options: AutoPositionOptions = {}) {
  const {
    preferredPlacement = 'bottom',
    offset = 6,
    minHeight = 160,
    maxHeight = 320,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement>(preferredPlacement);
  const [calculatedMaxHeight, setCalculatedMaxHeight] = useState<number>(maxHeight);

  const triggerRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom - offset;
    const spaceAbove = rect.top - offset;

    // Determine placement: flip upward if not enough room below and more room above
    let nextPlacement: Placement = preferredPlacement;
    if (preferredPlacement === 'bottom') {
      if (spaceBelow < minHeight && spaceAbove > spaceBelow) {
        nextPlacement = 'top';
      }
    } else {
      if (spaceAbove < minHeight && spaceBelow > spaceAbove) {
        nextPlacement = 'bottom';
      }
    }

    setPlacement(nextPlacement);

    // Constrain maximum available height to prevent viewport overflow
    const availableSpace = nextPlacement === 'bottom' ? spaceBelow : spaceAbove;
    const safeHeight = Math.max(100, Math.min(maxHeight, availableSpace - 12));
    setCalculatedMaxHeight(safeHeight);
  }, [preferredPlacement, offset, minHeight, maxHeight]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        // Measure before showing
        requestAnimationFrame(() => updatePosition());
      }
      return next;
    });
  }, [updatePosition]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    requestAnimationFrame(() => updatePosition());
  }, [updatePosition]);

  // Recalculate on scroll or resize when open
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowChange = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleWindowChange, { passive: true });
    window.addEventListener('resize', handleWindowChange, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleWindowChange);
      window.removeEventListener('resize', handleWindowChange);
    };
  }, [isOpen, updatePosition]);

  // Close on click outside and escape key
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const clickedTrigger = triggerRef.current?.contains(target);
      const clickedPopover = popoverRef.current?.contains(target);

      if (!clickedTrigger && !clickedPopover) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return {
    isOpen,
    placement,
    maxHeight: calculatedMaxHeight,
    triggerRef,
    popoverRef,
    toggle,
    open,
    close,
  };
}
