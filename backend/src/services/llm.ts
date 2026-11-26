/** The two model operations the app needs. Tests provide their own implementation. */
export interface Citation {
  url: string;
  title: string;
  startIndex: number;
}

export interface SearchOutput {
  text: string;
  citations: Citation[];
}

export interface Prompt {
  instructions: string;
  input: string;
}

export interface LlmClient {
  search(prompt: Prompt, allowedDomains: string[]): Promise<SearchOutput>;
  /** Returns unvalidated JSON, or null when the model gave no usable answer. */
  analyze(prompt: Prompt): Promise<unknown>;
}
