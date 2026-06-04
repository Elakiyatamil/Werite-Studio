// src/engine/pdfExport.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Compiles the absolute-positioned DOM page divs and exports them as a print-ready A5 PDF.
 */
export async function exportToPDF(pageElements: HTMLElement[]): Promise<void> {
  if (pageElements.length === 0) return;

  // Show a loading overlay or just execute the PDF creation
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5', // A5 paperback dimensions (148mm x 210mm)
  });

  for (let i = 0; i < pageElements.length; i++) {
    const pageEl = pageElements[i];

    // Find and hide any edit controls/resize handles temporarily if they exist
    const dragHandles = pageEl.querySelectorAll('.resize-handle, .drag-indicator, .image-controls');
    dragHandles.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    try {
      const capturedCanvas = await html2canvas(pageEl, {
        scale: 2.5, // High resolution
        useCORS: true,
        backgroundColor: '#f5f0e8',
        logging: false,
      });

      const imgData = capturedCanvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, 148, 210);
    } catch (err) {
      console.error('Failed to render page to PDF', err);
    } finally {
      // Restore the handles
      dragHandles.forEach(el => {
        (el as HTMLElement).style.display = '';
      });
    }
  }

  pdf.save('manuscript.pdf');
}
