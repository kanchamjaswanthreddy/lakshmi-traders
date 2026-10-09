'use client';

import { useState } from 'react';
import { BillFormItem } from '@/types';
import { Trash2, Plus } from 'lucide-react';

interface BillTableProps {
  items: BillFormItem[];
  onUpdateItem: (index: number, field: keyof BillFormItem, value: string | number) => void;
  onDeleteItem: (index: number) => void;
  onAddRow: () => void;
}

export default function BillTable({
  items,
  onUpdateItem,
  onDeleteItem,
  onAddRow,
}: BillTableProps) {
  // Track raw string display values so fields can be fully cleared
  const [inclValues, setInclValues] = useState<Record<number, string>>({});
  const [qtyStrings, setQtyStrings] = useState<Record<number, string>>({});
  const [rateStrings, setRateStrings] = useState<Record<number, string>>({});

  function handleInclGstChange(index: number, inclStr: string, gstPercent: number) {
    setInclValues((prev) => ({ ...prev, [index]: inclStr }));
    const inclPrice = parseFloat(inclStr) || 0;
    const baseRate = inclPrice / (1 + gstPercent / 100);
    const rounded = Math.round(baseRate * 100) / 100;
    onUpdateItem(index, 'rate', rounded);
    onUpdateItem(index, 'amount', rounded * items[index].quantity);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86868B] border-b border-[#E0E0E2] w-12">
              S.No
            </th>
            <th className="text-left px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86868B] border-b border-[#E0E0E2]">
              Product
            </th>
            <th className="text-left px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86868B] border-b border-[#E0E0E2] w-24">
              HSN
            </th>
            <th className="text-center px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86868B] border-b border-[#E0E0E2] w-18">
              Qty
            </th>
            <th className="text-center px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86868B] border-b border-[#E0E0E2] w-14">
              Unit
            </th>
            <th className="text-right px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86868B] border-b border-[#E0E0E2] w-24">
              Rate
            </th>
            <th className="text-right px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0066CC] border-b border-[#E0E0E2] w-24">
              Incl. GST
            </th>
            <th className="text-center px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86868B] border-b border-[#E0E0E2] w-16">
              GST%
            </th>
            <th className="text-right px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#86868B] border-b border-[#E0E0E2] w-28">
              Amount
            </th>
            <th className="w-10 border-b border-[#E0E0E2]" />
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const computedIncl = item.rate * (1 + item.gstPercent / 100);
            return (
              <tr key={i} className="border-b border-[#F0F0F2] last:border-b-0">
                <td className="px-3 py-3">
                  <span className="w-7 h-7 rounded-lg bg-[#F0F0F2] flex items-center justify-center text-[11px] font-bold text-[#86868B]">
                    {i + 1}
                  </span>
                </td>
                <td className="px-3 py-3 text-[13px] text-[#1A1A1A] font-semibold">
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) => onUpdateItem(i, 'productName', e.target.value)}
                    placeholder="Item name"
                    className="bg-transparent border border-transparent hover:border-[#E0E0E2] focus:border-[#1A1A1A] focus:bg-white rounded-lg px-2 py-1.5 w-full outline-none transition-all"
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    type="text"
                    value={item.hsnCode || ''}
                    onChange={(e) => onUpdateItem(i, 'hsnCode', e.target.value)}
                    placeholder="HSN"
                    className="font-mono text-[11px] font-medium text-[#86868B] bg-[#F0F0F2] border border-transparent focus:border-[#1A1A1A] focus:bg-white px-2 py-1.5 rounded-md w-[80px] outline-none transition-all"
                  />
                </td>
                <td className="px-3 py-3 text-center">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={qtyStrings[i] !== undefined ? qtyStrings[i] : item.quantity}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setQtyStrings((prev) => ({ ...prev, [i]: raw }));
                      const parsed = parseInt(raw);
                      if (!isNaN(parsed)) {
                        onUpdateItem(i, 'quantity', parsed);
                      }
                    }}
                    onBlur={() => {
                      setQtyStrings((prev) => {
                        const next = { ...prev };
                        delete next[i];
                        return next;
                      });
                      if (item.quantity <= 0) onUpdateItem(i, 'quantity', 1);
                    }}
                    className="bg-[#F0F0F2] border border-[#E0E0E2] rounded-lg px-2 py-1.5 text-[13px] font-semibold text-[#1A1A1A] text-center w-[56px] outline-none focus:border-[#1A1A1A]"
                  />
                </td>
                <td className="px-3 py-3 text-center">
                  <select
                    value={item.unit}
                    onChange={(e) => onUpdateItem(i, 'unit', e.target.value)}
                    className="bg-transparent border border-transparent hover:border-[#E0E0E2] focus:border-[#1A1A1A] focus:bg-white rounded-lg px-1 py-1.5 text-[12px] font-medium text-[#6E6E73] text-center w-[60px] outline-none transition-all uppercase cursor-pointer"
                  >
                    <option value="NOS">NOS</option>
                    <option value="MTR">MTR</option>
                    <option value="KGS">KGS</option>
                    <option value="LTR">LTR</option>
                    <option value="PCS">PCS</option>
                    <option value="PKT">PKT</option>
                    <option value="BOX">BOX</option>
                  </select>
                </td>
                <td className="px-3 py-3 text-right">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={rateStrings[i] !== undefined ? rateStrings[i] : (item.rate > 0 ? item.rate : '')}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setRateStrings((prev) => ({ ...prev, [i]: raw }));
                      const parsed = parseFloat(raw);
                      if (!isNaN(parsed)) {
                        onUpdateItem(i, 'rate', parsed);
                        onUpdateItem(i, 'amount', parsed * item.quantity);
                      }
                      // Clear incl field when rate is edited directly
                      setInclValues((prev) => {
                        const next = { ...prev };
                        delete next[i];
                        return next;
                      });
                    }}
                    onBlur={() => {
                      setRateStrings((prev) => {
                        const next = { ...prev };
                        delete next[i];
                        return next;
                      });
                    }}
                    placeholder="0"
                    className="bg-[#F0F0F2] border border-[#E0E0E2] rounded-lg px-2 py-1.5 text-[13px] font-semibold text-[#1A1A1A] text-right w-[80px] outline-none focus:border-[#1A1A1A] font-mono placeholder:text-[#C0C0C2]"
                  />
                </td>
                <td className="px-3 py-3 text-right">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={inclValues[i] !== undefined ? inclValues[i] : (item.rate > 0 ? computedIncl.toFixed(2) : '')}
                    onChange={(e) => handleInclGstChange(i, e.target.value, item.gstPercent)}
                    placeholder="0"
                    className="bg-[#F0F6FF] border border-[#D0E2F7] rounded-lg px-2 py-1.5 text-[13px] font-semibold text-[#0066CC] text-right w-[80px] outline-none focus:border-[#0066CC] font-mono placeholder:text-[#B8D4F7]"
                  />
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={item.gstPercent}
                      onChange={(e) => onUpdateItem(i, 'gstPercent', parseFloat(e.target.value) || 0)}
                      className="bg-transparent border border-transparent hover:border-[#E0E0E2] focus:border-[#1A1A1A] focus:bg-white rounded-lg px-1 py-1.5 text-[12px] font-medium text-[#6E6E73] text-center w-[40px] outline-none transition-all"
                    />
                    <span className="text-[12px] font-medium text-[#6E6E73]">%</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-right font-mono text-[14px] font-bold text-[#1A1A1A]">
                  ₹{item.amount.toFixed(2)}
                </td>
                <td className="px-2 py-3">
                  <button
                    onClick={() => onDeleteItem(i)}
                    aria-label={`Delete ${item.productName}`}
                    className="p-1.5 rounded-lg hover:bg-[#FFF0F0] text-[#86868B] hover:text-[#E03020] transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        onClick={onAddRow}
        className="flex items-center gap-2 mt-4 px-4 py-2.5 bg-[#F0F0F2] hover:bg-[#E8E8EA] border border-[#E0E0E2] rounded-xl text-[13px] font-semibold text-[#1A1A1A] transition-all cursor-pointer"
      >
        <Plus size={15} />
        Add Row
      </button>
    </div>
  );
}
