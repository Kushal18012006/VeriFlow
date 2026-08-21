/**
 * Deterministic UTC Date Formatter for React SSR & Hydration Safety
 * 
 * Prevents "Text content does not match server-rendered HTML" errors caused by
 * locale or timezone discrepancies between Node.js server and client browser.
 */

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDateUTC(isoString: string | Date): string {
  if (!isoString) return '';
  const d = typeof isoString === 'string' ? new Date(isoString) : isoString;
  if (isNaN(d.getTime())) return String(isoString);
  const month = MONTH_NAMES[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

export function formatDateTimeUTC(isoString: string | Date): string {
  if (!isoString) return '';
  const d = typeof isoString === 'string' ? new Date(isoString) : isoString;
  if (isNaN(d.getTime())) return String(isoString);
  const month = MONTH_NAMES[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  return `${month} ${day}, ${year} at ${hours}:${minutes} UTC`;
}
