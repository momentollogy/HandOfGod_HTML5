import MediaPipeTracker from './MediaPipeTracker.js';
import UIManager, { Button } from './UIManager.js';
import SweetSpotCircle from './SweetSpotCircle.js';
import JsonManager from './JsonManager.js';
import DrawEngine from './DrawEngine.js';

export default class Level_05
{
    constructor()
    {
        this.mediaPipe = MediaPipeTracker.getInstance()
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
        this.drawEngine = DrawEngine.getInstance();
        this.fileInput = document.getElementById('fileInput');
        
        this.audio = new Audio();
        this.audio.volume = 0.03; 
        
        this.jsonManager = new JsonManager();
        this.jsonManager.promptForFile(); 

        this.uiManager = new UIManager(this.audio);
        this.initUI();

        this.SweetSpotCircleArray=[];
        this.SweetSpotCircleArray[0] = new SweetSpotCircle(this.audio);
        this.SweetSpotCircleArray[1] = new SweetSpotCircle(this.audio);
        this.SweetSpotCircleArray[0].beatCirclePathDirectionAngle = -135;
        this.SweetSpotCircleArray[1].beatCirclePathDirectionAngle = -45;
        this.SweetSpotCircleArray[1].color = 'rgb(0, 255, 200)';
        this.SweetSpotCircleArray[0].position = { x: 570, y: this.canvas.height/2};
        this.SweetSpotCircleArray[1].position = { x: 1350, y: this.canvas.height/2};

        this.beatArray=[];
        this.beatCircles_Array = [];
        this.lastfingerposition;
        this.prevHandPositions=[];
        this.handInsidePreviously = false;
        this.swipePositions = [];
        this.swipeDirectionPos_arr = [];
        this.currentHandedness = null;
        this.recordedMoments_Array=[];
        this.previousPositions_arr=[]

        //////////////////////////////////////////////////////////////////////////////
        ////////Loading a song and beats on startup for testing purposes /////////////
        //////////////////////////////////////////////////////////////////////////////
        this.audio.src = "sound2/apache.mp3";          
        this.jsonManager.loadJsonFileByPath('sound2/apache.json');
    }

