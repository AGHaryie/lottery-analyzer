export type GameType = 'POWERBALL' | 'MEGA_MILLIONS';

export interface DrawData {
  date: string;
  whiteBalls: number[];
  bonusBall: number;
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
}

export interface GameRules {
  whiteMax: number;
  bonusMax: number;
  highThreshold: number;
}

export const GAME_RULES: Record<GameType, GameRules> = {
  POWERBALL: { whiteMax: 69, bonusMax: 26, highThreshold: 35 },
  MEGA_MILLIONS: { whiteMax: 70, bonusMax: 24, highThreshold: 36 },
};

export function analyzeDraws(draws: DrawData[], game: GameType): AnalysisResult {
  const rules = GAME_RULES[game];
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

  draws.forEach((draw, index) => {
    // Process White Balls
    draw.whiteBalls.forEach((num) => {
      if (num >= 1 && num <= rules.whiteMax) {
        whiteFreq[num] = (whiteFreq[num] || 0) + 1;
        totalWhiteCount++;

        if (num % 2 === 0) evenCount++;
        else oddCount++;

        if (num >= rules.highThreshold) highCount++;
        else lowCount++;

        if (!(num in lastSeenGap)) {
          lastSeenGap[num] = index; // index 0 means most recent draw
        }
      }
    });

    // Process Bonus Ball
    if (draw.bonusBall >= 1 && draw.bonusBall <= rules.bonusMax) {
      bonusFreq[draw.bonusBall] = (bonusFreq[draw.bonusBall] || 0) + 1;
    }
  });

  // Calculate gaps for numbers never seen
  for (let i = 1; i <= rules.whiteMax; i++) {
    if (!(i in lastSeenGap)) {
      lastSeenGap[i] = draws.length;
    }
  }

  const sortedWhiteByFreq = Object.entries(whiteFreq)
    .map(([num, count]) => ({ num: Number(num), count }))
    .sort((a, b) => b.count - a.count);

  const hotWhite = sortedWhiteByFreq.slice(0, 5).map((x) => x.num);
  const coldWhite = sortedWhiteByFreq.slice(-5).map((x) => x.num);

  const overdueWhite = Object.entries(lastSeenGap)
    .map(([num, gap]) => ({ number: Number(num), gap }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 5);

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
  };
}

export function generateCombinations(
  analysis: AnalysisResult,
  game: GameType,
  count: number
): Array<{ whiteBalls: number[]; bonusBall: number }> {
  const rules = GAME_RULES[game];
  const results: Array<{ whiteBalls: number[]; bonusBall: number }> = [];

  // Weighted pool favoring hot and overdue numbers
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

    while (chosen.size < 5 && attempts < 500) {
      attempts++;
      const randomNum = pool[Math.floor(Math.random() * pool.length)];
      if (randomNum >= 1 && randomNum <= rules.whiteMax) {
        chosen.add(randomNum);
      }
    }

    // Fallback if weighted selection stalled
    while (chosen.size < 5) {
      const rand = Math.floor(Math.random() * rules.whiteMax) + 1;
      chosen.add(rand);
    }

    const whiteBalls = Array.from(chosen).sort((a, b) => a - b);
    const bonusBall = Math.floor(Math.random() * rules.bonusMax) + 1;

    results.push({ whiteBalls, bonusBall });
  }

  return results;
}