'use client';

import React from 'react';
import { Flame, Snowflake, Clock, BarChart2 } from 'lucide-react';
import { AnalysisResult } from '@/app/lib/lotteryEngine';

interface AnalyticsMetricsProps {
  analysis: AnalysisResult;
}

export const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ analysis }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="text-xs text-slate-400 font-semibold flex items-center gap-1">
          <Flame className="w-4 h-4 text-amber-500" /> Hot White Balls
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {analysis.hotWhite.map((num) => (
            <span
              key={num}
              className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold flex items-center justify-center text-xs"
            >
              {num < 10 ? `0${num}` : num}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="text-xs text-slate-400 font-semibold flex items-center gap-1">
          <Snowflake className="w-4 h-4 text-cyan-400" /> Cold White Balls
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {analysis.coldWhite.map((num) => (
            <span
              key={num}
              className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold flex items-center justify-center text-xs"
            >
              {num < 10 ? `0${num}` : num}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="text-xs text-slate-400 font-semibold flex items-center gap-1">
          <Clock className="w-4 h-4 text-rose-400" /> Overdue Gap
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {analysis.overdueWhite.slice(0, 3).map((item) => (
            <span
              key={item.number}
              className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold flex items-center justify-center text-xs"
              title={`Gap: ${item.gap} draws`}
            >
              {item.number < 10 ? `0${item.number}` : item.number}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
        <div className="text-xs text-slate-400 font-semibold flex items-center gap-1">
          <BarChart2 className="w-4 h-4 text-indigo-400" /> Sum & Ratios
        </div>
        <div className="text-xs text-slate-300">
          Avg: <span className="font-bold">{analysis.avgSum}</span> | [{analysis.minSum}–{analysis.maxSum}]
        </div>
        <div className="text-[10px] text-slate-500 pt-1">
          Consecutive Pairs: {analysis.consecutivePairCount}
        </div>
      </div>
    </div>
  );
};