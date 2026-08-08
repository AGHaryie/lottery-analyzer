'use client';

import React from 'react';
import { BarChart2, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FrequencyChartProps {
  whiteFrequency: Record<number, number>;
  hotWhite: number[];
  coldWhite: number[];
  whiteMax: number;
  oddEvenRatio: { oddPct: number; evenPct: number };
  highLowRatio: { highPct: number; lowPct: number };
  highThreshold: number;
}

export const FrequencyChart: React.FC<FrequencyChartProps> = ({
  whiteFrequency,
  hotWhite,
  coldWhite,
  whiteMax,
  oddEvenRatio,
  highLowRatio,
  highThreshold,
}) => {
  const chartData = Object.entries(whiteFrequency).map(([num, count]) => ({
    ball: `#${num}`,
    rawNum: Number(num),
    count,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-400" /> White Ball Frequency Spectrum
          </span>
          <span className="text-xs text-slate-500">1..{whiteMax} Distribution</span>
        </div>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="ball" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => {
                  const isHot = hotWhite.includes(entry.rawNum);
                  const isCold = coldWhite.includes(entry.rawNum);
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isHot ? '#f59e0b' : isCold ? '#06b6d4' : '#6366f1'}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
        <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-rose-400" /> Parity & Range Balances
        </span>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-amber-400">Odd ({oddEvenRatio.oddPct}%)</span>
            <span className="text-cyan-400">Even ({oddEvenRatio.evenPct}%)</span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
            <div style={{ width: `${oddEvenRatio.oddPct}%` }} className="bg-amber-500 h-full" />
            <div style={{ width: `${oddEvenRatio.evenPct}%` }} className="bg-cyan-500 h-full" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-indigo-400">High ({highLowRatio.highPct}%)</span>
            <span className="text-emerald-400">Low ({highLowRatio.lowPct}%)</span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
            <div style={{ width: `${highLowRatio.highPct}%` }} className="bg-indigo-500 h-full" />
            <div style={{ width: `${highLowRatio.lowPct}%` }} className="bg-emerald-500 h-full" />
          </div>
          <p className="text-[11px] text-slate-500 pt-1">Midpoint Threshold: ≥ {highThreshold}</p>
        </div>

        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Hot Numbers
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" /> Cold Numbers
          </div>
        </div>
      </div>
    </div>
  );
};