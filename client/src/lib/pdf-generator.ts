import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Add type definition for jsPDF autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ReportSection {
  title: string;
  content: string | string[] | object;
}

interface PitchSlide {
  title: string;
  content: string | string[];
}

interface ReportData {
  id?: number;
  ventureId?: number;
  title?: string;
  fullReport?: any;
  pitchDeck?: any;
  elevatorPitch?: string;
  fullPitch?: string;
  createdAt?: string;
}

export const generatePDF = (reportData: ReportData): void => {
  const { title = 'Venture Report', fullReport = {}, pitchDeck = [], elevatorPitch = '', fullPitch = '' } = reportData;
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Helper for formatting content
  const formatContent = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    } else if (Array.isArray(content)) {
      return content.map((item, index) => `${index + 1}. ${item}`).join('\n');
    } else if (typeof content === 'object') {
      return Object.entries(content)
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}: ${formatContent(value)}`)
        .join('\n\n');
    }
    return String(content);
  };

  // Add title page
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Primary blue color
  doc.text(title, 105, 60, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(107, 114, 128); // Gray color
  doc.text('Venture Report', 105, 70, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 80, { align: 'center' });
  
  // Add company logo/branding
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('VentureForge', 105, 100, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text('AI-Powered Startup Ideation Tool', 105, 107, { align: 'center' });
  
  // Add page break
  doc.addPage();
  
  // Add table of contents
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Table of Contents', 14, 20);
  
  let y = 30;
  const sections = [
    'Executive Summary',
    'Venture Thesis',
    'Market Analysis',
    'Business Model',
    'Marketing Strategy',
    'Financial Projections',
    'Risk Assessment',
    'Pitch Materials'
  ];
  
  doc.setFontSize(12);
  sections.forEach((section, index) => {
    doc.text(`${index + 1}. ${section}`, 20, y);
    y += 10;
  });
  
  // Add page break
  doc.addPage();
  
  // Add full report content
  let pageNum = 3; // Starting from page 3 after title and TOC
  
  Object.entries(fullReport).forEach(([sectionKey, sectionContent]) => {
    // Format section title
    const sectionTitle = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1).replace(/([A-Z])/g, ' $1').trim();
    
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text(sectionTitle, 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const formattedContent = formatContent(sectionContent);
    
    // Split content into lines that fit on the page
    const textLines = doc.splitTextToSize(formattedContent, 180);
    
    // Check if content fits on current page
    if (textLines.length > 40) {
      // Add content in multiple pages if needed
      for (let i = 0; i < textLines.length; i += 40) {
        if (i > 0) {
          doc.addPage();
          pageNum++;
        }
        doc.text(textLines.slice(i, i + 40), 14, 30);
      }
    } else {
      doc.text(textLines, 14, 30);
    }
    
    // Add page break for next section
    doc.addPage();
    pageNum++;
  });
  
  // Add pitch materials
  doc.setFontSize(16);
  doc.setTextColor(59, 130, 246);
  doc.text('Pitch Materials', 14, 20);
  
  // Add elevator pitch
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Elevator Pitch (20 seconds)', 14, 30);
  
  doc.setFontSize(12);
  const elevatorPitchLines = doc.splitTextToSize(elevatorPitch, 180);
  doc.text(elevatorPitchLines, 14, 40);
  
  // Add full pitch
  doc.setFontSize(14);
  doc.text('Full Pitch (3 minutes)', 14, 70);
  
  doc.setFontSize(12);
  const fullPitchLines = doc.splitTextToSize(fullPitch, 180);
  
  // Check if full pitch fits on current page
  if ((70 + fullPitchLines.length * 7) > 280) {
    doc.addPage();
    pageNum++;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Full Pitch (3 minutes)', 14, 20);
    doc.setFontSize(12);
    doc.text(fullPitchLines, 14, 30);
  } else {
    doc.text(fullPitchLines, 14, 80);
  }
  
  // Add pitch deck slides
  doc.addPage();
  pageNum++;
  doc.setFontSize(16);
  doc.setTextColor(59, 130, 246);
  doc.text('Pitch Deck Slides', 14, 20);
  
  let slideY = 30;
  
  pitchDeck.forEach((slide: PitchSlide, index: number) => {
    // Check if we need a new page
    if (slideY > 240) {
      doc.addPage();
      pageNum++;
      slideY = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Slide ${index + 1}: ${slide.title}`, 14, slideY);
    
    doc.setFontSize(12);
    slideY += 10;
    
    // Format slide content
    const slideContent = formatContent(slide.content);
    const slideContentLines = doc.splitTextToSize(slideContent, 180);
    
    doc.text(slideContentLines, 14, slideY);
    slideY += (slideContentLines.length * 7) + 15; // Add spacing after each slide
  });
  
  // Add page numbers
  const totalPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, 105, 290, { align: 'center' });
  }
  
  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '_')}_Report.pdf`);
};
