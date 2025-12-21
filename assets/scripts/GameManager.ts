import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    // --- STEP 1: CLEANING ---
    @property(Node)
    debrisContainer: Node = null!;

    private totalDebris: number = 0;

    // --- STEP 2: REPAIR ---
    @property(Node)
    step2ToolsNode: Node = null!; 

    private fixedPieces: number = 0;
    private totalPiecesToFix: number = 3; 

    // --- STEP 3: WARMING ---
    @property(Node)
    step3ToolsNode: Node = null!; 

    start() {
        // --- SETUP STEP 1 ---
        this.totalDebris = this.debrisContainer.children.length;
        console.log(`Game Start: ${this.totalDebris} debris items to clean.`);

        this.debrisContainer.children.forEach((child: Node) => {
            child.on('debris-cleaned', this.onDebrisCleaned, this);
        });

        // Ensure later steps are hidden at start
        if (this.step2ToolsNode) this.step2ToolsNode.active = false;
        if (this.step3ToolsNode) this.step3ToolsNode.active = false;
    }

    // --- STEP 1 LOGIC ---
    onDebrisCleaned() {
        this.totalDebris--;
        if (this.totalDebris <= 0) {
            this.startStep2();
        }
    }

    // --- STEP 2 LOGIC ---
    startStep2() {
        console.log("Step 1 Complete! Starting Step 2 (Repair)...");
        
        if (this.step2ToolsNode) {
            this.step2ToolsNode.active = true;

            this.step2ToolsNode.children.forEach((tool: Node) => {
                tool.on('piece-fixed', this.onPieceFixed, this);
            });
        }
    }

    onPieceFixed() {
        this.fixedPieces++;
        console.log(`Piece Fixed: ${this.fixedPieces}/${this.totalPiecesToFix}`);

        if (this.fixedPieces >= this.totalPiecesToFix) {
            this.startStep3();
        }
    }

    // --- STEP 3 LOGIC ---
    startStep3() {
        console.log("Step 2 Complete! Starting Step 3 (Warm)...");

        if (this.step2ToolsNode) this.step2ToolsNode.active = false;
        
        if (this.step3ToolsNode) {
            this.step3ToolsNode.active = true;
        }
    }
}