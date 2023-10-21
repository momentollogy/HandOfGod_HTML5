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
        this.yValues = [];



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
        this.audio.volume = 0.5; 
        
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


        getSwipeDirection() {
        console.log('getSwipeDirection called');
        console.log('Y values:', this.yValues);
        
        if (this.yValues.length < 2) {
            console.log('Not enough data for a swipe');
            return null;  // Not enough data to determine direction
        }
        
        const firstY = this.yValues[0];
        const lastY = this.yValues[this.yValues.length - 1];
        const deltaY = lastY - firstY;
        
        // Determining the direction of swipe based on the Y values
        const direction = deltaY > 0 ? 'Down' : 'Up';
        
        // Calculating average velocity
        const velocity = deltaY / this.yValues.length;
        
        // Logging the detected swipe direction and velocity
        console.log(`Swipe direction: ${direction}, Velocity: ${velocity}`);
        
        // For now, we'll just return the direction, you can extend this to return velocity or other information as needed
        return direction;
    }
    

        handleSwipeDetection(handPosition, timestamp) {
        const isHandInside = this.circle.is_hand_inside(handPosition);
        
        if (isHandInside) {
            this.yValues.push(handPosition.y);  // Store y value
            console.log('Hand INSIDE the circle.');
            console.log('Y value added:', handPosition.y);
            console.log('Y values array:', this.yValues);
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
                const landmarks = results.landmarks[i];
            
                for (const landmark of landmarks) {
                    const handPosition = {
                        x: landmark.x * this.canvas.width,
                        y: landmark.y * this.canvas.height
                    };
            
                    if (this.circle.is_hand_inside(handPosition)) {
                        anyHandInside = true;
                        this.handleSwipeDetection(handPosition, currentTimeSinceAppStart);
                    }
                }
            }
            
            // Check if the hand has left the circle
            if (!anyHandInside && this.handInsidePreviously) {
                this.handInsidePreviously = false;
                const swipeDirection = this.getSwipeDirection();
                if (swipeDirection) {
                    console.log(`Swipe direction: ${swipeDirection}`);
                }
                this.yValues = [];  // Reset the yValues array
                console.log('Y values array RESET.');
            }
            
            // Update circle properties
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
        this.velocity = 200;
        this.y = this.calculateStartingPosition(timestamp); // Y position


        
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
        if (this.y > this.SWEET_SPOT_Y + 5) {this.alpha -=.01}; if(this.alpha<0){this.alpha=0};
        ctx.globalAlpha = this.alpha;
        
            // Determine the color based on the position
        if (this.isNearSweetSpot(this.audio.currentTime * 1000)) {
            this.color = "red";
        } else {
            this.color = "green";
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


