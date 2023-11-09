import MediaPipeTracker from './MediaPipeTracker.js';
import UIManager from './UIManager.js';
import SweetSpotCircle from './SweetSpotCircle.js';
import JsonManager from './JsonManager.js';
import DrawEngine from './DrawEngine.js';
import LeaderBoardVisual from './LeaderBoardVisual.js';
import { addScore } from './Leaderboard.js';
import BlueButton from './BlueButton.js';
import { OverlayText } from './OverlayText.js';


 


export default class Level_BasicTouch
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
        this.audio.volume = 0.03; 
        
        this.jsonManager = new JsonManager();

        this.levelArrayDataObject = _levelArrayDataObject; //important

        this.mp3Path= this.levelArrayDataObject.mp3Path;
        this.jsonPath=this.levelArrayDataObject.jsonPath;

        this.uIButtons = []
        this.uiManager = new UIManager(this.audio,this.uIButtons)

        this.SweetSpotCircleArray=[];
        this.SweetSpotCircleArray[0] = new SweetSpotCircle(this.audio,  'rgb(0, 255, 0)',     { x: this.canvas.width /2 -125, y: this.canvas.height/2+200}  );
        this.SweetSpotCircleArray[1] = new SweetSpotCircle(this.audio,  'rgb(0, 255, 200)',   { x: this.canvas.width /2 +125, y: this.canvas.height/2+200} );
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

        

/*

//TAKE 1 - passing direct data like how play button did it

this.restartButton = new BlueButton(
    this.ctx,
    leftButtonX,
    buttonY,
    buttonWidth,
    buttonHeight,
    buttonRadius,
    "#00008B", // deep blue color
    "#0000CD", // lighter blue for hover effect
    "Restart",
    "rgba(0, 0, 0, 0.5)",
    () => {
        console.log("Restart Button action function, current level data:", this.levelArrayDataObject);

        // First, call the cleanup method
        this.cleanup();

        // Then, construct the level data to dispatch with the event
        const detailData = {
            levelName: this.levelArrayDataObject.fileName,
            levelDisplayName: this.levelArrayDataObject.levelDisplayName,
            fireBaseLevelLeaderBoard: this.levelArrayDataObject.fireBaseLevelLeaderBoard,
            duration: this.levelArrayDataObject.duration,
            mp3Path: this.levelArrayDataObject.mp3Path,
            jsonPath: this.levelArrayDataObject.jsonPath
            // Add other properties from this.levelArrayDataObject as needed
        };

        // Dispatch the levelChange event with the detailData
        document.dispatchEvent(new CustomEvent('levelChange', { detail: detailData }));
    }
);
*/

//TAKE 2 - passing object

//const LevelSelectVisual = this.levelArrayDataObject.event.detail.levelName;

/*
this.restartButton = new BlueButton(
    this.ctx,
    leftButtonX,
    buttonY,
    buttonWidth,
    buttonHeight,
    buttonRadius,
    "#00008B", // Deep blue color
    "#0000CD", // Lighter blue for hover effect
    "Restart",
    "rgba(0, 0, 0, 0.5)",
   // this.levelArrayDataObject.event.detail.levelName // Pass the level data object here
    // LevelSelectVisual
);

/*


//TAKE 3 - function wrapped in arrow
this.restartButton = new BlueButton(
    this.ctx,
    leftButtonX,
    buttonY,
    buttonWidth,
    buttonHeight,
    buttonRadius,
    "#00008B", // Deep blue color
    "#0000CD", // Lighter blue for hover effect
    "Restart",
    "rgba(0, 0, 0, 0.5)",
    () => { // Pass an anonymous function that calls cleanup and then dispatches the event
        this.cleanup(); // Call the cleanup method
        // Dispatch the levelChange event with the level data
        document.dispatchEvent(new CustomEvent('levelChange', { detail: this.levelArrayDataObject }));
    }
);

    
        
        // Create 'Level Select' button instance
        this.levelSelectButton = new BlueButton(
            this.ctx,
            rightButtonX,
            buttonY,
            buttonWidth,
            buttonHeight,
            buttonRadius,
            "#00008B", // deep blue color
            "#0000CD", // lighter blue for hover effect
            "Level Select",
            "rgba(0, 0, 0, 0.5)",
           // "Level_StageSelect", // Pass the level data object here

          //  () => console.log("Left Button clicked") // Pass a function directly
        );




           */ 

        this.playerName = 'momentology'; // Add this line with a default test player name
      //  const leaderBoardVisual = new LeaderBoardVisual();
        this.leaderBoardVisualInstance = new LeaderBoardVisual();


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

        
        // load mp3, json, and play
        this.audio.src = this.mp3Path;          
        this.jsonManager.loadJsonFileByPath(this.jsonPath);
        this.audio.play();
    }

    
    level_loop() {
        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
        if(!this.recordMode){
            // game interaction and score stuff
            this.checkForFingerTouchCircles();
            //this.checkCirclesForMissesAndStuff();
        }else{
            this.sendTouchesForRecording();
        }

        // update display stuff and process classes stuff
        for(let sweetspotcircle of this.SweetSpotCircleArray) { sweetspotcircle.updateAndDraw(); }
        this.uiManager.draw();
        //this.restartButton.draw();
        //this.levelSelectButton.draw();
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
        console.log('touchSuccesfulWithPercentage called with:', percentAccuracy, sweetspotcircle);

        ////////////////////////////////////////////////////////////////////
        ////////////// Touch Succesful. Receive Percent ////////////////////
        //////////////////////////////////////////////////////////////////// 
        let startPosition = { x: sweetspotcircle.position.x, y: sweetspotcircle.position.y };
        this.overlayText.addText(percentAccuracy, sweetspotcircle.color, startPosition);
        this.increaseComboNumer(); 
        this.scoreNumber += ( percentAccuracy + this.comboNumber );
        this.uiManager.scoreNumber = this.scoreNumber;
        this.removeMiss();
        console.log(percentAccuracy + "%  accuracy", sweetspotcircle.color, "score:", this.scoreNumber);
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
    

    cleanup() {
        // Stop and reset the audio
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    
        // Reset the state of each SweetSpotCircle
        this.SweetSpotCircleArray.forEach(sweetSpotCircle => sweetSpotCircle.reset());
    
        // Clear game-related arrays
        this.beatCircles_Array = []; // Assuming this is an array of objects for beat circles
        this.recordedMoments_Array = []; // Assuming this is for recording moments or beats
    
        // Reset game-related counters
        this.beatsMissed = 0;
        this.scoreNumber = 0;
        this.comboNumber = 0;
    
        // ... any additional resets for other state variables ...
    }
    
    

}


