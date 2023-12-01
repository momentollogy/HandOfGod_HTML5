import MediaPipeTracker from './MediaPipeTracker.js';
import UIManager from './UIManager.js';
import SweetSpotCircle from './SweetSpotCircle.js';
import JsonManager from './JsonManager.js';
import DrawEngine from './DrawEngine.js';
import LeaderBoard_Box from './LeaderBoard_Box.js';
import { addScore } from './Leaderboard.js';
import BlueButton from './BlueButton.js';
import { OverlayText } from './OverlayText.js';


 


export default class Level_BasicSwipe
{
    constructor(_levelArrayDataObject)
    {
       // console.log('Level_BasicTouch constructor - levelArrayDataObject:', _levelArrayDataObject);

        this.mediaPipe = MediaPipeTracker.getInstance()
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
        this.drawEngine = DrawEngine.getInstance();
        this.fileInput = document.getElementById('fileInput');
        
        this.audio = new Audio();
        this.audio.volume = 0.1; 
        
        this.jsonManager = new JsonManager();

        this.levelArrayDataObject = _levelArrayDataObject; //important

             // JSON management for level data
             this.jsonManager = new JsonManager(); 
             this.mp3Path = _levelArrayDataObject.mp3Path;
             this.jsonPath = _levelArrayDataObject.jsonPath;

        this.uIButtons = []
        this.uiManager = new UIManager(this.audio,this.uIButtons)

        this.SweetSpotCircleArray=[];
        this.SweetSpotCircleArray[0] = new SweetSpotCircle(this.audio,  'rgb(0, 255, 0)',     { x: this.canvas.width /2 -140, y: this.canvas.height/2}  );
        this.SweetSpotCircleArray[1] = new SweetSpotCircle(this.audio,  'rgb(0, 255, 200)',   { x: this.canvas.width /2 +140, y: this.canvas.height/2} );
        this.SweetSpotCircleArray[0].beatCirclePathDirectionAngle = -90;
        this.SweetSpotCircleArray[1].beatCirclePathDirectionAngle = -90;
        this.SweetSpotCircleArray[0].name="LeftSSCir";
        this.SweetSpotCircleArray[1].name="RightSSCir";

        this.recordedMoments_Array=[];
        this.recordMode = false;
        this.beatsMissed=0;
        this.scoreNumber = 0;
        this.comboNumber = 0;

        this.beatsMissedPrevious=0;
        this.beatArray=[];
        this.beatCircles_Array = [];
        this.lastfingerposition;
        this.prevHandPositions=[];
        this.handInsidePreviously = false;
        this.swipePositions = [];
        this.swipeDirectionPos_arr = [];
        this.swipeHand = "";
        this.currentHandedness = null;
        this.previousPositions_L_arr=[];
        this.previousPositions_R_arr=[];
        this.displayBkg = false;
        this.hasBeatBeenMissed=false;

        this.overlayText = new OverlayText();


        // Button positions (You may need to adjust these positions to fit your layout)
        const leftButtonX = 100; // for example, 100 pixels from the left
        const rightButtonX = this.canvas.width - 300; // for example, 300 pixels from the right edge
        const buttonY = this.canvas.height / 2 + 400; // vertical center for demonstration
        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonRadius = 10;
        

        this.leftSwipeArray = [];
        this.rightSwipeArray = [];
        

       // 'Level Select' button specific code
       this.levelSelectButton = new BlueButton
       (
           this.ctx,
           leftButtonX,
           buttonY,
           buttonWidth,
           buttonHeight,
           buttonRadius,
           "#00008B",
           "#0000CD",
           "Level Select",
           "rgba(0, 0, 0, 0.5)",
           { levelName: "Level_StageSelect", lastLevelData: this.lastLevelChangeDetails },
           (actionData) => {
               // Dispatching event for a different level selection
               document.dispatchEvent(new CustomEvent('levelChange', { detail: actionData }));
               console.log("Level Select Button clicked, dispatching levelChange event with details:", actionData);
           }
       );



       // 'Restart' button specific code
       this.restartButton = new BlueButton
       (
           this.ctx,
           rightButtonX,
           buttonY,
           buttonWidth,
           buttonHeight,
           buttonRadius,
           "#8B0000",
           "#CD5C5C",
           "Restart",
           "rgba(0, 0, 0, 0.5)",
           this.levelArrayDataObject,
           (actionData) => {
               // Dispatching event to restart the game or level
               document.dispatchEvent(new CustomEvent('levelChange', { detail: actionData }));
               console.log("Restart Button clicked, dispatching levelChange event with details:", actionData);
           }
       );
        
        


        this.playerName = 'momentology'; // Add this line with a default test player name
      //  const leaderBoardVisual = new LeaderBoardVisual();
   
            this.leaderBoardBoxInstance = new LeaderBoard_Box()


        // event handler for when json is fully loaded
        document.addEventListener('beatTimeDataReady', event => {
            this.SweetSpotCircleArray[0].receiveAndProcessCircleData(this.jsonManager.leftCircleData);
            this.SweetSpotCircleArray[1].receiveAndProcessCircleData(this.jsonManager.rightCircleData);
        });
        
        // event handler for when beat missed ( this is dispatched from SweetSpotCircles )
        document.addEventListener("BeatMissed", (data) => {;
            this.beatMissed();
        });

        // listen for when song ends to log level complete
        this.audio.addEventListener('ended', this.audioEnded.bind(this));

       /* 
        // load mp3, json, and play
        this.audio.src = this.mp3Path;          
        this.jsonManager.loadJsonFileByPath(this.jsonPath);
        this.audio.play();
        */

            // JSON management for level data
            this.jsonManager = new JsonManager(); 
            this.mp3Path = _levelArrayDataObject.mp3Path;
            this.jsonPath = _levelArrayDataObject.jsonPath;
    }

    
    level_loop() {
        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
        if(!this.recordMode){
            // game interaction and score stuff
            //this.checkForFingerTouchCircles();
            
            this.checkFingerPositionsAndUpdateFingerArrays();
            this.drawSwipeForEachFingerFromFingerArrayData();
            this.checkLineCircleTouch();

            //this.checkCirclesForMissesAndStuff();
        }else{
            this.sendTouchesForRecording();
        }

        // update display stuff and process classes stuff
        for(let sweetspotcircle of this.SweetSpotCircleArray) { sweetspotcircle.updateAndDraw(); }
        this.uiManager.draw();
        this.restartButton.draw();
        this.levelSelectButton.draw();
        // Now update and draw the overlay texts
        this.overlayText.update(); // This will update positions and fade out texts
        this.overlayText.draw(this.ctx); // This will draw texts to the canvas


    }
    
