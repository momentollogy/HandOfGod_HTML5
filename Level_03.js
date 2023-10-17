import Circle from './Circle.js';  // Adjust the path to match the location of your Circle.js file


export default class Level_03
{
    constructor(mp,canvasElement, canvasCtx)
    {
        this.xpos = 0;
        this.ypos = 0;
        this.canvas = canvasElement;  // Fixed here
        this.ctx = canvasCtx;  // Fixed here
        console.log(this.canvas.width,this.canvas.length,"=CHECKING DIMENSIONS from INSIDE Level Constructor")
        this.win = false;
        this.lose= false;
        this.circlesArray = [];
        this.circlesArray.push(new Circle(this.canvas, this.ctx));
    }

    level_loop(results,canvasElement,canvasCtx)
    {
        // if landmark results exist, then you can loop over them and do stuff ( like console.log their coordinates )
        if (results.landmarks) 
        {
          for (const landmarks of results.landmarks) 
          {
            outerLoop: for (const landmark of landmarks) 
            {
                // Convert landmark coordinates to canvas coordinates
                const handPosition = 
                {
                    x: landmark.x * this.canvas.width,
                    y: landmark.y * this.canvas.height
                };             
                for(let circle of this.circlesArray)
                // Check if any landmark is inside the circle
                {  if (circle.is_hand_inside(handPosition)) 
                    {
                        circle.handInside = true;
                        break outerLoop;  // Exit loop if any landmark is inside the circle
                    }
                    else
                    {
                        circle.handInside = false;
                    }
                }
            }
          }
        }
        // if hand is out do this  ( I used a toggle because of the for loop on the landmarks )
        for (let circle of this.circlesArray)
        {
            if(circle.handInside)
            {
            // this.circle.color = 'blue';
                circle.grow(.9);
                if (circle.radius > 70)
                {                  
                    if  (circle.newCircleMade==false)
                    {
                        this.circlesArray.push(new Circle(this.canvas, this.ctx,'rgb(0, 255, 0)', {x:320,y:240}, 40));
                        circle.newCircleMade = true;
                    }
                    circle.color="rgb(255, 0, 255)";
                        
                }
            }
            // must be called in order to see the cricle on the canvas
            circle.draw();
        }
        // win lose condition is set here
        //if(this.circlesArray[0].radius > 130)
        // {
       //   this.win=true;
      //  }
      //  else
      //  {
      //    this.win=false;
      //  }
    
  }
}
