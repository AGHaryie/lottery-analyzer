import { describe, it, expect } from 'vitest';
import { parseLotteryCSV } from '../csvParser';
import { GAME_RULES } from '../lotteryEngine';

describe('parseLotteryCSV Unit Tests', () => {
  it('should parse a valid Powerball CSV with zero errors', () => {
    const csv = `Draw Date, Winning Numbers\n08/05/2026, 14 20 48 54 61 04\n`;
    const result = parseLotteryCSV(csv, 'POWERBALL');

    expect(result.data.length).toBe(1);
    expect(result.errors.length).toBe(0);
    expect(result.data[0].whiteBalls).toEqual([14, 20, 48, 54, 61]);
    expect(result.data[0].bonusBall).toBe(4);
  });

  it('should drop rows with out-of-bounds numbers', () => {
    const csv = `Draw Date, Num1, Num2, Num3, Num4, Num5, Mega Ball\n08/04/2026, 04, 18, 26, 43, 999, 21\n`;
    const result = parseLotteryCSV(csv, 'MEGA_MILLIONS');

    expect(result.data.length).toBe(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should dynamically validate custom matrix boundaries', () => {
    const customRules = { whiteCount: 3, whiteMax: 10, bonusMax: 5, highThreshold: 5 };
    const validCsv = `Draw Date, Num1, Num2, Num3, Bonus Ball\n08/01/2026, 01, 05, 10, 05\n`;
    
    const result = parseLotteryCSV(validCsv, 'CUSTOM', customRules);
    expect(result.data.length).toBe(1);
    expect(result.data[0].whiteBalls).toEqual([1, 5, 10]);
  });
});