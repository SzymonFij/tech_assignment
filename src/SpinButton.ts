import { Container, Sprite } from "pixi.js";
import { gsap } from "gsap";
import { GameState } from "./GameStateMachine";

export class SpinButton extends Container {
    public onClick: (() => void) | null = null;

    private _btn: Sprite;
    private _clickable = true;

    constructor() {
        super();

        this._btn = Sprite.from('spin_btn_normal');
        this._btn.anchor.set(0.5);
        this._btn.eventMode = 'static';
        this._btn.cursor = 'pointer';

        this._btn.on('pointerover', () => {
            if (this._clickable) {
                this._btn.texture = Sprite.from('spin_btn_over').texture; 
            }
        });
        this._btn.on('pointerout', () => {
            if (this._clickable) {
                this._btn.texture = Sprite.from('spin_btn_normal').texture; 
            }
        });
        this._btn.on('pointerdown', () => {
            if (!this._clickable) {
                return;
            }
            gsap.killTweensOf(this._btn.scale);
            gsap.to(this._btn.scale, { x: 0.9, y: 0.9, duration: 0.1, ease: 'power2.in' });
            this.onClick?.();
        });
        this._btn.on('pointerup', () => {
            gsap.killTweensOf(this._btn.scale);
            gsap.to(this._btn.scale, { x: 1, y: 1, duration: 0.15, ease: 'back.out(2)' });
        });
        this._btn.on('pointerupoutside', () => {
            gsap.killTweensOf(this._btn.scale);
            gsap.to(this._btn.scale, { x: 1, y: 1, duration: 0.15, ease: 'power2.out' });
        });

        this.addChild(this._btn);
    }

    onGameStateChange(state: GameState): void {
        this._clickable = state === 'Idle' || state === 'Win';
        if (this._clickable) {
            this._btn.texture = Sprite.from('spin_btn_normal').texture;
        } else {
            this._btn.texture = Sprite.from('spin_btn_disabled').texture;
        }
    }
}
