import OcrBot from './components/OcrBot';

function App() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <OcrBot />
      <footer className="text-center py-4 mt-8 text-slate-500 text-sm">
        <p>
          Designed by Dualite Alpha &copy; 2025
        </p>
      </footer>
    </main>
  );
}

export default App;
