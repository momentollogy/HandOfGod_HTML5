export default class KeyboardManager {
    constructor(level,audioManager) {
        this.level = level;
        this.audioManager = audioManager;
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        const { key, code } = event;
        switch(key.toLowerCase()) {


         //for levelbasic touch
            case 'p':
                this.level.togglePlayPause();
                break;
              
            case 'r':
                this.level.resetLevel();
                break;


              //for basic sound test
                case 'p':
                 this.audioManager.togglePlayPause();
                 break;
             case 'r':
                 this.audioManager.restartAudio();
                 break;


                
            case 'b':
                this.level.toggleBeatRanges();
                break;
            case ',':
                this.level.adjustBeatBufferTime(-10);
                break;
            case '.':
                this.level.adjustBeatBufferTime(10);
                break;
            case '-':
                this.level.adjustVelocity(-10);
                break;
            case '=':
                this.level.adjustVelocity(10);
                break;
            case 'k':
                this.level.toggleBoxVisibility();
                break;
            case '1':
                this.level.adjustMaxBufferLimit(-1);
                break;
            case '2':
                this.level.adjustMaxBufferLimit(1);
                break;
            case '3':
                this.level.setMaxBufferLimit(999);
                break;
            default:
                this.handleMovementKeys(code);
                break;
        }
    }

    handleKeyUp(event) {
        const { code } = event;
        if (code === 'KeyA') this.level.A_pressed = false;
        if (code === 'KeyS') this.level.S_pressed = false;
    }

    handleMovementKeys(code) {
        let step = event.shiftKey ? this.level.fastMovementStep : this.level.movementStep;
        switch(code) {
            case 'ArrowLeft':
                this.level.moveCircles('left', step);
                break;
            case 'ArrowRight':
                this.level.moveCircles('right', step);
                break;
            case 'ArrowUp':
                this.level.moveCircles('up', step);
                break;
            case 'ArrowDown':
                this.level.moveCircles('down', step);
                break;
            case 'KeyA':
                this.level.A_pressed = true;
                break;
            case 'KeyS':
                this.level.S_pressed = true;
                break;
        }
    }



    dispose() {
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        document.removeEventListener('keyup', this.handleKeyUp.bind(this));
    }
}
