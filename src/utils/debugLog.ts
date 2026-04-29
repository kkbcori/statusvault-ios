// ═══════════════════════════════════════════════════════════════
// StatusVault — In-app debug log buffer
// ───────────────────────────────────────────────────────────────
// Captures log messages so the in-app debug screen can display
// them. Use this anywhere we currently console.log or console.warn
// for diagnostic purposes — the message goes to BOTH the JS console
// and to this buffer.
//
// Buffer is bounded to last 200 entries to avoid memory bloat.
// ═══════════════════════════════════════════════════════════════

export interface DebugLogEntry {
  ts: number;             // epoch ms
  level: 'log' | 'warn' | 'error';
  message: string;
}

const BUFFER_LIMIT = 200;
const buffer: DebugLogEntry[] = [];
const subscribers: Array<() => void> = [];

function format(args: any[]): string {
  return args.map(a => {
    if (typeof a === 'string') return a;
    try { return JSON.stringify(a); } catch { return String(a); }
  }).join(' ');
}

function push(level: DebugLogEntry['level'], args: any[]) {
  buffer.push({ ts: Date.now(), level, message: format(args) });
  while (buffer.length > BUFFER_LIMIT) buffer.shift();
  subscribers.forEach(fn => { try { fn(); } catch {} });
}

/** Public API: log to buffer + console */
export const dlog = (...args: any[]) => { push('log', args); console.log(...args); };
export const dwarn = (...args: any[]) => { push('warn', args); console.warn(...args); };
export const derror = (...args: any[]) => { push('error', args); console.error(...args); };

/** Read the current buffer (most recent first) */
export const getDebugLogs = (): DebugLogEntry[] => [...buffer].reverse();

/** Subscribe to buffer changes; returns unsubscribe fn */
export const subscribeToLogs = (fn: () => void): (() => void) => {
  subscribers.push(fn);
  return () => {
    const idx = subscribers.indexOf(fn);
    if (idx !== -1) subscribers.splice(idx, 1);
  };
};

/** Clear the buffer */
export const clearDebugLogs = () => {
  buffer.length = 0;
  subscribers.forEach(fn => { try { fn(); } catch {} });
};
