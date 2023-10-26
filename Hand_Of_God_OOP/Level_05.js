 import Circle from './Circle.js';  // Adjust the path to match the location of your Circle.js file
 import Timer from './Timer.js';
 import UIManager, { Button } from './UIManager.js';
 import SweetSpotCircle from './SweetSpotCircle.js';
 import JsonManager from './JsonManager.js';




export default class Level_05
{
    constructor(mp,canvasElement)
    {
        console.log("welcome to level 4")
        //this.canvasCtx = canvasCtx;
        this.canvasElement = canvasElement;
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.beatArray=[];
        this.everythingloaded=false;
        this.nextBeatArrayIndex=0;
        this.timer = new Timer(this.ctx);


        this.SweetSpotCircleArray=[];

        this.SweetSpotCircleArray[0] = new SweetSpotCircle(canvasElement, this.ctx);  // Create a single circle instance
        this.SweetSpotCircleArray[1] = new SweetSpotCircle(canvasElement, this.ctx);  // Create a single circle instance
       


        //set/override default color
        this.SweetSpotCircleArray[1].color = 'rgb(255, 0, 0)';  // Set color to bright orange
 
        //set position
        this.SweetSpotCircleArray[0].position = { x: 640, y: 400};
        this.SweetSpotCircleArray[1].position = { x: 1280, y: 400};

        this.beatCircles_Array = [];
        this.velocity=100;
        this.playing=false;
        this.lastfingerposition;
        this.prevHandPositions=[];
        this.handInsidePreviously = false;
        this.swipePositions = [];
        this.xyHandPositions = [];
        this.currentHandedness = null;
        this.recordedMoments_Array=[];
        this.audio = new Audio();
        this.audio.volume = 0.03; 
        this.SweetSpotCircleArray[0].audio=this.audio;
        this.fileInput = document.getElementById('fileInput');

        this.uiManager = new UIManager(this.canvas, this.audio);
        this.hoveredButton = null;
        this.activeButton = null;
    
        this.canvasElement.addEventListener('click', this.uiManager.handleClick.bind(this.uiManager));
        this.canvasElement.addEventListener('mousemove', this.uiManager.handleMouseMove.bind(this.uiManager));
        this.canvasElement.addEventListener('mousedown', this.uiManager.handleMouseDown.bind(this.uiManager));
        this.canvasElement.addEventListener('mouseup', this.uiManager.handleMouseUp.bind(this.uiManager));
        this.jsonManager = new JsonManager();

        

        document.addEventListener('PLAY_PRESSED', (data) => {
            console.log("Play button!!");
            if(this.audio.paused){this.audio.play();}
            else{this.audio.pause();}
        });
        
        document.addEventListener('RESET_PRESSED', (data) => {
            console.log("Reset");
            this.audio.currentTime = 0;
        });

        document.addEventListener('EXPORT_PRESSED', (data) => {
            console.log("export");
            this.exportRecordedMoments_Array();
        });


        document.addEventListener('LOADBEATS_PRESSED', (data) => {
            console.log("load beats");
            this.jsonManager.promptForFile(); 
        });
        


        document.addEventListener('LOADSONG_PRESSED', () => {
            console.log("load Song");
            //this.audio.src = "sound2/Plateau.mp3"
           
            // if there is no file input node on the HTML, then create one
            if(!this.songInput){
                this.songInput = document.createElement('input');
                this.songInput.type = 'file';
                this.songInput.accept = '.mp3,.wav';
                this.songInput.style.display = 'none';
                document.body.appendChild(this.songInput);
            }
            
            // when the file is loaded use it as the new src for the audio object
            this.songInput.addEventListener('change', () => {
                const selectedFile = this.songInput.files[0];
                if (selectedFile) {
                    this.audio.src = URL.createObjectURL(selectedFile)
                    this.audio.load();
                 //   this.audio.play();
                }
            });

            this.songInput.click();
        });




        //LOADS json array beats, saved as file in folder
        fetch('sound2/apache.json')
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
        })
     
    }


    

    exportRecordedMoments_Array() 
    {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({beatTimes: this.recordedMoments_Array}));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "recordedMoments.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }


    pulseCircle() 
    {
        for(let sweetspotcircle of this.SweetSpotCircleArray)
        {
            sweetspotcircle.isGrowing = !sweetspotcircle.isGrowing;  // Toggle growing/shrinking
            if (sweetspotcircle.isGrowing) {
                sweetspotcircle.maxRadius = sweetspotcircle.radius + 20;  // Set the max radius for this pulse
            }
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
        
        const angleInRadians = Math.atan2(deltaVector.y, deltaVector.x);
        const angleInDegrees = angleInRadians * (180 / Math.PI);
        
        let direction = '';
    
        // Using Difference Ratios:
        const xRatio = Math.abs(deltaVector.x / magnitude);
        const yRatio = Math.abs(deltaVector.y / magnitude);
        
        // Using Tolerance Angles:
        const toleranceAngle = 15;  // 15 degrees tolerance
    
        if (angleInDegrees > -toleranceAngle && angleInDegrees < toleranceAngle) {
            direction = 'RIGHT';
        } else if (angleInDegrees > 180 - toleranceAngle || angleInDegrees < -180 + toleranceAngle) {
            direction = 'LEFT';
        } else if (angleInDegrees > 90 - toleranceAngle && angleInDegrees < 90 + toleranceAngle) {
            direction = 'DOWN';
        } else if (angleInDegrees > -90 - toleranceAngle && angleInDegrees < -90 + toleranceAngle) {
            direction = 'UP';
        } else if (xRatio > yRatio) {
            direction = deltaVector.x > 0 ? 'Right' : 'Left';
        } else {
            direction = deltaVector.y > 0 ? 'Down' : 'Up';
        }
    
        // Calculating average velocity
        const averageVelocity = magnitude / this.xyHandPositions.length;
        let swipeProperites = {angle:angleInDegrees.toFixed(2),time:(Math.floor(this.audio.currentTime * 1000)),hand:handHandedness}
       // this.recordedMoments_Array.push(Math.floor(this.audio.currentTime * 1000));
        this.recordedMoments_Array.push(swipeProperites);

        //console.log(`${handHandedness} Hand Swiped ${direction}. Angle = ${angleInDegrees.toFixed(2)}°. Velocity = ${averageVelocity.toFixed(2)}`);
       console.log(this.recordedMoments_Array);
        return direction;
    }
    
    
    
    
    
//In this modified version, this.handInsidePreviouslyArray is used to keep track of the 
//hand inside state for each circle individually. This way, the this.handInsidePreviouslyArray[i] 
//value for each circle is only updated based on the isHandInside value for that particular circle, 
//rather than being overwritten in each iteration of the loop.
handleSwipeDetection(handPosition, timestamp, handedness) 
    {

        // Initialize an array to keep track of the hand inside state for each circle
this.handInsidePreviouslyArray = this.handInsidePreviouslyArray || Array(this.SweetSpotCircleArray.length).fill(false);

for(let i = 0; i < this.SweetSpotCircleArray.length; i++)
{
    const sweetspotcircle = this.SweetSpotCircleArray[i];
    const isHandInside = sweetspotcircle.is_hand_inside(handPosition);
    
    if (isHandInside) {
        this.xyHandPositions.push(handPosition);
    }

    // No need to check for hand inside again. We use handInsidePreviouslyArray for the leaving action.
    if (!isHandInside && this.handInsidePreviouslyArray[i]) {
        console.log(`${handedness} Hand Swiped: ${this.getSwipeDirection()}`);
        this.xyHandPositions = [];  // Reset the xyHandPositions array when the hand leaves the circle
    }

    this.handInsidePreviouslyArray[i] = isHandInside;  // This will set the previous state for the next frame.
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
               for (let sweetSpot of this.SweetSpotCircleArray) {
                sweetSpot.populateBeatCircles(this.beatArray);
            }
               
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
                        x: this.canvas.width - (landmark.x * this.canvas.width),
                        y: landmark.y * this.canvas.height
                    };
        
                    
                    for(let sweetspotcircle of this.SweetSpotCircleArray) 
                    {
                        if (sweetspotcircle.is_hand_inside(handPosition)) 
                        {
                            anyHandInside = true;
                            this.currentHandedness = handHandedness; // Store the handedness
                            if (!this.handInsidePreviously) 
                            {
                                this.handInsidePreviously = true;
                                this.xyHandPositions = [];
                            }
                            this.handleSwipeDetection(handPosition, currentTimeSinceAppStart, this.currentHandedness);
                        }
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
            
        
            this.SweetSpotCircleArray[0].handInside = anyHandInside;
            this.SweetSpotCircleArray[0].anyHandInside ? "red" : "green";
            this.SweetSpotCircleArray[1].handInside = anyHandInside;
            this.SweetSpotCircleArray[1].anyHandInside ? "red" : "green";
        

            
        }
        


        //  Drawing/Displaying/applying calculations Screen
        // Update and draw the circle on every frame, regardless of beat timing
       // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(let sweetspotcircle of this.SweetSpotCircleArray)
        {
            sweetspotcircle.update(); 
            sweetspotcircle.draw(currentTimeSinceAppStart);
        }
    

        this.SweetSpotCircleArray[0].updateBeatCircles(currentTimeSinceAppStart);  // Update the positions of the beat circles
           
        
        this.uiManager.drawAll(this.ctx, this.canvas.width, this.canvas.height);
      
     
        }
 
    }
    

}


