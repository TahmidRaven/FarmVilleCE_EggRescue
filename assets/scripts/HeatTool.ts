import { _decorator, Component, Node, EventTouch, Input, Vec3, UITransform } from 'cc';
import { Egg } from './Egg';
const { ccclass, property } = _decorator;

@ccclass('HeatTool')
export class HeatTool extends Component {

    @property([Node])
    eggs: Node[] = [];  

    private isDragging: boolean = false;

    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onDragStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onDragMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onDragEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onDragEnd, this);
    }

    update(deltaTime: number) {
        if (!this.isDragging) return;

        // Check distance to all eggs
        const lampPos = this.node.getWorldPosition();
        
        this.eggs.forEach(eggNode => {
            const eggScript = eggNode.getComponent(Egg);
            if (eggScript) {
                const eggPos = eggNode.getWorldPosition();
                const dist = Vec3.distance(lampPos, eggPos);

                // If lamp is close (e.g. 250 pixels), warm the egg
                if (dist < 250) {
                    eggScript.addWarmth();
                }
            }
        });
    }

    onDragStart(event: EventTouch) {
        this.isDragging = true;
    }

    onDragMove(event: EventTouch) {
        if (!this.isDragging) return;
        const delta = event.getUIDelta();
        this.node.position = this.node.position.add3f(delta.x, delta.y, 0);
    }

    onDragEnd(event: EventTouch) {
        this.isDragging = false;
    }
}