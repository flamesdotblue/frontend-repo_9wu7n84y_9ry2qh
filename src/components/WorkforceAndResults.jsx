import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, FileDown, Mail, Sparkles } from 'lucide-react';

function useAnimatedNumber(value, duration = 800) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(0);
  const fromRef = useRef(0);
  const valRef = useRef(value);

  useEffect(() => {
    fromRef.current = display;
    valRef.current = value;
    startRef.current = performance.now();

    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(fromRef.current + (valRef.current - fromRef.current) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
}

const currency = (n) =>
  isFinite(n) ?
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(0, n)) :
    '₹0';

export default function WorkforceAndResults({ data, setData, onBackToSetup }) {
  const update = (key, value) => setData((d) => ({ ...d, [key]: value }));

  const rli = useMemo(() => {
    const map = { mumbai: 1.15, delhi: 1.1, dubai: 1.3, singapore: 1.4, bangkok: 0.9, london: 1.6, other: 1.0 };
    return map[data.location] || 1.0;
  }, [data.location]);

  const scm = useMemo(() => {
    const map = { 3: 1.0, 4: 1.15, 5: 1.35, 6: 1.5 };
    return map[data.stars] || 1.0;
  }, [data.stars]);

  const epi = useMemo(() => {
    const od = Number(data.onboardingDays || 0);
    const vd = Number(data.vacancyDays || 0);
    const wd = Number(data.wellbeingDays || 0);
    return Math.min(1, (od + vd + wd) / 365);
  }, [data.onboardingDays, data.vacancyDays, data.wellbeingDays]);

  const annualComp = Number(data.avgMonthlyComp || 0) * 12;
  const baseCostPerExit = (annualComp + Number(data.recruitCost || 0) + Number(data.trainingInvest || 0)) * (1 + epi);
  const opl = annualComp * 0.2 * epi;
  const exits = Number(data.exits || 0);
  const teamSize = Number(data.teamSize || 0);
  const keys = Number(data.keys || 0);
  const wellbeing = Number(data.wellbeingDays || 0);

  const softDrag = teamSize * (wellbeing / 365) * annualComp * 0.05;
  const leakageRaw = (exits * (baseCostPerExit + opl) + softDrag) * rli * scm;
  const leakage = Math.max(0, leakageRaw);

  const [recoveryPct, setRecoveryPct] = useState(20);
  const recoveryValue = leakage * (recoveryPct / 100);

  const displayLeakage = useAnimatedNumber(leakage);
  const lossPerSecond = leakage / (365 * 24 * 3600);

  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    setTicker(0);
    const start = performance.now();
    let raf;
    const loop = (now) => {
      const elapsed = (now - start) / 1000;
      setTicker(elapsed * lossPerSecond);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [lossPerSecond]);

  const costPerKey = keys > 0 ? leakage / keys : 0;
  const costPerEmployee = teamSize > 0 ? leakage / teamSize : 0;

  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  function downloadReport(name, email, designation) {
    const lines = [
      'Kintsug Workforce Leakage Report',
      '—',
      `Name: ${name}`,
      `Email: ${email}`,
      `Designation: ${designation}`,
      '',
      `Location: ${data.location || '-'} | Stars: ${data.stars || '-'} | Affiliation: ${data.affiliation || '-'}`,
      `Profile: ${data.profile || '-'} | Keys: ${data.keys || 0} | Team Size: ${data.teamSize || 0}`,
      '',
      `Exits (12M): ${exits}`,
      `Avg Monthly Comp: ₹${Number(data.avgMonthlyComp || 0).toLocaleString('en-IN')}`,
      `Recruitment Cost/Hire: ₹${Number(data.recruitCost || 0).toLocaleString('en-IN')}`,
      `Training Investment/Employee: ₹${Number(data.trainingInvest || 0).toLocaleString('en-IN')}`,
      `Onboarding (days): ${data.onboardingDays || 0}`,
      `Vacancy (days): ${data.vacancyDays || 0}`,
      `Well-Being / Sick Leave (days): ${wellbeing}`,
      '',
      `EPI: ${(epi * 100).toFixed(1)}% | RLI: ${rli.toFixed(2)} | SCM: ${scm.toFixed(2)}`,
      `Annual Workforce Leakage: ${currency(leakage)}`,
      `Cost per Key / Year: ${currency(costPerKey)}`,
      `Cost per Employee / Year: ${currency(costPerEmployee)}`,
      `Potential Recovery @ ${recoveryPct}%: ${currency(recoveryValue)}`,
      '',
      'Thank you for exploring Kintsug. Harmony is on the way.',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kintsug_Leakage_Report.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const designation = String(form.get('designation') || '');

    setSubmitting(true);
    try {
      // Simulate async processing for a cinematic pause
      await new Promise((r) => setTimeout(r, 900));
      downloadReport(name, email, designation);
      setModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Workforce Inputs */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 md:p-6">
        <div className="mb-4 text-sm font-medium text-amber-200">Workforce Operations</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberField label="Team Members Exited (12 M)" value={data.exits} onChange={(v) => update('exits', v)} tooltip="Total separations over last 12 months" />
          <NumberField label="Avg. Monthly Compensation" value={data.avgMonthlyComp} onChange={(v) => update('avgMonthlyComp', v)} prefix="₹" tooltip="Gross monthly cost incl. benefits" />
          <NumberField label="Recruitment Cost / Hire" value={data.recruitCost} onChange={(v) => update('recruitCost', v)} prefix="₹" tooltip="Agency + internal effort" />
          <NumberField label="Training Investment / Employee" value={data.trainingInvest} onChange={(v) => update('trainingInvest', v)} prefix="₹" tooltip="Initial L&D for role readiness" />
          <NumberField label="Onboarding Duration (days)" value={data.onboardingDays} onChange={(v) => update('onboardingDays', v)} tooltip="Ramp-up period to full productivity" />
          <NumberField label="Vacancy Duration (days)" value={data.vacancyDays} onChange={(v) => update('vacancyDays', v)} tooltip="Time role remains unfilled" />
          <NumberField label="Well-Being / Sick Leave (days)" value={data.wellbeingDays} onChange={(v) => update('wellbeingDays', v)} tooltip="Average downtime per employee" />
        </div>
      </div>

      {/* Outcome Zone */}
      <div className="mt-6 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 md:p-6">
          <div className="mb-4 text-sm font-medium text-amber-200">Results & Recovery</div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            <div className="lg:col-span-2 rounded-xl border border-white/10 bg-black/20 p-5">
              <div className="text-xs text-white/60">Annual Workforce Leakage</div>
              <div className="mt-1 text-4xl md:text-5xl font-semibold leading-tight bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent font-[Quattrocento]">
                {currency(displayLeakage)}
              </div>
              <div className="mt-2 text-sm text-white/70">Total hidden cost from attrition, burnout, and training drag.</div>
            </div>

            <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-5 shadow-inner">
              <div className="flex items-center justify-between text-sm text-amber-200">
                <span>Potential Recovery with Kintsug</span>
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="mt-3">
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={1}
                  value={recoveryPct}
                  onChange={(e) => setRecoveryPct(Number(e.target.value))}
                  className="w-full"
                />
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-white/70">Recovery: {recoveryPct}%</span>
                  <span className="text-amber-200 font-medium">{currency(recoveryValue)}</span>
                </div>
                <div className="mt-1 text-[11px] text-white/60">Projected savings with the Kintsug Harmony Layer.</div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MiniCard label="Cost per Key / Year" value={currency(costPerKey)} />
            <MiniCard label="Cost per Employee / Year" value={currency(costPerEmployee)} />
            <MiniCard label="Real-Time Loss Ticker" value={currency(ticker)} shimmer />
            <MiniCard label="EPI × RLI × SCM" value={`${(epi * 100).toFixed(1)}% × ${rli.toFixed(2)} × ${scm.toFixed(2)}`} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 md:p-6">
          <div className="mb-1 text-base font-medium text-amber-200">Your Personalized Kintsug Workforce Leakage Report</div>
          <div className="mb-4 text-sm text-white/70">Download your detailed insights and join our early-access waitlist to experience harmony in action.</div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-white/70">Name</label>
              <input name="name" required className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
            </div>
            <div>
              <label className="text-sm text-white/70">Email</label>
              <input name="email" type="email" required className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
            </div>
            <div>
              <label className="text-sm text-white/70">Designation</label>
              <input name="designation" required className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
            </div>

            <div className="md:col-span-3 flex items-center justify-between mt-1">
              <div className="text-xs text-white/60">We never share your data. One-click unsubscribe anytime.</div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 px-5 py-2 text-slate-900 font-medium hover:from-amber-300 hover:to-yellow-300 transition disabled:opacity-70"
              >
                {submitting ? 'Preparing…' : 'Send My Report & Join Waitlist →'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/70 to-fuchsia-900/60 p-6 text-center"
            >
              <div className="mx-auto h-10 w-10 rounded-full bg-amber-400/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-amber-300" />
              </div>
              <div className="mt-3 text-lg font-medium text-amber-200">Your report is on its way.</div>
              <div className="mt-1 text-sm text-white/80">You’ve been added to the Kintsug Early Access List.</div>
              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-white/70">
                <span className="inline-flex items-center gap-1"><FileDown className="h-4 w-4" /> Report saved</span>
                <span className="inline-flex items-center gap-1"><Mail className="h-4 w-4" /> Email queued</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-400/80 px-4 py-2 text-amber-300 hover:text-white hover:bg-amber-400/10"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NumberField({ label, value, onChange, prefix, tooltip }) {
  return (
    <div>
      <label className="text-sm text-white/70">{label}</label>
      <div className="relative mt-1">
        {prefix && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60">{prefix}</div>
        )}
        <input
          type="number"
          min="0"
          value={value ?? ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full rounded-xl bg-white/5 border border-white/10 ${prefix ? 'pl-8' : 'pl-3'} pr-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50`}
        />
        {tooltip && (
          <div className="pointer-events-none absolute -right-1 -top-1 translate-x-full select-none rounded-md border border-amber-400/40 bg-amber-400/10 px-2 py-1 text-[10px] text-amber-200">
            <span className="inline-flex items-center gap-1">
              <Info className="h-3 w-3" /> {tooltip}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniCard({ label, value, shimmer }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-black/20 p-4 ${shimmer ? 'relative overflow-hidden' : ''}`}>
      {shimmer && (
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      )}
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-lg font-medium text-amber-200">{value}</div>
    </div>
  );
}
