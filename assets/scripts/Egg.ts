import { _decorator, Component, Node, Tween, Vec3, Sprite, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Egg')
export class Egg extends Component {

    @property(Node)
    chickVisual: Node = null!; // Drag the Chick sprite here

    private warmth: number = 0;
    private hatchThreshold: number = 100; // How long to hold (approx 1.5 seconds)
    private isHatched: boolean = false;
    private isWobbling: boolean = false;

    start() {
        if (this.chickVisual) this.chickVisual.active = false;
    }

    // Called by the Lamp script every frame it is close
    addWarmth() {
        if (this.isHatched) return;

        this.warmth++;
        this.wobble();

        // Change color slightly to show heat (Red tint)
        const sprite = this.node.getComponent(Sprite);
        if (sprite) {
            sprite.color.set(255, 255 - this.warmth, 255 - this.warmth, 255);
        }

        if (this.warmth >= this.hatchThreshold) {
            this.hatch();
        }
    }

    wobble() {
        if (this.isWobbling) return;
        this.isWobbling = true;

        // Shake left and right
        tween(this.node)
            .by(0.1, { angle: 10 })
            .by(0.1, { angle: -20 })
            .by(0.1, { angle: 10 })
            .call(() => { this.isWobbling = false; })
            .start();
    }

hatch() {
        this.isHatched = true;
        
        // Pop effect (Squish)
        tween(this.node)
            .to(0.1, { scale: new Vec3(1.2, 0.8, 1) }) // Squish down
            .to(0.1, { scale: new Vec3(0.1, 0.1, 1) }) // Shrink almost to nothing
            .call(() => {
                // 1. Hide the Egg Shell (Sprite) ONLY
                const sprite = this.node.getComponent(Sprite);
                if (sprite) sprite.enabled = false;
                
                // 2. IMPORTANT: Reset the container scale to 1 so the Chick can be seen!
                this.node.setScale(new Vec3(1, 1, 1));

                // 3. Show Chick
                if (this.chickVisual) {
                    this.chickVisual.active = true;
                    this.chickVisual.setScale(0, 0, 1); // Start chick at 0
                    
                    // Pop Chick out
                    tween(this.chickVisual)
                        .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'elasticOut' })
                        .start();
                }

                this.node.emit('egg-hatched');
            })
            .start();
    }
}