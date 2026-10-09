'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { Bill, BillItem } from '@/types';
import { STORE } from '@/lib/store';
import { displayDate } from '@/lib/date';
import { amountInWords } from '@/lib/amountInWords';

const s = StyleSheet.create({
  page: {
    padding: 12,
    fontFamily: 'Helvetica',
    fontSize: 7,
    color: '#111',
    flexDirection: 'row',
    gap: 10,
  },
  half: {
    flex: 1,
    border: '1.5pt solid #1a3a8c',
  },
  header: {
    borderBottom: '0.75pt solid #c5cce8',
    padding: '4 8 3 8',
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1.5,
    fontSize: 5.5,
    color: '#333',
  },
  storeName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a3a8c',
    marginBottom: 1,
  },
  storeAddr: {
    fontSize: 5.5,
    color: '#333',
  },
  invoiceLabel: {
    fontWeight: 'bold',
    fontSize: 7,
    letterSpacing: 0.6,
  },
  cusInvRow: {
    flexDirection: 'row',
    borderBottom: '0.75pt solid #c5cce8',
  },
  cusCol: {
    flex: 1,
    padding: '3 8',
    borderRight: '0.75pt solid #c5cce8',
  },
  invCol: {
    width: 120,
    padding: '3 8',
  },
  fieldLabel: {
    fontSize: 5.5,
    color: '#666',
  },
  fieldValue: {
    fontSize: 6.5,
    fontWeight: 'bold',
  },
  fieldRow: {
    marginBottom: 1,
  },
  invNo: {
    fontWeight: 'bold',
    color: '#E03020',
    fontSize: 8.5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
  },
  tableRow: {
    flexDirection: 'row',
  },
  th: {
    border: '0.5pt solid #c5cce8',
    padding: '2 2',
    fontSize: 5.5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  td: {
    border: '0.5pt solid #c5cce8',
    padding: '1.5 2',
    fontSize: 6,
  },
  colSno: { width: 16 },
  colName: { flex: 1 },
  colHsn: { width: 30 },
  colQty: { width: 28 },
  colRate: { width: 38, textAlign: 'right' },
  colAmt: { width: 42, textAlign: 'right' },
  colTotal: { width: 44, textAlign: 'right' },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
  },
  footerWrap: {
    flexDirection: 'row',
    borderTop: '0.75pt solid #c5cce8',
  },
  footerLeft: {
    flex: 1,
    padding: '4 8',
    borderRight: '0.75pt solid #c5cce8',
  },
  footerRight: {
    width: 150,
    padding: '4 8',
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
    fontSize: 6,
  },
  notes: {
    borderTop: '0.75pt solid #c5cce8',
    padding: '3 8',
  },
  noteText: {
    fontSize: 4.5,
    color: '#666',
    marginBottom: 0.5,
  },
  sigBlock: {
    textAlign: 'right',
    marginTop: 4,
  },
});

interface BillPDFProps {
  bill: Bill;
}

