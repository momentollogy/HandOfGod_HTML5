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

        for (let circle of this.circlesArray)                       // do this for each circle
        {
            if (results.landmarks)                                  // do landmarks exist?
            {
                for (const landmarks of results.landmarks)          // do this for each hand
                {
                    for (const landmark of landmarks)               //  do this for each landmark on a hand
                    { 
                        const handPosition =                        // make an object with X, Y, properties that match the screen coordinates so we can check it it's in the circle later
                        {
                            x: landmark.x * this.canvas.width,
                            y: landmark.y * this.canvas.height
                        };             

                        if (circle.is_hand_inside(handPosition))    // check if the circle has any landmark in it
                        {
                            circle.handInside = true;
                            circle.grow(.9);
                            if (circle.radius > 120)                // if the circle is big enough, then make the next circle
                            {                  
                                if  (circle.newCircleMade==false)   // If this circle is big enough and it has NOT spawned a new circle, then spawn a new circle
                                {
                                    this.circlesArray.push(new Circle(this.canvas, this.ctx,'rgb(0, 255, 0)', {x:320,y:240}, 40));  // spawns a new circle and pushes it into the circle array
                                    circle.newCircleMade = true;
                                }
                                circle.color="rgb(255, 0, 255)"; 
                            }
                            break;                                  // this break ensures that only one landmark triggers the circle growth.  in other words: no other landmarks will be checked as long as one is already inside the circle
                        }
                        else
                        {
                            circle.handInside = false;
                        }
                    }
                }
            }
            circle.draw();                                           // draw the circle
        }
    }
}
