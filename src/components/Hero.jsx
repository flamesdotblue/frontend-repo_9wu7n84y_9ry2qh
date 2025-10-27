import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';

const methodologyText = {
  epi: {
    title: 'Effective Productivity Impact (EPI)',
    body:
      'EPI estimates the fraction of a year an exiting role is under-productive due to vacancy, onboarding, and wellness downtime. EPI = (Onboarding Days + Vacancy Days + Well‑Being Days) / 365. Higher EPI amplifies true replacement cost beyond payroll.',
  },
  opl: {
    title: 'Overtime Premium Load (OPL)',
    body:
      'When teams cover gaps, overtime and premium shift costs rise. We approximate OPL as 20% of annual compensation weighted by EPI. Example: If EPI = 0.25 and annual comp = ₹6,00,000, then OPL ≈ 0.20 × 6,00,000 × 0.25 = ₹30,000 per exit.',
  },
  rli: {
    title: 'Regional Labor Index (RLI)',
    body:
      'Adjusts for destination-specific wage dynamics and luxury services density. Baseline 1.00; premium markets trend 1.1–1.6.',
  },
  scm: {
    title: 'Service Complexity Multiplier (SCM)',
    body:
      'Higher star categories require higher staffing intensity, cross-training, and quality buffers. We apply 1.00 (3★), 1.15 (4★), 1.35 (5★), 1.50 (6★).',
  },
};

export default function Hero({ onOpenMethodology }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    onOpenMethodology?.();
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight bg-gradient-to-br from-amber-300 via-yellow-300 to-amber-500 bg-clip-text text-transparent"
        >
          Kintsug Workforce Intelligence Calculator
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-4 text-base md:text-lg text-white/80"
        >
          A single-screen, immersive experience that quantifies what every minute of workforce inefficiency costs your luxury hotel
        </motion.p>

        <motion.button
          onClick={handleOpen}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/80 px-5 py-2.5 text-amber-300 hover:text-white hover:bg-amber-400/10 transition-colors"
        >
          <Info className="h-4 w-4" />
          View System Logic & Methodology
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <div
              className="absolute inset-0 bg-purple-950/60 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-purple-900/70 to-fuchsia-900/60 border-l border-white/10 shadow-xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-amber-200">Methodology</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-amber-300 hover:text-white hover:bg-amber-400/10 transition"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-5 text-sm leading-relaxed text-white/80">
                {Object.values(methodologyText).map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h4 className="text-amber-200 font-medium">{item.title}</h4>
                    <p className="mt-1">{item.body}</p>
                  </div>
                ))}

                <p className="text-amber-300/90">
                  These elements combine to reflect true workforce leakage and the recovery potential unlocked by Kintsug’s Harmony Layer.
                </p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
