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
    // Normalize all column header keys to lowercase & trimmed
    const keys = Object.keys(row).reduce((acc, k) => {
      acc[k.trim().toLowerCase()] = row[k] ? row[k].trim() : '';
      return acc;
    }, {} as Record<string, string>);

    const date = keys['date'] || keys['draw date'] || `Draw #${index + 1}`;
    let whites: number[] = [];
    let bonus: number = NaN;

    // Case 1: Single combined string column (e.g., "winning numbers" -> "04 18 26 43 70 21")
    const combinedCol = keys['winning numbers'] || keys['winning_numbers'] || keys['numbers'];
    
    if (combinedCol) {
      const parts = combinedCol.split(/[\s,]+/).filter(Boolean).map(Number);
      if (parts.length >= rules.whiteCount + 1) {
        whites = parts.slice(0, rules.whiteCount);
        bonus = parts[rules.whiteCount];
      }
    } else {
      // Case 2: Separate numeric columns (e.g., "num1", "num2" OR "ball1", "ball2")
      const parsedWhites: number[] = [];
      for (let i = 1; i <= rules.whiteCount; i++) {
        const val = Number(
          keys[`num${i}`] || 
          keys[`num ${i}`] || 
          keys[`ball${i}`] || 
          keys[`ball ${i}`] || 
          keys[`n${i}`] || 
          keys[`white${i}`]
        );
        parsedWhites.push(val);
      }
      
      bonus = Number(
        keys['bonus ball'] || 
        keys['bonus_ball'] || 
        keys['bonus'] || 
        keys['mega ball'] || 
        keys['megaball'] || 
        keys['powerball'] || 
        keys['pb'] || 
        keys['mb']
      );

      whites = parsedWhites;
    }

    // Validation Check against Active Rules Range
    const invalidWhite =
      whites.length !== rules.whiteCount ||
      whites.some((n) => isNaN(n) || n < 1 || n > rules.whiteMax);

    const invalidBonus = isNaN(bonus) || bonus < 1 || bonus > rules.bonusMax;

    if (!invalidWhite && !invalidBonus) {
      validDraws.push({ date, whiteBalls: whites, bonusBall: bonus });
    } else {
      errors.push(
        `Row ${index + 2}: Numbers [${whites.join(', ')} + ${bonus}] out of range for current matrix (White: 1..${rules.whiteMax}, Bonus: 1..${rules.bonusMax}).`
      );
    }
  });

  return { data: validDraws, errors };
}