    initUI(){
        this.canvas.addEventListener('click', this.uiManager.handleClick.bind(this.uiManager));
        this.canvas.addEventListener('mousemove', this.uiManager.handleMouseMove.bind(this.uiManager));
        this.canvas.addEventListener('mousedown', this.uiManager.handleMouseDown.bind(this.uiManager));
        this.canvas.addEventListener('mouseup', this.uiManager.handleMouseUp.bind(this.uiManager));
        
        // responds to when the JSON loaded and beat data is available on the JSON Manager
        document.addEventListener('beatTimeDataReady', event => {
            //console.log('beatTimeDataReady ready ready ready ready ready :', event.detail);
            this.SweetSpotCircleArray[0].populateBeatCircles(this.jsonManager.loadedBeats);
            this.SweetSpotCircleArray[1].populateBeatCircles(this.jsonManager.loadedBeats);
        });

        document.addEventListener('PLAY_PRESSED', (data) => {
            //console.log("Play button!!");
            if(this.audio.paused){this.audio.play();
            }else{this.audio.pause();}
        });
        
        document.addEventListener('RESET_PRESSED', (data) => {
            //console.log("Reset");
            this.audio.currentTime = 0;
            this.SweetSpotCircleArray[0].reset()
            this.SweetSpotCircleArray[1].reset()
        });

        document.addEventListener('EXPORT_PRESSED', (data) => {
            //console.log("export");
            this.exportRecordedMoments_Array();
        });

        document.addEventListener('LOADBEATS_PRESSED', (data) => {
            //console.log("load beats");
            this.jsonManager.promptForFile(); 
        });

        document.addEventListener('LOADSONG_PRESSED', () => {
            //console.log("load Song pressed");
            
            // if there is no file input node on the HTML, then create one
            if(!this.songInput){
                this.songInput = document.createElement('input');
                this.songInput.type = 'file';
                this.songInput.accept = '.mp3,.wav';
                this.songInput.style.display = 'none';
                document.body.appendChild(this.songInput);
                // when the file is loaded use it as the new src for the audio object
                this.songInput.addEventListener('change', () => {
                    const selectedFile = this.songInput.files[0];
                    if (selectedFile) {
                        this.audio.src = URL.createObjectURL(selectedFile)
                        //this.audio.load();
                    }
                });
            }
            this.songInput.click();
        });
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

    level_loop()
    {
        let results = this.mediaPipe.results;
        if (results == undefined)   {return;}
        
        for(let sweetspotcircle of this.SweetSpotCircleArray)
        {
            sweetspotcircle.updateAndDraw(this.drawEngine.deltaTime);
        }
        
        this.checkForFingerTouch();
        this.drawFingerSwipe();
        this.getSlashDirection();9

        this.uiManager.draw();
    }

    checkForFingerTouch()
    {
        for(let sweetspotcircle of this.SweetSpotCircleArray)
        {
            let handCircleTouchObj = this.mediaPipe.checkForTouchWithShape(sweetspotcircle, this.mediaPipe.BOTH,  8)
            if (handCircleTouchObj.length>0){
                /*this.drawEngine.setInfoText(
                    handCircleTouchObj[0].hand, 
                    handCircleTouchObj[0].x.toFixed(0), 
                    handCircleTouchObj[0].y.toFixed(0),
                    this.drawEngine.deltaTime 
                    );*/
                sweetspotcircle.puffy = true;
            }else{sweetspotcircle.puffy = false;}
            //sweetspotcircle.updateAndDraw(this.drawEngine.deltaTime);
        }
    }

    drawFingerSwipe(){
        if(this.mediaPipe.getPointOfIndex(8))
        {
            let coords=this.mediaPipe.getPointOfIndex(8);
            this.previousPositions_arr.push(coords)
            if(this.previousPositions_arr.length > 8 ){this.previousPositions_arr.shift();}

            let strokeWidth = 1.5;
            this.ctx.lineJoin = 'round';
            this.ctx.lineCap = 'round';
        
            for(let i=1; i<this.previousPositions_arr.length; i++){
                //let distance = Math.sqrt(((this.previousPositions_arr[i-1].x-this.previousPositions_arr[i].x)**2)+((this.previousPositions_arr[i-1].y-this.previousPositions_arr[i].y)**2))
                //strokeWidth = distance /5;
                if( i < Math.round(this.previousPositions_arr.length / 2)+3 ){ strokeWidth += 1.25 }else{ strokeWidth -= 1.75 }
                
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'rgb(0, 255, 200)';
                this.ctx.shadowColor =  'rgb(0, 255, 200)';
                this.ctx.shadowBlur = 12;
                this.ctx.moveTo(this.previousPositions_arr[i-1].x, this.previousPositions_arr[i-1].y);
                this.ctx.lineWidth = strokeWidth;
                this.ctx.lineTo(this.previousPositions_arr[i].x , this.previousPositions_arr[i].y)
                this.ctx.stroke();
            }
        }
    }


    getSlashDirection(handHandedness) {
        //for(let sweetspotcircle of this.SweetSpotCircleArray)
        //{
            // this draws the vector on the screen if it exists on the sweetSpotCircle
            if(this.SweetSpotCircleArray[0].slash){
                // define begining and end points
                let fromX = this.SweetSpotCircleArray[0].slash.start.x;
                let fromY = this.SweetSpotCircleArray[0].slash.start.y;
                let toX = this.SweetSpotCircleArray[0].slash.end.x
                let toY = this.SweetSpotCircleArray[0].slash.end.y
                let arrowSize = 16;

                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'rgb(0, 0, 255)';
                this.ctx.lineWidth = 5;
                this.ctx.moveTo( fromX, fromY );
                this.ctx.lineTo( toX, toY );
                this.ctx.stroke();

                // draw arrow head
                const angle = Math.atan2(toY - fromY, toX - fromX);
                const x1 = toX - arrowSize * Math.cos(angle - Math.PI / 6);
                const y1 = toY - arrowSize * Math.sin(angle - Math.PI / 6);
                const x2 = toX - arrowSize * Math.cos(angle + Math.PI / 6);
                const y2 = toY - arrowSize * Math.sin(angle + Math.PI / 6);

                this.ctx.beginPath();
                this.ctx.moveTo(toX, toY);
                this.ctx.lineTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.restore();
            }

            let sweetspotcircle = this.SweetSpotCircleArray[0];
            let handCircleTouchObj = this.mediaPipe.checkForTouchWithShape(sweetspotcircle, this.mediaPipe.BOTH,  8)
            if (handCircleTouchObj.length>0){
                this.swipeDirectionPos_arr.push(handCircleTouchObj);
                this.ctx.fillStyle = "red";
                this.ctx.beginPath();
                this.ctx.arc(this.swipeDirectionPos_arr[0][0].x, this.swipeDirectionPos_arr[0][0].y, 6, 0, 2 * Math.PI);
                this.ctx.fill();
            }else{
                if(this.swipeDirectionPos_arr.length < 2){return;}
                //console.log(this.swipeDirectionPos_arr[0][0],this.swipeDirectionPos_arr[this.swipeDirectionPos_arr.length-1][0]);
                this.SweetSpotCircleArray[0].slash =    {   start:{ x:this.swipeDirectionPos_arr[0][0].x,
                                                                    y:this.swipeDirectionPos_arr[0][0].y}, 
                                                            end:{   x:this.swipeDirectionPos_arr[this.swipeDirectionPos_arr.length-1][0].x,
                                                                    y:this.swipeDirectionPos_arr[this.swipeDirectionPos_arr.length-1][0].y}  
                                                        }      
                                                             
                let vec = this.calculateNormalizedVector2(this.swipeDirectionPos_arr[0][0].x, this.swipeDirectionPos_arr[0][0].y, this.swipeDirectionPos_arr[this.swipeDirectionPos_arr.length-1][0].x, this.swipeDirectionPos_arr[this.swipeDirectionPos_arr.length-1][0].y);
                console.log("Time and Vector:",this.audio.currentTime, vec);  
                // this is where the slash and timestamp can be stored in the data object
                this.swipeDirectionPos_arr = []
            }
    }

    calculateNormalizedVector2(startX, startY, endX, endY) {
        const directionX = endX - startX;
        const directionY = endY - startY;

        // Calculate the magnitude (length) of the direction vector
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);

        // Normalize the direction vector
        const normalizedX = directionX / magnitude;
        const normalizedY = directionY / magnitude;

        return { x: normalizedX, y: normalizedY };
    }

