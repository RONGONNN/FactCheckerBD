'use client';

import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { FeedbackForm } from './FeedbackForm';

export function ContactView() {
  const { t } = useLanguage();
  // Next.js keeps pages alive between visits; a new visit should show an empty form.
  const { bfcacheId } = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t.feedback.title}</h1>
      <p>{t.feedback.intro}</p>
      <Fragment key={bfcacheId}>
        <FeedbackForm title={t.nav.feedback} />
      </Fragment>
    </div>
  );
}
