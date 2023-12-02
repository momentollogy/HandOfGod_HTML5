import MediaPipeTracker from './MediaPipeTracker.js';

export default class DrawEngine {
    constructor() {        
        this.gm;
        this.mediaPipe = MediaPipeTracker.getInstance();
        
        this.video = document.getElementById("webcam");
        this.mpCanvasElement = document.getElementById("mediaPipe_canvas");

      //  this.mpCanvasElement.style.zIndex = "10"; // Use a higher value to bring it to the front

        this.canvas = document.getElementById("output_canvas");
        this.mpctx = this.mpCanvasElement.getContext("2d");
        this.ctx = this.canvas.getContext("2d");

        this.displayTracking = true;
        this.looping = true;
        this.lastTimeStamp = 0;
        this.deltaTime = 0;
    }

    static popup(str){
        let de = this.getInstance();
        de.setInfoText(str);
    }

    static getInstance() {
        if (!DrawEngine.instance) {
            DrawEngine.instance = new DrawEngine();
        }
        return DrawEngine.instance;
    }

    setGameManager(_gm){
        this.gm = _gm;
    }

    clearCanvas()
    {
        this.mpctx.clearRect(0, 0, this.mpCanvasElement.width, this.mpCanvasElement.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    calculateHands()
    {
        // get the results and store them as a class member even though results is only used in this method
        
        if(this.mediaPipe.results == undefined){this.mediaPipe.detectVideoResults();}
        if(this.mediaPipe.results == undefined){return;}
        // check if the video frame has updated, and if so: generate a new set of landmark results
        //let framesSinceStart = performance.now(); // Get the current Broswer frame number since the app started
        if (this.lastVideoTime !== this.video.currentTime) { //If brower refresh rate is faster than video rate dont draw past past that rate ie 30fps
            this.lastVideoTime = this.video.currentTime;
            this.mediaPipe.detectVideoResults();
        }
    }

    drawHands()
    {
        if (this.mediaPipe.results.landmarks) {
            for (const landmarks of this.mediaPipe.results.landmarks) {
                drawConnectors(this.mpctx, landmarks, HAND_CONNECTIONS, {
                    color: "#00FF00",
                    lineWidth: 1
                });
                drawLandmarks(this.mpctx, landmarks, { color: "#FF0000", lineWidth: .1 });   
            }
        }
    }

    
    loop(timestamp) 
    {
        this.deltaTime = timestamp - this.lastTimestamp;

        this.clearCanvas() // clear canvas

        this.calculateHands();
    
        this.gm.currentLevel.level_loop(); // draw game level stuff
        if(this.displayTracking){this.drawHands()}  // draw hands
        
        this.lastTimestamp = timestamp
        if (this.looping) { requestAnimationFrame(this.loop.bind(this)); }
    }
}