    checkForFingerTouchCircles(){
        for(let sweetspotcircle of this.SweetSpotCircleArray){
            if (this.mediaPipe.checkForTouchWithShape(sweetspotcircle, this.mediaPipe.BOTH,  8).length>0)
            {
                sweetspotcircle.puffy = true;  
                let percentAccuracyIfTouched = sweetspotcircle.touch(); // this method returns null if touch is invalid
                if(percentAccuracyIfTouched){

                    this.touchSuccesfulWithPercentage(percentAccuracyIfTouched, sweetspotcircle);
                }
            }else{
                sweetspotcircle.puffy = false;
            }
        }
    }

    increaseComboNumer(){
        this.comboNumber += 1;
        this.uiManager.comboNumber = this.comboNumber;
    }

    resetComboNumber(){
        this.comboNumber = 0;
        this.uiManager.comboNumber = this.comboNumber;
    }

    removeMiss(){
        if(this.beatsMissed>0){this.beatsMissed -= 1;}
        this.uiManager.missesNumber = this.beatsMissed;
    }
    
    


    touchSuccesfulWithPercentage(percentAccuracy, sweetspotcircle)
    {
        //console.log('touchSuccesfulWithPercentage called with:', percentAccuracy, sweetspotcircle);

        ////////////////////////////////////////////////////////////////////
        ////////////// Touch Succesful. Receive Percent ////////////////////
        //////////////////////////////////////////////////////////////////// 
        let startPosition = { x: sweetspotcircle.position.x, y: sweetspotcircle.position.y };
        this.overlayText.addText(percentAccuracy, sweetspotcircle.color, startPosition);
        this.increaseComboNumer(); 
        this.scoreNumber += ( percentAccuracy + this.comboNumber );
        this.uiManager.scoreNumber = this.scoreNumber;
        this.removeMiss();
        //console.log(percentAccuracy + "%  accuracy", sweetspotcircle.color, "score:", this.scoreNumber);
    }

    beatMissed()
    {
        ////////////////////////////////////////////////////////////////////
        ////////////// Beat Missed. Total Beats Tallied ////////////////////
        ////////////////////////////////////////////////////////////////////
        this.beatsMissed += 1;
        this.uiManager.missesNumber = this.beatsMissed;
        this.resetComboNumber();
        if(this.beatsMissed > 20){
            console.log("you lose");
            this.audio.pause();
            // show something in the UI perhaps?
        }
    }


