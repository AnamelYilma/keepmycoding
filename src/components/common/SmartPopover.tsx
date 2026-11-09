'use client';

import React, { ReactNode } from 'react';
import { useAutoPosition, Placement } from '@/hooks/useAutoPosition';

interface SmartPopoverProps {
  trigger: (props: {
    isOpen: boolean;
    toggle: () => void;
    ref: React.RefCallback<HTMLElement>;
    'aria-expanded': boolean;
    'aria-haspopup': 'true';
  }) => ReactNode;
  children: (props: { close: () => void; placement: Placement }) => ReactNode;
  className?: string;
  preferredPlacement?: Placement;
  minHeight?: number;
  maxHeight?: number;
  align?: 'left' | 'right' | 'center';
}

export default function SmartPopover({
  trigger,
  children,
  className = '',
  preferredPlacement = 'bottom',
  minHeight = 160,
  maxHeight = 320,
  align = 'right',
}: SmartPopoverProps) {
  const {
    isOpen,
    placement,
    maxHeight: calculatedMaxHeight,
    triggerRef,
    popoverRef,
    toggle,
    close,
  } = useAutoPosition({
    preferredPlacement,
    minHeight,
    maxHeight,
  });

  const alignClass =
    align === 'right'
      ? 'right-0'
      : align === 'left'
      ? 'left-0'
      : 'left-1/2 -translate-x-1/2';

  const positionClass =
    placement === 'bottom'
      ? 'top-full mt-2 origin-top'
      : 'bottom-full mb-2 origin-bottom';

  return (
    <div className="relative inline-block">
      {trigger({
        isOpen,
        toggle,
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node;
        },
        'aria-expanded': isOpen,
        'aria-haspopup': 'true',
      })}

      {isOpen && (
        <div
          ref={popoverRef}
          style={{ maxHeight: `${calculatedMaxHeight}px` }}
          className={`absolute ${alignClass} ${positionClass} z-50 w-72 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-3 shadow-2xl transition-all duration-150 ease-out focus:outline-none ${className}`}
          role="region"
        >
          {children({ close, placement })}
        </div>
      )}
    </div>
  );
}
