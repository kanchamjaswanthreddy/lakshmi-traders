'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { format } from 'date-fns';
import { displayDate } from '@/lib/date';
import { Upload, Check, AlertTriangle, Layers, Loader2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import CategorySelector from '@/components/CategorySelector';

type Transaction = {
  id: string;
  date: string;
  customerName: string;
  amount: string;
  reference: string;
  selected: boolean;
};

export default function BulkAutoBillPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [file, setFile] = useState<File | null>(null);
  
  // Parsing states
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawData, setRawData] = useState<Record<string, string>[]>([]);
  
  // Mapping states
  const [dateCol, setDateCol] = useState('');
  const [nameCol, setNameCol] = useState('');
  const [amountCol, setAmountCol] = useState('');
  
  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Processing
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<{ success: number; error: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);

    if (uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      const toastId = toast.loading('Parsing PDF...');
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        const res = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to parse PDF');
        }

        if (data.transactions && data.transactions.length > 0) {
          const parsedTxns: Transaction[] = data.transactions.map((t: { date?: string; description?: string; amount: string }, idx: number) => {
            let parsedDate = format(new Date(), 'yyyy-MM-dd');
            try {
               const rawDate = t.date;
               if (rawDate) {
                 const d = new Date(rawDate);
                 if (!isNaN(d.getTime())) {
                   parsedDate = format(d, 'yyyy-MM-dd');
                 } else {
                    const parts = String(rawDate).split(/[-/]/);
                    if (parts.length === 3) {
                       const d2 = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                       if (!isNaN(d2.getTime())) {
                         parsedDate = format(d2, 'yyyy-MM-dd');
                       }
                    }
                 }
               }
            } catch {
              // Date parse failed, using today's date as fallback
            }

            return {
              id: `txn-${idx}`,
              date: parsedDate,
              customerName: t.description ? String(t.description).substring(0, 50) : 'Unknown',
              reference: t.description ? String(t.description) : '',
              amount: t.amount.replace(/[^0-9.-]+/g, ""),
              selected: true,
            };
          });
          
          setTransactions(parsedTxns);
          setStep(3);
          toast.success('PDF parsed successfully', { id: toastId });
        } else {
          toast.error('No transactions found in this PDF.', { id: toastId });
        }
      } catch (error: unknown) {
         const message = error instanceof Error ? error.message : 'Failed to parse file';
         toast.error(message, { id: toastId });
      }
      return;
    }

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields && results.meta.fields.length > 0) {
          setHeaders(results.meta.fields);
          setRawData(results.data as Record<string, string>[]);
          
          // Auto-guess columns
          const fields = results.meta.fields.map(f => f.toLowerCase());
          
          const guessDate = results.meta.fields.find(f => fields.includes(f.toLowerCase()) && f.toLowerCase().includes('date'));
          const guessName = results.meta.fields.find(f => fields.includes(f.toLowerCase()) && (f.toLowerCase().includes('narration') || f.toLowerCase().includes('description') || f.toLowerCase().includes('particulars')));
          const guessAmount = results.meta.fields.find(f => fields.includes(f.toLowerCase()) && (f.toLowerCase().includes('credit') || f.toLowerCase().includes('deposit') || f.toLowerCase().includes('amount') || f.toLowerCase() === 'cr'));

          if (guessDate) setDateCol(guessDate);
          if (guessName) setNameCol(guessName);
          if (guessAmount) setAmountCol(guessAmount);

          setStep(2);
        } else {
          toast.error('Could not read CSV headers');
        }
      },
      error: (error) => {
        toast.error(`Error parsing file: ${error.message}`);
      }
    });
  };

  const handleMapColumns = () => {
    if (!dateCol || !nameCol || !amountCol) {
      toast.error('Please select all required columns');
      return;
    }

    const parsedTxns: Transaction[] = [];

    rawData.forEach((row, idx) => {
      const rawAmount = row[amountCol];
      // Clean amount: remove commas, currency symbols
      const cleanAmount = typeof rawAmount === 'string' ? rawAmount.replace(/[^0-9.-]+/g, "") : rawAmount;
      const amountVal = parseFloat(cleanAmount);
      
      if (!isNaN(amountVal) && amountVal > 0) {
        let parsedDate = format(new Date(), 'yyyy-MM-dd'); // Fallback
        
        // Try parsing the date (very naive approach, assumes DD/MM/YYYY or YYYY-MM-DD or standard JS formats)
        try {
           const rawDate = row[dateCol];
           if (rawDate) {
             const d = new Date(rawDate);
             if (!isNaN(d.getTime())) {
               parsedDate = format(d, 'yyyy-MM-dd');
             } else {
                // Try DD/MM/YYYY or DD-MM-YYYY
                const parts = String(rawDate).split(/[-/]/);
                if (parts.length === 3) {
                   const d2 = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                   if (!isNaN(d2.getTime())) {
                     parsedDate = format(d2, 'yyyy-MM-dd');
                   }
                }
             }
           }
        } catch {
           // Date parse failed, using today's date as fallback
        }

        parsedTxns.push({
          id: `txn-${idx}`,
          date: parsedDate,
          customerName: row[nameCol] ? String(row[nameCol]).substring(0, 50) : 'Unknown',
          reference: row[nameCol] ? String(row[nameCol]) : '',
          amount: amountVal.toString(),
          selected: true, // Default to selected
        });
      }
    });

    if (parsedTxns.length === 0) {
      toast.error('No valid positive transactions found with this mapping.');
      return;
    }

    setTransactions(parsedTxns);
    setStep(3);
  };

  const handleToggleTxn = (id: string) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  };

  const handleToggleAll = (select: boolean) => {
    setTransactions(transactions.map(t => ({ ...t, selected: select })));
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleGenerate = async () => {
    const selectedTxns = transactions.filter(t => t.selected);
    
    if (selectedTxns.length === 0) {
      toast.error('Please select at least one transaction');
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error('Please select at least one product category');
      return;
    }

    setProcessing(true);

    try {
      const res = await fetch('/api/bills/bulk-auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions: selectedTxns,
          categories: selectedCategories
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to process transactions');
      } else {
        setResults({ success: data.successCount, error: data.errorCount });
        if (data.errorCount > 0) {
          toast.success(`Generated ${data.successCount} bills, ${data.errorCount} failed.`);
        } else {
          toast.success(`Successfully generated ${data.successCount} bills!`);
        }
        setStep(4);
      }
    } catch {
      toast.error('An error occurred during bulk generation');
    }

    setProcessing(false);
  };

  const resetFlow = () => {
    setStep(1);
    setFile(null);
    setHeaders([]);
    setRawData([]);
    setTransactions([]);
    setResults(null);
  };

  const inputClass = "w-full min-w-0 bg-[#F0F0F2] border border-[#E0E0E2] rounded-xl px-4 py-3 text-[14px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all";
  const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#86868B] mb-2";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] flex items-center gap-3">
          <Layers className="text-blue-500" /> Bulk Auto Bill
        </h1>
        <p className="text-[13px] font-medium text-[#86868B] mt-1">
          Upload your bank statement and generate bills in bulk.
        </p>
      </div>

      {step === 1 && (
        <div className="bento-card-static p-10 flex flex-col items-center justify-center text-center border-dashed border-2 border-[#E0E0E2] bg-[#F9F9FB] rounded-3xl min-h-[400px]">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <Upload size={28} />
          </div>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">Upload Bank Statement</h2>
          <p className="text-[14px] text-[#86868B] mb-8 max-w-md">
            Please upload a CSV or PDF file downloaded from your bank. We will automatically detect deposits and help you generate bills for them.
          </p>
          
          <input
            type="file"
            accept=".csv, .pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#1A1A1A] text-white px-8 py-3.5 rounded-xl font-semibold text-[14px] hover:bg-black transition-colors"
          >
            Select File
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bento-card-static p-6">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">Map Columns</h2>
          <p className="text-[13px] text-[#86868B] mb-6">
            Different banks use different names. Please select which columns from your file match the required fields.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className={labelClass}>Date Column</label>
              <select value={dateCol} onChange={e => setDateCol(e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Description / Name Column</label>
              <select value={nameCol} onChange={e => setNameCol(e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Deposit / Amount Column</label>
              <select value={amountCol} onChange={e => setAmountCol(e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={resetFlow} className="px-6 py-3 rounded-xl font-semibold text-[#86868B] hover:bg-[#F5F5F7] transition-colors text-[14px]">
              Cancel
            </button>
            <button onClick={handleMapColumns} className="bg-[#1A1A1A] text-white px-6 py-3 rounded-xl font-semibold text-[14px] hover:bg-black transition-colors">
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bento-card-static p-6">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Select Transactions</h2>
                   <p className="text-[13px] text-[#86868B]">
                     We found {transactions.length} incoming transactions. Select the ones you want to bill.
                   </p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => handleToggleAll(true)} className="px-3 py-1.5 text-[12px] font-semibold text-[#1A1A1A] bg-[#F0F0F2] rounded-lg hover:bg-[#E0E0E2]">Select All</button>
                   <button onClick={() => handleToggleAll(false)} className="px-3 py-1.5 text-[12px] font-semibold text-[#1A1A1A] bg-[#F0F0F2] rounded-lg hover:bg-[#E0E0E2]">Deselect All</button>
                </div>
             </div>
             
             <div className="max-h-[400px] overflow-y-auto border border-[#E0E0E2] rounded-xl">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-[#F9F9FB] sticky top-0 z-10">
                   <tr>
                     <th className="p-4 border-b border-[#E0E0E2] w-12 text-center">
                       <Check size={16} className="text-[#86868B] mx-auto" />
                     </th>
                     <th className="p-4 border-b border-[#E0E0E2] text-[12px] font-semibold text-[#86868B] uppercase tracking-wider">Date</th>
                     <th className="p-4 border-b border-[#E0E0E2] text-[12px] font-semibold text-[#86868B] uppercase tracking-wider">Customer / Description</th>
                     <th className="p-4 border-b border-[#E0E0E2] text-[12px] font-semibold text-[#86868B] uppercase tracking-wider text-right">Amount</th>
                   </tr>
                 </thead>
                 <tbody>
                   {transactions.map((txn) => (
                     <tr key={txn.id} className="border-b border-[#E0E0E2] last:border-0 hover:bg-[#F5F5F7] transition-colors cursor-pointer" onClick={() => handleToggleTxn(txn.id)}>
                       <td className="p-4 text-center">
                         <div className={`w-5 h-5 rounded border flex items-center justify-center mx-auto transition-colors ${txn.selected ? 'bg-[#1A1A1A] border-[#1A1A1A]' : 'border-[#C0C0C2] bg-white'}`}>
                           {txn.selected && <Check size={14} className="text-white" />}
                         </div>
                       </td>
                       <td className="p-4 text-[13px] font-medium text-[#1A1A1A]">{displayDate(txn.date)}</td>
                       <td className="p-4 text-[13px] font-medium text-[#6E6E73] truncate max-w-xs">{txn.customerName}</td>
                       <td className="p-4 text-[14px] font-bold text-[#1A1A1A] text-right font-mono">₹{parseFloat(txn.amount).toLocaleString('en-IN')}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

          <div className="bento-card-static p-6">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">Select Categories</h2>
            <p className="text-[13px] text-[#86868B] mb-6">
              Select one or more product categories. We will auto-generate items from these categories to match the transaction amounts.
            </p>
            <CategorySelector selected={selectedCategories} onToggle={toggleCategory} />
            
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setStep(2)} disabled={processing} className="px-6 py-3 rounded-xl font-semibold text-[#86868B] hover:bg-[#F5F5F7] transition-colors text-[14px]">
                Back
              </button>
              <button 
                onClick={handleGenerate} 
                disabled={processing}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-[14px] hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {processing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                {processing ? 'Generating...' : `Generate ${transactions.filter(t => t.selected).length} Bills`}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 4 && results && (
        <div className="bento-card-static p-10 flex flex-col items-center justify-center text-center bg-[#F9F9FB] rounded-3xl min-h-[400px]">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <Check size={40} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Done!</h2>
          <p className="text-[15px] text-[#6E6E73] mb-8">
            Successfully generated <strong className="text-[#1A1A1A]">{results.success}</strong> bills.
            {results.error > 0 && <span className="text-red-500 ml-1">Failed to generate {results.error} bills.</span>}
          </p>
          
          <div className="flex gap-4">
             <button
               onClick={resetFlow}
               className="bg-[#1A1A1A] text-white px-8 py-3.5 rounded-xl font-semibold text-[14px] hover:bg-black transition-colors"
             >
               Process Another File
             </button>
             <a
               href="/history"
               className="bg-white border border-[#E0E0E2] text-[#1A1A1A] px-8 py-3.5 rounded-xl font-semibold text-[14px] hover:bg-[#F5F5F7] transition-colors"
             >
               View History
             </a>
          </div>
        </div>
      )}
    </div>
  );
}