    audioEnded() {
        console.log('Level Complete');
        console.log('Score is:', this.scoreNumber);
    
        // Prompt the user for their name
        const playerName = window.prompt("Enter Player Name:", "");
        if (playerName) { // If a name was entered
            this.playerName = playerName; // Store the entered name
            console.log('audioEnded - levelArrayDataObject:', this.levelArrayDataObject);
            
            // Now that we have the playerName, proceed with adding the score
            addScore(this.playerName, this.scoreNumber, this.levelArrayDataObject).then(() => {
                this.leaderBoardVisualInstance.populateAndDraw();
            }).catch(error => {
                console.error("Error adding score: ", error);
            });
        } else {
            console.log('User did not enter a name.');
            // Handle the case where the user does not enter a name
            // You might want to ask them again, or handle it however you prefer
        }
    }

    resetVariables(){
        this.scoreNumber = 0;
        this.comboNumber = 0;
        this.beatsMissed = 0;
        this.beatsMissedPrevious=0;
        for(let sweetspotcircle of this.SweetSpotCircleArray)
        {
            sweetspotcircle.beatsMissed = 0;
        }
    }
    

    dispose() 
    {
        // Stop and reset the audio
        if (this.audio) 
        {
            this.audio.pause();
            this.audio.currentTime = 0;
           // this.audio = null;
           this.audio.removeEventListener('ended', this.onAudioEnded);
           this.audio = new Audio();

        }
    
        // Clear game-related arrays
        this.beatCircles_Array = []; // Assuming this is an array of objects for beat circles
        this.recordedMoments_Array = []; // Assuming this is for recording moments or beats
    
        //this.scoreNumber = 0;
       // this.comboNumber = 0;
    
        // ... any additional resets for other state variables ...

       // this.uiManager.scoreNumber = 0;
      //  this.uiManager.comboNumber = 0;
      //  this.beatsMissed = 0;
       // this.beatIndex = 0;

        this.SweetSpotCircleArray[0].reset();
        this.SweetSpotCircleArray[1].reset();
        this.uiManager.draw();
        this.resetVariables();

        //this.uiManager.reset();
    }
    






////////////////////////////////////////////////////////////////////////////
////////these methods depend on these arrays in the constructor/////////////
/////////// this.leftSwipeArray = [];///////////////////////////////////////
/////////// this.rightSwipeArray = [];//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

    checkFingerPositionsAndUpdateFingerArrays(){
        this.leftSwipeArray.push(this.mediaPipe.getPointOfIndex("Left",8));
        this.rightSwipeArray.push(this.mediaPipe.getPointOfIndex("Right",8));

        if(this.leftSwipeArray.length > 2){ this.leftSwipeArray.shift() };
        if(this.rightSwipeArray.length > 2){ this.rightSwipeArray.shift() };
    }

