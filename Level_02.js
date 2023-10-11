import Circle from './Circle.js';  // Adjust the path to match the location of your Circle.js file


export default class Level_01
{
    constructor(mp,canvasElement, canvasCtx){
        this.xpos = 0;
        this.ypos = 0;
        this.canvas = canvasElement;  // Fixed here
        this.ctx = canvasCtx;  // Fixed here
        this.win = false;
        this.lose= false;

        //console.log("MATTS",canvasElement, canvasCtx);
        this.circle = new Circle(canvasElement, canvasCtx);
    }

    level_loop(results,canvasElement,canvasCtx)
    {
        // if landmark results exist, then you can loop over them and do stuff ( like console.log their coordinates )
        if(results.landmarks)
        {
            for (const landmarks of results.landmarks) 
            {
                this.xpos = landmarks[8].x * canvasElement.width;
                this.ypos = landmarks[8].y * canvasElement.height;

                this.xpos1 = landmarks[20].x * canvasElement.width;
                this.ypos1 = landmarks[20].y * canvasElement.height;
            }
        }
    
        // place a bubble at the fingertip coordinates
        const bub = document.getElementById("bubblePic");
        const bub1 = document.getElementById("bubblePic");
        canvasCtx.drawImage(bub, this.xpos-23, this.ypos-23, 46, 46 );
        canvasCtx.drawImage(bub1, this.xpos1-23, this.ypos1-23, 46, 46 );

        // win lose condition is set here
        if(this.xpos-23 > 320)
        {
          this.win=true;}
        else
        {
          this.win=false;
        }

    }
}
