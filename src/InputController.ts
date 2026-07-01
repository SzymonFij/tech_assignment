import { Machine } from "./Machine";
import { SpinButton } from "./SpinButton";

export class InputController {
    private readonly _machine: Machine;
    private readonly _onKeyDown: (event: KeyboardEvent) => void;

    constructor(machine: Machine, button: SpinButton) {
        this._machine = machine;

        button.onClick = () => this._triggerSpin();
        machine.onStateChange(state => button.onGameStateChange(state));

        this._onKeyDown = this._handleKeyDown.bind(this);
        window.addEventListener('keydown', this._onKeyDown);
    }

    destroy(): void {
        window.removeEventListener('keydown', this._onKeyDown);
    }

    private _handleKeyDown(event: KeyboardEvent): void {
        if (event.code === 'Space') {
            event.preventDefault();
            this._triggerSpin();
        }
    }

    private _triggerSpin(): void {
        this._machine.spin();
    }
}
