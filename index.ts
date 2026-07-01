import { Application, Assets, Sprite, Container, Graphics, DestroyOptions } from 'pixi.js';
import { Machine } from "./src/Machine";
import { SpinButton } from "./src/SpinButton";
import { WinOdometer } from "./src/WinOdometer";
import { InputController } from "./src/InputController";
import { urls } from './img/index';
import { AssetConfig } from './src/types';
import { SLOT_CONFIG } from './src/config';

const DESIGN_SIZE = {
    width: 1920,
    height: 1080
};

class MainScene extends Container {
    private _machine: Machine;
    private _inputController: InputController;
    private _odometer: WinOdometer;

    constructor() {
        super();

        const background = Sprite.from('background');
        background.anchor.set(0.5);
        background.position.set(DESIGN_SIZE.width * 0.5, DESIGN_SIZE.height * 0.5);
        this.addChild(background);

        // slotView groups the frame and the symbol grid so they scale together.
        const slotView = new Container();
        slotView.position.set(DESIGN_SIZE.width * 0.5, DESIGN_SIZE.height * 0.5);
        slotView.scale.set(SLOT_CONFIG.MACHINE_SCALE);
        this.addChild(slotView);

        const reelsFrame = Sprite.from('reels_base');
        reelsFrame.anchor.set(0.5);
        reelsFrame.alpha = 0.4;
        slotView.addChild(reelsFrame);

        const machine = new Machine();
        const gridCenterX = (SLOT_CONFIG.REELS - 1) * SLOT_CONFIG.SYMBOL_WIDTH / 2;
        const gridCenterY = (SLOT_CONFIG.ROWS - 1) * SLOT_CONFIG.SYMBOL_HEIGHT / 2;
        machine.position.set(-gridCenterX, -gridCenterY);
        slotView.addChild(machine);

        // Single mask covering all reels
        const machineMask = new Graphics();
        machineMask.rect(
            -SLOT_CONFIG.SYMBOL_WIDTH / 2,
            -SLOT_CONFIG.SYMBOL_HEIGHT / 2,
            SLOT_CONFIG.SYMBOL_WIDTH * SLOT_CONFIG.REELS,
            SLOT_CONFIG.SYMBOL_HEIGHT * SLOT_CONFIG.ROWS
        );
        machineMask.fill(0xffffff);
        machine.addChild(machineMask);
        machine.mask = machineMask;

        const spinButton = new SpinButton();
        spinButton.position.set(DESIGN_SIZE.width * 0.92, DESIGN_SIZE.height * 0.88);
        this.addChild(spinButton);

        const odometer = new WinOdometer();
        odometer.position.set(DESIGN_SIZE.width * 0.5, DESIGN_SIZE.height * 0.5);
        this.addChild(odometer);

        machine.onWin = total => odometer.show(total);
        machine.onStateChange(state => {
            if (state === 'Spinning') {
                odometer.reset();
            }
        });

        this._machine = machine;
        this._inputController = new InputController(machine, spinButton);
        this._odometer = odometer;
    }

    update(dt: number) {
        this._machine.update(dt);
    }

    override destroy(options?: DestroyOptions): void {
        this._odometer.reset();
        this._inputController.destroy();
        super.destroy(options);
    }
}

class Game {

    constructor(public app: Application) {}

    async initialize(urls: readonly AssetConfig[]) {
        await Assets.load(urls);
    }

    setScene(scene: Container) {
        this.app.stage.removeChildren();
        this.app.stage.addChild(scene);
    }
}

(async () => {
    const app = new Application();
    await app.init({ width: DESIGN_SIZE.width, height: DESIGN_SIZE.height, backgroundColor: 0x000000 });

    app.canvas.style.position = 'absolute';
    app.canvas.style.top = '0';
    app.canvas.style.left = '0';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.background = '#000';
    document.body.appendChild(app.canvas);

    const game = new Game(app);
    await game.initialize(urls);

    const main = new MainScene();
    game.setScene(main);

    function resize() {
        const scale = Math.min(
            window.innerWidth / DESIGN_SIZE.width,
            window.innerHeight / DESIGN_SIZE.height
        );
        app.renderer.resize(window.innerWidth, window.innerHeight);
        main.scale.set(scale);
        main.position.set(
            (window.innerWidth - DESIGN_SIZE.width * scale) * 0.5,
            (window.innerHeight - DESIGN_SIZE.height * scale) * 0.5
        );
    }

    window.addEventListener('resize', resize);
    resize();

    app.ticker.add(({ deltaTime }) => {
        main.update(deltaTime);
    });
})();
