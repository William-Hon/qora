import React, { useState, useEffect, useRef } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useDocumentScanner } from '../hooks/useDocumentScanner';
import { supabase } from '../lib/supabaseClient';
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
  const [usedSource, setUsedSource] = useState<string>('typed');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingScanType, setPendingScanType] = useState<'typed' | 'handwritten'>('typed');
  const [remainingScans, setRemainingScans] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchQuota = async () => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0,0,0,0);
      
      const { count, error } = await supabase
        .from('ocr_usage_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString());
        
      if (!error && count !== null) {
         setRemainingScans(Math.max(0, 5 - count));
      } else {
         setRemainingScans(0);
      }
    } catch (err) {
      setRemainingScans(0);
    }
  };

  const handleUploadClick = () => {
    fetchQuota();
    setShowUploadModal(true);
  };

  const handleScanTypeSelect = (type: 'typed' | 'handwritten') => {
    setPendingScanType(type);
    setShowUploadModal(false);
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, 10);
  };

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
    setShowUploadModal(false);
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
    } else {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
    }

    processFile(file, pendingScanType);
  };

  const processFile = async (file: File, scanType: 'typed' | 'handwritten') => {
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

        {showUploadModal && (
          <div className="upload-modal fade-in">
            <p>What kind of document is this?</p>
            <div className="upload-modal-buttons">
              <button 
                className="primary-btn" 
                onClick={() => handleScanTypeSelect('typed')}
              >
                <strong>Typed Entry</strong>
                <span>Unlimited uploads</span>
              </button>
              
              <button 
                className="primary-btn outline" 
                onClick={() => handleScanTypeSelect('handwritten')}
                disabled={remainingScans === 0}
              >
                <strong>Handwritten</strong>
                <span>
                  {remainingScans === null ? 'Loading...' : `${remainingScans} uploads left today`}
                </span>
              </button>
            </div>
            <button className="text-btn cancel-btn" onClick={() => setShowUploadModal(false)}>Cancel</button>
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
             if (!usedSource) setUsedSource('typed');
          }}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={showUploadModal || isProcessing}
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
                disabled={showUploadModal || isProcessing}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              className={`action-btn scan-btn ${isProcessing || showUploadModal ? 'processing' : ''}`}
              onClick={handleUploadClick}
              disabled={isProcessing || showUploadModal}
              title="Upload Entry"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" x2="12" y1="3" y2="15"/>
              </svg>
              <span className="action-btn-text">Upload Entry</span>
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
                disabled={showUploadModal || isProcessing}
              >
                Back
              </button>
            )}
            <button 
              className="continue-btn"
              onClick={handleContinue}
              disabled={!response.trim() || showUploadModal || isProcessing}
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
