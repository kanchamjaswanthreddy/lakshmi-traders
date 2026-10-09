'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Bill } from '@/types';

interface PDFDownloadButtonProps {
  bill: Bill;
  className?: string;
  children: ReactNode;
}

export default function PDFDownloadButton({
  bill,
  className,
  children,
}: PDFDownloadButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [PDFDoc, setPDFDoc] = useState<React.ComponentType<{ bill: Bill }> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    Promise.all([
      import('@react-pdf/renderer'),
      import('@/components/BillPDF'),
    ]).then(([pdfMod, billPdfMod]) => {
      setComponent(() => pdfMod.PDFDownloadLink);
      setPDFDoc(() => billPdfMod.default);
    });
  }, []);

  if (!mounted || !Component || !PDFDoc) {
    return <span className={className}>{children}</span>;
  }

  return (
    <Component
      document={<PDFDoc bill={bill} />}
      fileName={`INV-${bill.bill_number}.pdf`}
      className={className}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }: { loading: boolean }) =>
        loading ? <span className="inline-flex items-center gap-2">Generating...</span> : children
      }
    </Component>
  );
}
