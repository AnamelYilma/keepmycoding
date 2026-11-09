'use client';

import { useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useAutoPosition } from '@/hooks/useAutoPosition';

export interface SelectOption<T extends string | number = string> {
  value: T;
  label: string;
  description?: string;
}

export interface CustomSelectProps<T extends string | number = string> {
  id?: string;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export function CustomSelect<T extends string | number = string>({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
}: CustomSelectProps<T>) {
  const generatedId = useId();
  const selectId = id || generatedId;

  const {
    isOpen,
    placement,
    maxHeight,
    triggerRef,
    popoverRef,
    toggle,
    close,
  } = useAutoPosition({
    preferredPlacement: 'bottom',
    minHeight: 140,
    maxHeight: 280,
    offset: 6,
  });

  const selectedOption = options.find((opt) => opt.value === value);

  const positionClass =
    placement === 'bottom'
      ? 'top-full mt-1.5 origin-top'
      : 'bottom-full mb-1.5 origin-bottom';

  return (
    <div className={`relative w-full ${className}`}>
      <button
        id={selectId}
        ref={triggerRef as any}
        type="button"
        disabled={disabled}
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`w-full flex items-center justify-between rounded-lg border bg-zinc-950 px-3 py-2 text-sm text-zinc-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#88BDA4] ${
          isOpen
            ? 'border-[#88BDA4]/60 ring-1 ring-[#88BDA4]/30 bg-zinc-900'
            : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/60'
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#88BDA4]' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          role="listbox"
          aria-labelledby={selectId}
          style={{ maxHeight: `${maxHeight}px` }}
          className={`absolute left-0 ${positionClass} z-50 w-full min-w-[170px] rounded-xl border border-zinc-800 bg-[#12151e] p-1.5 shadow-2xl backdrop-blur-md overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-100`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={String(option.value)}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  close();
                }}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700/60'
                    : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100'
                }`}
              >
                <div className="flex flex-col text-left truncate mr-2">
                  <span className="truncate">{option.label}</span>
                  {option.description && (
                    <span className="text-[10px] text-zinc-400 font-normal truncate">
                      {option.description}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#88BDA4] shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
