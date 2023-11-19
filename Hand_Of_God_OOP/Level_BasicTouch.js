import MediaPipeTracker from './MediaPipeTracker.js';
import SweetSpotCircle from './SweetSpotCircle.js';
import JsonManager from './JsonManager.js';
import DrawEngine from './DrawEngine.js';
import LeaderBoard_Box from './LeaderBoard_Box.js';
import { addScore } from './Leaderboard.js';
import BlueButton from './BlueButton.js';
import { OverlayText } from './OverlayText.js';
import { UIUtilities } from './UIUtilities.js';
import { GameStats } from './GameStats.js'; 



export default class Level_BasicTouch
{
    constructor(_levelArrayDataObject,audio)
    {

        this.mediaPipe = MediaPipeTracker.getInstance()
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
        this.drawEngine = DrawEngine.getInstance();
       // this.fileInput = document.getElementById('fileInput');
        
        this.audio = new Audio();
        this.audio.volume = 0.04; 

        this.jsonManager = new JsonManager(); // Ensure this is initialized


        // Assign mp3Path and jsonPath from the level data object first
        this.mp3Path = _levelArrayDataObject.mp3Path;
        this.jsonPath = _levelArrayDataObject.jsonPath;
    
        // Then use them to set the audio source and load JSON
        this.jsonManager.loadJsonFileByPath(this.jsonPath);
        

        this.levelArrayDataObject = _levelArrayDataObject; //important, has all mp3,json etc..


        this.volumeSlider = UIUtilities.createVolumeSlider(this.audio, this.canvas);
       
        // Bind the audioEnded method and add it as an event listener
        this.boundAudioEnded = this.audioEnded.bind(this);
        this.audio.addEventListener('ended', this.boundAudioEnded);

        
        //ALL SCORES/STATS CAPTURED HERE
        this.stats = new GameStats(14); 
        this.stats.reset(); // Reset the game stats including the buffer

       
        this.SweetSpotCircleArray=[];
        this.SweetSpotCircleArray[0] = new SweetSpotCircle(this.audio,  'rgb(0, 255, 0)',     { x: this.canvas.width /2 -135, y: this.canvas.height/2+100}  );
        this.SweetSpotCircleArray[1] = new SweetSpotCircle(this.audio,  'rgb(0, 255, 200)',   { x: this.canvas.width /2 +135, y: this.canvas.height/2+100} );
        this.SweetSpotCircleArray[0].beatCirclePathDirectionAngle = -90;
        this.SweetSpotCircleArray[1].beatCirclePathDirectionAngle = -90;
        this.SweetSpotCircleArray[0].name="LeftSSCir";
        this.SweetSpotCircleArray[1].name="RightSSCir";

     //   this.scoreNumber = 0;
      //  this.comboNumber = 0;

        this.beatArray=[];
        this.beatCircles_Array = [];


        //showing Percentage accuacies when touch beats.
        this.overlayText = new OverlayText();


        this.calculateRank = (score) => {
            // Logic to determine rank based on the score argument
            if (score > 200) return 'A';
            if (score > 100) return 'B';
            return 'C';
        };
        this.checkNewHighScore = (score) => {
            // For now, any score greater than 50 is considered a high score
            return score > 50;
        };


        // Button positions (You may need to adjust these positions to fit your layout)
        const leftButtonX = 100; // for example, 100 pixels from the left
        const rightButtonX = this.canvas.width - 300; // for example, 300 pixels from the right edge
        const buttonY = this.canvas.height / 2 + 400; // vertical center for demonstration
        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonRadius = 10;


        // 'Level Select' button specific code
        this.levelSelectButton = new BlueButton
        (
            leftButtonX,
            buttonY,
            buttonWidth,
            buttonHeight,
            buttonRadius,
            "#00008B",
            "#0000CD",
            "Level Select",
            "rgba(0, 0, 0, 0.5)",
            { levelName: "Level_StageSelect",leaderBoardState: "latestScores"},
            (actionData) => 
            {
            console.log("Level select button clicked. Current buffer:", this.stats.buffer);
            document.dispatchEvent(new CustomEvent('levelChange', { detail: actionData }));
            }
        );


        // 'Restart' button specific code
        this.restartButton = new BlueButton
        (
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
            (actionData) => 
            {
                // Dispatching event to restart the game or level
                console.log("Level Basic Touch Restart Button clicked, dispatching levelChange event with details:", actionData);
                document.dispatchEvent(new CustomEvent('levelChange', { detail: actionData }));
            
                
            }
        );

        this.leaderBoardBoxInstance = new LeaderBoard_Box();


        // event handler for when json is fully loaded
        document.addEventListener('beatTimeDataReady', event => {
            this.SweetSpotCircleArray[0].receiveAndProcessCircleData(this.jsonManager.leftCircleData);
            this.SweetSpotCircleArray[1].receiveAndProcessCircleData(this.jsonManager.rightCircleData);
        });
        
        // Add these lines in the constructor
        this.handleBeatMissed = this.beatMissed.bind(this);
        document.addEventListener("BeatMissed", this.handleBeatMissed);

    

        // listen for when song ends to log level complete
        this.audio.addEventListener('ended', this.audioEnded.bind(this));

        
      // Set the audio source
        this.audio.src = _levelArrayDataObject.mp3Path;

        // Add an event listener to start playing the audio once it's loaded
        this.audio.addEventListener('loadeddata', () => {
            this.startAudio();
        });

       

    }


