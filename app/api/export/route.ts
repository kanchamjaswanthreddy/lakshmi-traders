import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { STORE } from '@/lib/store';
import { supabaseAdmin as supabase } from '@/lib/supabase';

const BRAND_BLUE = '1a3a8c';
const HEADER_BG = '2d5dd4';
const HEADER_FONT = 'FFFFFF';
const BORDER_COLOR = 'B0B0B0';

function thinBorder(): Partial<ExcelJS.Borders> {
  const side: Partial<ExcelJS.Border> = { style: 'thin', color: { argb: BORDER_COLOR } };
  return { top: side, bottom: side, left: side, right: side };
}

function addShopHeader(sheet: ExcelJS.Worksheet, colCount: number, reportTitle: string) {
  const lastCol = colCount;

  // Row 1: Shop name
  const nameRow = sheet.addRow([STORE.name]);
  sheet.mergeCells(nameRow.number, 1, nameRow.number, lastCol);
  nameRow.getCell(1).font = { name: 'Calibri', size: 16, bold: true, color: { argb: BRAND_BLUE } };
  nameRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  nameRow.height = 28;

  // Row 2: Address
  const addrRow = sheet.addRow([STORE.address]);
  sheet.mergeCells(addrRow.number, 1, addrRow.number, lastCol);
  addrRow.getCell(1).font = { name: 'Calibri', size: 10, color: { argb: '444444' } };
  addrRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  // Row 3: GSTIN & Cell
  const gstRow = sheet.addRow([`GSTIN: ${STORE.gstin}  |  Cell: ${STORE.cell}`]);
  sheet.mergeCells(gstRow.number, 1, gstRow.number, lastCol);
  gstRow.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: '333333' } };
  gstRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  // Row 4: Report title
  const titleRow = sheet.addRow([reportTitle]);
  sheet.mergeCells(titleRow.number, 1, titleRow.number, lastCol);
  titleRow.getCell(1).font = { name: 'Calibri', size: 12, bold: true, color: { argb: BRAND_BLUE } };
  titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  titleRow.height = 22;

  // Row 5: Blank spacer
  sheet.addRow([]);
}

function styleHeaderRow(row: ExcelJS.Row, colCount: number) {
  for (let i = 1; i <= colCount; i++) {
    const cell = row.getCell(i);
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: HEADER_FONT } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BG } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = thinBorder();
  }
  row.height = 22;
}

function styleDataRows(sheet: ExcelJS.Worksheet, startRow: number, colCount: number) {
  sheet.eachRow((row, rowNum) => {
    if (rowNum < startRow) return;
    for (let i = 1; i <= colCount; i++) {
      const cell = row.getCell(i);
      cell.font = { name: 'Calibri', size: 10 };
      cell.border = thinBorder();
      cell.alignment = { vertical: 'middle' };
    }
  });
}

async function buildResponse(workbook: ExcelJS.Workbook, filename: string): Promise<NextResponse> {
  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get('type');

  if (type === 'bills') {
    return exportBills(searchParams.get('month') || '');
  }
  if (type === 'all-bills') {
    return exportAllBills();
  }
  if (type === 'products') {
    return exportProducts();
  }

  return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
}

