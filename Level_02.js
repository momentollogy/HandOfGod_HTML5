import Circle from './Circle.js';  // Adjust the path to match the location of your Circle.js file


export default class Level_02
{
    constructor(mp,canvasElement, canvasCtx)
    {
        this.xpos = 0;
        this.ypos = 0;
        this.canvas = canvasElement;  // Fixed here
        this.ctx = canvasCtx;  // Fixed here
        this.win = false;
        this.lose= false;
        this.circlesArray = [];
        this.circlesArray.push(new Circle(this.canvas, this.ctx,'rgb(0, 255, 0)', {x:320,y:240}, 40));
        this.circlesArray[0].randomizePosition();
    //creating the first object and storing it in a varible "this.circle"
      //  this.circle = new Circle(this.canvas, this.ctx, "red", {x:320,y:240}, 40);
    }

    level_loop(results,canvasElement,canvasCtx)
    {
      var inside = false
        // if landmark results exist, then you can loop over them and do stuff ( like console.log their coordinates )
        if (results.landmarks) 
        {
          for (const landmarks of results.landmarks) 
          {
            for (const landmark of landmarks) 
            {
              // Convert landmark coordinates to canvas coordinates
              const handPosition = 
              {
                  x: landmark.x * this.canvas.width,
                  y: landmark.y * this.canvas.height
              };
              
              // Check if any landmark is inside the circle
              if (this.circlesArray[0].is_hand_inside(handPosition)) 
              {
                  inside = true;
                  break;  // Exit loop if any landmark is inside the circle
              }
              else
              {
                  inside = false;
              }
            }
          }
        }


        // if hand is out do this  ( I used a toggle because of the for loop on the landmarks )
        if(inside)
        {
         // this.circle.color = 'blue';
          this.circlesArray[0].grow(.1);
            if (this.circlesArray[0].radius > 70)
            {
                this.circlesArray[0].color="rgb(0, 0, 255)";
            }
        }
        // must be called in order to see the cricle on the canvas
        this.circlesArray[0].draw();

        // win lose condition is set here
        if(this.circlesArray[0].radius > 130)
        {
          this.win=true;
        }
        else
        {
          this.win=false;
        }
    
  }
}
