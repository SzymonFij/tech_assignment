export const SLOT_CONFIG = {
	REELS: 5,
	ROWS: 3,

	MIN_SYMBOLS_WIN_MATCH: 3,

	SYMBOL_HEIGHT: 192,
	SYMBOL_WIDTH: 200,
	
	SPIN_SPEED: 30,
	REEL_STOP_DELAY_MS: 300,
	SPIN_DURATION_MS: 2000,
	WIN_FLASH_MS: 1200,
	WIN_WAY_MS: 1200,
	WIN_COUNT_MS: 1000,

	// Scale applied to the slot view (reels frame + symbols together).
	MACHINE_SCALE: 1.3,
};

export const SYMBOLS = ['high1', 'high2', 'high3', 'low1', 'low2', 'low3', 'low4'] as const;
