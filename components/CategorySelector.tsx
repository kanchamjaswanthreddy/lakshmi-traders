'use client';

import { CATEGORIES } from '@/lib/categories';
import {
  ShowerHead,
  Sprout,
  Cylinder,
  Zap,
  Bath,
  Droplets,
  Package,
  type LucideProps,
} from 'lucide-react';
import { type ForwardRefExoticComponent, type RefAttributes, type ComponentType, type SVGProps } from 'react';
import { CpvcPipeIcon, UpvcPipeIcon, SwrPipeIcon } from './PipeIcons';

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
type SvgIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

interface CategorySelectorProps {
  selected: string[];
  onToggle: (categoryId: string) => void;
}

const CATEGORY_CONFIG: Record<
  string,
  {
    icon: LucideIcon | SvgIcon;
    color: string;
    bg: string;
    activeBg: string;
  }
> = {
  cpvc: { icon: CpvcPipeIcon, color: '#E65100', bg: '#FFF3E0', activeBg: '#FF9800' },
  upvc: { icon: UpvcPipeIcon, color: '#1565C0', bg: '#E3F2FD', activeBg: '#2196F3' },
  swr: { icon: SwrPipeIcon, color: '#616161', bg: '#F5F5F5', activeBg: '#757575' },
  agri: { icon: Sprout, color: '#2E7D32', bg: '#E8F5E9', activeBg: '#4CAF50' },
  water_tanks: { icon: Cylinder, color: '#00838F', bg: '#E0F7FA', activeBg: '#00BCD4' },
  motors: { icon: Zap, color: '#F57F17', bg: '#FFFDE7', activeBg: '#FFC107' },
  basins: { icon: Bath, color: '#AD1457', bg: '#FCE4EC', activeBg: '#E91E63' },
  taps: { icon: ShowerHead, color: '#0277BD', bg: '#E1F5FE', activeBg: '#03A9F4' },
  other: { icon: Package, color: '#546E7A', bg: '#ECEFF1', activeBg: '#78909C' },
};

export default function CategorySelector({
  selected,
  onToggle,
}: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
      {CATEGORIES.map((cat) => {
        const isSelected = selected.includes(cat.id);
        const config = CATEGORY_CONFIG[cat.id] || CATEGORY_CONFIG.other;
        const Icon = config.icon;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onToggle(cat.id)}
            className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all ${
              isSelected
                ? 'border-transparent shadow-lg scale-[1.02]'
                : 'bg-white border-[rgba(0,0,0,0.07)] hover:border-[rgba(0,0,0,0.12)] hover:shadow-md'
            }`}
            style={
              isSelected
                ? { background: config.activeBg }
                : undefined
            }
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all"
              style={
                isSelected
                  ? { background: 'rgba(255,255,255,0.3)' }
                  : { background: config.bg }
              }
            >
              <Icon
                size={22}
                strokeWidth={1.8}
                style={{ color: isSelected ? '#fff' : config.color }}
              />
            </div>
            <span
              className={`text-[11px] font-bold leading-tight transition-colors ${
                isSelected ? 'text-white' : 'text-[#1A1A1A]'
              }`}
            >
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
