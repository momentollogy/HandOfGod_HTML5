export default class VanillaCanvasDrawEngine {
    constructor(_canvas, _mediaPipe, _video, _gm) {
        this.canvasElement = _canvas;
        this.canvasCtx = this.canvasElement.getContext("2d");
        this.mediaPipe = _mediaPipe;
        this.video = _video;
        this.gm = _gm;

        this.tracking = true;
        this.looping = true;

        this.bub = document.getElementById("bubblePic");
        console.log("vanillaConstructer",this.gm)
    }

    clearCanvas()
    {
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }

    drawUI()
    {
        // Draw label
        this.canvasCtx.font = "30px Arial";
        this.canvasCtx.strokeText("Bubble Menu",30,30)

        // calculate xPos using a sin wave for simple oscilating motion
        this.xVal = (Math.sin(performance.now()*.001) * this.canvasElement.width/2) + this.canvasElement.width/2 - 64;

        // draw bubble using xPos
        this.canvasCtx.drawImage(this.bub, this.xVal, 50, 128, 128 );
    }

    drawHands()
    {
        // get the results and store them as a class member even though results is only used in this method
        if(this.results == undefined){this.results = this.mediaPipe.getResults();}
        if(this.results== undefined){return;}
        // check if the video frame has updated, and if so: generate a new set of landmark results
        let framesSinceStart = performance.now(); // Get the current Broswer frame number since the app started
        if (this.lastVideoTime !== this.video.currentTime) { //If brower refresh rate is faster than video rate dont draw past past that rate ie 30fps
            this.lastVideoTime = this.video.currentTime;
            this.results = this.mediaPipe.getResults();
        }

        if (this.results.landmarks) {
            for (const landmarks of this.results.landmarks) {
                drawConnectors(this.canvasCtx, landmarks, HAND_CONNECTIONS, {
                    color: "#00FF00",
                    lineWidth: 1
                });
                drawLandmarks(this.canvasCtx, landmarks, { color: "#FF0000", lineWidth: .1 });   
            }
        }
    }

    toggleLoop()
    {
        this.looping = ! this.looping;
        console.log('Looping state!!!:', this.looping);  // <-- Log the looping state

        if(this.looping){this.loop();}
    }

    toggleTracking(){this.tracking = !this.tracking}

    loop() 
    {
        console.log('Loop is being called!!!!!!!');  // <-- This line logs to the console each time loop() is called

       // this.clearCanvas() // clear canvas

        this.canvasCtx.fillStyle = 'red';  // Set fill color to red
        this.canvasCtx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);  // Fill the entire canvas red
       
        if(this.tracking){this.drawHands()}  // draw hands
        
        this.gm.currentLevel.level_loop(this.results,this.canvasElement,this.canvasCtx); // draw game level stuff
        
        this.drawUI() // draw UI

        if (this.looping) { requestAnimationFrame(() => this.loop()); }  // repeat loop
    }
}
