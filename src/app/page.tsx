'use client';

import React, { useState } from 'react';
import { GameType, GameRules, GAME_RULES, analyzeDraws, generateCombinations, AnalysisResult, DrawData } from '@/app/lib/lotteryEngine';
import { parseLotteryCSV } from '@/app/lib/csvParser';
import { AlertCircle } from 'lucide-react';

import { Header } from '@/app/components/Header';
import { CustomMatrixSettings } from '@/app/components/CustomMatrixSettings';
import { DashboardControls } from '@/app/components/DashboardControls';
import { AnalyticsMetrics } from '@/app/components/AnalyticsMetrics';
import { FrequencyChart } from '@/app/components/FrequencyChart';
import { CandidateTickets } from '@/app/components/CandidateTickets';

export default function Home() {
  const [game, setGame] = useState<GameType>('POWERBALL');
  const [count, setCount] = useState<number>(5);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  const [rawCustom, setRawCustom] = useState<{ whiteCount: number; whiteMax: number; bonusMax: number }>({
    whiteCount: 3,
    whiteMax: 10,
    bonusMax: 5,
  });

  const activeRules: GameRules =
    game === 'CUSTOM'
      ? {
          whiteCount: rawCustom.whiteCount || 3,
          whiteMax: rawCustom.whiteMax || 10,
          bonusMax: rawCustom.bonusMax || 5,
          highThreshold: Math.ceil((rawCustom.whiteMax || 10) / 2),
        }
      : GAME_RULES[game];

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [tickets, setTickets] = useState<Array<{ whiteBalls: number[]; bonusBall: number; sum: number }>>([]);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);

  const processCSVContent = (content: string, fileName?: string) => {
    const { data, errors } = parseLotteryCSV(content, game, activeRules);

    setErrorLogs(errors);
    if (data.length > 0) {
      if (fileName) setUploadedFileName(fileName);
      const stats = analyzeDraws(data, game, activeRules);
      setAnalysis(stats);
      setTickets(generateCombinations(stats, game, count, activeRules));
    } else {
      setAnalysis(null);
      setTickets([]);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processCSVContent(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleLoadDemoData = () => {
  let demoCSV = '';

  if (game === 'POWERBALL') {
    demoCSV =
      `Draw Date, Winning Numbers, Multiplier\n` +
      `08/05/2026, 14 20 48 54 61 04, 03\n` +
      `08/03/2026, 08 30 41 48 54 14, 02\n` +
      `08/01/2026, 06 17 27 48 50 05, 03\n` +
      `07/29/2026, 10 30 40 48 57 02, 04\n` +
      `07/27/2026, 14 20 30 54 68 18, 02\n` +
      `07/25/2026, 03 12 25 48 61 14, 05\n` +
      `07/22/2026, 10 20 30 41 50 04, 02\n` +
      `07/20/2026, 08 14 27 48 69 22, 03\n`;
  } else if (game === 'MEGA_MILLIONS') {
    demoCSV =
      `Draw Date, Num1, Num2, Num3, Num4, Num5, Mega Ball, Megaplier\n` +
      `08/04/2026, 04, 18, 26, 43, 70, 21, 02\n` +
      `08/01/2026, 12, 18, 33, 43, 65, 11, 03\n` +
      `07/28/2026, 04, 22, 38, 43, 70, 21, 04\n` +
      `07/25/2026, 09, 18, 26, 51, 68, 05, 02\n` +
      `07/21/2026, 04, 18, 33, 43, 70, 21, 03\n` +
      `07/18/2026, 12, 26, 38, 51, 65, 11, 05\n` +
      `07/14/2026, 04, 18, 26, 43, 70, 08, 02\n` +
      `07/11/2026, 09, 22, 33, 51, 68, 21, 03\n`;
  } else {
    // Dynamically generate headers & valid rows based on whatever Custom Matrix is configured
    const whiteHeaders = Array.from(
      { length: activeRules.whiteCount },
      (_, i) => `Num${i + 1}`
    ).join(', ');
    
    demoCSV = `Draw Date, ${whiteHeaders}, Bonus Ball\n`;

    // Generate 8 valid mock draws strictly inside activeRules boundaries
    for (let row = 1; row <= 8; row++) {
      const drawnSet = new Set<number>();
      while (drawnSet.size < activeRules.whiteCount) {
        const num = Math.floor(Math.random() * activeRules.whiteMax) + 1;
        drawnSet.add(num);
      }
      const sortedWhites = Array.from(drawnSet)
        .sort((a, b) => a - b)
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(', ');

      const bonus = Math.floor(Math.random() * activeRules.bonusMax) + 1;
      const formattedBonus = bonus < 10 ? `0${bonus}` : `${bonus}`;

      demoCSV += `08/0${row}/2026, ${sortedWhites}, ${formattedBonus}\n`;
    }
  }

  processCSVContent(demoCSV, `${game.toLowerCase()}_demo.csv`);
};

  const handleClearData = () => {
    setAnalysis(null);
    setTickets([]);
    setErrorLogs([]);
    setUploadedFileName(null);
  };

  const handleGenerate = () => {
    if (analysis) {
      setTickets(generateCombinations(analysis, game, count, activeRules));
    }
  };

  const handleDownloadTemplate = () => {
    let csvContent = '';
    if (game === 'POWERBALL') {
      csvContent = `Draw Date, Winning Numbers, Multiplier\n08/05/2026, 14 20 48 54 61 04, 03\n`;
    } else if (game === 'MEGA_MILLIONS') {
      csvContent = `Draw Date, Num1, Num2, Num3, Num4, Num5, Mega Ball, Megaplier\n08/04/2026, 04, 18, 26, 43, 70, 21, 02\n`;
    } else {
      const whiteHeaders = Array.from({ length: activeRules.whiteCount }, (_, i) => `Num${i + 1}`).join(', ');
      csvContent = `Draw Date, ${whiteHeaders}, Bonus Ball\n08/09/2026, ${Array.from({ length: activeRules.whiteCount }, (_, i) => (i + 1).toString().padStart(2, '0')).join(', ')}, 01\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${game.toLowerCase()}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <Header
          game={game}
          onSelectGame={(g) => { setGame(g); handleClearData(); }}
        />

        {game === 'CUSTOM' && (
          <CustomMatrixSettings
            rawCustom={rawCustom}
            highThreshold={activeRules.highThreshold}
            onChange={setRawCustom}
          />
        )}

        <DashboardControls
          game={game}
          count={count}
          activeRules={activeRules}
          hasAnalysis={!!analysis}
          uploadedFileName={uploadedFileName}
          onFileUpload={handleFileUpload}
          onDownloadTemplate={handleDownloadTemplate}
          onLoadDemoData={handleLoadDemoData}
          onClearData={handleClearData}
          onCountChange={setCount}
          onGenerate={handleGenerate}
          totalDraws={analysis?.totalDraws}
        />

        {errorLogs.length > 0 && (
          <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-lg text-amber-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-semibold">Upload sanitization log:</p>
              <p>{errorLogs.length} rows contained out-of-range bounds for this matrix and were dropped.</p>
            </div>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <AnalyticsMetrics analysis={analysis} />
            <FrequencyChart
              whiteFrequency={analysis.whiteFrequency}
              hotWhite={analysis.hotWhite}
              coldWhite={analysis.coldWhite}
              whiteMax={activeRules.whiteMax}
              oddEvenRatio={analysis.oddEvenRatio}
              highLowRatio={analysis.highLowRatio}
              highThreshold={activeRules.highThreshold}
            />
          </div>
        )}

        <CandidateTickets tickets={tickets} />
      </div>
    </main>
  );
}