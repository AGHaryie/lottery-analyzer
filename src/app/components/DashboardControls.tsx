'use client';

import React, { useState } from 'react';
import { Upload, Download, Sparkles, FileCheck, X, Zap } from 'lucide-react';
import { GameRules } from '@/app/lib/lotteryEngine';

interface DashboardControlsProps {
  game: string;
  count: number;
  activeRules: GameRules;
  hasAnalysis: boolean;
  uploadedFileName: string | null;
  onFileUpload: (file: File) => void;
  onDownloadTemplate: () => void;
  onLoadDemoData: () => void;
  onClearData: () => void;
  onCountChange: (count: number) => void;
  onGenerate: () => void;
  totalDraws?: number;
}

export const DashboardControls: React.FC<DashboardControlsProps> = ({
  game,
  count,
  activeRules,
  hasAnalysis,
  uploadedFileName,
  onFileUpload,
  onDownloadTemplate,
  onLoadDemoData,
  onClearData,
  onCountChange,
  onGenerate,
  totalDraws,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Upload & Template Control Box */}
      <div className="flex flex-col gap-2">
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition relative ${
            isDragging
              ? 'border-indigo-500 bg-indigo-950/30'
              : uploadedFileName
              ? 'border-emerald-800/80 bg-emerald-950/20'
              : 'border-slate-800 hover:border-slate-600 bg-slate-900/50'
          }`}
        >
          {uploadedFileName ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <FileCheck className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-[180px]">{uploadedFileName}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearData();
                }}
                className="p-1 hover:bg-emerald-900/50 rounded text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-5 h-5 mb-1 text-slate-400" />
              <span className="text-xs font-medium text-slate-200">
                {isDragging ? 'Drop CSV File Here' : 'Upload or Drag Draw CSV'}
              </span>
            </>
          )}
          <input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
            className="hidden"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onDownloadTemplate}
            className="py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition"
          >
            <Download className="w-3 h-3 text-indigo-400" /> Template
          </button>

          <button
            type="button"
            onClick={onLoadDemoData}
            className="py-2 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/50 text-indigo-300 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition"
          >
            <Zap className="w-3 h-3 text-amber-400" /> Demo Data
          </button>
        </div>
      </div>

      {/* Ticket Generator Control Box */}
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
          className="w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition shadow"
        >
          <Sparkles className="w-4 h-4" /> Re-Generate
        </button>
      </div>

      {/* Matrix Information Box */}
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