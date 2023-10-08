export default class Level_01
{
    constructor(){
        this.xpos = 0;
        this.ypos = 0;
    }

    level_loop(results,canvasElement,canvasCtx)
    {
        // if landmark results exist, then you can loop over them and do stuff ( like console.log their coordinates )
        if(results.landmarks)
        {
            for (const landmarks of results.landmarks) 
            {
                // get the X and Y position of the fingertip
                //console.log(landmarks[0].x);
                this.xpos = landmarks[8].x * canvasElement.width;
                this.ypos = landmarks[8].y * canvasElement.height;
            }
        }
    
        // place a bubble at the fingertip coordinates
        const bub = document.getElementById("bubblePic");
        canvasCtx.drawImage(bub, this.xpos-32, this.ypos-32, 64, 64 );
    }
}