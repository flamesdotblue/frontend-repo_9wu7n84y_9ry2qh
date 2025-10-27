import React, { useMemo, useState } from 'react';
import Hero from './components/Hero.jsx';
import ProgressNav from './components/ProgressNav.jsx';
import SetupSection from './components/SetupSection.jsx';
import WorkforceAndResults from './components/WorkforceAndResults.jsx';

export default function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    // Setup
    location: '',
    stars: undefined,
    affiliation: '',
    brand: '',
    profile: '',
    keys: undefined,
    teamSize: undefined,
    properties: undefined,
    // Workforce
    exits: undefined,
    avgMonthlyComp: undefined,
    recruitCost: undefined,
    trainingInvest: undefined,
    onboardingDays: undefined,
    vacancyDays: undefined,
    wellbeingDays: undefined,
  });

  const confidence = useMemo(() => {
    const fields = [
      'location', 'stars', 'affiliation', 'brand', 'profile', 'keys', 'teamSize',
      'exits', 'avgMonthlyComp', 'recruitCost', 'trainingInvest', 'onboardingDays', 'vacancyDays', 'wellbeingDays',
    ];
    const required = fields.length + (data.affiliation === 'chain' ? 1 : 0);
    const filled = fields.filter((k) => data[k] !== undefined && data[k] !== '' && !(typeof data[k] === 'number' && isNaN(data[k]))).length + (data.affiliation === 'chain' && data.properties ? 1 : 0);
    return (filled / Math.max(1, required)) * 100;
  }, [data]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950 to-fuchsia-900 text-white">
      <ProgressNav step={step} confidence={confidence} />
      <Hero />

      {step === 1 && (
        <div className="mt-2 mb-10">
          <SetupSection data={data} setData={setData} onNext={() => setStep(2)} />
        </div>
      )}

      {step >= 2 && (
        <div className="mb-16">
          <WorkforceAndResults data={data} setData={setData} />
        </div>
      )}

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-white/50">
        © {new Date().getFullYear()} Kintsug. Crafted for clarity and control.
      </footer>
    </div>
  );
}
