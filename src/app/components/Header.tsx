'use client';

import React from 'react';
import { GameType } from '@/app/lib/lotteryEngine';

interface HeaderProps {
  game: GameType;
  onSelectGame: (g: GameType) => void;
}

export const Header: React.FC<HeaderProps> = ({ game, onSelectGame }) => {
  return (
    <header className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">
          Lottery Statistical Analyzer & Predictor
        </h1>
        <p className="text-slate-400 text-sm">Dynamic Game Matrices & Combinatorial Frequency Engine</p>
      </div>

      <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
        {(['POWERBALL', 'MEGA_MILLIONS', 'CUSTOM'] as GameType[]).map((g) => (
          <button
            key={g}
            onClick={() => onSelectGame(g)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              game === g ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {g.replace('_', ' ')}
          </button>
        ))}
      </div>
    </header>
  );
};