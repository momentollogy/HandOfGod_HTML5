import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
let handLandmarker = undefined;
let runningMode = "IMAGE";


// Accessing required HTML elements
const video = document.getElementById("webcam");
const enableWebcamButton = document.getElementById("webcamButton");
const fullscreenButton = document.getElementById("fullscreenButton");

class UIManager {
    constructor(drawEngine) {
        this.drawEngine = drawEngine;
        this.ctx = this.drawEngine.ctx;  // Accessing the canvas context from the DrawEngine
    }

    drawText(text, x, y) {
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = 'red';
        this.ctx.fillText(text, x, y);
    }

    drawCircle(x, y, radius, color) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#003300';
        this.ctx.stroke();
    }

    // Add other UI-specific methods here, like drawButton, displayScore, etc.
}

class WebcamManager 
{
    constructor(videoElement) {
        this.video = videoElement;
    }

    start() {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(stream => {
                this.video.srcObject = stream;
                this.video.onloadedmetadata = () => 
                {
                    outputCanvas.width = this.video.videoWidth;
                    outputCanvas.height = this.video.videoHeight;
                };
                this.video.style.display = "block";
                enableWebcamButton.innerText = "DISABLE WEBCAM";
            })
            .catch(error => {
                console.error("Error accessing webcam:", error);
            });
    }

    stop() {
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
            this.video.style.display = "none";
            enableWebcamButton.innerText = "ENABLE WEBCAM";
        }
    }

    initialize() {
        enableWebcamButton.addEventListener("click", () => {
            if (!video.srcObject) {
                this.start();
            } else {
                this.stop();
            }
        });

        fullscreenButton.addEventListener("click", function() {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) { /* Safari */
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { /* IE/Edge */
                video.msRequestFullscreen();
            }
        });
    }
}

class CVProcceser {
    
}

class DrawEngine {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
    }

}



class GameEngine {
    constructor(videoElement, canvasElement) {
        // Initialize the WebcamManager and DrawEngine within the GameEngine
        this.webcamManager = new WebcamManager(videoElement);
        this.drawEngine = new DrawEngine(canvasElement);
        this.uimanager = new UIManager(this.drawEngine);

    }
    
    initialize() {
        // Start the WebcamManager
        this.webcamManager.initialize();

    }

    // A method to test the DrawEngine by drawing some text and a circle
    testDrawEngine() 
    {
        // Draw Text
        this.uimanager.drawText('Canvas Ready!', 10, 50);
        
        // Draw a circle with center (100,100) and radius 50
        this.uimanager.drawCircle(100, 100, 50, 'blue');
    }

    
}


// Main Execution
const outputCanvas = document.getElementById('outputCanvas');
const gameEngine = new GameEngine(video, outputCanvas);
gameEngine.initialize();
