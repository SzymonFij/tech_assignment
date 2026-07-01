import { SlotSymbol } from "./SlotSymbol";
import { WinResult, WinningPositions } from "./types";
import { SLOT_CONFIG } from "./config";

/**
 * Plays the win highlight sequence on a fixed grid of symbols:
 *   1. flash every winning symbol together + dim loosing symbols
 *   2. then cycle through each individual winning "way"
 *
 * The caller decides when to start and stop the presentation (e.g. on the next spin)
 */
export class WinPresenter {
    private readonly _grid: SlotSymbol[][];
    private readonly _symbols: SlotSymbol[];
    private _timeout: ReturnType<typeof setTimeout> | null = null;
    private _running = false;

    constructor(grid: SlotSymbol[][]) {
        this._grid = grid;
        this._symbols = grid.flat();
    }

    start(wins: WinResult[]): void {
        this._running = true;

        this._highlight(this._allWinningSymbols(wins));

        const ways = wins.flatMap(win => win.individualWays);
        this._timeout = setTimeout(() => this._cycle(ways, 0), SLOT_CONFIG.WIN_FLASH_MS);
    }

    stop(): void {
        this._running = false;
        if (this._timeout !== null) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
        this._symbols.forEach(symbol => symbol.resetAnimation());
    }

    private _cycle(ways: WinningPositions[][], index: number): void {
        if (!this._running) return;

        this._highlight(this._symbolsAt(ways[index]));

        this._timeout = setTimeout(
            () => this._cycle(ways, (index + 1) % ways.length),
            SLOT_CONFIG.WIN_WAY_MS
        );
    }

    // Pulse the winning symbols, dim every other symbol on the grid.
    private _highlight(winners: Set<SlotSymbol>): void {
        for (const symbol of this._symbols) {
            symbol.stopWinPulse();
            if (winners.has(symbol)) {
                symbol.playWinAnimation();
            } else {
                symbol.dimSymbol();
            }
        }
    }

    // Every symbol that takes part in any win (used for the flash presentation)
    private _allWinningSymbols(wins: WinResult[]): Set<SlotSymbol> {
        return this._symbolsAt(wins.flatMap(win => win.positions));
    }

    private _symbolsAt(positions: WinningPositions[]): Set<SlotSymbol> {
        return new Set(positions.map(position => this._grid[position.reel][position.row]));
    }
}