    async startAudio() 
    {
        console.log("Attempting to start audio. Is audio already playing?", !this.audio.paused);

        if (!this.audio.paused) {
            console.log("Audio is already playing.");
            return;
        }
        try 
        {
         await this.audio.play();
        } 
         catch (err) 
        {
         console.error("Error starting audio playback:", err);
        }
    }
    

    level_loop() 
    {

        if (!this.ctx) {
            console.log("Canvas context is null, stopping level loop.");
            return;
        }

        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
        this.checkForFingerTouchCircles(); 
        // update display stuff and process classes stuff
        for(let sweetspotcircle of this.SweetSpotCircleArray) { sweetspotcircle.updateAndDraw(); }
        
        this.restartButton.draw();
        this.levelSelectButton.draw();

        //Draw Score from GameStat.js
        UIUtilities.drawScore(this.ctx, this.stats.score, this.stats.combo, this.stats.buffer);


        // Update and draw percentage overlay texts with succesful beat hits
        this.overlayText.update(); 
        this.overlayText.draw(this.ctx); 

        //Draw volume slider
        this.volumeSlider.drawVolumeSlider();


    }
    
    
    checkForFingerTouchCircles() {
        for(let sweetspotcircle of this.SweetSpotCircleArray){
            const isTouchingNow = this.mediaPipe.checkForTouchWithShape(sweetspotcircle, this.mediaPipe.BOTH, 8).length > 0;
            
            if (isTouchingNow) {
                sweetspotcircle.puffy = true;
                // Only call touch() if the finger was not touching in the previous frame
                if (!sweetspotcircle.wasTouching) {
                    let percentAccuracyIfTouched = sweetspotcircle.touch();
                    if (percentAccuracyIfTouched) {
                        this.touchSuccessfulWithPercentage(percentAccuracyIfTouched, sweetspotcircle);
                    }
                }
            } else {
                sweetspotcircle.puffy = false;
            }
    
            // Update the wasTouching state for the next frame
            sweetspotcircle.wasTouching = isTouchingNow;
        }
    }
    

        //Simplifed gamestats logic
        increaseComboNumber() {this.stats.increaseCombo();}
        resetComboNumber() {this.stats.resetCombo();}
    


