'use client';

import { useRef, useState, useEffect } from 'react';

interface GlassPillSelectorProps {
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md';
}

export default function GlassPillSelector({ items, value, onChange, size = 'md' }: GlassPillSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const activeBtn = containerRef.current.querySelector(`[data-id="${value}"]`) as HTMLElement | null;
    if (activeBtn) {
      setPillStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [value, items]);

  const pad = size === 'sm' ? 'px-3 py-[5px] text-[11px]' : 'px-4 py-[7px] text-[12px]';
  const height = size === 'sm' ? 'h-[34px]' : 'h-[38px]';
  const pillPad = size === 'sm' ? 3 : 3;

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-0 ${height} rounded-xl overflow-hidden overflow-x-auto`}
      style={{
        background: 'rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Sliding glass pill */}
      {pillStyle && (
        <div
          className="absolute top-[3px] bottom-[3px] rounded-lg pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            left: pillStyle.left + pillPad,
            width: pillStyle.width - pillPad * 2,
            background: 'rgba(255, 255, 255, 0.85)',
            boxShadow: `
              0 0.5px 0 0 rgba(255,255,255,0.9) inset,
              0 1px 3px rgba(0,0,0,0.08),
              0 4px 12px rgba(0,0,0,0.06)
            `,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        />
      )}

      {/* Buttons */}
      {items.map((item) => (
        <button
          key={item.id}
          data-id={item.id}
          onClick={() => onChange(item.id)}
          className={`relative z-10 ${pad} font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer select-none ${
            value === item.id
              ? 'text-[#1A1A1A]'
              : 'text-[rgba(0,0,0,0.45)] hover:text-[rgba(0,0,0,0.65)]'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
