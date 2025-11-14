import OcrBot from './components/OcrBot';
import { Info } from 'lucide-react';

const InfoBox = () => (
    <div className="w-full max-w-2xl mt-8 p-4 bg-sky-900/50 border border-sky-700 rounded-lg text-sm text-sky-200">
      <div className="flex items-start gap-3">
        <Info className="flex-shrink-0 mt-0.5 text-sky-400" size={20} />
        <div>
          <h3 className="font-semibold text-sky-300 mb-1">How This Works</h3>
          <p className="text-slate-300">This is a frontend interface. To extract text, it must connect to a backend (server-side) application that you provide.</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
            <li>Your backend service will perform the OCR (text extraction).</li>
            <li>This frontend will send the uploaded file to your backend's URL.</li>
            <li>Please set this URL in the <code>.env</code> file under the variable <code>VITE_API_URL</code>.</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">Note: A Telegram Bot Token is for your backend service; it cannot be used directly in this frontend application for security reasons.</p>
        </div>
      </div>
    </div>
);

function App() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <OcrBot />
      <InfoBox />
      <footer className="text-center py-4 mt-8 text-slate-500 text-sm">
        <p>
          Designed by Dualite Alpha &copy; 2025
        </p>
      </footer>
    </main>
  );
}

export default App;
