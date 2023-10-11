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
        this.circle = new Circle(this.canvas, this.ctx, "red", {x:320,y:240}, 40);
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
              
              this.xpos = landmarks[8].x * canvasElement.width;
              this.ypos = landmarks[8].y * canvasElement.height;

              // Check if any landmark is inside the circle
              if (this.circle.is_hand_inside(handPosition)) 
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



        // if hand is out do this  ( I used a toddle because of the for loop on the landmarks )
        if(inside){
          this.circle.color = 'blue';
          this.circle.grow(.1);
        }else{
          this.circle.color = 'green';
          this.circle.shrink();
        }

        // must be called in order to see the cricle on the canvas
        this.circle.draw();

        // win lose condition is set here
        if(this.circle.radius > 130)
        {
          this.win=true;
        }
        else
        {
          this.win=false;
        }
    
  }
}
