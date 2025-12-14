import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    debrisContainer: Node = null!;

    @property(Node)
    step2ToolsNode: Node = null!; // Drag "Step2_Tools" here

    private totalDebris: number = 0;

    start() {
        // Count Debris
        this.totalDebris = this.debrisContainer.children.length;

        // Listen for cleaning
        this.debrisContainer.children.forEach(child => {
            child.on('debris-cleaned', this.onDebrisCleaned, this);
        });
    }

    onDebrisCleaned() {
        this.totalDebris--;
        if (this.totalDebris <= 0) {
            this.startStep2();
        }
    }

    startStep2() {
        console.log("Step 1 Complete! Starting Step 2...");
        
        // Reveal the Repair Tools
        if (this.step2ToolsNode) {
            this.step2ToolsNode.active = true;
        }
    }
}