import MediaPipeTracker from './MediaPipeTracker.js';
//import UIManager from './UIManager.js';
import SweetSpotCircle from './SweetSpotCircle.js';
import JsonManager from './JsonManager.js';
import DrawEngine from './DrawEngine.js';
import LeaderBoardVisual from './LeaderBoardVisual.js';
import { addScore } from './Leaderboard.js';
import BlueButton from './BlueButton.js';
import { OverlayText } from './OverlayText.js';
import { UIUtilities } from './UIUtilities.js';
import { GameStats } from './GameStats.js'; 
console.log("GameStats imported successfully:", GameStats);







 

export default class Level_BasicTouch
{
    constructor(_levelArrayDataObject,audio)
    {
        console.log("GameLevel constructor started");

        console.log('Level_BasicTouch constructor - levelArrayDataObject:', _levelArrayDataObject);

        this.mediaPipe = MediaPipeTracker.getInstance()
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
        this.drawEngine = DrawEngine.getInstance();
        this.fileInput = document.getElementById('fileInput');
        
        this.audio = new Audio();
        this.audio.volume = 0.5; 
        
        this.jsonManager = new JsonManager();

        this.levelArrayDataObject = _levelArrayDataObject; //important

        this.mp3Path= this.levelArrayDataObject.mp3Path;
        this.jsonPath=this.levelArrayDataObject.jsonPath;

        this.volumeSlider = UIUtilities.createVolumeSlider(this.audio, this.canvas);
        
        this.stats = new GameStats();
        console.log("GameStats instance created:", this.stats);
        console.log("Initial GameStats values:", this.stats.score, this.stats.combo, this.stats.misses);



        this.SweetSpotCircleArray=[];
        this.SweetSpotCircleArray[0] = new SweetSpotCircle(this.audio,  'rgb(0, 255, 0)',     { x: this.canvas.width /2 -135, y: this.canvas.height/2+100}  );
        this.SweetSpotCircleArray[1] = new SweetSpotCircle(this.audio,  'rgb(0, 255, 200)',   { x: this.canvas.width /2 +135, y: this.canvas.height/2+100} );
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



        // 'LEVEL SELECT' BUTTON
        this.levelSelectButton = new BlueButton(
            this.ctx,
            leftButtonX,
            buttonY,
            buttonWidth,
            buttonHeight,
            buttonRadius,
            "#00008B", // Deep blue color
            "#0000CD", // Lighter blue for hover effect
            "Level Select",
            "rgba(0, 0, 0, 0.5)",
            // Here, instead of passing a callback, you pass the actionData directly
            { levelName: "Level_StageSelect", 
            lastLevelData: this.lastLevelChangeDetails // Pass the entire levelChange object or relevant part
            } // This will be used as this.actionData in the BlueButton class
        );


         // 'RESTART' BUTTON
        this.restartButton = new BlueButton
        (
            this.ctx,
            rightButtonX,
            buttonY,
            buttonWidth,
            buttonHeight,
            buttonRadius,
            "#8B0000", // Dark red color
            "#CD5C5C", // Lighter red for hover effect
            "Restart",
            "rgba(0, 0, 0, 0.5)",
            this.levelArrayDataObject        
        );
        

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


        console.log("GameLevel constructor finished");
        

    }


    
    level_loop() 
    {

        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
        this.checkForFingerTouchCircles(); 
        // update display stuff and process classes stuff
        for(let sweetspotcircle of this.SweetSpotCircleArray) { sweetspotcircle.updateAndDraw(); }
        
        this.restartButton.draw();
        this.levelSelectButton.draw();
        console.log("Score:", this.stats.score, "Combo:", this.stats.combo, "Misses:", this.stats.misses);
        UIUtilities.drawScore(this.ctx, this.stats.score, this.stats.combo, this.stats.misses);

        


        // Update and draw percentage overlay texts
        this.overlayText.update(); // This will update positions and fade out texts
        this.overlayText.draw(this.ctx); // This will draw texts to the canvas
        this.volumeSlider.drawVolumeSlider();


    }
    
