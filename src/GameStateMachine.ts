export type GameState = 'Idle' | 'Spinning' | 'Stopping' | 'Win';

type StateChangeCallback = (state: GameState) => void;

const VALID_TRANSITIONS: Record<GameState, GameState[]> = {
    Idle:     ['Spinning'],
    Spinning: ['Stopping'],
    Stopping: ['Win', 'Idle'],
    Win:      ['Spinning'],
};

export class GameStateMachine {
    private _state: GameState = 'Idle';
    private _listeners: StateChangeCallback[] = [];

    get state(): GameState {
        return this._state;
    }

    transition(next: GameState): void {
        if (!VALID_TRANSITIONS[this._state].includes(next)) {
            console.warn(`Invalid transition from: ${this._state} to: ${next}`);
            return;
        }
        this._state = next;
        this._listeners.forEach(callback => callback(next));
    }

    onStateChange(callback: StateChangeCallback): void {
        this._listeners.push(callback);
    }
}
