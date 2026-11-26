import type { Language } from '../../types/api';
import { bn } from './bn';
import { en } from './en';
import type { Messages } from './types';

export type { Messages } from './types';

export const messages: Record<Language, Messages> = { bn, en };
