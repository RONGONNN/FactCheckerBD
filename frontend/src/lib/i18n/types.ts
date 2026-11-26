import type { ApiErrorKind } from '../api/client';
import type { Source, Verdict } from '../../types/api';

export interface Messages {
  tagline: string;
  nav: {
    dashboard: string;
    history: string;
    sources: string;
    howItWorks: string;
    about: string;
    privacy: string;
    feedback: string;
    menu: string;
  };
  stats: {
    heading: string;
    total: string;
    byVerdict: string;
    recent: string;
    empty: string;
    allHistory: string;
    localOnly: string;
  };
  history: {
    title: string;
    search: string;
    filter: string;
    allVerdicts: string;
    empty: string;
    noMatch: string;
    remove: string;
    removeAll: string;
    confirmRemoveAll: string;
    cancel: string;
    limit: string;
  };
  sourcesPage: { title: string; intro: string; loading: string; retry: string; empty: string };
  feedback: {
    title: string;
    intro: string;
    resultTitle: string;
    rating: string;
    message: string;
    submit: string;
    sending: string;
    thanks: string;
    ratingRequired: string;
    noPersonalInfo: string;
  };
  switchLanguage: string;
  claim: {
    heading: string;
    label: string;
    placeholder: string;
    submit: string;
    examplesTitle: string;
    suggestedTitle: string;
    suggesting: string;
    examples: string[];
    empty: string;
  };
  disclaimer: string;
  progress: { searching: string; analyzing: string; note: string; cancel: string };
  errors: Record<ApiErrorKind, string>;
  result: {
    claim: string;
    explanation: string;
    supporting: string;
    contradicting: string;
    noEvidence: string;
    factcheckSources: string;
    newsSources: string;
    noSources: string;
    source: string;
    checkedAt: string;
    warning: string;
    another: string;
    loading: string;
    missingTitle: string;
    missingText: string;
  };
  verdicts: Record<Verdict, string>;
  sourceTypes: Record<Source['type'], string>;
}
