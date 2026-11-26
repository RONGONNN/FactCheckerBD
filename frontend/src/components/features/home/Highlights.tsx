'use client';

import { homeContent } from '../../../lib/i18n/home';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { Icon, type IconName } from '../../ui/Icon';
import { card, mutedText } from '../../ui/styles';

const ICONS: IconName[] = ['shield', 'link', 'globe', 'bolt'];

export function Highlights() {
  const { language } = useLanguage();

  return (
    <ul className="mx-auto grid max-w-6xl gap-3 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
      {homeContent[language].features.map((feature, index) => (
        <li key={feature.title} className={`${card} flex items-center gap-3`}>
          <span className="rounded-xl bg-orange-50 p-2 text-accent">
            <Icon name={ICONS[index] ?? 'check'} />
          </span>
          <div>
            <p className="font-bold text-navy">{feature.title}</p>
            <p className={mutedText}>{feature.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
