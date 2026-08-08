'use client';

import React from 'react';
import { Upload, Download, Sparkles } from 'lucide-react';
import { GameRules } from '@/app/lib/lotteryEngine';

interface DashboardControlsProps {
  game: string;
  count: number;
  activeRules: GameRules;
  hasAnalysis: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
  onCountChange: (count: number) => void;
  onGenerate: () => void;
  totalDraws?: number;
}

export const DashboardControls: React.FC<DashboardControlsProps> = ({
  game,
  count,
  activeRules,
  hasAnalysis,
  onFileUpload,
  onDownloadTemplate,
  onCountChange,
  onGenerate,
  totalDraws,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col gap-2">
        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-800 hover:border-slate-600 rounded-xl bg-slate-900/50 cursor-pointer transition">
          <Upload className="w-5 h-5 mb-1 text-slate-400" />
          <span className="text-xs font-medium">Upload Draw CSV</span>
          <input type="file" accept=".csv" onChange={onFileUpload} className="hidden" />
        </label>

        <button
          onClick={onDownloadTemplate}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" /> Download {game.replace('_', ' ')} Template
        </button>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
        <div>
          <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">
            Number of Candidate Tickets
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onCountChange(isNaN(val) ? 0 : val);
            }}
            onBlur={() => {
              onCountChange(Math.max(1, Math.min(100, count || 1)));
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm font-semibold focus:outline-none focus:border-indigo-500 transition"
            placeholder="Enter ticket count"
          />
        </div>
        <button
          onClick={onGenerate}
          disabled={!hasAnalysis}
          className="w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4" /> Re-Generate
        </button>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
        <span className="text-xs text-slate-400 uppercase font-semibold">Matrix Range</span>
        <div className="text-xl font-bold text-slate-200">
          Pick {activeRules.whiteCount} (1–{activeRules.whiteMax}) + Bonus (1–{activeRules.bonusMax})
        </div>
        <p className="text-xs text-slate-500">
          {totalDraws ? `${totalDraws} draws evaluated.` : 'Ready for data upload.'}
        </p>
      </div>
    </div>
  );
};