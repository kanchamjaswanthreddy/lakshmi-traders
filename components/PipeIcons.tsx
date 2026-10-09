import { type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

// CPVC — L-shaped elbow pipe (orange-toned)
export function CpvcPipeIcon({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 6 L4 14 Q4 18 8 18 L20 18" />
      <path d="M2 6 L6 6" />
      <path d="M20 16 L20 20" />
    </svg>
  );
}

// UPVC — Straight pipe with coupling joint (blue-toned)
export function UpvcPipeIcon({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12 L22 12" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M2 10 L2 14" />
      <path d="M22 10 L22 14" />
    </svg>
  );
}

// SWR — Large pipe with downward flow arrow (grey-toned)
export function SwrPipeIcon({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 3 L8 14 Q8 18 12 18 L12 21" />
      <path d="M16 3 L16 10 Q16 14 12 14" />
      <path d="M6 3 L18 3" />
      <path d="M9 18 L12 21 L15 18" />
    </svg>
  );
}
