export default class Timer {
    constructor(canvasCtx) {
        this.canvasCtx = canvasCtx;
        this.startTime = null;
        this.elapsedTime = 0;
    }

    start() {
        this.startTime = Date.now();
    }

    update() {
        if (this.startTime !== null) {
            this.elapsedTime = Date.now() - this.startTime;
        }
    }

    draw() {
        this.canvasCtx.clearRect(0, 0, 150, 50);  // Clear previous timer area
        
        // Save the current canvas state
        this.canvasCtx.save();
    
        // Apply transformations to flip the text orientation
        this.canvasCtx.translate(150, 0);  // Adjust the x-coordinate based on the text width
        this.canvasCtx.scale(-1, 1);
    
        this.canvasCtx.fillStyle = 'white';
        this.canvasCtx.font = '30px Arial';
        this.canvasCtx.fillText((this.elapsedTime / 1000).toFixed(2) + ' s', 90, 30);  // Display elapsed time in seconds
    
        // Restore the original canvas state
        this.canvasCtx.restore();
    }

    getTime() {
        return this.elapsedTime;
    }
}
