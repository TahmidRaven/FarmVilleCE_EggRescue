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
        // Get touch location in UI space
        const touchUILocation = event.getUILocation();
        
        // Convert to Node Space of the debris container
        const uiTransform = this.debrisContainer.getComponent(UITransform);
        const localPos = uiTransform.convertToNodeSpaceAR(new Vec3(touchUILocation.x, touchUILocation.y, 0));

        // Simple Distance Check (Efficient for Playable Ads)
        // Check all children to see if we touched them
        this.debrisContainer.children.forEach(child => {
            const debrisScript = child.getComponent(Debris);
            if (debrisScript && !debrisScript.isCleaned) {
                
                // Check if touch is inside the bounding box (approximated)
                const boundingBox = child.getComponent(UITransform).getBoundingBox();
                // We need to adjust bounding box to local coordinates relative to the child's position
                // Alternatively, simply check distance for "Brush" feel
                const dist = Vec3.distance(child.position, localPos);
                
                // If close enough (e.g., radius of 50px), clean it!
                if (dist < 80) { 
                    debrisScript.clean();
                }
            }
        });
    }
}