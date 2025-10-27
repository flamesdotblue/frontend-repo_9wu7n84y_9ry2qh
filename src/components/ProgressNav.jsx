import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressNav({ step = 1, confidence = 0 }) {
  const steps = [
    { id: 1, label: '🏨 Setup' },
    { id: 2, label: '👥 Operations' },
    { id: 3, label: '📊 Results & Recovery' },
  ];

  const pct = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="sticky top-0 z-40 w-full bg-gradient-to-b from-black/60 to-black/0 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs sm:text-sm text-white/70">
          <div className="flex gap-4">
            {steps.map((s) => (
              <span key={s.id} className={s.id === step ? 'text-amber-200' : ''}>
                {s.label}
              </span>
            ))}
          </div>
          <div>
            Data Confidence: <span className="text-amber-300 font-medium">{Math.round(confidence)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
