import { Suspense } from 'react';
import { ResultView } from '../../../components/features/result/ResultView';

export default function ResultPage() {
  // The id is only known at request time, so reading it suspends.
  return (
    <Suspense fallback={<p role="status">…</p>}>
      <ResultView />
    </Suspense>
  );
}
