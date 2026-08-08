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
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1">
          <Flame className="w-4 h-4 text-amber-500" /> Hot White Balls
        </div>
        <div className="text-lg font-bold text-slate-100">{analysis.hotWhite.join(', ')}</div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1">
          <Snowflake className="w-4 h-4 text-cyan-400" /> Cold White Balls
        </div>
        <div className="text-lg font-bold text-slate-100">{analysis.coldWhite.join(', ')}</div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1">
          <Clock className="w-4 h-4 text-rose-400" /> Overdue Gap
        </div>
        <div className="text-lg font-bold text-slate-100">
          {analysis.overdueWhite.slice(0, 3).map((o) => `#${o.number}`).join(', ')}
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1">
          <BarChart2 className="w-4 h-4 text-indigo-400" /> Sum & Ratios
        </div>
        <div className="text-xs text-slate-300">
          Avg: <span className="font-bold">{analysis.avgSum}</span> | [{analysis.minSum}–{analysis.maxSum}]
        </div>
        <div className="text-[10px] text-slate-500 mt-1">
          Consecutive Pairs: {analysis.consecutivePairCount}
        </div>
      </div>
    </div>
  );
};