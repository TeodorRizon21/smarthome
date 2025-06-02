import { renderToBuffer } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/pdf/InvoicePDF';
import { ReactElement } from 'react';

export async function generateInvoicePDF(order: any) {
  try {
    const pdfBuffer = await renderToBuffer(InvoicePDF({ order }) as ReactElement);
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
} 