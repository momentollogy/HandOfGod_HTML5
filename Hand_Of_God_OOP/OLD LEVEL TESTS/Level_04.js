 import Circle from './Circle.js';  // Adjust the path to match the location of your Circle.js file
 import Timer from './Timer.js';


export default class Level_04
{
    constructor(mp,canvasElement, canvasCtx)
    {
        console.log("welcome to level 4")
        this.canvasCtx = canvasCtx;
        this.canvasElement = canvasElement;
        this.canvas = canvasElement;
        this.ctx = canvasCtx;
        this.beatArray=[];
        this.everythingloaded=false;
        this.nextBeatArrayIndex=0;
        this.timer = new Timer(canvasCtx);
        this.circle = new Circle(canvasElement, canvasCtx);  // Create a single circle instance
        this.circle.position = { x: canvasElement.width / 2, y: canvasElement.height / 2 };  // Position the circle at the center
        this.beatCircles_Array = [];
        this.velocity=100;
        this.playing=false;
        this.lastfingerposition;
        this.prevHandPositions=[];
        this.handInsidePreviously = false;
        this.swipePositions = [];
        this.xyHandPositions = [];
        this.currentHandedness = null;





        //LOADS json array beats, saved as file in folder
        fetch('apache.json')
        .then(response => 
        {
            // Check if the request was successful
            if(!response.ok) 
            {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })


        .then(data => 
        {
           // console.log(data);  // Log the data to the console
            this.beatArray = data.beatTimes; //getting arrays and storing them in beatarray.
          //  console.log("Beat Arrays are", this.beatArray)
            this.everythingloaded=true;
            this.timer.start()    
            })
        .catch(error => 
        {
            console.error('There has been a problem with your fetch operation:', error);
        });


        //load music

        this.audio = new Audio('sound2/apache.mp3');
        this.audio.volume = 0.00; 
        
    }




    pulseCircle() 
    {
        this.circle.isGrowing = !this.circle.isGrowing;  // Toggle growing/shrinking
        if (this.circle.isGrowing) {
            this.circle.maxRadius = this.circle.radius + 20;  // Set the max radius for this pulse
        }
    }


    populateBeatCircles(){
        this.beatCircles_Array = [];
        for(let timemarker of this.beatArray){
            this.beatCircles_Array.push( new BeatCircle(timemarker,this.velocity,this.audio,this.canvasElement) )
        }
    }



    updateBeatCircles(timeOfCurrentLoop)
    {

        for( let i = 0 ; i < this.beatCircles_Array.length ; i++)
        {
            let cir = this.beatCircles_Array[i];
            if(!this.audio.paused){cir.updatePosition(timeOfCurrentLoop)}
            cir.draw(this.ctx);
            cir.checkForRemoval();
        }
    }


    getSwipeDirection(handHandedness) {
        if (this.xyHandPositions.length < 2) {
            return null;
        }
    
        const startPoint = this.xyHandPositions[0];
        const endPoint = this.xyHandPositions[this.xyHandPositions.length - 1];
        const deltaVector = {
            x: endPoint.x - startPoint.x,
            y: endPoint.y - startPoint.y
        };
    
        const magnitude = Math.sqrt(deltaVector.x**2 + deltaVector.y**2);
        const timeElapsed = this.xyHandPositions.length;
        const averageVelocity = magnitude / timeElapsed;
    
        let direction = '';
    
        // Compute the ratio of y change to x change
        const deltaY = Math.abs(deltaVector.y);
        const deltaX = Math.abs(deltaVector.x);
        const ratio = deltaY / deltaX;
    
        // Set a threshold ratio to decide between vertical and horizontal swipes
        const thresholdRatio = 2;  // Adjust this value based on testing
    
        if (ratio > thresholdRatio) {
            // Predominantly vertical swipe
            direction = deltaVector.y > 0 ? 'Down' : 'Up';
        } else {
            // Predominantly horizontal swipe
            direction = deltaVector.x > 0 ? 'Right' : 'Left';
        }
    
        //console.log(`${handHandedness} Hand Swiped ${direction}. Angle = ${(Math.atan2(deltaVector.y, deltaVector.x) * (180 / Math.PI)).toFixed(2)}°. Velocity = ${averageVelocity.toFixed(2)}`);
          console.log(JSON.stringify({hand: handHandedness,direction: direction,xyPositions: this.xyHandPositions,frames: this.xyHandPositions.length}));

        return direction;
    }
    
    

    
    
    

    handleSwipeDetection(handPosition, timestamp, handedness) {
        const isHandInside = this.circle.is_hand_inside(handPosition);
        
        if (isHandInside) {
            this.xyHandPositions.push(handPosition);
        }
    
        // No need to check for hand inside again. We use handInsidePreviously for the leaving action.
        if (!isHandInside && this.handInsidePreviously) {
            console.log(`${handedness} Hand Swiped: ${this.getSwipeDirection()}`);
            this.xyHandPositions = [];  // Reset the xyHandPositions array when the hand leaves the circle
        }
    
        this.handInsidePreviously = isHandInside;  // This will set the previous state for the next frame.
    }
    
    
    
    
    

    level_loop(results,canvasElement,canvasCtx,currentTimeSinceAppStart)
    {
        
        if (this.everythingloaded)
        {
            if (!this.playing)
            {
                this.audio.play();
                this.playing=true;
                this.populateBeatCircles();
               
            }
           
            const currentTime = this.audio.currentTime * 1000;  // Get current time in milliseconds from the audio
            const nextBeatTime = this.beatArray[this.nextBeatArrayIndex];  // beatArray values are in milliseconds


        if (currentTime >= nextBeatTime && this.nextBeatArrayIndex < this.beatArray.length) {
            this.pulseCircle();
            this.nextBeatArrayIndex++;
        }


        // HAND IN CIRCLE STUFF
        if (results.handednesses && results.landmarks) {
            let anyHandInside = false; 
        
            for (let i = 0; i < results.handednesses.length; i++) {
                const handHandedness = results.handednesses[i][0].displayName; 
                const landmarks = results.landmarks[i];
        
                for (const landmark of landmarks) {
                    const handPosition = {
                        x: parseFloat((landmark.x * this.canvas.width).toFixed(2)),
                        y: parseFloat((landmark.y * this.canvas.height).toFixed(2))
                    };
        
                    if (this.circle.is_hand_inside(handPosition)) {
                        anyHandInside = true;
                        this.currentHandedness = handHandedness; // Store the handedness
                        if (!this.handInsidePreviously) {
                            this.handInsidePreviously = true;
                            this.xyHandPositions = [];
                        }
                        this.handleSwipeDetection(handPosition, currentTimeSinceAppStart, this.currentHandedness);
                    }
                }
            }
            
            if (!anyHandInside && this.handInsidePreviously) {
                this.handInsidePreviously = false;
                const swipeDirection = this.getSwipeDirection(this.currentHandedness);
                if (swipeDirection) {
                  //  console.log(`Swipe direction: ${swipeDirection}`);
                }
                this.xyHandPositions = [];
            }
            
            this.circle.handInside = anyHandInside;
            this.circle.color = anyHandInside ? "red" : "green";
        }
        


        //  Drawing/Displaying/applying calculations Screen
        // Update and draw the circle on every frame, regardless of beat timing
        this.circle.update();  // Assuming you have an update method to handle pulsing
        this.circle.draw();
        this.updateBeatCircles(currentTimeSinceAppStart);  // Update the positions of the beat circles

        for(let beatcircle of this.beatCircles_Array)
        {beatcircle.draw(canvasCtx);}
        }

      
    }
    

    
}

class BeatCircle 
{
    constructor(timestamp,beatCircleSpeed,_audio,canvasElement) {
        this.timestamp = timestamp;
        this.color = "green"; // Default color
        this.radius = 40;
        this.lastTimeOfCurrentLoop;
        this.alpha = 1.0;
        this.SWEET_SPOT_Y = 540;
        this.audio=_audio;
        this.canvasElement = canvasElement;
        this.x = canvasElement.width / 2;
        this.elapsedTime=0;
        this.lastTimeOfCurrentLoop;
        this.distance;
        this.velocity = 300;
        this.y = this.calculateStartingPosition(timestamp); // Y position
        this.vibrated = false;
        this.canVibrate = "vibrate" in navigator;



        
    }

