import { _decorator, Component, Node, EventTouch, Input, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RepairTool')
export class RepairTool extends Component {

    @property(Node)
    targetGhost: Node = null!; // The dark "hole" on the nest

    @property(Node)
    fixedVisual: Node = null!; // The piece inside the nest (to turn on when fixed)

    private startPos: Vec3 = new Vec3();
    private isDragging: boolean = false;

    start() {
        this.startPos = this.node.position.clone();
        this.node.on(Input.EventType.TOUCH_START, this.onDragStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onDragMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onDragEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onDragEnd, this);
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
        
        // Check distance to the Ghost Target
        const myPos = this.node.getWorldPosition();
        const targetPos = this.targetGhost.getWorldPosition();
        
        // If close enough (within 100 pixels)
        if (Vec3.distance(myPos, targetPos) < 100) {
            this.snapToTarget();
        } else {
            // Return to start if missed
            tween(this.node).to(0.2, { position: this.startPos }).start();
        }
    }

    snapToTarget() {
        // 1. Hide this draggable tool
        this.node.active = false; 
        
        // 2. Hide the "Shadow" ghost
        this.targetGhost.active = false;

        // 3. Show the "Fixed" visual (making the nest look whole)
        this.fixedVisual.active = true;
        
        // 4. Pop effect
        this.fixedVisual.setScale(0.5, 0.5, 1);
        tween(this.fixedVisual).to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }).start();

        // 5. Notify Game Manager (Optional, if you want to track progress)
        this.node.emit('piece-fixed'); 
    }
}