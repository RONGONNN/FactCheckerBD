import type { Source } from '../config/sources.js';
import { findSource, normalizeUrl, stripLinks } from '../utils/url.js';
import type { LlmClient, SearchOutput } from './llm.js';
import { buildSearchPrompt } from './prompts.js';

const MAX_SOURCES = 12;

export interface RetrievedSource {
  id: number;
  title: string;
  publisher: string;
  type: Source['type'];
  url: string;
  /** Lines of the search report that cite this page. */
  findings: string[];
}

function lineAt(text: string, index: number): string {
  const start = text.lastIndexOf('\n', index) + 1;
  const end = text.indexOf('\n', index);
  return stripLinks(text.slice(start, end === -1 ? text.length : end));
}

/** Keeps only approved pages, merged by URL. */
export function collectSources(output: SearchOutput, approved: Source[]): RetrievedSource[] {
  const byUrl = new Map<string, RetrievedSource>();

  for (const citation of output.citations) {
    const url = normalizeUrl(citation.url);
    const source = url ? findSource(url, approved) : undefined;
    if (!url || !source) continue;

    let entry = byUrl.get(url);
    if (!entry) {
      if (byUrl.size >= MAX_SOURCES) continue;
      entry = {
        id: byUrl.size + 1,
        title: citation.title || source.name,
        publisher: source.name,
        type: source.type,
        url,
        findings: [],
      };
      byUrl.set(url, entry);
    }

    const finding = lineAt(output.text, citation.startIndex);
    if (finding && !entry.findings.includes(finding)) entry.findings.push(finding);
  }

  return [...byUrl.values()];
}

export async function searchEvidence(
  claim: string,
  llm: LlmClient,
  approved: Source[],
  today: string,
): Promise<RetrievedSource[]> {
  const domains = [...new Set(approved.map((source) => source.domain))];
  const output = await llm.search(buildSearchPrompt(claim, today), domains);
  return collectSources(output, approved);
}
