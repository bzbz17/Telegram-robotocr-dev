import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, X, LoaderCircle, Copy, Check, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

const OcrBot: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [extractedText, setExtractedText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const isProcessing = useMemo(() => status === 'uploading' || status === 'processing', [status]);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      // Validate file type
      const fileType = files[0].type;
      if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
        setFile(files[0]);
        setStatus('idle');
        setError('');
        setExtractedText('');
      } else {
        setError('Invalid file type. Please upload a PDF, PNG, or JPG file.');
        setFile(null);
      }
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e, false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files);
    }
  };

  const clearFile = () => {
    setFile(null);
    setStatus('idle');
    setExtractedText('');
    setError('');
  };

  const handleExtractText = async () => {
    if (!file) return;

    setStatus('uploading');
    setError('');
    setExtractedText('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // This is a mock API call. Replace with your actual API endpoint.
      // The API URL is read from the .env file.
      const apiUrl = import.meta.env.VITE_API_URL;
      
      if (!apiUrl || apiUrl === "YOUR_API_URL") {
        setError("API URL is not configured. Please set VITE_API_URL in your .env file.");
        setStatus('error');
        // Simulate processing for demonstration purposes
        console.warn("API URL not configured. Simulating API call.");
        await new Promise(resolve => setTimeout(resolve, 2000));
        setExtractedText("این یک متن نمونه است که از فایل استخراج شده است. لطفاً API خود را برای دریافت نتایج واقعی متصل کنید.");
        setStatus('success');
        return;
      }
      
      setStatus('processing');
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setExtractedText(response.data.text);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setError('Failed to extract text. Please try again.');
      setStatus('error');
      // Set mock data on error for demonstration
      setExtractedText("خطا در پردازش فایل. این یک متن نمونه برای نمایش است.");
    }
  };

  const handleCopy = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl shadow-slate-950/50 border border-slate-700 overflow-hidden">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Telegram Bot OCR
          </h1>
          <p className="text-slate-400 mt-2">
            Upload a PDF or image file to extract Persian text.
          </p>
        </div>

        {/* File Upload */}
        {!file ? (
          <label
            onDragEnter={(e) => handleDragEvents(e, true)}
            onDragLeave={(e) => handleDragEvents(e, false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-indigo-500 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
              <p className="mb-2 text-sm text-slate-400">
                <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-500">PDF, PNG, or JPG</p>
            </div>
            <input type="file" className="hidden" accept=".pdf,image/png,image/jpeg" onChange={(e) => handleFileChange(e.target.files)} />
          </label>
        ) : (
          <div className="w-full p-4 bg-slate-700/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-indigo-400" />
              <span className="text-sm font-medium text-slate-200 truncate">{file.name}</span>
            </div>
            <button onClick={clearFile} disabled={isProcessing} className="p-1 text-slate-400 hover:text-red-400 transition-colors rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
            </div>
        )}

        {/* Action Button */}
        {file && (
          <div className="mt-6 text-center">
            <button
              onClick={handleExtractText}
              disabled={isProcessing}
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {isProcessing ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5" />
                  <span>{status === 'uploading' ? 'Uploading...' : 'Processing...'}</span>
                </>
              ) : (
                'Extract Text'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Result Display */}
      {(status === 'success' || (status === 'error' && extractedText)) && (
        <div className="bg-slate-900/70 p-6 md:p-8 border-t border-slate-700">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-slate-200">Extracted Text</h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
            >
              {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={extractedText}
            className="w-full h-48 p-3 bg-slate-800 border border-slate-700 rounded-md text-slate-300 font-mono text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            placeholder="Extracted text will appear here..."
            dir="rtl"
          />
        </div>
      )}
    </div>
  );
};

export default OcrBot;