async function exportBills(month: string) {
  const startDate = `${month}-01`;
  const [y, m] = month.split('-').map(Number);
  const endDate = `${y}-${String(m + 1).padStart(2, '0')}-01`;

  const { data: bills } = await supabase
    .from('bills')
    .select('*')
    .gte('date', startDate)
    .lt('date', endDate)
    .is('deleted_at', null)
    .order('date', { ascending: true });

  const rows = bills || [];

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Monthly Bills');

  const columns = ['Bill No', 'Date', 'Customer', 'Address', 'GSTIN', 'Subtotal', 'CGST', 'SGST', 'Total GST', 'Grand Total', 'Source', 'Remarks'];
  const colCount = columns.length;

  // Format month label
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const monthLabel = `${monthNames[m - 1]} ${y}`;

  addShopHeader(sheet, colCount, `Monthly Bills - ${monthLabel}`);

  const headerRow = sheet.addRow(columns);
  styleHeaderRow(headerRow, colCount);
  const dataStartRow = headerRow.number + 1;

  for (const b of rows) {
    sheet.addRow([
      b.bill_number, b.date, b.customer_name, b.customer_address || '', b.customer_gstin || '',
      b.subtotal, b.cgst_amount, b.sgst_amount, b.total_gst, b.grand_total,
      b.source, b.remarks || '',
    ]);
  }

  styleDataRows(sheet, dataStartRow, colCount);

  // Auto-fit column widths
  sheet.columns = [
    { width: 12 }, { width: 12 }, { width: 22 }, { width: 28 }, { width: 20 },
    { width: 12 }, { width: 10 }, { width: 10 }, { width: 12 }, { width: 14 },
    { width: 10 }, { width: 18 },
  ];

  // Number format for money columns
  for (let r = dataStartRow; r <= sheet.rowCount; r++) {
    for (const col of [6, 7, 8, 9, 10]) {
      sheet.getRow(r).getCell(col).numFmt = '#,##0.00';
    }
  }

  return buildResponse(workbook, `bills-${month}.xlsx`);
}

async function exportAllBills() {
  const { data: bills } = await supabase
    .from('bills')
    .select('*')
    .is('deleted_at', null)
    .order('date', { ascending: true })
    .limit(10000);

  const rows = bills || [];

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('All Bills');

  const columns = ['Bill No', 'Date', 'Customer', 'Address', 'GSTIN', 'Subtotal', 'CGST', 'SGST', 'Total GST', 'Grand Total', 'Source', 'Remarks'];
  const colCount = columns.length;

  addShopHeader(sheet, colCount, 'All Bills Backup');

  const headerRow = sheet.addRow(columns);
  styleHeaderRow(headerRow, colCount);
  const dataStartRow = headerRow.number + 1;

  for (const b of rows) {
    sheet.addRow([
      b.bill_number, b.date, b.customer_name, b.customer_address || '', b.customer_gstin || '',
      b.subtotal, b.cgst_amount, b.sgst_amount, b.total_gst, b.grand_total,
      b.source, b.remarks || '',
    ]);
  }

  styleDataRows(sheet, dataStartRow, colCount);

  sheet.columns = [
    { width: 12 }, { width: 12 }, { width: 22 }, { width: 28 }, { width: 20 },
    { width: 12 }, { width: 10 }, { width: 10 }, { width: 12 }, { width: 14 },
    { width: 10 }, { width: 18 },
  ];

  for (let r = dataStartRow; r <= sheet.rowCount; r++) {
    for (const col of [6, 7, 8, 9, 10]) {
      sheet.getRow(r).getCell(col).numFmt = '#,##0.00';
    }
  }

  return buildResponse(workbook, 'all-bills-backup.xlsx');
}

async function exportProducts() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('category')
    .order('name');

  const rows = products || [];

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Products');

  const columns = ['Name', 'Category', 'HSN', 'Price', 'GST %', 'Unit', 'Active'];
  const colCount = columns.length;

  addShopHeader(sheet, colCount, 'Products List');

  const headerRow = sheet.addRow(columns);
  styleHeaderRow(headerRow, colCount);
  const dataStartRow = headerRow.number + 1;

  for (const p of rows) {
    sheet.addRow([
      p.name, p.category, p.hsn_code, p.price, p.gst_percent, p.unit, p.is_active ? 'Yes' : 'No',
    ]);
  }

  styleDataRows(sheet, dataStartRow, colCount);

  sheet.columns = [
    { width: 30 }, { width: 14 }, { width: 12 }, { width: 12 }, { width: 8 }, { width: 10 }, { width: 8 },
  ];

  for (let r = dataStartRow; r <= sheet.rowCount; r++) {
    sheet.getRow(r).getCell(4).numFmt = '#,##0.00';
  }

  return buildResponse(workbook, 'products-export.xlsx');
}
