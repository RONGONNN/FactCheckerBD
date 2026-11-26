'use client';

import { useState, type FormEvent } from 'react';
import { ApiError, sendFeedback, type ApiErrorKind } from '../../../lib/api/client';
import { formatNumber } from '../../../lib/format';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { MAX_FEEDBACK_LENGTH } from '../../../types/api';
import { card, field, mutedText, primaryButton } from '../../ui/styles';
import { RatingInput } from './RatingInput';

type Status = 'idle' | 'sending' | 'sent' | 'ratingRequired' | ApiErrorKind;

export function FeedbackForm({ title, checkId }: { title: string; checkId?: string }) {
  const { t, language } = useLanguage();
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (rating === null) {
      setStatus('ratingRequired');
      return;
    }
    setStatus('sending');
    try {
      await sendFeedback({ rating, message: message.trim() || undefined, checkId });
      setStatus('sent');
    } catch (error) {
      setStatus(error instanceof ApiError ? error.kind : 'unexpected');
    }
  }

  if (status === 'sent') {
    return (
      <p role="status" className={card}>
        {t.feedback.thanks}
      </p>
    );
  }

  let problem: string | null = null;
  if (status === 'ratingRequired') problem = t.feedback.ratingRequired;
  else if (status !== 'idle' && status !== 'sending') problem = t.errors[status];

  return (
    <form onSubmit={handleSubmit} noValidate className={`${card} flex flex-col gap-3`}>
      <h2 className="font-semibold">{title}</h2>
      <RatingInput
        legend={t.feedback.rating}
        value={rating}
        format={(value) => formatNumber(value, language)}
        onChange={(value) => {
          setRating(value);
          setStatus('idle');
        }}
      />
      <label className="flex flex-col gap-1 text-sm font-medium">
        {t.feedback.message}
        <textarea
          rows={3}
          value={message}
          maxLength={MAX_FEEDBACK_LENGTH}
          onChange={(event) => setMessage(event.target.value)}
          className={field}
        />
      </label>
      <p className={mutedText}>{t.feedback.noPersonalInfo}</p>
      <button
        type="submit"
        className={`self-start ${primaryButton}`}
        disabled={status === 'sending'}
      >
        {status === 'sending' ? t.feedback.sending : t.feedback.submit}
      </button>
      {problem && (
        <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">
          {problem}
        </p>
      )}
    </form>
  );
}
