export type GameType = 'POWERBALL' | 'MEGA_MILLIONS' | 'CUSTOM';

export interface DrawData {
  date: string;
  whiteBalls: number[];
  bonusBall: number;
}

export interface GameRules {
  whiteCount: number;
  whiteMax: number;
  bonusMax: number;
  highThreshold: number;
}

export interface AnalysisResult {
  totalDraws: number;
  whiteFrequency: Record<number, number>;
  bonusFrequency: Record<number, number>;
  hotWhite: number[];
  coldWhite: number[];
  overdueWhite: Array<{ number: number; gap: number }>;
  oddEvenRatio: { oddPct: number; evenPct: number };
  highLowRatio: { highPct: number; lowPct: number };
  consecutivePairCount: number;
  avgSum: number;
  minSum: number;
  maxSum: number;
}

export const GAME_RULES: Record<GameType, GameRules> = {
  POWERBALL: { whiteCount: 5, whiteMax: 69, bonusMax: 26, highThreshold: 35 },
  MEGA_MILLIONS: { whiteCount: 5, whiteMax: 70, bonusMax: 24, highThreshold: 36 },
  CUSTOM: { whiteCount: 3, whiteMax: 10, bonusMax: 5, highThreshold: 5 },
};

export function analyzeDraws(
  draws: DrawData[],
  game: GameType,
  customRules?: GameRules
): AnalysisResult {
  const rules = game === 'CUSTOM' && customRules ? customRules : GAME_RULES[game];
  const autoHighThreshold = Math.ceil(rules.whiteMax / 2);

  const whiteFreq: Record<number, number> = {};
  const bonusFreq: Record<number, number> = {};
  const lastSeenGap: Record<number, number> = {};

  for (let i = 1; i <= rules.whiteMax; i++) whiteFreq[i] = 0;
  for (let i = 1; i <= rules.bonusMax; i++) bonusFreq[i] = 0;

  let totalWhiteCount = 0;
  let oddCount = 0;
  let evenCount = 0;
  let highCount = 0;
  let lowCount = 0;
  let consecutivePairCount = 0;
  let totalSum = 0;
  let minSum = Infinity;
  let maxSum = -Infinity;

  draws.forEach((draw, index) => {
    const sortedWhites = [...draw.whiteBalls].sort((a, b) => a - b);
    let drawSum = 0;

    for (let i = 0; i < sortedWhites.length - 1; i++) {
      if (sortedWhites[i + 1] - sortedWhites[i] === 1) {
        consecutivePairCount++;
      }
    }

    sortedWhites.forEach((num) => {
      if (num >= 1 && num <= rules.whiteMax) {
        whiteFreq[num] = (whiteFreq[num] || 0) + 1;
        totalWhiteCount++;
        drawSum += num;

        if (num % 2 === 0) evenCount++;
        else oddCount++;

        if (num >= autoHighThreshold) highCount++;
        else lowCount++;

        if (!(num in lastSeenGap)) {
          lastSeenGap[num] = index;
        }
      }
    });

    if (drawSum > 0) {
      totalSum += drawSum;
      if (drawSum < minSum) minSum = drawSum;
      if (drawSum > maxSum) maxSum = drawSum;
    }

    if (draw.bonusBall >= 1 && draw.bonusBall <= rules.bonusMax) {
      bonusFreq[draw.bonusBall] = (bonusFreq[draw.bonusBall] || 0) + 1;
    }
  });

  for (let i = 1; i <= rules.whiteMax; i++) {
    if (!(i in lastSeenGap)) {
      lastSeenGap[i] = draws.length;
    }
  }

  const sortedWhiteByFreq = Object.entries(whiteFreq)
    .map(([num, count]) => ({ num: Number(num), count }))
    .sort((a, b) => b.count - a.count);

  const displayLimit = Math.min(5, rules.whiteMax);
  const hotWhite = sortedWhiteByFreq.slice(0, displayLimit).map((x) => x.num);
  const coldWhite = sortedWhiteByFreq.slice(-displayLimit).map((x) => x.num);

  const overdueWhite = Object.entries(lastSeenGap)
    .map(([num, gap]) => ({ number: Number(num), gap }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, displayLimit);

  return {
    totalDraws: draws.length,
    whiteFrequency: whiteFreq,
    bonusFrequency: bonusFreq,
    hotWhite,
    coldWhite,
    overdueWhite,
    oddEvenRatio: {
      oddPct: totalWhiteCount ? Math.round((oddCount / totalWhiteCount) * 100) : 50,
      evenPct: totalWhiteCount ? Math.round((evenCount / totalWhiteCount) * 100) : 50,
    },
    highLowRatio: {
      highPct: totalWhiteCount ? Math.round((highCount / totalWhiteCount) * 100) : 50,
      lowPct: totalWhiteCount ? Math.round((lowCount / totalWhiteCount) * 100) : 50,
    },
    consecutivePairCount,
    avgSum: draws.length ? Math.round(totalSum / draws.length) : 0,
    minSum: minSum === Infinity ? 0 : minSum,
    maxSum: maxSum === -Infinity ? 0 : maxSum,
  };
}

export function generateCombinations(
  analysis: AnalysisResult,
  game: GameType,
  count: number,
  customRules?: GameRules
): Array<{ whiteBalls: number[]; bonusBall: number; sum: number }> {
  const rules = game === 'CUSTOM' && customRules ? customRules : GAME_RULES[game];
  const results: Array<{ whiteBalls: number[]; bonusBall: number; sum: number }> = [];

  const pool: number[] = [];
  Object.entries(analysis.whiteFrequency).forEach(([numStr, freq]) => {
    const num = Number(numStr);
    const weight = Math.max(1, freq);
    for (let i = 0; i < weight; i++) pool.push(num);
  });
  analysis.overdueWhite.forEach((item) => {
    for (let i = 0; i < 3; i++) pool.push(item.number);
  });

  for (let i = 0; i < count; i++) {
    const chosen = new Set<number>();
    let attempts = 0;

    while (chosen.size < rules.whiteCount && attempts < 500) {
      attempts++;
      const randomNum = pool[Math.floor(Math.random() * pool.length)];
      if (randomNum >= 1 && randomNum <= rules.whiteMax) {
        chosen.add(randomNum);
      }
    }

    while (chosen.size < rules.whiteCount) {
      const rand = Math.floor(Math.random() * rules.whiteMax) + 1;
      chosen.add(rand);
    }

    const whiteBalls = Array.from(chosen).sort((a, b) => a - b);
    const bonusBall = Math.floor(Math.random() * rules.bonusMax) + 1;
    const sum = whiteBalls.reduce((acc, curr) => acc + curr, 0);

    results.push({ whiteBalls, bonusBall, sum });
  }

  return results;
}