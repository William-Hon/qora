import React, { useState, useEffect, useRef } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useDocumentScanner } from '../hooks/useDocumentScanner';
import '../styles/PromptCard.css';

interface PromptCardProps {
  prompt: string;
  onContinue: (response: string, source: string) => void;
  onBack?: () => void;
  initialResponse?: string;
  isLast?: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onContinue, onBack, initialResponse = '', isLast = false }) => {
  const [response, setResponse] = useState(initialResponse);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [usedSource, setUsedSource] = useState<string>('typed');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSpeechResult = (text: string) => {
    setUsedSource('voice');
    setResponse(prev => {
      const current = prev.trim();
      return current ? `${current} ${text}` : text;
    });
  };

  const {
    isListening,
    isSupported,
    interimTranscript,
    toggleListening
  } = useSpeechToText(handleSpeechResult);

  const {
    isProcessing,
    progress,
    error: scanError,
    extractText,
    resetScanner
  } = useDocumentScanner();

  const clearImagePreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setPendingFile(null);
    resetScanner();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset response when prompt or initialResponse changes
  useEffect(() => {
    setResponse(initialResponse);
    setUsedSource('typed');
    clearImagePreview();
  }, [prompt, initialResponse]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setPendingFile(file);
    } else {
      // Clear any existing preview for PDFs
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      // Process PDFs immediately
      processFile(file, 'typed');
    }
  };

  const processFile = async (file: File, scanType: 'typed' | 'handwritten') => {
    setPendingFile(null);
    setUsedSource('photo');
    try {
      const extractedText = await extractText(file, scanType);
      if (extractedText) {
        setResponse(prev => {
          const current = prev.trim();
          return current ? `${current}\n\n${extractedText}` : extractedText;
        });
      }
    } catch (err) {
      // Error is handled in the hook and exposed as scanError
    }
  };

  const handleContinue = () => {
    if (response.trim()) {
      onContinue(response.trim(), usedSource);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (response.trim()) {
        handleContinue();
      }
    }
  };

  return (
    <div className="prompt-card flex-col fade-in">
      <h2 className="prompt-text">{prompt}</h2>
      
      <div className="textarea-container flex-col">
        {imagePreview && (
          <div className="ocr-preview-container">
            <img src={imagePreview} alt="Scanned reflection" className="ocr-preview-image" />
            <button className="ocr-clear-btn" onClick={clearImagePreview} title="Remove image">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
        )}

        {pendingFile && (
          <div className="scan-type-prompt fade-in">
            <p>Is this document typed or handwritten?</p>
            <div className="scan-type-buttons">
              <button className="primary-btn" onClick={() => processFile(pendingFile, 'typed')}>Typed</button>
              <button className="primary-btn outline" onClick={() => processFile(pendingFile, 'handwritten')}>Handwritten</button>
            </div>
          </div>
        )}
        
        {isProcessing && (
          <div className="ocr-status loading">
            <p>Reading document... {progress > 0 ? `${progress}%` : ''}</p>
          </div>
        )}
        
        {scanError && (
          <div className="ocr-status error">
            <p>{scanError}</p>
          </div>
        )}

        <textarea
          className="prompt-textarea"
          placeholder="Type your thoughts here..."
          value={response}
          onChange={(e) => {
             setResponse(e.target.value);
             // If user starts typing normally, we could assume 'typed', but let's leave it as what it was initialized/set to
             if (!usedSource) setUsedSource('typed');
          }}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={!!pendingFile || isProcessing}
        />
        {isListening && interimTranscript && (
          <p className="interim-text">{interimTranscript}</p>
        )}
        
        <div className="input-actions row">
          <div className="media-actions">
            {isSupported ? (
              <button 
                className={`action-btn mic-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
                title="Dictate with voice"
                disabled={!!pendingFile || isProcessing}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
                <span className="action-btn-text">{isListening ? 'Listening...' : 'Dictate'}</span>
              </button>
            ) : (
              <p className="unsupported-msg">Voice input is not supported in this browser.</p>
            )}

            <button
              className={`action-btn scan-btn ${isProcessing || pendingFile ? 'processing' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing || !!pendingFile}
              title="Scan Reflection or Document"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <span className="action-btn-text">Scan Document</span>
            </button>
            <input
              type="file"
              accept="image/*,application/pdf"
              capture="environment"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          <div className="button-group">
            {onBack && (
              <button 
                className="back-btn"
                onClick={onBack}
                disabled={!!pendingFile || isProcessing}
              >
                Back
              </button>
            )}
            <button 
              className="continue-btn"
              onClick={handleContinue}
              disabled={!response.trim() || !!pendingFile || isProcessing}
            >
              {isLast ? 'Complete' : 'Continue'}
              <span className="shortcut-hint"> (Ctrl + Enter)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
