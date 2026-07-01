import { SLOT_CONFIG } from "./config";
import { WinningPositions, WinResult } from "./types";

export class WinChecker {
	static check(board: string[][]): WinResult[] {
		const wins: WinResult[] = [];

		const candidates = [...new Set(board[0])];

		for (const symbol of candidates) {
			const reelMatches: WinningPositions[][] = [];
			
			for (let reel = 0; reel < board.length; reel++) {
				const positions: WinningPositions[] = [];

				for (let row = 0; row < board[reel].length; row++) {
					if (board[reel][row] === symbol) {
						positions.push({reel, row});
					}
				}

				if (positions.length === 0) {
					break;
				}

				reelMatches.push(positions);
			}

			if (reelMatches.length >= SLOT_CONFIG.MIN_SYMBOLS_WIN_MATCH) {
				// Generate every possible left-to-right winning path by combining one matching position from each reel.
				// (Cartesian product)
				const individualWays = reelMatches.reduce<WinningPositions[][]>(
					(paths, reelPos) => paths.flatMap(path => reelPos.map(pos => [...path, pos])),
					[[]]
				);

				wins.push({
					symbol,
					reelCount: reelMatches.length,
					positions: reelMatches.flat(),
					individualWays,
				});
			}
		}
		return wins;
	}
}