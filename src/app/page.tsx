'use client';

import React, { useState } from 'react';
import { GameType, analyzeDraws, generateCombinations, AnalysisResult } from '@/lib/lotteryEngine';
import { parseLotteryCSV } from '@/lib/csvParser';
import { Upload, Flame, Snowflake, Clock, Sparkles, AlertCircle } from 'lucide-react';

export default function Home() {
  const [game, setGame] = useState<GameType>('POWERBALL');
  const [count, setCount] = useState<number>(5);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [tickets, setTickets] = useState<Array<{ whiteBalls: number[]; bonusBall: number }>>([]);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const { data, errors } = parseLotteryCSV(content, game);
      
      setErrorLogs(errors);
      if (data.length > 0) {
        const stats = analyzeDraws(data, game);
        setAnalysis(stats);
        setTickets(generateCombinations(stats, game, count));
      } else {
        setAnalysis(null);
        setTickets([]);
      }
    };
    reader.readAsText(file);
  };

  const handleGenerate = () => {
    if (analysis) {
      setTickets(generateCombinations(analysis, game, count));
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">
              Lottery Statistical Analyzer
            </h1>
            <p className="text-slate-400 text-sm">Upload historical CSV draws to generate candidate combinations</p>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => { setGame('POWERBALL'); setAnalysis(null); }}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${game === 'POWERBALL' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Powerball
            </button>
            <button
              onClick={() => { setGame('MEGA_MILLIONS'); setAnalysis(null); }}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${game === 'MEGA_MILLIONS' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              Mega Millions
            </button>
          </div>
        </header>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-slate-600 rounded-xl bg-slate-900/50 cursor-pointer transition">
            <Upload className="w-6 h-6 mb-2 text-slate-400" />
            <span className="text-sm font-medium">Upload Draw CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <label className="text-xs text-slate-400 uppercase font-semibold">Candidate Tickets</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-sm"
            >
              <option value={1}>1 Ticket</option>
              <option value={5}>5 Tickets</option>
              <option value={10}>10 Tickets</option>
              <option value={20}>20 Tickets</option>
            </select>
            <button
              onClick={handleGenerate}
              disabled={!analysis}
              className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" /> Re-Generate
            </button>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Dataset Status</span>
            <div className="text-2xl font-bold text-slate-200">
              {analysis ? `${analysis.totalDraws} Draws` : 'No CSV Loaded'}
            </div>
            <p className="text-xs text-slate-500">
              {analysis ? `Parity: ${analysis.oddEvenRatio.oddPct}% Odd / ${analysis.oddEvenRatio.evenPct}% Even` : 'Upload data to calculate stats.'}
            </p>
          </div>
        </div>

        {/* Parsing Warning Banner */}
        {errorLogs.length > 0 && (
          <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-lg text-amber-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-semibold">Notice regarding uploaded CSV:</p>
              <p>{errorLogs.length} rows contained corrupt formatting or out-of-bound numbers and were skipped.</p>
            </div>
          </div>
        )}

        {/* Analytics Breakdown */}
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <Flame className="w-8 h-8 text-amber-500 shrink-0" />
              <div>
                <div className="text-xs text-slate-400 font-semibold">Hot Numbers</div>
                <div className="text-lg font-bold text-slate-100">{analysis.hotWhite.join(', ')}</div>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <Snowflake className="w-8 h-8 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400 font-semibold">Cold Numbers</div>
                <div className="text-lg font-bold text-slate-100">{analysis.coldWhite.join(', ')}</div>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <Clock className="w-8 h-8 text-rose-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400 font-semibold">Top Overdue</div>
                <div className="text-lg font-bold text-slate-100">
                  {analysis.overdueWhite.slice(0, 3).map(o => `#${o.number}`).join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generated Combinations Display */}
        {tickets.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-200">Generated Candidates</h2>
            <div className="space-y-2">
              {tickets.map((t, idx) => (
                <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">#{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    {t.whiteBalls.map((b, bIdx) => (
                      <span key={bIdx} className="w-9 h-9 rounded-full bg-slate-100 text-slate-950 font-bold flex items-center justify-center text-sm shadow">
                        {b < 10 ? `0${b}` : b}
                      </span>
                    ))}
                    <span className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-sm shadow text-white ${game === 'POWERBALL' ? 'bg-red-600' : 'bg-amber-500 text-slate-950'}`}>
                      {t.bonusBall < 10 ? `0${t.bonusBall}` : t.bonusBall}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}