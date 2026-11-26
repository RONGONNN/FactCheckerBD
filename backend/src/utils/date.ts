/** The date in Bangladesh, which is what "today" and "tomorrow" in a claim refer to. */
export function dateInDhaka(now: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);
}

/** The Bangladesh date as YYYY-MM-DD, optionally some days ahead. */
export function isoDateInDhaka(now: Date, daysAhead = 0): string {
  const shifted = new Date(now.getTime() + daysAhead * 86_400_000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(shifted);
}

const RELATIVE_WORDS: Record<string, number> = {
  আজ: 0,
  আজকে: 0,
  আজকের: 0,
  today: 0,
  আগামীকাল: 1,
  আগামীকালের: 1,
  tomorrow: 1,
};

/** The day a claim points at with a word such as "tomorrow", or null. */
export function relativeClaimDate(claim: string, now: Date): string | null {
  // Whole words only: "আজ" is also part of unrelated words.
  const words = claim.toLowerCase().split(/[^\p{L}\p{M}]+/u);
  const word = words.find((item) => Object.hasOwn(RELATIVE_WORDS, item));
  return word === undefined ? null : isoDateInDhaka(now, RELATIVE_WORDS[word]);
}