        //}
        

        // if finger is touching circle
        //   swiping = true
        //   record positions
        // if finger is NOT touching circle
        //   swiping = false
        //   check start and end positions
        //   calculate vector
        //   show line on screen
        //   If in record mode
        //        store vector in json data

        /*
        const startPoint = this.swipeDirectionPos_arr[0];
        const endPoint = this.swipeDirectionPos_arr[this.swipeDirectionPos_arr.length - 1];
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
        const averageVelocity = magnitude / this.swipeDirectionPos_arr.length;
        let swipeProperites = {angle:angleInDegrees.toFixed(2),time:(Math.floor(this.audio.currentTime * 1000)),hand:handHandedness}
       // this.recordedMoments_Array.push(Math.floor(this.audio.currentTime * 1000));
        this.recordedMoments_Array.push(swipeProperites);

        //console.log(`${handHandedness} Hand Swiped ${direction}. Angle = ${angleInDegrees.toFixed(2)}°. Velocity = ${averageVelocity.toFixed(2)}`);
       //console.log(this.recordedMoments_Array);
        return direction;
        */
    
    




















    
    /*
    
    //In this modified version, this.handInsidePreviouslyArray is used to keep track of the 
    //hand inside state for each circle individually. This way, the this.handInsidePreviouslyArray[i] 
    //value for each circle is only updated based on the isHandInside value for that particular circle, 
    //rather than being overwritten in each iteration of the loop.
    handleSwipeDetection(handPosition, handedness) 
    {
                // Initialize an array to keep track of the hand inside state for each circle
        this.handInsidePreviouslyArray = this.handInsidePreviouslyArray || Array(this.SweetSpotCircleArray.length).fill(false);

        for(let i = 0; i < this.SweetSpotCircleArray.length; i++)
        {
            const sweetspotcircle = this.SweetSpotCircleArray[i];
            const isHandInside = sweetspotcircle.is_hand_inside(handPosition);
            
            if (isHandInside) {
                this.swipeDirectionPos_arr.push(handPosition);
            }

            // No need to check for hand inside again. We use handInsidePreviouslyArray for the leaving action.
            if (!isHandInside && this.handInsidePreviouslyArray[i]) {
                console.log(`${handedness} Hand Swiped: ${this.getSwipeDirection()}`);
                this.swipeDirectionPos_arr = [];  // Reset the swipeDirectionPos_arr array when the hand leaves the circle
            }

            this.handInsidePreviouslyArray[i] = isHandInside;  // This will set the previous state for the next frame.
        }

    }

*/


}





// This crap used to be in the loop..  I'll sort through it and make sense of what was being attempted
    /*
    const currentTime = this.audio.currentTime * 1000;  // Get current time in milliseconds from the audio
    const nextBeatTime = this.beatArray[this.nextBeatArrayIndex];  // beatArray values are in milliseconds

    if (currentTime >= nextBeatTime && this.nextBeatArrayIndex < this.beatArray.length) {
        this.pulseCircle();
        this.nextBeatArrayIndex++;
    }

    // HAND IN CIRCLE STUFF
    //if (results.handednesses && results.landmarks)
    if(false)
    {
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
                            this.swipeDirectionPos_arr = [];
                        }
                        this.handleSwipeDetection(handPosition, this.currentHandedness);
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
            this.swipeDirectionPos_arr = [];
        }
        
        this.SweetSpotCircleArray[0].handInside = anyHandInside;
        this.SweetSpotCircleArray[0].anyHandInside ? "red" : "green";
        this.SweetSpotCircleArray[1].handInside = anyHandInside;
        this.SweetSpotCircleArray[1].anyHandInside ? "red" : "green";  
    }
    
    //  Drawing/Displaying/applying calculations Screen
    // Update and draw the circle on every frame, regardless of beat timing
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    */