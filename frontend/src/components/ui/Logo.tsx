import Link from 'next/link';
import { focusRing } from './styles';

export function Logo() {
  return (
    <Link href="/" className={`text-2xl font-extrabold tracking-tight text-navy ${focusRing}`}>
      Fact<span className="text-accent">Check</span>
    </Link>
  );
}
