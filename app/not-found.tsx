import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">404</h1>
      <p className="text-[15px] font-medium text-[#86868B] mb-6">Page not found</p>
      <Link
        href="/dashboard"
        className="bg-[#1A1A1A] text-white rounded-xl px-6 py-3 text-[14px] font-semibold hover:bg-black transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
