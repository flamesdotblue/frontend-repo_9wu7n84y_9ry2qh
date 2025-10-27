import React, { useMemo } from 'react';
import { Info, ArrowRight } from 'lucide-react';

const LOCATIONS = [
  { label: 'Select a destination', value: '' },
  { label: 'Mumbai', value: 'mumbai' },
  { label: 'Delhi', value: 'delhi' },
  { label: 'Dubai', value: 'dubai' },
  { label: 'Singapore', value: 'singapore' },
  { label: 'Bangkok', value: 'bangkok' },
  { label: 'London', value: 'london' },
  { label: 'Other', value: 'other' },
];

const STARS = [
  { label: '3 Stars', value: 3 },
  { label: '4 Stars', value: 4 },
  { label: '5 Stars', value: 5 },
  { label: '6 Stars', value: 6 },
];

const AFFILIATIONS = [
  { label: 'Chain', value: 'chain' },
  { label: 'Independent', value: 'independent' },
];

const PROFILES = [
  { label: 'Urban Luxury', value: 'urban' },
  { label: 'Resort', value: 'resort' },
  { label: 'Boutique', value: 'boutique' },
  { label: 'Business Luxury', value: 'business' },
];

export default function SetupSection({ data, setData, onNext }) {
  const update = (key, value) => setData((d) => ({ ...d, [key]: value }));

  const filled = useMemo(() => {
    const keys = ['location', 'stars', 'affiliation', 'brand', 'profile', 'keys', 'teamSize'];
    const base = keys.filter((k) => Boolean(data[k] || data[k] === 0)).length;
    const cond = data.affiliation === 'chain' && data.properties ? 1 : 0;
    const denom = keys.length + (data.affiliation === 'chain' ? 1 : 0);
    return { count: base + cond, denom };
  }, [data]);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/70">Location / Destination</label>
            <div className="relative mt-1">
              <select
                value={data.location || ''}
                onChange={(e) => update('location', e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              >
                {LOCATIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
                ))}
              </select>
              <Tooltip>Regional wage + density index</Tooltip>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70">Hotel Category (Stars)</label>
            <div className="relative mt-1">
              <select
                value={data.stars || ''}
                onChange={(e) => update('stars', Number(e.target.value))}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              >
                <option value="">Select category</option>
                {STARS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
                ))}
              </select>
              <Tooltip>Influences service complexity</Tooltip>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70">Affiliation Type</label>
            <div className="relative mt-1">
              <select
                value={data.affiliation || ''}
                onChange={(e) => update('affiliation', e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              >
                <option value="">Select affiliation</option>
                {AFFILIATIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
                ))}
              </select>
              <Tooltip>Chain visibility adds scale nuance</Tooltip>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70">Hotel Brand / Group Name</label>
            <input
              value={data.brand || ''}
              onChange={(e) => update('brand', e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              placeholder="e.g., Kintsug Collection"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Property Profile</label>
            <div className="relative mt-1">
              <select
                value={data.profile || ''}
                onChange={(e) => update('profile', e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              >
                <option value="">Select profile</option>
                {PROFILES.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
                ))}
              </select>
              <Tooltip>Guest mix and service mix</Tooltip>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70">Number of Keys (Rooms)</label>
            <input
              type="number"
              min="0"
              value={data.keys ?? ''}
              onChange={(e) => update('keys', Number(e.target.value))}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              placeholder="e.g., 220"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Total Team Strength</label>
            <input
              type="number"
              min="0"
              value={data.teamSize ?? ''}
              onChange={(e) => update('teamSize', Number(e.target.value))}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              placeholder="e.g., 180"
            />
          </div>

          {data.affiliation === 'chain' && (
            <div>
              <label className="text-sm text-white/70">Number of Properties</label>
              <input
                type="number"
                min="0"
                value={data.properties ?? ''}
                onChange={(e) => update('properties', Number(e.target.value))}
                className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                placeholder="e.g., 8"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-white/60">
            Fields completed: {filled.count}/{filled.denom}
          </div>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 px-5 py-2 text-slate-900 font-medium hover:from-amber-300 hover:to-yellow-300 transition"
          >
            Next → Workforce Inputs
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Tooltip({ children }) {
  return (
    <div className="pointer-events-none absolute -right-1 -top-1 translate-x-full select-none rounded-md border border-amber-400/40 bg-amber-400/10 px-2 py-1 text-[10px] text-amber-200">
      <span className="inline-flex items-center gap-1">
        <Info className="h-3 w-3" /> {children}
      </span>
    </div>
  );
}
