import { NextResponse } from 'next/server';
const PDFParser = require('pdf2json');

interface ParsedTransaction {
  date: string;
  description: string;
  amount: string;
  isDeposit: boolean;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const text = await new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);
        pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
        pdfParser.parseBuffer(buffer);
    });

    const lines = text.split('\n');
    const transactions: ParsedTransaction[] = [];
    let currentTxn: ParsedTransaction | null = null;

    const dateRegex = /^(\d{2}[-/][a-zA-Z]{3}[-/]\d{2,4}|\d{2}[-/]\d{2}[-/]\d{2,4})(?:\s+(.*))?$/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\r/g, '').trim();
      if (!line || line === '----------------Page (0) Break----------------') continue;

      const dateMatch = line.match(dateRegex);
      if (dateMatch) {
        if (currentTxn) {
          transactions.push(currentTxn);
        }

        currentTxn = {
          date: dateMatch[1],
          description: "",
          amount: "",
          isDeposit: false
        };

        const remaining = dateMatch[2] || "";
        const numbersMatch = remaining.match(/^(.*?)\s*([\d,]+\.\d{2})\s+([\d,]+\.\d{2})$/);

        if (numbersMatch) {
           currentTxn.description = numbersMatch[1].trim() + " ";
           currentTxn.amount = numbersMatch[2];
        } else {
           currentTxn.description = remaining + " ";
        }
      } else if (currentTxn) {
        if (!line.startsWith('page ') && !line.startsWith('Statement for') && !line.startsWith('Chq:')) {
           currentTxn.description += line + " ";
        }
      }
    }

    if (currentTxn) {
      transactions.push(currentTxn);
    }

    // Determine deposits
    transactions.forEach(t => {
       if (t.description.includes('/CR/') || t.description.includes('CREDIT') || t.description.includes('NEFT') || t.description.includes('IMPS') || t.description.includes('RTGS')) {
           t.isDeposit = true;
       }
    });

    let deposits = transactions.filter(t => t.isDeposit || (!t.description.includes('/DR/') && !t.description.includes('WITHDRAWAL') && !t.description.includes('INSTALLMENT')));

    if (deposits.length === 0 && transactions.length > 0) {
       deposits = transactions;
    }

    if (deposits.length === 0) {
       return NextResponse.json({
          error: 'No transactions found in this PDF.'
       }, { status: 400 });
    }

    return NextResponse.json({ transactions: deposits });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to parse PDF';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
