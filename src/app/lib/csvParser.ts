import Papa from 'papaparse';
import { DrawData, GameType, GAME_RULES } from './lotteryEngine';

export interface ParseResult {
  data: DrawData[];
  errors: string[];
}

export function parseLotteryCSV(fileContent: string, game: GameType): ParseResult {
  const errors: string[] = [];
  const validDraws: DrawData[] = [];
  const rules = GAME_RULES[game];

  const parsed = Papa.parse<Record<string, string>>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    parsed.errors.forEach((e) => errors.push(`CSV Line ${e.row}: ${e.message}`));
  }

  parsed.data.forEach((row, index) => {
    const keys = Object.keys(row).reduce((acc, k) => {
      acc[k.trim().toLowerCase()] = row[k];
      return acc;
    }, {} as Record<string, string>);

    let date = keys['date'] || keys['draw date'] || `Draw #${index + 1}`;
    let whites: number[] = [];
    let bonus: number = NaN;

    if (keys['winning numbers']) {
      // Space or comma-delimited string format
      const parts = keys['winning numbers'].trim().split(/[\s,]+/);
      if (parts.length >= 6) {
        whites = parts.slice(0, 5).map(Number);
        bonus = Number(parts[5]);
      }
    } else {
      // Multi-column format
      const n1 = Number(keys['num1'] || keys['ball1'] || keys['n1']);
      const n2 = Number(keys['num2'] || keys['ball2'] || keys['n2']);
      const n3 = Number(keys['num3'] || keys['ball3'] || keys['n3']);
      const n4 = Number(keys['num4'] || keys['ball4'] || keys['n4']);
      const n5 = Number(keys['num5'] || keys['ball5'] || keys['n5']);
      const b = Number(keys['bonus'] || keys['powerball'] || keys['megaball'] || keys['pb']);

      whites = [n1, n2, n3, n4, n5];
      bonus = b;
    }

    const invalidWhite = whites.some((n) => isNaN(n) || n < 1 || n > rules.whiteMax);
    const invalidBonus = isNaN(bonus) || bonus < 1 || bonus > rules.bonusMax;

    if (whites.length === 5 && !invalidWhite && !invalidBonus) {
      validDraws.push({ date, whiteBalls: whites, bonusBall: bonus });
    } else {
      errors.push(`Row ${index + 2}: Dropped due to out-of-range or missing ball numbers.`);
    }
  });

  return { data: validDraws, errors };
}