function BillCopy({ bill, items, copyLabel }: { bill: Bill; items: BillItem[]; copyLabel: string }) {
  return (
    <View style={s.half}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <Text>GSTIN: {STORE.gstin}</Text>
          <View style={{ alignItems: 'center' }}>
            <Text style={s.invoiceLabel}>{bill.source === 'estimate' ? 'ESTIMATE' : 'TAX INVOICE'}</Text>
            <Text style={{ fontSize: 4.5, marginTop: 0.5, color: '#666' }}>({copyLabel})</Text>
          </View>
          <Text>Cell: {STORE.cell}</Text>
        </View>
        <Text style={s.storeName}>{STORE.name}</Text>
        <Text style={s.storeAddr}>{STORE.address}</Text>
      </View>

      {/* Customer + Invoice */}
      <View style={s.cusInvRow}>
        <View style={s.cusCol}>
          <View style={s.fieldRow}>
            <Text>
              <Text style={s.fieldLabel}>Name : </Text>
              <Text style={s.fieldValue}>{bill.customer_name}</Text>
            </Text>
          </View>
          <View style={s.fieldRow}>
            <Text>
              <Text style={s.fieldLabel}>Address : </Text>
              <Text style={{ fontSize: 6 }}>{bill.customer_address || '—'}</Text>
            </Text>
          </View>
          <View style={s.fieldRow}>
            <Text>
              <Text style={s.fieldLabel}>GSTIN : </Text>
              <Text style={{ fontSize: 6 }}>{bill.customer_gstin || '—'}</Text>
            </Text>
          </View>
          <View style={s.fieldRow}>
            <Text>
              <Text style={s.fieldLabel}>State : </Text>
              <Text style={{ fontSize: 6 }}>{bill.customer_state || STORE.state}</Text>
              <Text style={s.fieldLabel}>   Code: </Text>
              <Text style={{ fontSize: 6 }}>{STORE.stateCode}</Text>
            </Text>
          </View>
        </View>
        <View style={s.invCol}>
          <View style={s.fieldRow}>
            <Text>
              <Text style={s.fieldLabel}>INVOICE No. </Text>
              <Text style={s.invNo}>{bill.bill_number}</Text>
            </Text>
          </View>
          <View style={s.fieldRow}>
            <Text>
              <Text style={s.fieldLabel}>DATE: </Text>
              <Text style={{ fontSize: 6 }}>{displayDate(bill.date)}</Text>
            </Text>
          </View>
          <View style={s.fieldRow}>
            <Text>
              <Text style={s.fieldLabel}>Delivery: </Text>
              <Text style={{ fontSize: 6 }}>
                {bill.date_of_delivery ? displayDate(bill.date_of_delivery) : '—'}
              </Text>
            </Text>
          </View>
          <View style={s.fieldRow}>
            <Text>
              <Text style={s.fieldLabel}>Vehicle: </Text>
              <Text style={{ fontSize: 6 }}>{bill.vehicle_no || '—'}</Text>
            </Text>
          </View>
          <View style={s.fieldRow}>
            <Text>
              <Text style={s.fieldLabel}>E-Way Bill: </Text>
              <Text style={{ fontSize: 6, fontWeight: 'bold' }}>
                {bill.eway_bill_no || '....................................'}
              </Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Table area — flex:1 pushes footer to bottom */}
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {/* Table Header */}
        <View style={s.tableHeader}>
          <Text style={[s.th, s.colSno]}>S.No</Text>
          <Text style={[s.th, s.colName, { textAlign: 'left' }]}>Name of Product</Text>
          <Text style={[s.th, s.colHsn]}>HSN</Text>
          <Text style={[s.th, s.colQty]}>Qty</Text>
          <Text style={[s.th, s.colRate]}>Rate</Text>
          <Text style={[s.th, s.colAmt]}>Amount</Text>
          <Text style={[s.th, s.colTotal]}>TOTAL</Text>
        </View>

        {/* Table Body */}
        {items.map((item: BillItem, i: number) => {
          const gstAmt = item.amount * (item.gst_percent / 100);
          const total = item.amount + gstAmt;
          return (
            <View style={s.tableRow} key={item.id || i}>
              <Text style={[s.td, s.colSno, { textAlign: 'center' }]}>{item.s_no}</Text>
              <Text style={[s.td, s.colName]}>{item.product_name}</Text>
              <Text style={[s.td, s.colHsn, { textAlign: 'center', fontSize: 5 }]}>{item.hsn_code}</Text>
              <Text style={[s.td, s.colQty, { textAlign: 'center' }]}>{item.quantity} {item.unit}</Text>
              <Text style={[s.td, s.colRate]}>{item.rate.toFixed(2)}</Text>
              <Text style={[s.td, s.colAmt]}>{item.amount.toFixed(2)}</Text>
              <Text style={[s.td, s.colTotal, { fontWeight: 'bold' }]}>{total.toFixed(2)}</Text>
            </View>
          );
        })}

        {/* Empty filler row — draws column lines to fill remaining space */}
        <View style={[s.tableRow, { flex: 1 }]}>
          <Text style={[s.td, s.colSno]} />
          <Text style={[s.td, s.colName]} />
          <Text style={[s.td, s.colHsn]} />
          <Text style={[s.td, s.colQty]} />
          <Text style={[s.td, s.colRate]} />
          <Text style={[s.td, s.colAmt]} />
          <Text style={[s.td, s.colTotal]} />
        </View>
      </View>

      {/* Total Row */}
      <View style={s.totalRow}>
        <Text style={[s.th, { flex: 1, textAlign: 'right', paddingRight: 3 }]}>TOTAL</Text>
        <Text style={[s.th, s.colAmt]}>{bill.subtotal.toFixed(2)}</Text>
        <Text style={[s.th, s.colTotal]}>{bill.grand_total.toFixed(2)}</Text>
      </View>

      {/* Footer */}
      <View style={s.footerWrap}>
        <View style={s.footerLeft}>
          <Text style={[s.fieldLabel, { marginBottom: 0.5 }]}>Total Invoice Amount In Words:</Text>
          <Text style={[s.fieldValue, { fontSize: 6, marginBottom: 3 }]}>{amountInWords(bill.grand_total)}</Text>
          <Text style={[s.fieldValue, { fontSize: 6, marginBottom: 1 }]}>Bank Details:</Text>
          <Text style={{ fontSize: 5.5 }}>{STORE.bankName}</Text>
          <Text style={{ fontSize: 5.5 }}>A/c: {STORE.accountNo}</Text>
          <Text style={{ fontSize: 5.5 }}>IFSC: {STORE.ifsc}</Text>
        </View>
        <View style={s.footerRight}>
          <View style={s.taxRow}>
            <Text>Before Tax:</Text>
            <Text style={{ fontWeight: 'bold' }}>{bill.subtotal.toFixed(2)}</Text>
          </View>
          <View style={s.taxRow}>
            <Text>CGST @ {bill.cgst_percent}%</Text>
            <Text>{bill.cgst_amount.toFixed(2)}</Text>
          </View>
          <View style={s.taxRow}>
            <Text>SGST @ {bill.sgst_percent}%</Text>
            <Text>{bill.sgst_amount.toFixed(2)}</Text>
          </View>
          {bill.igst_percent > 0 && (
            <View style={s.taxRow}>
              <Text>IGST @ {bill.igst_percent}%</Text>
              <Text>{bill.igst_amount.toFixed(2)}</Text>
            </View>
          )}
          <View style={s.taxRow}>
            <Text>Tax Amount: GST</Text>
            <Text>{bill.total_gst.toFixed(2)}</Text>
          </View>
          <View
            style={[
              s.taxRow,
              {
                marginTop: 2,
                paddingTop: 2,
                borderTop: '0.75pt solid #c5cce8',
                fontWeight: 'bold',
                fontSize: 7.5,
              },
            ]}
          >
            <Text>After Tax:</Text>
            <Text>Rs. {bill.grand_total.toFixed(2)}</Text>
          </View>
          <View style={s.taxRow}>
            <Text>Reverse Charge:</Text>
            <Text>N/A</Text>
          </View>
        </View>
      </View>

      {/* Notes + Signature */}
      <View style={s.notes}>
        <Text style={s.noteText}>{STORE.footerNote1}</Text>
        <Text style={s.noteText}>Note: {STORE.footerNote2}</Text>
        <View style={s.sigBlock}>
          <Text style={{ fontSize: 6, fontWeight: 'bold' }}>For: {STORE.name}</Text>
          <Text style={{ fontSize: 5.5, marginTop: 14 }}>Proprietor</Text>
        </View>
      </View>
    </View>
  );
}

export default function BillPDF({ bill }: BillPDFProps) {
  const items = bill.bill_items || [];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <BillCopy bill={bill} items={items} copyLabel="SHOP COPY" />
        <BillCopy bill={bill} items={items} copyLabel="CUSTOMER COPY" />
      </Page>
    </Document>
  );
}
