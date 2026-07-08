import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export const useDocumentScanner = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const extractTextFromImage = async (file: File, updateProgress: (p: number) => void): Promise<string> => {
    const result = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            updateProgress(Math.round(m.progress * 100));
          }
        }
      }
    );
    return result.data.text.trim();
  };

  const processPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const numPages = pdf.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        // @ts-ignore
        .map((item) => item.str)
        .join(' ')
        .trim();

      if (pageText) {
        // Native text found
        fullText += pageText + '\n\n';
        setProgress(Math.round((pageNum / numPages) * 100));
      } else {
        // Fallback to OCR for this page
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          // @ts-ignore
          await page.render({ canvasContext: context, viewport }).promise;
          
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
          
          if (blob) {
            const fileFromBlob = new File([blob], `page-${pageNum}.png`, { type: 'image/png' });
            
            const ocrText = await extractTextFromImage(fileFromBlob, (p) => {
               const baseProgress = ((pageNum - 1) / numPages) * 100;
               const pageProgress = (p / 100) * (100 / numPages);
               setProgress(Math.round(baseProgress + pageProgress));
            });
            fullText += ocrText + '\n\n';
          }
        }
      }
    }
    
    return fullText.trim();
  };

  const extractText = useCallback(async (file: File): Promise<string> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      let extractedText = '';
      if (file.type === 'application/pdf') {
        extractedText = await processPdf(file);
      } else {
        extractedText = await extractTextFromImage(file, (p) => setProgress(p));
      }
      
      setIsProcessing(false);
      return extractedText;
    } catch (err: any) {
      console.error('Scan Error:', err);
      setError('Could not read the document clearly. Please try again.');
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const resetScanner = useCallback(() => {
    setIsProcessing(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    isProcessing,
    progress,
    error,
    extractText,
    resetScanner
  };
};
