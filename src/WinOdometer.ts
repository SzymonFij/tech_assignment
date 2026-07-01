import { Container, Text, TextStyle, FillGradient } from "pixi.js";
import { gsap } from "gsap";
import { SLOT_CONFIG } from "./config";

function goldFill(): FillGradient {
    return new FillGradient({
        type: 'linear',
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
        colorStops: [
            { offset: 0,   color: 0xfff3b0 },
            { offset: 0.5, color: 0xffd24a },
            { offset: 1,   color: 0xc8881a },
        ],
        textureSpace: 'local',
    });
}

export class WinOdometer extends Container {
    private _amount: Text;
    private _tween: gsap.core.Tween | null = null;

    constructor() {
        super();

        this._amount = new Text({
            text: '0',
            style: new TextStyle({
                fontFamily: 'Arial',
                fontSize: 180,
                fontWeight: 'bold',
                fill: goldFill(),
                stroke: { color: 0x5a3500, width: 8, join: 'round' },
                dropShadow: {
                    color: 0x000000,
                    alpha: 0.6,
                    blur: 10,
                    angle: Math.PI / 2,
                    distance: 8,
                },
            }),
        });
        this._amount.anchor.set(0.5);
        this.addChild(this._amount);

        this.visible = false;
    }

    // Roll the counter from 0 up to `total`
    show(total: number): void {
        this.reset();
        if (total <= 0) {
            return;
        }

        this.visible = true;

        // A small pop as the win appears
        this.scale.set(0.6);
        gsap.to(this.scale, { x: 1, y: 1, duration: 0.3, ease: 'back.out(2)' });

        const counter = { value: 0 };
        this._tween = gsap.to(counter, {
            value: total,
            duration: SLOT_CONFIG.WIN_COUNT_MS / 1000,
            ease: 'power1.out',
            onUpdate: () => this._render(counter.value),
            onComplete: () => {
                this._render(total);
                this._bump();
                this._holdThenFade();
            },
        });
    }

    reset(): void {
        this._tween?.kill();
        this._tween = null;
        gsap.killTweensOf(this.scale);
        gsap.killTweensOf(this);
        this.scale.set(1);
        this.alpha = 1;
        this.visible = false;
        this._render(0);
    }

    // Keep the final amount on screen for a short time before fading it out
    private _holdThenFade(): void {
        gsap.to(this, {
            alpha: 0,
            duration: 0.4,
            delay: 1,
            ease: 'power1.in',
            onComplete: () => { this.visible = false; },
        });
    }

    // Quick scale bump when the count is completed
    private _bump(): void {
        gsap.killTweensOf(this.scale);
        this.scale.set(1);
        gsap.to(this.scale, {
            x: 1.25,
            y: 1.25,
            duration: 0.14,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1,
        });
    }

    private _render(value: number): void {
        this._amount.text = Math.floor(value).toLocaleString('en-US');
    }
}
