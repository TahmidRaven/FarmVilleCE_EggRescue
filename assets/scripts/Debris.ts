import { _decorator, Component, Node, Tween, Vec3, UIOpacity, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Debris')
export class Debris extends Component {
    @property
    isCleaned: boolean = false;

    // Call this when the player swipes over this object
    clean() {
        if (this.isCleaned) return;
        this.isCleaned = true;

        // Visual Feedback: Slide away and fade out
        // Random direction for "flicking" effect
        const randomX = (Math.random() - 0.5) * 500; 
        const randomY = (Math.random() - 0.5) * 500; 
        const targetPos = this.node.position.clone().add3f(randomX, randomY, 0);

        // Ensure we have opacity component for fading
        let opacityComp = this.node.getComponent(UIOpacity);
        if (!opacityComp) opacityComp = this.node.addComponent(UIOpacity);

        // Simple Tween Animation (ASMR feel)
        new Tween(this.node)
            .to(0.5, { position: targetPos, angle: 180 }) // Slide & Rotate
            .start();

        new Tween(opacityComp)
            .to(0.4, { opacity: 0 }) // Fade out
            .call(() => {
                // Notify Game Manager (implemented below) and destroy
                this.node.emit('debris-cleaned');
                this.node.destroy();
            })
            .start();
    }
}