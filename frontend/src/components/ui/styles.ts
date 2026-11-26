// Shared class names, so cards, buttons and focus rings look the same everywhere.
export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

export const card =
  'rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900';

export const primaryButton = `inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800 disabled:opacity-60 ${focusRing}`;

export const secondaryButton = `inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 ${focusRing}`;

export const mutedText = 'text-sm text-slate-600 dark:text-slate-400';

export const field = `w-full rounded-lg border border-slate-300 bg-white p-3 font-normal dark:border-slate-700 dark:bg-slate-900 ${focusRing}`;
