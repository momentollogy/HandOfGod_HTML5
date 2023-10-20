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
        this.velocity=85;
        this.playing=false;
        



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
        this.beatCircles_Array = [];
        for(let timemarker of this.beatArray){
            this.beatCircles_Array.push( new BeatCircle(timemarker,this.velocity,this.audio) )
        }
    }



    updateBeatCircles(timeOfCurrentLoop)
    {
        for( let i = 0 ; i < beatCircles_Array.length ; i++)
        {
            let cir = beatCircles_Array[i];
            if(!this.audio.paused){cir.updatePosition(timeOfCurrentLoop)}
            cir.draw(ctx);
            cir.checkForRemoval();
        }
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
                console.log("startsong")
            }
           
            const currentTime = this.audio.currentTime * 1000;  // Get current time in milliseconds from the audio
            const nextBeatTime = this.beatArray[this.nextBeatArrayIndex];  // beatArray values are in milliseconds


        if (currentTime >= nextBeatTime && this.nextBeatArrayIndex < this.beatArray.length) {
           // console.log("CurrentTimeStart", currentTimeSinceAppStart,`Pulse at audio time: ${currentTime} ms, beat time: ${nextBeatTime} ms, beat array index: ${this.nextBeatArrayIndex},`);
           // console.log("timestamp=", currentTimeSinceAppStart);
           //  console.log('Pulse at:', Date.now());
            this.pulseCircle();
            this.nextBeatArrayIndex++;
        }


        // Update and draw the circle on every frame, regardless of beat timing
        this.circle.update();  // Assuming you have an update method to handle pulsing
        this.circle.draw();
        for(let beatcircle of this.beatCircles_Array)
        {
            //beatcircle.updatePosition(currentTimeSinceAppStart);
            beatcircle.y+=2;
            beatcircle.draw(canvasCtx);
           // console.log("Cir pos", beatcircle.y)
        }
        }

      
    }
    

    
}

class BeatCircle {
    constructor(timestamp,beatCircleSpeed,_audio) {
        this.timestamp = timestamp;
        this.y = this.calculateStartingPosition(timestamp); // Y position
        this.x = 400;
        this.speed = 85; // Set the speed based on the initialized beatCircleSpeed
        this.color = "green"; // Default color
        this.radius = 40;
        this.lastTimeOfCurrentLoop;
        this.alpha = 1.0;
        this.SWEET_SPOT_Y=540;
        this.audio=_audio;
        this.elapsedTime=0;
        this.lastTimeOfCurrentLoop;
        this.distance;
    }

    isNearSweetSpot(currentTimeMs) {
        const difference = Math.abs(this.timestamp - currentTimeMs);
        //console.log(difference);
        return difference <= 75;
    }

    updatePosition(timeOfCurrentLoop){
        if(!this.lastTimeOfCurrentLoop){this.lastTimeOfCurrentLoop = timeOfCurrentLoop;}
        this.elapsedTime = timeOfCurrentLoop - this.lastTimeOfCurrentLoop;
        this.distance = (this.speed/1000) * this.elapsedTime;  //  find the pixels per millisecond, then multiply that by the number of milliseconds to find how far it should move this loop!!
        this.y += this.distance;
        this.lastTimeOfCurrentLoop = timeOfCurrentLoop;
    }

    draw(ctx){
            // set the alpha of circle
        if (this.y > this.SWEET_SPOT_Y + 5) {this.alpha -=.02}; if(this.alpha<0){this.alpha=0};
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
        beatCircles.splice(beatCircles.indexOf(this),1);
    }

    checkForRemoval()
    {
        // Remove BeatCircle if it's too far past the sweet spot
      //  if (songElapsedTime * 1000 > this.timestamp){
            //this.x += 2;
      //      if (this.y > SWEET_SPOT_Y + BEAT_CIRCLE_THRESHOLD_MS) {
       //         this.killSelf()
       //     }
        //}
    }
    
    calculateStartingPosition(timestamp) {
        let totalDist = (85/1000) * timestamp;
        let offset = -totalDist + 540;
       // console.log("Timestamp is", timestamp, totalDist);
        return offset;
    }
}


