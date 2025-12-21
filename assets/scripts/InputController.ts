import { _decorator, Component, Node, EventTouch, Input, input, Camera, GeometryRenderer, PhysicsSystem2D, Intersection2D, Vec2, Vec3, UITransform } from 'cc';
import { Debris } from './Debris';
const { ccclass, property } = _decorator;

@ccclass('InputController')
export class InputController extends Component {

    @property(Camera)
    mainCamera: Camera = null!;

    @property(Node)
    debrisContainer: Node = null!; // Parent node containing all debris

    start() {
        // Listen for touch/drag events
        input.on(Input.EventType.TOUCH_START, this.onTouch, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouch, this);
    }

    onTouch(event: EventTouch) {
        const touchUILocation = event.getUILocation();
        
        const uiTransform = this.debrisContainer.getComponent(UITransform);
        const localPos = uiTransform.convertToNodeSpaceAR(new Vec3(touchUILocation.x, touchUILocation.y, 0));


        this.debrisContainer.children.forEach(child => {
            const debrisScript = child.getComponent(Debris);
            if (debrisScript && !debrisScript.isCleaned) {
                
                const boundingBox = child.getComponent(UITransform).getBoundingBox();
                const dist = Vec3.distance(child.position, localPos);
                
                if (dist < 80) { 
                    debrisScript.clean();
                }
            }
        });
    }
}