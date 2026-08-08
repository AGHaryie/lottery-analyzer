'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Ticket {
  whiteBalls: number[];
  bonusBall: number;
  sum: number;
}

interface CandidateTicketsProps {
  tickets: Ticket[];
}

export const CandidateTickets: React.FC<CandidateTicketsProps> = ({ tickets }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = tickets
      .map(
        (t, i) =>
          `Ticket #${i + 1}: ${t.whiteBalls
            .map((b) => (b < 10 ? `0${b}` : b))
            .join(' ')} [Bonus: ${t.bonusBall < 10 ? `0${t.bonusBall}` : t.bonusBall}]`
      )
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (tickets.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-200">Generated Candidates</h2>
        <button
          onClick={handleCopy}
          className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
          {copied ? 'Copied All!' : 'Copy Candidates'}
        </button>
      </div>

      <div className="space-y-2">
        {tickets.map((t, idx) => (
          <div
            key={idx}
            className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 w-6">#{idx + 1}</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {t.whiteBalls.map((b, bIdx) => (
                  <span
                    key={bIdx}
                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-950 font-bold flex items-center justify-center text-xs shadow"
                  >
                    {b < 10 ? `0${b}` : b}
                  </span>
                ))}
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow">
                  {t.bonusBall < 10 ? `0${t.bonusBall}` : t.bonusBall}
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">Sum: {t.sum}</span>
          </div>
        ))}
      </div>
    </section>
  );
};