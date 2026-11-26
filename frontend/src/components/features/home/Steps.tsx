'use client';

import { formatNumber } from '../../../lib/format';
import { homeContent } from '../../../lib/i18n/home';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { Icon, type IconName } from '../../ui/Icon';
import { mutedText, sectionTitle } from '../../ui/styles';

const STYLES: { icon: IconName; color: string }[] = [
  { icon: 'pen', color: 'bg-blue-100 text-blue-700' },
  { icon: 'search', color: 'bg-violet-100 text-violet-700' },
  { icon: 'chart', color: 'bg-orange-100 text-orange-700' },
  { icon: 'check', color: 'bg-emerald-100 text-emerald-700' },
];

export function Steps() {
  const { language } = useLanguage();
  const content = homeContent[language];

  return (
    <section aria-labelledby="steps-title" className="mx-auto max-w-6xl px-4 py-8">
      <h2 id="steps-title" className={sectionTitle}>
        {content.stepsTitle}
      </h2>
      <p className={mutedText}>{content.stepsIntro}</p>
      <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.steps.map((step, index) => (
          <li key={step.title} className="flex flex-col items-center gap-2 text-center">
            <span className={`rounded-full p-4 ${STYLES[index]?.color}`}>
              <Icon name={STYLES[index]?.icon ?? 'check'} className="size-7" />
            </span>
            <p className="font-bold text-navy">
              {formatNumber(index + 1, language)}. {step.title}
            </p>
            <p className={mutedText}>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
