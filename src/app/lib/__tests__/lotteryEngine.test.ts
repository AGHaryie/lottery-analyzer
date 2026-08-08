import { describe, it, expect } from 'vitest';
import { analyzeDraws, generateCombinations, DrawData } from '../lotteryEngine';

describe('Lottery Statistical Engine', () => {
  const mockPowerballDraws: DrawData[] = [
    { date: '2026-08-01', whiteBalls: [10, 20, 30, 40, 50], bonusBall: 15 },
    { date: '2026-07-28', whiteBalls: [10, 21, 31, 41, 51], bonusBall: 15 },
    { date: '2026-07-25', whiteBalls: [10, 22, 32, 42, 52], bonusBall: 5 },
  ];

  it('calculates hot and cold numbers correctly', () => {
    const stats = analyzeDraws(mockPowerballDraws, 'POWERBALL');
    
    // Number 10 appeared in all 3 draws -> Hot
    expect(stats.hotWhite[0]).toBe(10);
    expect(stats.whiteFrequency[10]).toBe(3);
    expect(stats.totalDraws).toBe(3);
  });

  it('tracks overdue numbers gap correctly', () => {
    const stats = analyzeDraws(mockPowerballDraws, 'POWERBALL');
    
    // Number 50 appeared at index 0 (most recent draw), gap should be 0
    const item50 = stats.overdueWhite.find(o => o.number === 50);
    if (item50) {
      expect(item50.gap).toBe(0);
    }
  });

  it('generates exact number of requested combinations within boundary bounds', () => {
    const stats = analyzeDraws(mockPowerballDraws, 'POWERBALL');
    const tickets = generateCombinations(stats, 'POWERBALL', 5);

    expect(tickets.length).toBe(5);

    tickets.forEach((ticket) => {
      expect(ticket.whiteBalls.length).toBe(5);
      expect(ticket.bonusBall).toBeGreaterThanOrEqual(1);
      expect(ticket.bonusBall).toBeLessThanOrEqual(26);

      ticket.whiteBalls.forEach((num) => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(69);
      });
    });
  });
});