import { WinResult } from "./types";

// Payout for a single winning "way", indexed by match length (reels matched).
type SymbolPayouts = { [reelCount: number]: number };

/**
 * Mock paytable used for demo purposes.
 * Payout values are Hard-coded so the client can present a demo win amount.
 */
const PAYTABLE: Record<string, SymbolPayouts> = {
    high1: { 3: 50, 4: 150, 5: 500 },
    high2: { 3: 40, 4: 120, 5: 400 },
    high3: { 3: 30, 4: 100, 5: 300 },
    low1:  { 3: 20, 4: 60,  5: 200 },
    low2:  { 3: 20, 4: 60,  5: 200 },
    low3:  { 3: 10, 4: 40,  5: 120 },
    low4:  { 3: 10, 4: 40,  5: 120 },
};

export class Paytable {
    // Returns the payout for a single winning way of `symbol` across reels.
    static wayWinValue(symbol: string, reelCount: number): number {
        return PAYTABLE[symbol]?.[reelCount] ?? 0;
    }

    // Total win: every individual way contributes its value, returns the sum of all wins.
    static total(wins: WinResult[]): number {
        let total = 0;
        for (const win of wins) {
            const value = this.wayWinValue(win.symbol, win.reelCount);
            for (let i = 0; i < win.individualWays.length; i++) {
                total += value;
            }
        }
        return total;
    }
}
