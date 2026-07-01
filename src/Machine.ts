import { Container } from "pixi.js";
import { Reel } from "./Reel";
import { Outcome } from "./Outcome";
import { WinChecker } from "./WinChecker";
import { WinPresenter } from "./WinPresenter";
import { Paytable } from "./Paytable";
import { GameStateMachine, GameState } from "./GameStateMachine";
import { SLOT_CONFIG } from "./config";

/**
 * Orchestrates the reels and the game's state flow:
 *   Idle -> Spinning -> Stopping -> (Win | Idle)
 * Win checking is delegated to WinChecker, win visuals to WinPresenter.
 */
export class Machine extends Container {
    // Emitted with the total win (in credits) whenever a spin produces a win.
    public onWin: ((total: number) => void) | null = null;

    private _reels: Reel[] = [];
    private _stateMachine = new GameStateMachine();
    private _winPresenter: WinPresenter;

    constructor() {
        super();
        this._createReels();
        this._winPresenter = new WinPresenter(this._reels.map(reel => reel.symbols));
    }

    get state(): GameState {
        return this._stateMachine.state;
    }

    onStateChange(callback: (state: GameState) => void): void {
        this._stateMachine.onStateChange(callback);
    }

    spin(): void {
        const state = this._stateMachine.state;

        // Spin interrupts the presentation and starts a fresh round.
        if (state === 'Win') {
            this._winPresenter.stop();
        } else if (state !== 'Idle') {
            return;
        }

        this._stateMachine.transition('Spinning');
        this._startReels();
    }

    update(dt: number): void {
        for (const reel of this._reels) {
            reel.update(dt);
        }
    }

    private _createReels(): void {
        for (let i = 0; i < SLOT_CONFIG.REELS; i++) {
            const reel = new Reel();
            reel.position.x = i * SLOT_CONFIG.SYMBOL_WIDTH;
            this.addChild(reel);
            this._reels.push(reel);
        }
    }

    private _startReels(): void {
        for (const reel of this._reels) {
            reel.startSpin();
        }
        setTimeout(() => this._beginStop(), SLOT_CONFIG.SPIN_DURATION_MS);
    }

    private _beginStop(): void {
        this._stateMachine.transition('Stopping');

        const outcome = Outcome.resolve();

        const stopPromises = this._reels.map(
            (reel, i) => new Promise<void>(resolve => {
                setTimeout(() => reel.stopSpin(outcome[i]).then(resolve), i * SLOT_CONFIG.REEL_STOP_DELAY_MS);
            })
        );

        Promise.all(stopPromises).then(() => {
            const wins = WinChecker.check(outcome);

            if (wins.length > 0) {
                this._stateMachine.transition('Win');
                this._winPresenter.start(wins);
                this.onWin?.(Paytable.total(wins));
            } else {
                this._stateMachine.transition('Idle');
            }
        });
    }
}
