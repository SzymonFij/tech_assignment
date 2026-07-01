export interface WinResult {
	// The winning symbol id
	symbol: string;
	// Number of consecutive reels matched, from reel 0 (>= MIN_MATCH)
	// The paytable is indexed by (3-, 4-, 5-of-a-kind)
	reelCount: number;
	// Every winning cell — used to flash all winners together.
	positions: WinningPositions[];
	// Each individual "way" as a left-to-right path, one cell per reel
	individualWays: WinningPositions[][];
}

export interface WinningPositions {
	reel: number;
	row: number;
}

export type AssetConfig = {
	alias: string;
	src: string;
}