    checkForFingerTouchCircles(){
        console.log("checkForFingerTouchCircles this:", this);

        for(let sweetspotcircle of this.SweetSpotCircleArray){
            if (this.mediaPipe.checkForTouchWithShape(sweetspotcircle, this.mediaPipe.BOTH,  8).length>0)
            {
                sweetspotcircle.puffy = true;  
                let percentAccuracyIfTouched = sweetspotcircle.touch(); // this method returns null if touch is invalid
                if(percentAccuracyIfTouched){

                    this.touchSuccessfulWithPercentage(percentAccuracyIfTouched, sweetspotcircle);
                }
            }else{
                sweetspotcircle.puffy = false;
            }
        }
    }
        //simplifed gamestats logic
        increaseComboNumber() {this.stats.increaseCombo();}
        resetComboNumber() {this.stats.resetCombo();}
        removeMiss() {this.stats.removeMiss();}
    
    


        ////////////////////////////////////////////////////////////////////
        ////////////// NEWTouch Successful. Receive Percent /////////////////
        //////////////////////////////////////////////////////////////////// 
        touchSuccessfulWithPercentage(percentAccuracy, sweetspotcircle) 
        {
            console.log('touchSuccessfulWithPercentage called with:', percentAccuracy, sweetspotcircle);
        
            let startPosition = { x: sweetspotcircle.position.x, y: sweetspotcircle.position.y };
            this.overlayText.addText(percentAccuracy, sweetspotcircle.color, startPosition);
        
            // Increase the combo number and update the score
            this.stats.increaseCombo(); 
            this.stats.addScore(percentAccuracy);  // Adjust this if you need to include comboNumber in the calculation
        
            // Assuming you always want to remove a miss after a successful touch
            this.stats.removeMiss();
        
            console.log(percentAccuracy + "%  accuracy", sweetspotcircle.color, "combo:", this.stats.combo, "score:", this.stats.score);
        }
        

        ////////////////////////////////////////////////////////////////////
        ////////////// NEW Beat Missed. Total Beats Tallied ////////////////////
        ////////////////////////////////////////////////////////////////////
        beatMissed() {
            this.stats.addMiss();
            this.resetComboNumber();  // Make sure this method updates this.stats.combo
        
            if (this.stats.misses > 20) {
                console.log("you lose");
                this.audio.pause();
                // Show something in the UI to indicate game over
            }
        }




    audioEnded() 
    {
        console.log('Level Complete');
       // console.log('Score is:', this.scoreNumber);
        console.log('Score is:', this.stats.score);


        console.log('audioEnded - levelArrayDataObject:', this.levelArrayDataObject);
        addScore(this.playerName, this.stats.score,this.levelArrayDataObject).then(() => {
            this.leaderBoardVisualInstance.populateAndDraw();
        }).catch(error => {
            console.error("Error adding score: ", error);
        });
    }



    /*
    }


        //WHEN SONG ENDS SEND SCORE AND PLAYER NAME TO FIREBASE. 
        audioEnded() 
    {
        console.log('Level Complete');
        console.log('Score is:', this.scoreNumber);

        // Retrieve the player's name from the global variable
        const playerName = window.playerName; // assuming you stored the name here

        // Check if a name was entered
        if (playerName) {
            console.log('audioEnded - levelArrayDataObject:', this.levelArrayDataObject);
            
            // Now that we have the playerName, proceed with adding the score
            addScore(playerName, this.scoreNumber, this.levelArrayDataObject).then(() => {
                this.leaderBoardVisualInstance.populateAndDraw();
            }).catch(error => {
                console.error("Error adding score: ", error);
            });
        } else {
            console.log('User did not enter a name.');
            // Handle the case where the playerName is not available
        }
    }
    */


    /*
    //WHEN SONG ENDS SEND SCORE AND PLAYER NAME TO FIREBASE. 
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
            
        }
    }

    */

    resetVariables(){
        this.scoreNumber = 0;
        this.comboNumber = 0;
        this.beatsMissed = 0;
        this.beatsMissedPrevious=0;
        for(let sweetspotcircle of this.SweetSpotCircleArray)
        {sweetspotcircle.beatsMissed = 0;}
    }
    

    dispose() 
    {
        // Stop and reset the audio
        if (this.audio) 
        {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.removeEventListener('ended', this.onAudioEnded);
            this.audio = new Audio();

        }
    
        // Clear game-related arrays
        this.beatCircles_Array = []; 
        this.recordedMoments_Array = []; 
        this.SweetSpotCircleArray[0].reset();
        this.SweetSpotCircleArray[1].reset();
       // this.uiManager.draw();
      // UIUtilities.drawScore(this.ctx, this.stats.score, this.stats.combo, this.stats.misses);

        this.resetVariables();

    }
}


