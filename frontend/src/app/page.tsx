import { Banner } from '../components/features/home/Banner';
import { Hero } from '../components/features/home/Hero';
import { Highlights } from '../components/features/home/Highlights';
import { Steps } from '../components/features/home/Steps';
import { DashboardStats } from '../components/features/stats/DashboardStats';

export default function DashboardPage() {
  return (
    <>
      <Hero />
      <Highlights />
      <Steps />
      <DashboardStats />
      <Banner />
    </>
  );
}
