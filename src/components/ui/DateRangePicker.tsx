'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRange {
  from: Date;
  to: Date;
  label: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const presets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (days: number, label: string) => {
    const to = new Date();
    const from = subDays(to, days);
    onChange({ from, to, label });
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-md hover:bg-[var(--background)] transition-colors"
      >
        <Calendar className="h-4 w-4 text-[var(--text-secondary)]" />
        <span className="text-[var(--text-primary)]">{value.label}</span>
        <ChevronDown className={cn('h-4 w-4 text-[var(--text-secondary)] transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-[var(--surface)] border border-[var(--border)] rounded-md shadow-lg min-w-[200px]">
          <div className="p-2">
            <p className="text-xs text-[var(--text-secondary)] px-2 py-1">Select range</p>
            {presets.map((preset) => (
              <button
                key={preset.days}
                onClick={() => handleSelect(preset.days, preset.label)}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                  value.label === preset.label
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text-primary)] hover:bg-[var(--background)]'
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="border-t border-[var(--border)] p-2">
            <p className="text-xs text-[var(--text-secondary)] px-2">
              {format(value.from, 'MMM d, yyyy')} - {format(value.to, 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
