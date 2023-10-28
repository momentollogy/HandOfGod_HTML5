import MediaPipeTracker from './MediaPipeTracker.js';

export default class DrawEngine {
    constructor() {        
        this.gm;
        this.mediaPipe = MediaPipeTracker.getInstance();
        
        this.video = document.getElementById("webcam");
        this.mpCanvasElement = document.getElementById("mediaPipe_canvas");
        this.canvas = document.getElementById("output_canvas");
        this.mpctx = this.mpCanvasElement.getContext("2d");
        this.ctx = this.canvas.getContext("2d");

        this.tracking = true;
        this.looping = true;
        this.lastTimeStamp = 0;
        this.deltaTime = 0;
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

    drawHands()
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

    toggleLoop()
    {
        this.looping = ! this.looping;
        if(this.looping){this.loop();}
    }

    toggleTracking()
    {
        this.tracking = !this.tracking
    }

    toggleVideo()
    {
        if( this.video.style.display == "none")
            this.video.style.display = "block";
        else
        this.video.style.display = "none";
    }

    setInfoText(...args){
        this.ctx.fillStyle = "rgba(0,0,255,.15)";
        this.ctx.fillRect(10,10,350,this.canvas.height-20);
        this.ctx.globalAlpha = 1.0;
        this.ctx.font = "36px Arial";
        this.ctx.fillStyle = "rgba(0,255,0,1)";
        for (let i=0 ; i<args.length ; i++){
            this.ctx.fillText(args[i], 185 , 40 + (i*36));
        }
    }

    loop(timestamp) 
    {
        this.deltaTime = timestamp - this.lastTimestamp;

        this.clearCanvas() // clear canvas

        if(this.tracking){this.drawHands()}  // draw hands
        
        this.gm.currentLevel.level_loop(); // draw game level stuff

        this.lastTimestamp = timestamp
        if (this.looping) { requestAnimationFrame(this.loop.bind(this)); }
    }
}
