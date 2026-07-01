import { Container, BlurFilter } from "pixi.js";
import { gsap } from "gsap";
import { SlotSymbol } from "./SlotSymbol";
import { SLOT_CONFIG, SYMBOLS } from "./config";

// Symbol number with one fake row for smooth transition
const TOTAL_SYMBOL_COUNT = SLOT_CONFIG.ROWS + 1;
// Distance a symbol travels before being recycled to the top.
// Must equal TOTAL_SYMBOL_COUNT * SYMBOL_HEIGHT so the symbol lands at -SYMBOL_HEIGHT (fake row above mask).
const SYMBOL_RECYCLE_DISTANCE = SLOT_CONFIG.SYMBOL_HEIGHT * TOTAL_SYMBOL_COUNT;
// Threshold: recycle a symbol once its center is one full slot past the last visible row.
const SYMBOL_RECYCLE_THRESHOLD = SLOT_CONFIG.SYMBOL_HEIGHT * SLOT_CONFIG.ROWS;

export class Reel extends Container {
    private _reel: SlotSymbol[] = [];
    private _isSpinning = false;
    private _blurFilter: BlurFilter;

    constructor() {
        super();
        this._buildReel();

        this._blurFilter = new BlurFilter({ strengthX: 0, strengthY: 0 });
        this.filters = [this._blurFilter];
    }

    get symbols(): SlotSymbol[] {
        return this._reel.slice(1);
    }

    startSpin(): void {
        this._isSpinning = true;
        gsap.to(this._blurFilter, { strengthY: 7, duration: 0.15, ease: 'power2.in' });
    }

    stopSpin(outcome: string[]): Promise<void> {
        this._isSpinning = false;

        // Fade out blur as reel stops
        gsap.to(this._blurFilter, { strengthY: 0, duration: 0.35, ease: 'power2.out' });

        // Reset fake symbol back to its starting position (above the visible area)
        this._reel[0].setSymbol(this._randomSymbol());
        this._reel[0].position.y = -SLOT_CONFIG.SYMBOL_HEIGHT;

        // Move symbols below their final positions — the tween brings them up
        const bounceOffset = SLOT_CONFIG.SYMBOL_HEIGHT * 0.4;
        for (let i = 0; i < SLOT_CONFIG.ROWS; i++) {
            this._reel[i + 1].setSymbol(outcome[i]);
            this._reel[i + 1].position.y = i * SLOT_CONFIG.SYMBOL_HEIGHT + bounceOffset;
        }

        return new Promise(resolve => {
            gsap.to(
                this._reel.slice(1).map(symbol => symbol.position), // slice(1) omits fake reel
                {
                    y: (i: number) => i * SLOT_CONFIG.SYMBOL_HEIGHT,
                    duration: 0.5,
                    ease: 'back.out(2.5)',
                    onComplete: resolve,
                }
            );
        });
    }

    update(dt: number): void {
        if (!this._isSpinning) {
            return;
        }

        for (const symbol of this._reel) {
            symbol.position.y += SLOT_CONFIG.SPIN_SPEED * dt;

            // Recycle the symbol above the visible area once it exits at the bottom.
            // SYMBOL_RECYCLE_THRESHOLD = just past the last visible row
            // Subtracting SYMBOL_RECYCLE_DISTANCE positions symbols one slot above the mask (on fake row)
            if (symbol.position.y > SYMBOL_RECYCLE_THRESHOLD) {
                symbol.position.y -= SYMBOL_RECYCLE_DISTANCE;
                symbol.setSymbol(this._randomSymbol());
            }
        }
    }

    private _buildReel(): void {
        for (let i = 0; i < TOTAL_SYMBOL_COUNT; i++) {
            const symbol = new SlotSymbol(this._randomSymbol());
            symbol.position.y = (i - 1) * SLOT_CONFIG.SYMBOL_HEIGHT;
            this.addChild(symbol);
            this._reel.push(symbol);
        }
    }

    private _randomSymbol(): string {
        return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }
}
