import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import type { Response } from 'openai/resources/responses/responses';
import { analysisSchema } from '../schemas/analysis.schema.js';
import { AppError } from '../utils/AppError.js';
import type { LlmClient, SearchOutput } from './llm.js';

const TIMEOUT_MS = 60_000;
const UNAVAILABLE_MESSAGE = 'Claim checking is not available right now.';

export interface Usage {
  step: 'search' | 'analyze';
  inputTokens: number;
  outputTokens: number;
  searchCalls: number;
}

export function extractSearchOutput(output: Response['output']): SearchOutput {
  const result: SearchOutput = { text: '', citations: [] };

  for (const item of output) {
    if (item.type !== 'message') continue;
    for (const part of item.content) {
      if (part.type !== 'output_text') continue;
      // Citation positions are relative to their own part.
      const offset = result.text.length;
      for (const annotation of part.annotations) {
        if (annotation.type !== 'url_citation') continue;
        const { url, title, start_index } = annotation;
        result.citations.push({ url, title, startIndex: offset + start_index });
      }
      result.text += `${part.text}\n`;
    }
  }

  return result;
}

export function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Only the status and code are logged: provider messages can echo part of the API key.
export function toUpstreamError(error: unknown): AppError {
  if (error instanceof OpenAI.APIConnectionTimeoutError) {
    return new AppError(504, 'UPSTREAM_ERROR', 'The check took too long. Please try again.');
  }
  if (error instanceof OpenAI.APIError) {
    console.error(`OpenAI request failed: status=${error.status} code=${error.code}`);
    const unavailable = [401, 403, 429].includes(error.status ?? 0);
    return new AppError(unavailable ? 503 : 502, 'UPSTREAM_ERROR', UNAVAILABLE_MESSAGE);
  }
  console.error(`OpenAI call failed: ${error instanceof Error ? error.name : 'unknown error'}`);
  return new AppError(502, 'UPSTREAM_ERROR', UNAVAILABLE_MESSAGE);
}

export function createOpenAiClient(
  apiKey: string,
  model: string,
  onUsage: (usage: Usage) => void = () => {},
): LlmClient {
  const client = new OpenAI({ apiKey, timeout: TIMEOUT_MS, maxRetries: 1 });

  async function request(
    step: Usage['step'],
    params: Omit<OpenAI.Responses.ResponseCreateParamsNonStreaming, 'model' | 'store'>,
  ) {
    try {
      // store: false keeps visitors' claims out of the provider's response storage.
      const response = await client.responses.create({ ...params, model, store: false });
      onUsage({
        step,
        inputTokens: response.usage?.input_tokens ?? 0,
        outputTokens: response.usage?.output_tokens ?? 0,
        searchCalls: response.output.filter((item) => item.type === 'web_search_call').length,
      });
      return response;
    } catch (error) {
      throw toUpstreamError(error);
    }
  }

  return {
    async search(prompt, allowedDomains) {
      const response = await request('search', {
        ...prompt,
        tool_choice: 'required',
        tools: [
          {
            type: 'web_search',
            filters: { allowed_domains: allowedDomains },
            user_location: { type: 'approximate' },
          },
        ],
      });
      return extractSearchOutput(response.output);
    },

    async analyze(prompt) {
      const response = await request('analyze', {
        ...prompt,
        text: { format: zodTextFormat(analysisSchema, 'analysis') },
      });
      return parseJson(response.output_text);
    },
  };
}
