import React, { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * Live QR scanner component using html5-qrcode.
 * Emits decoded text via onScan callback.
 * @param {Function} props.onScan  - Called with decoded QR string
 * @param {string[]} props.logs    - Array of past scan log strings
 * @param {string}   props.title  - Section heading
 */
const QRScanner = ({ onScan, logs = [], title = 'Live QR Scanner' }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    let scanner;
    (async () => {
      const { Html5QrcodeScanner } = await import('html5-qrcode');
      scanner = new Html5QrcodeScanner(
        'qr-reader-box',
        { qrbox: { width: 250, height: 250 }, fps: 5 },
        false
      );
      scanner.render(
        (decoded) => { if (onScan) onScan(decoded); },
        () => {}
      );
    })();
    return () => { scanner?.clear().catch(() => {}); };
  }, []);

  return (
    <section aria-label={title} className="p-10 max-w-6xl mx-auto animate-in fade-in">
      <h1 className="text-3xl font-cyber dark:text-white mb-2">{title}</h1>
      <p className="text-slate-500 font-mono mb-8 dark:text-cyber-primary">
        Point camera at student QR code to verify and check in
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Camera feed */}
        <div className="lg:col-span-1 border-2 border-dashed border-slate-300 dark:border-cyber-primary/50 rounded-3xl dark:rounded-none flex flex-col items-center p-6 bg-slate-50 dark:bg-black/30">
          <div
            id="qr-reader-box"
            ref={scannerRef}
            aria-label="QR code scanner camera feed"
            className="w-full bg-white dark:bg-black/80 rounded-xl dark:rounded-none overflow-hidden"
          />
        </div>

        {/* Scan log */}
        <div className="lg:col-span-2 bento-card p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-cyber-border flex justify-between items-center bg-slate-50 dark:bg-black/80">
            <h3 className="font-bold dark:text-white font-cyber">Live scan log</h3>
            <span className="badge-tag shadow-none text-[10px]">Firestore Sync Active</span>
          </div>
          {logs.length === 0 ? (
            <p className="p-6 text-slate-400 dark:text-slate-600 font-mono text-sm">
              Waiting for first scan…
            </p>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className="p-4 border-b border-slate-50 dark:border-cyber-border/30 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500" aria-hidden="true" />
                  <span className="font-bold dark:text-slate-300 text-sm">{log}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default QRScanner;
