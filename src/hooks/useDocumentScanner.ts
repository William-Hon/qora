import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { supabase } from '../lib/supabaseClient';

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

  const extractTextFromCloud = async (file: File): Promise<string> => {
    // 1. Get session token
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    
    if (!token) {
        throw new Error('Sign in to use cloud OCR.');
    }

    setProgress(10); // Indicate start of upload

    // 2. Convert file to Base64
    const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read file.'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    setProgress(50); // Reading file complete, sending to server

    // 3. Call backend
    const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type,
            fileName: file.name
        })
    });

    setProgress(90); // Server responded

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Cloud OCR failed.');
    }

    setProgress(100);
    return data.extractedText;
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
        // Fallback to local OCR for this page to prevent eating cloud quotas
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

  const extractText = useCallback(async (file: File, scanType: 'typed' | 'handwritten' = 'typed'): Promise<string> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      let extractedText = '';
      if (file.type === 'application/pdf') {
        extractedText = await processPdf(file);
      } else {
        if (scanType === 'handwritten') {
          try {
            extractedText = await extractTextFromCloud(file);
          } catch (cloudErr: any) {
            console.warn('Cloud OCR failed, falling back to local Tesseract:', cloudErr);
            // If the error is an auth or limit error, we can either throw or fallback.
            // Let's fallback to Tesseract for resilience, but we might want to expose the limit error.
            // If it's a known limit error, maybe bubble it up instead?
            const errMsg = cloudErr.message || '';
            if (errMsg.includes('limit') || errMsg.includes('Sign in') || errMsg.includes('configured')) {
               throw cloudErr; // Let the user see the exact error for these specific cases
            }
            extractedText = await extractTextFromImage(file, (p) => setProgress(p));
          }
        } else {
          extractedText = await extractTextFromImage(file, (p) => setProgress(p));
        }
      }
      
      setIsProcessing(false);
      return extractedText;
    } catch (err: any) {
      console.error('Scan Error:', err);
      setError(err.message || 'Could not read the document clearly. Please try again.');
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
