import { Sprite } from "pixi.js";
import { gsap } from "gsap";

export class SlotSymbol extends Sprite {
    private _symbolId: string;
    private _winTween: gsap.core.Tween | null = null;

    constructor(symbolId: string) {
        super();
        this._symbolId = symbolId;
        this.anchor.set(0.5);
        this.setSymbol(symbolId);
    }

    get id(): string {
        return this._symbolId;
    }

    setSymbol(symbolId: string): void {
        this._symbolId = symbolId;
        this.texture = Sprite.from(symbolId).texture;
    }

    playWinAnimation(): void {
        this.alpha = 1;
        gsap.killTweensOf(this.scale);
        this.scale.set(1);
        this._winTween = gsap.to(this.scale, {
            x: 1.2,
            y: 1.2,
            duration: 0.3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });
    }

    dimSymbol(): void {
        gsap.to(this, { alpha: 0.25, duration: 0.25 });
    }

    stopWinPulse(): void {
        this._winTween?.kill();
        this._winTween = null;
        gsap.killTweensOf(this.scale);
        gsap.to(this.scale, { x: 1, y: 1, duration: 0.15, ease: 'power2.out' });
    }

    resetAnimation(): void {
        this._winTween?.kill();
        this._winTween = null;
        gsap.killTweensOf(this);
        gsap.killTweensOf(this.scale);
        this.alpha = 1;
        this.scale.set(1);
    }
}
