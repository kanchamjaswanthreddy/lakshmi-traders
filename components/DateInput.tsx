'use client';

import { useState, useRef } from 'react';

interface DateInputProps {
  value: string; // yyyy-MM-dd
  onChange: (iso: string) => void;
  className?: string;
  placeholder?: string;
}

function isoToDisplay(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return '';
  return `${d}.${m}.${y}`;
}

function displayToIso(display: string): string | null {
  const clean = display.replace(/[\/\-]/g, '.');
  const parts = clean.split('.');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  if (!d || !m || !y || y.length !== 4) return null;
  const day = parseInt(d, 10);
  const month = parseInt(m, 10);
  const year = parseInt(y, 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function DateInput({ value, onChange, className = '', placeholder }: DateInputProps) {
  const [raw, setRaw] = useState<string | null>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  const displayValue = raw !== null ? raw : isoToDisplay(value);

  function handleTextChange(text: string) {
    // Auto-insert dots: 12 → 12., 12.05 → 12.05., but let user delete freely
    let formatted = text;
    const digitsOnly = text.replace(/\D/g, '');
    if (digitsOnly.length <= 8 && text.length <= 10) {
      // Only auto-format if user is typing forward (not deleting)
      if (raw !== null && text.length > raw.length) {
        if (digitsOnly.length === 2 && !text.includes('.')) {
          formatted = digitsOnly + '.';
        } else if (digitsOnly.length === 4 && text.split('.').length < 3) {
          formatted = digitsOnly.slice(0, 2) + '.' + digitsOnly.slice(2) + '.';
        }
      }
    }

    setRaw(formatted);

    const iso = displayToIso(formatted);
    if (iso) {
      onChange(iso);
    }
  }

  function handleBlur() {
    // On blur, try to parse and clean up
    if (raw !== null) {
      const iso = displayToIso(raw);
      if (iso) {
        onChange(iso);
        setRaw(null); // Reset to controlled display
      } else if (raw === '') {
        onChange('');
        setRaw(null);
      }
      // If invalid, keep raw so user can fix
    }
  }

  function handleCalendarClick() {
    hiddenRef.current?.showPicker();
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={(e) => handleTextChange(e.target.value)}
        onBlur={handleBlur}
        onFocus={() => { if (raw === null) setRaw(isoToDisplay(value)); }}
        placeholder={placeholder || 'DD.MM.YYYY'}
        maxLength={10}
        className={className}
      />
      {/* Hidden native date picker for calendar icon */}
      <input
        ref={hiddenRef}
        type="date"
        value={value}
        onChange={(e) => { onChange(e.target.value); setRaw(null); }}
        className="absolute inset-0 opacity-0 cursor-pointer"
        tabIndex={-1}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={handleCalendarClick}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1A1A1A] transition-colors"
        tabIndex={-1}
        aria-label="Open calendar"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>
    </div>
  );
}
