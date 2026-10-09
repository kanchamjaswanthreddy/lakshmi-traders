'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Zap,
  FileText,
  Clock,
  Package,
  BarChart3,
  Trash2,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  IndianRupee,
} from 'lucide-react';
import { useState } from 'react';
import { useSidebar } from './SidebarContext';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/bill/auto', label: 'Auto Bill', icon: Zap, section: 'BILLING' },

  { href: '/bill/manual', label: 'Manual Bill', icon: FileText },
  { href: '/bill/from-statement', label: 'Bill from Statement', icon: FileText },
  { href: '/history', label: 'Bill History', icon: Clock, section: 'RECORDS' },
  { href: '/reports', label: 'Sales Reports', icon: BarChart3 },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/price-list', label: 'Price List', icon: IndianRupee },
  { href: '/trash', label: 'Recycle Bin', icon: Trash2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, toggle } = useSidebar();

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
  }

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white border border-[#E0E0E2] rounded-xl flex items-center justify-center no-print shadow-sm"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — Apple Music Style */}
      <aside
        className={`fixed z-40 top-0 bottom-0 left-0 flex flex-col pt-6 no-print transition-all duration-200 ease-out
          backdrop-blur-[24px] backdrop-saturate-[180%]
          bg-white/55
          border-r border-[rgba(255,255,255,0.4)]
          ${mobileOpen ? 'translate-x-0 w-[220px]' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'lg:w-[68px]' : 'lg:w-[220px]'}`}
      >
        {/* Logo */}
        <div className={`mb-8 ${collapsed ? 'px-3' : 'px-5'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1a3a8c 0%, #2d5dd4 100%)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v2H4z" opacity="0.5" />
                <path d="M6 6v14h12V6" />
                <path d="M9 10h6" />
                <path d="M9 13h4" />
                <path d="M9 16h2" />
              </svg>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-[#1A1A1A] truncate tracking-tight">
                  Lakshmi Traders
                </p>
                <p className="text-[10px] text-[rgba(0,0,0,0.4)] font-medium">Billing Software</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2">
          {NAV_ITEMS.map((item) => (
            <div key={item.href}>
              {item.section && !collapsed && (
                <p className="px-3 pt-5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[rgba(0,0,0,0.4)]">
                  {item.section}
                </p>
              )}
              {item.section && collapsed && <div className="pt-3" />}
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
                className={`relative flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} ${collapsed ? 'px-0 py-2' : 'px-3 py-[7px]'} rounded-lg text-[13px] transition-all mb-px ${
                  isActive(item.href)
                    ? 'bg-white/50 text-[#1A1A1A] font-semibold shadow-[0_0.5px_0_0_rgba(255,255,255,0.8)_inset,0_1px_3px_rgba(0,0,0,0.06)]'
                    : 'text-[rgba(0,0,0,0.55)] font-medium hover:text-[#1A1A1A] hover:bg-white/30'
                }`}
              >
                <item.icon size={16} strokeWidth={1.8} className="flex-shrink-0" />
                {!collapsed && item.label}
              </Link>
            </div>
          ))}
        </nav>

        {/* Bottom: Collapse toggle + Logout */}
        <div className="px-2 pb-5 space-y-1">
          {/* Desktop collapse toggle */}
          <button
            onClick={toggle}
            className={`hidden lg:flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} ${collapsed ? 'px-0' : 'px-3'} py-[7px] rounded-lg text-[13px] font-medium text-[rgba(0,0,0,0.4)] hover:text-[#1A1A1A] hover:bg-white/30 transition-all w-full cursor-pointer`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen size={17} strokeWidth={1.8} />
            ) : (
              <>
                <PanelLeftClose size={17} strokeWidth={1.8} />
                Collapse
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            aria-label="Logout"
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} ${collapsed ? 'px-0' : 'px-3'} py-[7px] rounded-lg text-[13px] font-medium text-[rgba(0,0,0,0.4)] hover:text-[#1A1A1A] hover:bg-white/30 transition-all w-full cursor-pointer`}
          >
            <LogOut size={17} strokeWidth={1.8} className="flex-shrink-0" />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>
    </>
  );
}