    isNearSweetSpot(currentTimeMs) {
        const difference = Math.abs(this.timestamp - currentTimeMs);
        return difference <= 75;
    }

    updatePosition(timeOfCurrentLoop){
        if(!this.lastTimeOfCurrentLoop){this.lastTimeOfCurrentLoop = timeOfCurrentLoop;}
        this.elapsedTime = timeOfCurrentLoop - this.lastTimeOfCurrentLoop;
        this.distance = (this.velocity/1000) * this.elapsedTime;  // This line is fine
        this.y = this.calculateStartingPosition(this.timestamp);
        this.lastTimeOfCurrentLoop = timeOfCurrentLoop;
    }

    draw(ctx){

            // set the alpha of circle
            if (this.isNearSweetSpot(this.audio.currentTime * 1000)) {
                this.color = "red";
                if (this.canVibrate && !this.vibrated) {
                    navigator.vibrate(100);
                  //  console.log("This vibrated!");  
                    this.vibrated = true;
                }
            } else {
                this.color = "green";
                this.vibrated = false;
            }

            // Draw the BeatCircle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillText(this.timestamp, this.x + 40, this.y);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    killSelf(){
        this.beatCircles_Array.splice(this.beatCircles_Array.indexOf(this),1);
    }

    checkForRemoval()
    {
        // Remove BeatCircle if it's too far past the sweet spot
       // if (this.alpha <= 0) {
       //     this.killSelf();
           // console.log(this.killSelf)
       // }
        
    }
    

calculateStartingPosition(timestamp)
 {
    const timeUntilBeat = timestamp - this.audio.currentTime * 1000;  // Assuming audio.currentTime is in seconds
    const initialOffset = (timeUntilBeat / 1000) * this.velocity;
    return this.SWEET_SPOT_Y - initialOffset;
 }


}


