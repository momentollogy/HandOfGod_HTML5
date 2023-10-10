import Circle from  "./Cir.js"

export default class Level_01
{
    constructor(){
        this.xpos = 0;
        this.ypos = 0;
        console.log("level 1 constructor works");
        this.circle=new Circle();

    }



    level_loop(results, canvasElement, canvasCtx) {
        // if landmark results exist, then you can loop over them and do stuff
        if (results.landmarks) {
            for (const landmarks of results.landmarks) {
                for (const landmark of landmarks) {
                    // Convert landmark coordinates to canvas coordinates
                    const handPosition = {
                        x: landmark.x * canvasElement.width,
                        y: landmark.y * canvasElement.height
                    };

                    // Check if any landmark is inside the circle
                    if (this.circle.is_hand_inside(handPosition)) 
                    {
                        this.circle.color = 'blue';  // Change color to blue if inside
                        this.circle.grow(.4);
                        break;  // Exit loop if any landmark is inside the circle
                    }
                    else
                    {
                        //Hand out of Circle
                        this.circle.color = 'green';
                    }
                }

                // get the X and Y position of the fingertip
                //console.log(landmarks[0].x);
                //  this.xpos = landmarks[8].x * canvasElement.width;
                //  this.ypos = landmarks[8].y * canvasElement.height;

                // this.xpos1 = landmarks[20].x * canvasElement.width;
                // this.ypos1 = landmarks[20].y * canvasElement.height;


            }
            
        }
        
        // place a bubble at the fingertip coordinates
      //  const bub = document.getElementById("bubblePic");
       // const bub1 = document.getElementById("bubblePic");
      //  canvasCtx.drawImage(bub, this.xpos-23, this.ypos-23, 46, 46 );
       // canvasCtx.drawImage(bub1, this.xpos1-23, this.ypos1-23, 46, 46 );
        this.circle.draw(canvasCtx);
    }
}
