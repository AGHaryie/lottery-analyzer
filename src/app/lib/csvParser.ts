import Papa from 'papaparse';
import { DrawData, GameType, GAME_RULES, GameRules } from './lotteryEngine';

export interface ParseResult {
  data: DrawData[];
  errors: string[];
}

export function parseLotteryCSV(
  fileContent: string,
  game: GameType,
  customRules?: GameRules
): ParseResult {
  const errors: string[] = [];
  const validDraws: DrawData[] = [];
  const rules = game === 'CUSTOM' && customRules ? customRules : GAME_RULES[game];

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

    const date = keys['date'] || keys['draw date'] || `Draw #${index + 1}`;
    let whites: number[] = [];
    let bonus: number = NaN;

    if (keys['winning numbers']) {
      const parts = keys['winning numbers'].trim().split(/[\s,]+/);
      if (parts.length >= rules.whiteCount + 1) {
        whites = parts.slice(0, rules.whiteCount).map(Number);
        bonus = Number(parts[rules.whiteCount]);
      }
    } else {
      const parsedWhites: number[] = [];
      for (let i = 1; i <= rules.whiteCount; i++) {
        const val = Number(keys[`num${i}`] || keys[`ball${i}`] || keys[`n${i}`]);
        parsedWhites.push(val);
      }
      bonus = Number(keys['bonus'] || keys['powerball'] || keys['megaball'] || keys['pb']);
      whites = parsedWhites;
    }

    const invalidWhite =
      whites.length !== rules.whiteCount ||
      whites.some((n) => isNaN(n) || n < 1 || n > rules.whiteMax);
    const invalidBonus = isNaN(bonus) || bonus < 1 || bonus > rules.bonusMax;

    if (!invalidWhite && !invalidBonus) {
      validDraws.push({ date, whiteBalls: whites, bonusBall: bonus });
    } else {
      errors.push(`Row ${index + 2}: Dropped due to numbers out of range for this matrix.`);
    }
  });

  return { data: validDraws, errors };
}