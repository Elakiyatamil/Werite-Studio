// src/engine/pdfExport.ts
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportToPDF(
  pageEls: HTMLElement[],
  preset: { w: number; h: number }
) {
  // A5 = 148×210mm. Scale px→mm: 148/560 = 0.264285
  const mmW = (preset.w / 560) * 148
  const mmH = (preset.h / 794) * 210
  
  const pdf = new jsPDF({
    unit: 'mm',
    format: [mmW, mmH],
    orientation: 'portrait',
  })

  for (let i = 0; i < pageEls.length; i++) {
    if (i > 0) {
      pdf.addPage([mmW, mmH])
    }
    const canvas = await html2canvas(pageEls[i], {
      scale: 2,
      backgroundColor: '#f5f0e8',
      useCORS: true,
      logging: false,
    })
    const img = canvas.toDataURL('image/jpeg', 0.95)
    pdf.addImage(img, 'JPEG', 0, 0, mmW, mmH)
  }

  pdf.save('werite-manuscript.pdf')
}