    ////////////// NEWTouch Successful. Receive Percent /////////////////
    touchSuccessfulWithPercentage(percentAccuracy, sweetspotcircle) 
    {
        let startPosition = { x: sweetspotcircle.position.x, y: sweetspotcircle.position.y };
        this.overlayText.addText(percentAccuracy, sweetspotcircle.color, startPosition);
    
        // Increase the combo number and update the score
        this.stats.increaseCombo(); 
        this.stats.addScore(percentAccuracy);  // Adjust this if you need to include comboNumber in the calculation
    
        // Assuming you always want to remove a miss after a successful touch
        this.stats.removeMiss();   

    }
    

    ////////////// NEW Beat Missed. Total Beats Tallied ////////////////////
    beatMissed() 
    {
        this.stats.addMiss();
        console.log("Miss Added from beatMissed. Buffer remaining: ", this.stats.buffer);
    
        this.resetComboNumber();  // Resets the combo count
    
        // Check if the buffer is depleted
        if (this.stats.buffer === 0) {
            console.log("Buffer depleted. You lose.");
    
            if (!this.audio.paused)
            {
                this.audio.pause();
            }
            this.resetVariables();
    
            // Dispatch a levelChange event for level failure
            const levelFailureData = 
            {
                levelName: 'Level_ResultsStage', 
                state: 'levelFailed', // Indicate the level failed
                playerName: window.playerName,
                levelData: this.levelArrayDataObject
            };
    
            document.dispatchEvent(new CustomEvent('levelChange', { detail: levelFailureData }));
        }
    }
        

    audioEnded() 
    {
        console.log('Level Complete');
        console.log('Score is:', this.stats.score);
        console.log('Player Name:', window.playerName);
        console.log('Level Array Data Object:', this.levelArrayDataObject);
        // Dispatch a levelChange event with the required data for the Level Results Stage
        const levelResultsData = 
        {
            levelName: 'Level_ResultsStage', // The name of the results level/stage
            state: 'levelComplete',
            score: this.stats.score,
            playerName: window.playerName,
            levelData: this.levelArrayDataObject
        };

        document.dispatchEvent(new CustomEvent('levelChange', { detail: levelResultsData }));



        addScore(window.playerName, this.stats.score,this.levelArrayDataObject).then(() => {
            this.leaderBoardBoxInstance.populateAndDraw();
        }).catch(error => {
            console.error("Error adding score: ", error);
        });
    }
      

    resetVariables() 
    {
        this.stats.reset(); // Reset all game stats    
       // this.beatsMissedPrevious = 0;
        for (let sweetspotcircle of this.SweetSpotCircleArray) {
            sweetspotcircle.beatsMissed = 0;
        }
    }

    dispose() 
    {
        console.log("Level_BasicTouch ending. Final buffer:", this.stats.buffer);

        // Stop and reset the audio
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            if (this.audio.src) {
                URL.revokeObjectURL(this.audio.src); // Release any object URL
            }

            this.audio.src = '';
            this.audio.removeEventListener('ended', this.boundAudioEnded);
        }
    
        // Clear game-related arrays
        this.beatCircles_Array.length = 0;
       // this.recordedMoments_Array.length = 0;
        
        // Reset SweetSpotCircleArray items
        if (this.SweetSpotCircleArray && this.SweetSpotCircleArray.length) {
            this.SweetSpotCircleArray.forEach(circle => {
                if (circle && typeof circle.reset === 'function') {
                    circle.reset();
                }
            });
        }
    
        // Dispose of buttons if they have a dispose method
        if (this.levelSelectButton && typeof this.levelSelectButton.dispose === 'function') {
            this.levelSelectButton.dispose();
        }
    
        if (this.restartButton && typeof this.restartButton.dispose === 'function') {
            this.restartButton.dispose();
        }
    
        document.removeEventListener("BeatMissed", this.handleBeatMissed);

        // Resetting variables to their initial state
        this.resetVariables();

    
        // Remove references to DOM elements and external objects
        this.canvas = null;
        this.fileInput = null;
        this.volumeSlider = null;
    
    }
    
}