    drawSwipeForEachFingerFromFingerArrayData(){
        //console.log(this.leftSwipeArray);
        if(this.leftSwipeArray[0] &&  this.leftSwipeArray[1]){
            this.ctx.save();
            this.ctx.strokeStyle = "rgb(0,255,200)";
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            this.ctx.moveTo(this.leftSwipeArray[0].x , this.leftSwipeArray[0].y);
            this.ctx.lineTo(this.leftSwipeArray[1].x , this.leftSwipeArray[1].y);
            //console.log(this.leftSwipeArray[0])
            this.ctx.stroke();
            this.ctx.restore();
        }

        if(this.rightSwipeArray[0] &&  this.rightSwipeArray[1]){
            this.ctx.save();
            this.ctx.strokeStyle = "rgb(255,29,206)";
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            this.ctx.moveTo(this.rightSwipeArray[0].x , this.rightSwipeArray[0].y);
            this.ctx.lineTo(this.rightSwipeArray[1].x , this.rightSwipeArray[1].y);
            //console.log(this.rightSwipeArray[0])
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    checkLineCircleTouch()
    {
        for(var sweetSpotCircle of this.SweetSpotCircleArray)
        {
            let leftTouches = false;
            let rightTouches = false;

            if(this.leftSwipeArray[0] && this.leftSwipeArray[1] && this.SweetSpotCircleArray[0])
            {
                leftTouches = this.circleLineToucheyMath  (   {x:sweetSpotCircle.position.x, y:sweetSpotCircle.position.y},    
                                                            sweetSpotCircle.baseRadius,
                                                            [this.leftSwipeArray[0].x, this.leftSwipeArray[0].y],  
                                                            [this.leftSwipeArray[1].x, this.leftSwipeArray[1].y] 
                                                        );   
                //console.log(this.calculateAngle(this.leftSwipeArray[0].x, this.leftSwipeArray[0].y, this.leftSwipeArray[1].x, this.leftSwipeArray[1].y))
            }
            if(this.rightSwipeArray[0] && this.rightSwipeArray[1] && this.SweetSpotCircleArray[0])
            {
                rightTouches = this.circleLineToucheyMath  (   {x:sweetSpotCircle.position.x, y:sweetSpotCircle.position.y},    
                                                            sweetSpotCircle.baseRadius,
                                                            [this.rightSwipeArray[0].x, this.rightSwipeArray[0].y],  
                                                            [this.rightSwipeArray[1].x, this.rightSwipeArray[1].y] 
                                                        );     
                //console.log(this.calculateAngle(this.rightSwipeArray[0].x, this.rightSwipeArray[0].y, this.rightSwipeArray[1].x, this.rightSwipeArray[1].y))
            }

            if(leftTouches && !sweetSpotCircle.puffy){
                sweetSpotCircle.puffy=true;
                //this.touchSuccesfulWithPercentage(percentAccuracyIfTouched, sweetspotcircle);
                console.log(this.calculateAngle(this.leftSwipeArray[0].x, this.leftSwipeArray[0].y, this.leftSwipeArray[1].x, this.leftSwipeArray[1].y))
            }
            else if(rightTouches && !sweetSpotCircle.puffy){
                sweetSpotCircle.puffy=true;
                //this.touchSuccesfulWithPercentage(percentAccuracyIfTouched, sweetspotcircle);
                console.log(this.calculateAngle(this.rightSwipeArray[0].x, this.rightSwipeArray[0].y, this.rightSwipeArray[1].x, this.rightSwipeArray[1].y))
            }
            else{sweetSpotCircle.puffy=false}
        }  

    }

    circleLineToucheyMath(circleCenter, circleRadius, linePoint1, linePoint2) {
        // Extracting coordinates
        const { x: cx, y: cy } = circleCenter;
        const r = circleRadius;
        const [x1, y1] = linePoint1;
        const [x2, y2] = linePoint2;
    
        // Function to calculate the distance between two points
        function distance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        }
    
        // Check if both points are inside the circle
        const distance1 = distance(cx, cy, x1, y1);
        const distance2 = distance(cx, cy, x2, y2);
        if (distance1 < r && distance2 < r) {
            // Both points are within the circle, so the line segment is inside the circle
            return [linePoint1, linePoint2];
        }
    
        // Continue with the rest of the function to check for intersection points
        // Check for vertical line to avoid division by zero
        if (x1 === x2) {
            // The line is vertical
            const y_diff_square = r * r - (x1 - cx) * (x1 - cx);
            if (y_diff_square < 0) {
                return null; // The line is outside the circle
            }
            const y_diff = Math.sqrt(y_diff_square);
            const y_int1 = cy + y_diff;
            const y_int2 = cy - y_diff;
            // Check if y coordinates are within the segment
            if (y1 <= y_int1 && y_int1 <= y2 || y1 <= y_int2 && y_int2 <= y2) {
                return [[x1, y_int1], [x1, y_int2]].filter(point => distance(cx, cy, point[0], point[1]) <= r);
            } else {
                return null;
            }
        }
    
        // Calculate slope and intercept of the line
        const m = (y2 - y1) / (x2 - x1);
        const b = y1 - m * x1;
    
        // Coefficients for the quadratic equation ax^2 + bx + c = 0
        const a = 1 + m * m;
        const b_quad = 2 * (m * b - m * cy - cx);
        const c_quad = cx * cx + cy * cy - r * r + b * b - 2 * b * cy;
    
        // Calculate discriminant
        const discriminant = b_quad * b_quad - 4 * a * c_quad;
    
        if (discriminant < 0) {
            return null; // No intersection
        }
    
        // Calculate x values for the intersection points
        const x_int1 = (-b_quad + Math.sqrt(discriminant)) / (2 * a);
        const x_int2 = (-b_quad - Math.sqrt(discriminant)) / (2 * a);
    
        // Calculate y values for the intersection points
        const y_int1 = m * x_int1 + b;
        const y_int2 = m * x_int2 + b;
    
        // Function to check if a point is within the line segment
        function isBetween(value, start, end) {
            return Math.min(start, end) <= value && value <= Math.max(start, end);
        }
    
        // Filter points that are not within the line segment
        const points = [[x_int1, y_int1], [x_int2, y_int2]].filter(point => {
            return isBetween(point[0], x1, x2) && isBetween(point[1], y1, y2);
        });
    
        return points.length > 0 ? points : null;
    }
    
    calculateAngle(x1, y1, x2, y2) {
        // Calculate the angle in radians
        const angleRadians = Math.atan2(y2 - y1, x2 - x1);
      
        // Convert the angle to degrees
        const angleDegrees = (angleRadians * 180) / Math.PI;
      
        return angleDegrees;
      }

}


