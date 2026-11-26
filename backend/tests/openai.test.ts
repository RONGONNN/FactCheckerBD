import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import OpenAI from 'openai';
import type { Response } from 'openai/resources/responses/responses';
import { activeSources } from '../src/config/sources.js';
import { extractSearchOutput, parseJson, toUpstreamError } from '../src/services/openai.service.js';
import { collectSources } from '../src/services/search.service.js';

describe('OpenAI adapter', () => {
  it('reads citations and the line each one belongs to', () => {
    const text = 'Intro line\nThe ministry denied it.';
    const citation = {
      type: 'url_citation',
      url: 'https://en.prothomalo.com/a',
      title: 'A',
      start_index: text.indexOf('denied'),
      end_index: text.length,
    };
    const output = [
      { type: 'web_search_call' },
      {
        type: 'message',
        content: [
          { type: 'output_text', text: 'First part', annotations: [] },
          { type: 'output_text', text, annotations: [citation] },
        ],
      },
    ] as unknown as Response['output'];

    const [source] = collectSources(extractSearchOutput(output), activeSources);
    assert.equal(source?.publisher, 'Prothom Alo');
    assert.deepEqual(source?.findings, ['The ministry denied it.']);
  });

  it('rejects sponsored sections of an approved news site', () => {
    const approved = (url: string) =>
      collectSources({ text: 'x', citations: [{ url, title: 't', startIndex: 0 }] }, activeSources);
    assert.equal(approved('https://www.bbc.com/storyworks/travel/page').length, 0);
    assert.equal(approved('https://www.bbc.com/news/articles/page').length, 1);
  });

  it('returns null for text that is not JSON', () => {
    assert.equal(parseJson('not json'), null);
  });

  it('maps a timeout to 504', () => {
    assert.equal(toUpstreamError(new OpenAI.APIConnectionTimeoutError()).status, 504);
  });

  it('maps a rejected key to 503 without logging the provider message', (t) => {
    const log = t.mock.method(console, 'error', () => {});
    const error = new OpenAI.APIError(401, undefined, 'Incorrect key sk-abc', new Headers());
    assert.equal(toUpstreamError(error).status, 503);
    assert.ok(!JSON.stringify(log.mock.calls.map((call) => call.arguments)).includes('sk-abc'));
  });
});
