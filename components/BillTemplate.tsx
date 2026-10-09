'use client';

import { Bill, BillItem } from '@/types';
import { STORE } from '@/lib/store';
import { displayDate } from '@/lib/date';
import { amountInWords } from '@/lib/amountInWords';

interface BillTemplateProps {
  bill: Bill;
  copyType?: string;
}

export default function BillTemplate({ bill, copyType }: BillTemplateProps) {
  const items = bill.bill_items || [];
  
  // Dynamic scaling to fit many items within the fixed A5 height
  const itemFontSize = items.length > 25 ? '7px' : items.length > 15 ? '9px' : '11px';
  const itemPadding = items.length > 25 ? '1px 2px' : items.length > 15 ? '3px 4px' : '5px 4px';

  return (
    <div
      className="bill-sheet bg-[#FAFAF8] mx-auto print:!h-[210mm] print:!w-[148mm] print:!border-none"
      style={{
        border: '2px solid #1a3a8c',
        width: '148mm',
        height: '210mm',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        color: '#111',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid #c5cce8',
          padding: '12px 16px 10px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#333',
            marginBottom: '6px',
          }}
        >
          <span>GSTIN: {STORE.gstin}</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.1em',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {bill.source === 'estimate' ? 'ESTIMATE' : 'TAX INVOICE'}
            {copyType && <span style={{ fontSize: '10px', marginTop: '2px', color: '#666' }}>({copyType})</span>}
          </span>
          <span>Cell: {STORE.cell}</span>
        </div>
        <h1
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1a3a8c',
            margin: '0 0 2px',
          }}
        >
          {STORE.name}
        </h1>
        <p style={{ fontSize: '11px', color: '#333', margin: 0 }}>
          {STORE.address}
        </p>
      </div>

      {/* Customer + Invoice Info */}
      <div style={{ display: 'flex', borderBottom: '1px solid #c5cce8' }}>
        <div
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRight: '1px solid #c5cce8',
          }}
        >
          <div style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: '#666' }}>Name : </span>
            <span style={{ fontWeight: 600 }}>{bill.customer_name}</span>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: '#666' }}>Address : </span>
            <span>{bill.customer_address || '—'}</span>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: '#666' }}>GSTIN : </span>
            <span style={{ fontFamily: 'monospace' }}>
              {bill.customer_gstin || '—'}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#666' }}>State : </span>
            <span>{bill.customer_state || STORE.state}</span>
            <span
              style={{ marginLeft: '20px', fontSize: '10px', color: '#666' }}
            >
              State Code:{' '}
            </span>
            <span>{STORE.stateCode}</span>
          </div>
        </div>
        <div style={{ width: '220px', padding: '8px 16px' }}>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: '#666' }}>
              INVOICE No.{' '}
            </span>
            <span
              style={{
                fontWeight: 700,
                color: '#E03020',
                fontFamily: 'monospace',
                fontSize: '14px',
              }}
            >
              {bill.bill_number}
            </span>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: '#666' }}>DATE: </span>
            <span>{displayDate(bill.date)}</span>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: '#666' }}>
              Date of Delivery:{' '}
            </span>
            <span>
              {bill.date_of_delivery
                ? displayDate(bill.date_of_delivery)
                : '—'}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#666' }}>
              Vehicle No:{' '}
            </span>
            <span>{bill.vehicle_no || '—'}</span>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#666' }}>
              E-Way Bill:{' '}
            </span>
            <span style={{ fontWeight: 'bold' }}>
              {bill.eway_bill_no || '....................................'}
            </span>
          </div>
        </div>
      </div>

      {/* Items Table Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <table
          style={{
            width: '100%',
            height: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
          <tr style={{ background: '#EEF2FF' }}>
            <th
              style={{
                border: '1px solid #c5cce8',
                padding: '6px 4px',
                fontSize: '10px',
                fontWeight: 600,
                textAlign: 'center',
                width: '35px',
              }}
            >
              S.No
            </th>
            <th
              style={{
                border: '1px solid #c5cce8',
                padding: '6px 8px',
                fontSize: '10px',
                fontWeight: 600,
                textAlign: 'left',
              }}
            >
              Name of Product
            </th>
            <th
              style={{
                border: '1px solid #c5cce8',
                padding: '6px 4px',
                fontSize: '10px',
                fontWeight: 600,
                textAlign: 'center',
                width: '55px',
              }}
            >
              HSN
            </th>
            <th
              style={{
                border: '1px solid #c5cce8',
                padding: '6px 4px',
                fontSize: '10px',
                fontWeight: 600,
                textAlign: 'center',
                width: '45px',
              }}
            >
              Qty
            </th>
            <th
              style={{
                border: '1px solid #c5cce8',
                padding: '6px 4px',
                fontSize: '10px',
                fontWeight: 600,
                textAlign: 'right',
                width: '70px',
              }}
            >
              Rate
            </th>
            <th
              style={{
                border: '1px solid #c5cce8',
                padding: '6px 4px',
                fontSize: '10px',
                fontWeight: 600,
                textAlign: 'right',
                width: '80px',
              }}
            >
              Amount
            </th>
            <th
              style={{
                border: '1px solid #c5cce8',
                padding: '6px 4px',
                fontSize: '10px',
                fontWeight: 600,
                textAlign: 'right',
                width: '80px',
              }}
            >
              TOTAL
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: BillItem, i: number) => {
            const gstAmt = item.amount * (item.gst_percent / 100);
            const total = item.amount + gstAmt;
            return (
              <tr key={item.id || i}>
                <td
                  style={{
                    border: '1px solid #c5cce8',
                    padding: itemPadding,
                    textAlign: 'center',
                    fontSize: itemFontSize,
                  }}
                >
                  {item.s_no}
                </td>
                <td
                  style={{
                    border: '1px solid #c5cce8',
                    padding: itemPadding,
                    fontSize: itemFontSize,
                  }}
                >
                  {item.product_name}
                </td>
                <td
                  style={{
                    border: '1px solid #c5cce8',
                    padding: itemPadding,
                    textAlign: 'center',
                    fontSize: itemFontSize,
                    fontFamily: 'monospace',
                  }}
                >
                  {item.hsn_code}
                </td>
                <td
                  style={{
                    border: '1px solid #c5cce8',
                    padding: itemPadding,
                    textAlign: 'center',
                    fontSize: itemFontSize,
                  }}
                >
                  {item.quantity} {item.unit}
                </td>
                <td
                  style={{
                    border: '1px solid #c5cce8',
                    padding: itemPadding,
                    textAlign: 'right',
                    fontSize: itemFontSize,
                    fontFamily: 'monospace',
                  }}
                >
                  {item.rate.toFixed(2)}
                </td>
                <td
                  style={{
                    border: '1px solid #c5cce8',
                    padding: itemPadding,
                    textAlign: 'right',
                    fontSize: itemFontSize,
                    fontFamily: 'monospace',
                  }}
                >
                  {item.amount.toFixed(2)}
                </td>
                <td
                  style={{
                    border: '1px solid #c5cce8',
                    padding: itemPadding,
                    textAlign: 'right',
                    fontSize: itemFontSize,
                    fontFamily: 'monospace',
                    fontWeight: 600,
                  }}
                >
                  {total.toFixed(2)}
                </td>
              </tr>
            );
          })}

          {/* Expanding empty row to fill remaining space so borders stretch to the bottom */}
          <tr style={{ height: '100%' }}>
            <td style={{ borderLeft: '1px solid #c5cce8', borderRight: '1px solid #c5cce8' }}></td>
            <td style={{ borderRight: '1px solid #c5cce8' }}></td>
            <td style={{ borderRight: '1px solid #c5cce8' }}></td>
            <td style={{ borderRight: '1px solid #c5cce8' }}></td>
            <td style={{ borderRight: '1px solid #c5cce8' }}></td>
            <td style={{ borderRight: '1px solid #c5cce8' }}></td>
            <td style={{ borderRight: '1px solid #c5cce8' }}></td>
          </tr>

          {/* Total Row */}
          <tr style={{ background: '#EEF2FF' }}>
            <td
              colSpan={5}
              style={{
                border: '1px solid #c5cce8',
                padding: '6px 8px',
                textAlign: 'right',
                fontWeight: 700,
                fontSize: '11px',
              }}
            >
              TOTAL
            </td>
            <td
              style={{
                border: '1px solid #c5cce8',
                padding: '6px',
                textAlign: 'right',
                fontWeight: 700,
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            >
              {bill.subtotal.toFixed(2)}
            </td>
            <td
              style={{
                border: '1px solid #c5cce8',
                padding: '6px',
                textAlign: 'right',
                fontWeight: 700,
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
            >
              {bill.grand_total.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      {/* Footer: Amount in Words + Tax Breakdown + Bank */}
      <div style={{ display: 'flex', borderTop: '1px solid #c5cce8' }}>
        <div
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRight: '1px solid #c5cce8',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', color: '#666' }}>
              Total Invoice Amount In Words:
            </span>
            <p style={{ fontWeight: 600, fontSize: '11px', margin: '2px 0 0' }}>
              {amountInWords(bill.grand_total)}
            </p>
          </div>
          <div style={{ fontSize: '10px', color: '#333' }}>
            <p style={{ fontWeight: 600, marginBottom: '2px' }}>
              Bank Details:
            </p>
            <p style={{ margin: '1px 0' }}>{STORE.bankName}</p>
            <p style={{ margin: '1px 0', fontFamily: 'monospace' }}>
              A/c: {STORE.accountNo}
            </p>
            <p style={{ margin: '1px 0', fontFamily: 'monospace' }}>
              IFSC: {STORE.ifsc}
            </p>
          </div>
        </div>
        <div style={{ width: '280px', padding: '10px 16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '3px',
              fontSize: '11px',
            }}
          >
            <span>Total Amount Before Tax:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
              {bill.subtotal.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '3px',
              fontSize: '11px',
            }}
          >
            <span>Add: CGST @ {bill.cgst_percent}%</span>
            <span style={{ fontFamily: 'monospace' }}>
              {bill.cgst_amount.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '3px',
              fontSize: '11px',
            }}
          >
            <span>Add: SGST @ {bill.sgst_percent}%</span>
            <span style={{ fontFamily: 'monospace' }}>
              {bill.sgst_amount.toFixed(2)}
            </span>
          </div>
          {bill.igst_percent > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '3px',
                fontSize: '11px',
              }}
            >
              <span>Add: IGST @ {bill.igst_percent}%</span>
              <span style={{ fontFamily: 'monospace' }}>
                {bill.igst_amount.toFixed(2)}
              </span>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '3px',
              fontSize: '11px',
            }}
          >
            <span>Tax Amount: GST</span>
            <span style={{ fontFamily: 'monospace' }}>
              {bill.total_gst.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '6px',
              paddingTop: '6px',
              borderTop: '1px solid #c5cce8',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            <span>Total Amount After Tax:</span>
            <span style={{ fontFamily: 'monospace' }}>
              ₹{bill.grand_total.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '4px',
              fontSize: '10px',
              color: '#666',
            }}
          >
            <span>GST Payable on Reverse Charge:</span>
            <span>N/A</span>
          </div>
        </div>
      </div>

      {/* Notes + Signature */}
      <div
        style={{
          borderTop: '1px solid #c5cce8',
          padding: '10px 16px',
        }}
      >
        <p style={{ fontSize: '9px', color: '#666', margin: '0 0 2px' }}>
          {STORE.footerNote1}
        </p>
        <p style={{ fontSize: '9px', color: '#666', margin: '0 0 12px' }}>
          Note: {STORE.footerNote2}
        </p>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, margin: '0 0 2px' }}>
            For: {STORE.name}
          </p>
          <p style={{ fontSize: '24px', margin: '8px 0', color: '#999' }}>
            &nbsp;
          </p>
          <p style={{ fontSize: '10px', fontWeight: 500 }}>Proprietor</p>
        </div>
      </div>
    </div>
  );
}
