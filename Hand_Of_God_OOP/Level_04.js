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
        this.beatCircles = [];



        //LOADS json array beats, saved as file in folder
        fetch('LONGBeats.json')
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
            console.log(data);  // Log the data to the console
            this.beatArray = data.beatTimes; //getting arrays and storing them in beatarray.
            console.log("Beat Arrays are", this.beatArray)
            this.everythingloaded=true;
            this.timer.start()    
            })
        .catch(error => 
        {
            console.error('There has been a problem with your fetch operation:', error);
        });


        //load music

        this.audio = new Audio('sound2/Plateau.mp3');
        this.audio.volume = 0.01; 
        
    }




    pulseCircle() 
    {
        this.circle.isGrowing = !this.circle.isGrowing;  // Toggle growing/shrinking
        if (this.circle.isGrowing) {
            this.circle.maxRadius = this.circle.radius + 20;  // Set the max radius for this pulse
        }
    }


    populateBeatCircles(){
        //console.log("in beat circles", loadedBeats.length );
        this.beatCircles = [];
        for(let timemarker of this.beatArray){
            this.beatCircles.push( new BeatCircle(timemarker) )
        }
    }



    updateBeatCircles(timeOfCurrentLoop)
    {
        for( let i = 0 ; i < beatCircles.length ; i++)
        {
            let cir = beatCircles[i];
            if(!this.audio.paused){cir.updatePosition(timeOfCurrentLoop)}
            cir.draw(ctx);
            cir.checkForRemoval();
        }
    }




    level_loop(timestamp,results,canvasElement,canvasCtx)
    {

        if (this.everythingloaded)
        {
            this.audio.play();
           
            const currentTime = this.audio.currentTime * 1000;  // Get current time in milliseconds from the audio
            const nextBeatTime = this.beatArray[this.nextBeatArrayIndex];  // beatArray values are in milliseconds


        if (currentTime >= nextBeatTime && this.nextBeatArrayIndex < this.beatArray.length) {
           // console.log("CurrentTimeStart", currentTimeSinceAppStart,`Pulse at audio time: ${currentTime} ms, beat time: ${nextBeatTime} ms, beat array index: ${this.nextBeatArrayIndex},`);
            console.log("timestamp=", timestamp);
           //  console.log('Pulse at:', Date.now());
            this.pulseCircle();
            this.nextBeatArrayIndex++;
        }

       // Pulse at audio time: 1478.48 ms, beat time: 1461 ms, beat array index: 0

        // Update and draw the circle on every frame, regardless of beat timing
        this.circle.update();  // Assuming you have an update method to handle pulsing
        this.circle.draw();
      //  this.()updateBeatCircles;

        }

      
    }
    

    
}

class BeatCircle {
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.y = 100 //this.calculateStartingPosition(timestamp); // Y position
        this.x = 400;
        this.speed = beatCircleSpeed; // Set the speed based on the initialized beatCircleSpeed
        this.color = "green"; // Default color
        this.radius = beatCircleRadius;
        this.lastTimeOfCurrentLoop;
        this.alpha = 1.0;
    }

    isNearSweetSpot(currentTimeMs) {
        const difference = Math.abs(this.timestamp - currentTimeMs);
        //console.log(difference);
        return difference <= BEAT_CIRCLE_THRESHOLD_MS;
    }

    updatePosition(timeOfCurrentLoop){
        if(!this.lastTimeOfCurrentLoop){this.lastTimeOfCurrentLoop = timeOfCurrentLoop;}
        elapsedTime = timeOfCurrentLoop - this.lastTimeOfCurrentLoop;
        distance = (velocity/1000) * elapsedTime;  //  find the pixels per millisecond, then multiply that by the number of milliseconds to find how far it should move this loop!!
        this.y += distance;
        this.lastTimeOfCurrentLoop = timeOfCurrentLoop;
    }

    draw(ctx){
            // set the alpha of circle
        if (this.y > SWEET_SPOT_Y + 5) {this.alpha -=.02}; if(this.alpha<0){this.alpha=0};
        ctx.globalAlpha = this.alpha;
        
            // Determine the color based on the position
        if (this.isNearSweetSpot(songElapsedTime * 1000)) {
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
        beatCircles.splice(beatCircles.indexOf(this),1);
    }

    checkForRemoval(){
        // Remove BeatCircle if it's too far past the sweet spot
        if (songElapsedTime * 1000 > this.timestamp){
            //this.x += 2;
            if (this.y > SWEET_SPOT_Y + BEAT_CIRCLE_THRESHOLD_MS) {
                this.killSelf()
            }
        }
    }
    
    calculateStartingPosition(timestamp) {
        var totalDist = (velocity/1000) * timestamp;
        var offset = -totalDist + 300;
        //console.log(this.timestamp, offset);
        return offset;
    }
}


