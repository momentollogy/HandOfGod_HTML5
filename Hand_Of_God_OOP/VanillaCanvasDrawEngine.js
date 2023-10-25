export default class VanillaCanvasDrawEngine {
    constructor(_mpCanvas, _canvas, _mediaPipe, _video, _gm) {
        this.mpCanvasElement = _mpCanvas;
        this.canvasElement = _canvas;
        this.mpctx = this.mpCanvasElement.getContext("2d");
        this.ctx = this.canvasElement.getContext("2d");
        this.mediaPipe = _mediaPipe;
        this.video = _video;
        this.gm = _gm;
        this.label = "Hand Of God"

        this.tracking = true;
        this.looping = true;
    }

    clearCanvas()
    {
        this.mpctx.clearRect(0, 0, this.mpCanvasElement.width, this.mpCanvasElement.height);
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }

    setLabel(incomingText){
        this.label = incomingText;
    }

    drawUI()
    {
        // Draw all text and human readable stuff inbetween these save() and restore() methods.. otherwise they will be reversed
        //this.ctx.save();
        this.ctx.lineWidth = 1;
        //this.ctx.scale(-1, 1);
        this.ctx.font = "30px Arial";
        this.ctx.strokeText(this.label, -this.canvasElement.width+30, 30);
        //this.ctx.restore();
    }

    drawHands()
    {
        // get the results and store them as a class member even though results is only used in this method
        if(this.results == undefined){this.results = this.mediaPipe.getResults();}
        if(this.results== undefined){return;}
        // check if the video frame has updated, and if so: generate a new set of landmark results
        //let framesSinceStart = performance.now(); // Get the current Broswer frame number since the app started
        if (this.lastVideoTime !== this.video.currentTime) { //If brower refresh rate is faster than video rate dont draw past past that rate ie 30fps
            this.lastVideoTime = this.video.currentTime;
            this.results = this.mediaPipe.getResults();
        }

        if (this.results.landmarks) {
            for (const landmarks of this.results.landmarks) {
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

    toggleTracking(){this.tracking = !this.tracking}

    checkGameStateAndProcessWinLose()
    {
        //console.log(this.gm.currentLevel.win, this.gm.currentLevel.lose)
        if(this.gm.currentLevel.win)
        {
            console.log("WIN!!!!");
            this.gm.nextLevel();
        }
    }

    loop(timestamp) 
    {
        this.clearCanvas() // clear canvas

     //   this.ctx.strokeStyle = 'red';
       // this.ctx.lineWidth = 10;
      //  this.ctx.strokeRect(0, 0, this.mpCanvasElement.width, this.mpCanvasElement.height);

      //  this.ctx.strokeStyle = 'blue';
      //  this.ctx.lineWidth = 5;
      //  this.ctx.strokeRect(0, 0, this.canvasElement.width, this.canvasElement.height);




        if(this.tracking){this.drawHands()}  // draw hands
        
        this.gm.currentLevel.level_loop(this.results,this.canvasElement,this.ctx,timestamp); // draw game level stuff
       
        this.checkGameStateAndProcessWinLose(); // check game conditions

        this.drawUI() // draw UI

        if (this.looping) { requestAnimationFrame(this.loop.bind(this)); }

    }

}
