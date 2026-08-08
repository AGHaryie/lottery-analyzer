'use client';

import React from 'react';
import { Settings } from 'lucide-react';

interface CustomMatrixSettingsProps {
  rawCustom: { whiteCount: number; whiteMax: number; bonusMax: number };
  highThreshold: number;
  onChange: (updated: { whiteCount: number; whiteMax: number; bonusMax: number }) => void;
}

export const CustomMatrixSettings: React.FC<CustomMatrixSettingsProps> = ({
  rawCustom,
  highThreshold,
  onChange,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
      <div className="flex items-center justify-between text-sm font-semibold text-indigo-400">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" /> Custom Matrix Configuration
        </div>
        <span className="text-xs text-slate-500 font-normal">
          Auto High/Low Threshold: ≥ {highThreshold}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-slate-400 block mb-1">Balls Drawn per Ticket</label>
          <input
            type="number"
            min={1}
            max={10}
            value={rawCustom.whiteCount}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onChange({ ...rawCustom, whiteCount: isNaN(val) ? 0 : val });
            }}
            onBlur={() => {
              onChange({
                ...rawCustom,
                whiteCount: Math.max(1, Math.min(10, rawCustom.whiteCount || 3)),
              });
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-medium focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Max White Ball (1..N)</label>
          <input
            type="number"
            min={10}
            max={100}
            value={rawCustom.whiteMax}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onChange({ ...rawCustom, whiteMax: isNaN(val) ? 0 : val });
            }}
            onBlur={() => {
              onChange({
                ...rawCustom,
                whiteMax: Math.max(10, Math.min(100, rawCustom.whiteMax || 10)),
              });
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-medium focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Max Bonus Ball (1..M)</label>
          <input
            type="number"
            min={1}
            max={50}
            value={rawCustom.bonusMax}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onChange({ ...rawCustom, bonusMax: isNaN(val) ? 0 : val });
            }}
            onBlur={() => {
              onChange({
                ...rawCustom,
                bonusMax: Math.max(1, Math.min(50, rawCustom.bonusMax || 5)),
              });
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-medium focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>
    </div>
  );
};