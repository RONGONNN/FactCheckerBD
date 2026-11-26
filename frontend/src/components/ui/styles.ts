// Shared class names, so cards, buttons and focus rings look the same everywhere.
export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

export const card =
  'rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(12,45,107,0.07)]';

export const primaryButton = `inline-flex items-center justify-center rounded-full bg-accent-strong px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover disabled:opacity-60 ${focusRing}`;

export const secondaryButton = `inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-navy transition-colors hover:border-navy/30 hover:bg-blue-50 ${focusRing}`;

export const mutedText = 'text-sm text-slate-600';

export const field = `w-full rounded-xl border border-slate-200 bg-white p-3 font-normal text-slate-900 ${focusRing}`;

export const pageTitle = 'text-2xl font-extrabold text-navy md:text-3xl';

export const sectionTitle = 'text-xl font-extrabold text-navy md:text-2xl';
