import MediaPipeTracker from './MediaPipeTracker.js';
import SweetSpotCircle from './SweetSpotCircle.js';
import JsonManager from './JsonManager.js';
import DrawEngine from './DrawEngine.js';
import LeaderBoard_Box from './LeaderBoard_Box.js';
import { addScore } from './Leaderboard.js';
import BlueButton from './BlueButton.js';
import BoxUI from './BoxUI.js'; // Ensure BoxUI.js is in the same directory
import { OverlayText, MissesOverlay } from './OverlayText.js';
import { UIUtilities } from './UIUtilities.js';
import { GameStats } from './GameStats.js';
import KeyboardManager from './KeyboardManager.js'; // Adjust the path as necessary
import AudioManager from './AudioManager.js'; // Import AudioManager at the top
import  Particles  from './Particles.js';






export default class Level_BasicSwipe
{
    constructor(_levelArrayDataObject) 
    {
        // Initialize MediaPipe and drawing utilities
        this.mediaPipe = MediaPipeTracker.getInstance();
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.drawEngine = DrawEngine.getInstance();

        // JSON management for level data
        this.jsonManager = new JsonManager(); 
        this.mp3Path = _levelArrayDataObject.mp3Path;
        this.jsonPath = _levelArrayDataObject.jsonPath;
        this.particles = new Particles(this.ctx);
  
       // Initialize AudioManager
        this.audioManager = new AudioManager();
        this.audioManager.loadSound(_levelArrayDataObject.mp3Path)
            .then(() => {
            this.audioManager.setMainMusicVolume(.1); // Example: Set to 50% volume

                // Optionally start playing audio here or wait for user interaction
                this.audioManager.startAudio();
            })
            .catch(error => console.error("Error in audio playback:", error));
    

       //Load sounds
        this.audioManager.loadHitSound0('sound2/hit_one.mp3');
        this.audioManager.loadHitSound1('sound2/hit_two.mp3');

        
        // Set the volume for the hit sounds
        this.audioManager.setVolumeForHitSound0(.03); // Set to 50% volume
        this.audioManager.setVolumeForHitSound1(.03); // Set to 50% volume

        //keeping track of audio ended. 
        this.audioManager.setAudioEndCallback(this.audioEnded.bind(this));

        //For hit sounds to make sure they dont double hit/echo
       // this.lastPlayedBeatTime = null; // Add this line to track the last played beat time

        this.audioOffset = -70; // Initial offset value


        //this.keyboardManager = new KeyboardManager(this);
        this.keyboardManager = new KeyboardManager(this, this.audioManager);



        // Keyboard event listeners for adjusting SweetSpotCircles
        this.movementStep = 20; // Adjust this value for normal movement speed
        this.fastMovementStep = 45; // Adjust for faster movement speed

       


        //For Swipes
        this.leftSwipeArray = [];
        this.rightSwipeArray = [];

        this.lastSwipeEntryPoint = null;
        this.lastSwipeAngle = null;

        this.swipeData = []; // Array to hold combined data

        

        this.showSwipeArrow = false;
        this.swipeEntryPoint = null;
        this.swipeAngle = 0;
        


     
              //  this.initializeDefaultSwipeData();


        this.handleBeatTimeDataReady = (event) => 
        {
        this.totalNotes = this.jsonManager.leftCircleData.length + this.jsonManager.rightCircleData.length;
       // console.log("Total notes calculated:", this.totalNotes);
        };

        // Set up the event listener
        document.addEventListener('beatTimeDataReady', this.handleBeatTimeDataReady);


        // Trigger JSON loading
        this.jsonManager.loadJsonFileByPath(this.jsonPath);

        // Store level data from level Array
        this.levelArrayDataObject = _levelArrayDataObject; 
    
        // OLD UI component for volume control
       // this.volumeSlider = UIUtilities.createVolumeSlider(this.audio, this.canvas);
  
    
        // Initialize game statistics
        this.stats = new GameStats(); 
        this.stats.reset(); 

        //for grade using json total notes/beats
        this.totalNotes = 0; // Initialize total notes property

    
        // Setup sweet spot circles
        this.SweetSpotCircleArray = [];
        // Define sweet spot circles and their properties
        this.setupSweetSpotCircles();
    

        // Initialize beat arrays
        this.beatArray = [];
        this.beatCircles_Array = [];
    
        // Overlay for displaying accuracy
        this.overlayText = new OverlayText();
        this.missesOverlay = new MissesOverlay();

    
        // Scoring and ranking logic
        // this.calculateRank = this.defineRankLogic();
        this.checkNewHighScore = this.defineHighScoreLogic();
    
        // Initialize UI buttons
        this.setupUIButtons();
    
        // Leaderboard box initialization
        this.leaderBoardBoxInstance = new LeaderBoard_Box();
    
        // Event listener for JSON data processing
        document.addEventListener('beatTimeDataReady', event => {
            this.SweetSpotCircleArray[0].receiveAndProcessCircleData(this.jsonManager.leftCircleData);
            this.SweetSpotCircleArray[1].receiveAndProcessCircleData(this.jsonManager.rightCircleData);
        });
    
        // Event listener for missed beats
        this.handleBeatMissed = this.beatMissed.bind(this);
        document.addEventListener("BeatMissed", this.handleBeatMissed);
    



       // BoxUI parameters: BoxUI(context,                     x,   y,  width, height, cornerRadius)
         this.boxUI = new BoxUI(this.ctx, this.canvas.width - 600, 20,  280,   300,       10); // Adjusted dimensions for larger size
         this.boxVisible = false;


        //this.currentSwipeSpeed = 0; // Initialize a class property for swipe speed



    



                 ////////END OF CONSTRUCTOR//////


    }






    exportSwipeData() {
        let leftCircleData = this.swipeData.filter(entry => entry.hand === "left").map(entry => ({ time: entry.time, dir: entry.dir }));
        let rightCircleData = this.swipeData.filter(entry => entry.hand === "right").map(entry => ({ time: entry.time, dir: entry.dir }));
    
        let exportData = {
            leftCircleData: leftCircleData,
            rightCircleData: rightCircleData,
            bpm: 120 // Adjust as necessary
        };
    
        // Convert to JSON string
        let jsonStr = JSON.stringify(exportData, null, 2);
    
        // Create a Blob from the JSON string
        let blob = new Blob([jsonStr], { type: "application/json" });
    
        // Create a link element, use it to download the blob, and remove it
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "swipeData.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    


    

    // Call this method to adjust the offset in real-time
        adjustBeatOffset(newOffset) 
        {
            this.runtimeBeatOffset = newOffset;
        }


//////////NEW AUDIO API TRY///////
    getCurrentAudioTime() {

        // Check if new audio system is being used
        if (this.audioManager) {

            return this.audioManager.getCurrentTime();

        }

        // Fallback to the old system if new one isn't ready
        return this.audio.currentTime;
    }

    togglePlayPause() {
        console.log('togglePlayPause called - new system');

        this.audioManager.togglePlayPause();

    }

 

 








    // Sweet spot circles setup
    setupSweetSpotCircles() 
    {
        // Initialize two sweet spot circles with specific attributes
        this.SweetSpotCircleArray[0] = new SweetSpotCircle(this, 'rgb(0, 255, 0)', { x: this.canvas.width /2 -215, y: this.canvas.height/2+80 });
        this.SweetSpotCircleArray[1] = new SweetSpotCircle(this, 'rgb(0, 255, 200)', { x: this.canvas.width /2 +215, y: this.canvas.height/2+80 });
        // Setting additional properties
        this.SweetSpotCircleArray[0].beatCirclePathDirectionAngle = -90;
        this.SweetSpotCircleArray[1].beatCirclePathDirectionAngle = -90;
        this.SweetSpotCircleArray[0].name = "LeftSSCir";
        this.SweetSpotCircleArray[1].name = "RightSSCir";
        this.SweetSpotCircleArray[0].circleIndex = 0;
        this.SweetSpotCircleArray[1].circleIndex = 1;
    }
    
   
 
   
    ///// UI Buttons plus KeybaordShortCuts setup//////
    setupUIButtons() 
    {
        // Define positions and dimensions for buttons
        const leftButtonX = 100;
        const rightButtonX = this.canvas.width - 300;
        const buttonY = this.canvas.height / 2 + 400;
        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonRadius = 10;
    
        // 'Level Select' button
        this.levelSelectButton = new BlueButton(leftButtonX, buttonY, buttonWidth, buttonHeight, buttonRadius, "#00008B", "#0000CD", "Level Select", "rgba(0, 0, 0, 0.5)", { levelName: "Level_StageSelect", leaderBoardState: "latestScores"}, actionData => {
            document.dispatchEvent(new CustomEvent('levelChange', { detail: actionData }));
        });
    

        this.restartButton = new BlueButton(rightButtonX, buttonY, buttonWidth, buttonHeight, buttonRadius, "#8B0000", "#CD5C5C", "Restart", "rgba(0, 0, 0, 0.5)", this.levelArrayDataObject, () => {
            this.resetLevel();
        });
    }


    //Methods for Level based KEYBOARD SHORTCUTS see KeyboardManager.js
    toggleBoxVisibility() {
        // Toggle the visibility of the box
        this.boxVisible = !this.boxVisible;
    }



    adjustBeatBufferTime(amount) {
        this.SweetSpotCircleArray.forEach(circle => {
            circle.beatBufferTime += amount;
        });
    }

    adjustVelocity(amount) {
        this.SweetSpotCircleArray.forEach(circle => {
            circle.velocity += amount;
        });
    }

    adjustMaxBufferLimit(amount) {
        this.stats.maxBufferLimit = Math.max(1, this.stats.maxBufferLimit + amount);
    }

    setMaxBufferLimit(limit) {
        this.stats.maxBufferLimit = limit;
    }


        //FOR CALIBRATING DELAYED AUDIO Method to adjust the audio BEAT offset
        adjustAudioOffset(amount) {
            this.audioOffset += amount;
            console.log("Adjusted audio offset:", this.audioOffset);

        }
    
        // Method to get the current audio BEAT offset
        getAudioOffset() {
            return this.audioOffset;
        }

    moveCircles(direction, step) {
        switch(direction) {
            case 'left':
                this.SweetSpotCircleArray[0].position.x -= step;
                this.SweetSpotCircleArray[1].position.x += step;
                break;
            case 'right':
                this.SweetSpotCircleArray[0].position.x += step;
                this.SweetSpotCircleArray[1].position.x -= step;
                break;
            case 'up':
                this.SweetSpotCircleArray.forEach(circle => circle.position.y -= step);
                break;
            case 'down':
                this.SweetSpotCircleArray.forEach(circle => circle.position.y += step);
                break;
        }
    }

    toggleBeatRanges() {
        this.SweetSpotCircleArray.forEach(circle => {
            circle.showBeatRanges = !circle.showBeatRanges;
        });
    }



drawShortcutsBox() 
{
    if (!this.boxVisible) return;

    // Calculate the offsets based on the current positions and the center of the canvas
    const xOffset = this.SweetSpotCircleArray[0].position.x - (this.canvas.width / 2);
    const yOffset = this.SweetSpotCircleArray[0].position.y - (this.canvas.height / 2);

      // Define shortcuts text array
      const shortcuts = [
        "SHOW/HIDE SHORTCUTS:   K",
        "PAUSE:                P",
        "RESTART:              R",
        "SHOW/HIDE BEAT RANGES:B",
        "Song Volume -/+ :     1/2 (" + Math.round(this.audioManager.mainMusicGain.gain.value * 100) + "%)",
        "Beat Volume -/+ :     3/4 (" + Math.round(this.audioManager.hitSound0Gain.gain.value * 100) + "%)",
        "Misses Allowed -/+ :  7/8 (" + this.stats.maxBufferLimit + ")",
        "Move Target Circles:  ←/↑ (" + (xOffset > 0 ? "+" : "") + xOffset + ", " + (yOffset > 0 ? "+" : "") + yOffset + ")",
        "BeatRange Size -/+ :  </>",
        "Beat Speed -/+ :      +/- (" + this.SweetSpotCircleArray[0].velocity + ")"
    ];

        // Define colors for text and grid lines
        const textColor = 'white';
        const gridColor = 'lightgray'; // Light gray for subtle grid lines
        const keyColor = 'cyan'; // Use a distinct color for keys to stand out

        // Define text positions and box dimensions
        const leftColumnX = this.boxUI.x + 20;
        const rightColumnX = this.boxUI.x + this.boxUI.width - 80; // Adjust this value to fit your layout
        const startY = this.boxUI.y + 15;//lower text
        const lineSpacing = 30;// Adjust line spacing to increase the gap between rows of text.

        // Set up the box UI style
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent black background
        this.ctx.fillRect(this.boxUI.x, this.boxUI.y, this.boxUI.width, this.boxUI.height); // Draw the background
        this.ctx.strokeStyle = gridColor;
        this.ctx.strokeRect(this.boxUI.x, this.boxUI.y, this.boxUI.width +170, this.boxUI.height); // Make box width 140 wider!

        // Set up text style
        this.ctx.font = '18px Courier New'; // Using a monospaced font for consistent spacing
        this.ctx.textAlign = 'left'; // Align text to the left
        this.ctx.fillStyle = textColor;

     // Calculate the maximum width of the text in the first column
        let maxTextWidth = 0;
        shortcuts.forEach((line) => {
            const parts = line.split(":");
            const metrics = this.ctx.measureText(parts[0].trim() + ":");
            maxTextWidth = Math.max(maxTextWidth, metrics.width);
        });
    
        // Define a fixed right column starting point based on the widest text
        const rightColumnStart = this.boxUI.x + maxTextWidth + 200; // Make Box Wider


    // Draw the shortcut text and keys
    for (let i = 0; i < shortcuts.length; i++) {
        let y = startY + i * lineSpacing;
        let parts = shortcuts[i].split(":");
        if (parts.length === 2) {
            // Draw action description
            this.ctx.fillStyle = textColor;
            this.ctx.textAlign = 'left'; // Align action description text to the left
            this.ctx.fillText(parts[0].trim() + ":", this.boxUI.x + 20, y);

            // Draw key in a different color, aligned to the right
            this.ctx.fillStyle = keyColor;
            this.ctx.textAlign = 'right'; // Align key text to the right
            this.ctx.fillText(parts[1].trim(), rightColumnStart, y);
        }
    }
}



    resetLevel() 
    {
       
        // Use AudioManager to restart the audio from the beginning
        this.audioManager.restartAudioFromBeginning();


        // Reset stats and other game variables
        this.stats.reset();
        this.beatCircles_Array.length = 0;

        // Call reset on each SweetSpotCircle instance
        for (let sweetspotcircle of this.SweetSpotCircleArray) {
            sweetspotcircle.reset();
        }

    }



    /////////////////////
    /////LEVEL LOOP//////
    ////////////////////

    level_loop() 
    {
        if (!this.ctx) {
           // console.log("Canvas context is null, stopping level loop.");
            return;
        }
        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }

        // update display stuff and process classes stuff
        for(let sweetspotcircle of this.SweetSpotCircleArray) { sweetspotcircle.updateAndDraw(); }
        this.checkFingerPositionsAndUpdateFingerArrays(); // populates swipe arrays
        this.checkLineCircleTouch(); // checks if swipe arrays (swipes) touch circles
        
        //for keyboard inputs
        this.checkIndividualClicks();

        // Draw UI Stuff
        UIUtilities.drawScore(this.ctx, this.stats.score, this.stats.combo, this.stats.buffer, this.stats.maxBufferLimit);//Draw Score from GameStat.js
        this.restartButton.draw();
        this.levelSelectButton.draw();
        this.overlayText.update();
        this.overlayText.draw(this.ctx); 
        this.missesOverlay.update();
        this.missesOverlay.draw(this.ctx);
        this.drawShortcutsBox();

        //sounds when beat hits.
        this.updateForPlay();

        // show the swipe-line on fingertips
        this.drawSwipeForEachFingerFromFingerArrayData();
        
        //draw swipe arrows
        this.drawSwipeVisualization()
        
        // draw particles
        this.particles.updateAndDraw();

    } // end level_loop()
    

    
    //CHECKS JUST INDEX FINGER
    ////Interaction with Beats and Circles Below///
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




/*
    //OLD Same as above but USES ALL LANDMAKS
    checkForFingerTouchCircles(){
        for(let sweetspotcircle of this.SweetSpotCircleArray){
            let anyLandmarkTouched = false;
            for (let i = 0; i < 21; i++) { // Check all landmarks from 0 to 20
                if (this.mediaPipe.checkForTouchWithShape(sweetspotcircle, this.mediaPipe.BOTH, i).length > 0) {
                    anyLandmarkTouched = true;
                    break; // If any landmark touches, break the loop
                }
            }
            if (anyLandmarkTouched) {
                // No change to your existing code
                sweetspotcircle.puffy = true;  
                let percentAccuracyIfTouched = sweetspotcircle.touch(); // this method returns null if touch is invalid
                if(percentAccuracyIfTouched){
                    this.touchSuccesfulWithPercentage(percentAccuracyIfTouched, sweetspotcircle);
                }
            } else {
                // No change to your existing code
                sweetspotcircle.puffy = false;
            }
        }
    }
*/
    /*
    checkForClick() {
        for (let sweetspotcircle of this.SweetSpotCircleArray) {
            // Check if 'A' or 'S' key is pressed
            if (this.A_Pressed || this.S_Pressed) {
             //   console.log("Key pressed in Check method");
                sweetspotcircle.puffy = true;
                let percentAccuracyIfTouched = sweetspotcircle.touch(); // this method returns null if touch is invalid
                if (percentAccuracyIfTouched) {
                    this.touchSuccessfulWithPercentage(percentAccuracyIfTouched, sweetspotcircle);
                }
            } else {
                sweetspotcircle.puffy = false;
            }
        }
    }
    */

    //For keyboard clicks
    checkIndividualClicks(){
        let sweetspotcircle = this.SweetSpotCircleArray[0];
        if (this.A_pressed)
        {
           // console.log("A pressed in Check method");
            sweetspotcircle.puffy = true;  
            let percentAccuracyIfTouched = sweetspotcircle.touch(); // this method returns null if touch is invalid
            if(percentAccuracyIfTouched){

                this.touchSuccessfulWithPercentage(percentAccuracyIfTouched, sweetspotcircle);
            }
        }
        else
        {
            sweetspotcircle.puffy = false;
        }
        sweetspotcircle = this.SweetSpotCircleArray[1];
        if (this.S_pressed)
        {
           // console.log("S pressed in Check method");
            sweetspotcircle.puffy = true;  
            let percentAccuracyIfTouched = sweetspotcircle.touch(); // this method returns null if touch is invalid
            if(percentAccuracyIfTouched){

                this.touchSuccessfulWithPercentage(percentAccuracyIfTouched, sweetspotcircle);
            }
        }else{
            sweetspotcircle.puffy = false;
        }
    }

    
    //Simplifed gamestats logic
    increaseComboNumber() {this.stats.increaseCombo();}
    resetComboNumber() {this.stats.resetCombo();}

            
    // High score check logic - not using yet
    defineHighScoreLogic() {return (score) => score > 50;}
    




    touchSuccessfulWithPercentage(percentAccuracy, sweetspotcircle) {
        if(!this.audioManager.isPlaying){return};
        let startPosition = { x: sweetspotcircle.position.x, y: sweetspotcircle.position.y };
        this.overlayText.addText(percentAccuracy, sweetspotcircle.color, startPosition);
    
        this.stats.increaseCombo(); 
        this.stats.addScore(percentAccuracy);  
        this.stats.removeMiss();   
        //hide beat circle
        //console.log("TouchME", startPosition, sweetspotcircle.lastSwipeAngle, sweetspotcircle.lastSwipeSpeed)
        this.particles.emit(startPosition, sweetspotcircle.lastSwipeAngle, sweetspotcircle.lastSwipeSpeed);
        

    }

    
    beatMissed(sweetspotcircle) {
        this.stats.addMiss();
       
    //record misses
    // Determine the hand based on the name of the sweetspotcircle
    let hand = sweetspotcircle.name.includes("Left") ? "left" : "right";

    // Retrieve the correct beatTime for the missed beat
    let missedBeatTime = sweetspotcircle.beatCircles_Array[sweetspotcircle.beatIndex].beatTime;

    // Add an entry to swipeData for the missed beat
    this.swipeData.push({ hand: hand, time: missedBeatTime, dir: 0 });





      const missedCircleIndex = event.detail.missedCircleIndex;
      const missedCircle = this.SweetSpotCircleArray[missedCircleIndex];

      

        // Calculate the position for the miss animation, adjust if necessary
        const missPosition = {
        x: missedCircle.position.x, // You can adjust this if needed
        y: missedCircle.position.y + 120 // Adjust the y-coordinate to your liking
    };

        // Call addMiss with the calculated position
        this.missesOverlay.addMiss(missPosition);

 
        this.resetComboNumber();  // Resets the combo count
    
        // Check if the buffer is depleted
        if (this.stats.buffer === 0) {
            this.audioManager.pauseAudio();
    
            this.resetVariables();
    
            // Dispatch a levelChange event for level failure
            const levelFailureData = {
                levelName: 'Level_ResultsStage', 
                state: 'levelFailed', // Indicate the level failed
                playerName: window.playerName,
                levelData: this.levelArrayDataObject
            };
    
            document.dispatchEvent(new CustomEvent('levelChange', { detail: levelFailureData }));
        }
    }


playSound(soundBuffer, gainNode) {
    if (!soundBuffer) return;

    const soundSource = this.audioManager.audioContext.createBufferSource();
    soundSource.buffer = soundBuffer;
    soundSource.connect(gainNode);  // Connect to the gain node for volume control
    gainNode.connect(this.audioManager.audioContext.destination); // Connect the gain node to the destination
    soundSource.start(0);
}

scheduleSound(soundBuffer, time, gainNode) {

    if (!soundBuffer) return;

    const soundSource = this.audioManager.audioContext.createBufferSource();
    soundSource.buffer = soundBuffer;
    soundSource.connect(gainNode);  // Connect to the gain node for volume control
    gainNode.connect(this.audioManager.audioContext.destination); // Connect the gain node to the destination
    soundSource.start(time); // Schedule the sound at the specified time
}



updateForPlay() {

    const currentTime = this.audioManager.audioContext.currentTime * 1000;
    const audioOffset = this.getAudioOffset();


    this.SweetSpotCircleArray.forEach((circle, index) => {
        circle.updateForPlay();

        if (circle.beatCircles_Array && circle.beatIndex < circle.beatCircles_Array.length) {
            const currentBeatTime = circle.beatCircles_Array[circle.beatIndex].beatTime;
            const scheduleTime = (currentBeatTime - audioOffset) / 1000;

            if (!circle.scheduledSound && currentTime < currentBeatTime - audioOffset) {

                circle.scheduledSound = true;

                if (index === 0) {
                    this.scheduleSound(this.audioManager.hitSound1Buffer, scheduleTime, this.audioManager.hitSound1Gain);
                } else if (index === 1) {
                    this.scheduleSound(this.audioManager.hitSound0Buffer, scheduleTime, this.audioManager.hitSound0Gain);
                }
            }

            if (currentTime > currentBeatTime) {
                circle.scheduledSound = false;
            }
        }
    });
}




    audioEnded() {
  
        
        // Define the levelResultsData object with the available data
        const levelResultsData = 
        {
            levelName: 'Level_ResultsStage', // The name of the results level/stage
            state: 'levelComplete',
            score: this.stats.score,
            playerName: window.playerName,
            levelData: this.levelArrayDataObject,
            totalNotes: this.totalNotes

        };

        this.exportSwipeData();
    
        // Add the score and get the rank
        addScore(window.playerName, this.stats.score, this.levelArrayDataObject).then(({ id, rank }) => {

            // Now that we have the rank, update levelResultsData with it
            levelResultsData.rank = rank;
    
            // Now dispatch the levelChange event with the complete levelResultsData
            document.dispatchEvent(new CustomEvent('levelChange', { detail: levelResultsData }));
    
        }).catch(error => {
            console.error("Error adding score: ", error);
        });
    }
    

    resetVariables() 
    {
        this.stats.reset(); // Reset all game stats    
        for (let sweetspotcircle of this.SweetSpotCircleArray) {
            sweetspotcircle.beatsMissed = 0;
        }
    }

    dispose() 
    {

        // Stop the sound source if it is playing
        if (this.isPlaying && this.soundSource) {
            this.soundSource.stop();
        }

        // Disconnect and nullify the sound source
        if (this.soundSource) {
            this.soundSource.disconnect();
            this.soundSource = null;
        }

        // Close the audio context
        if (this.audioContext) {
            this.audioContext.close();
        }

        // Nullify the audioBuffer
        this.audioBuffer = null;

        // Reset playback state
        this.isPlaying = false;


    
        // Clear game-related arrays
        this.beatCircles_Array.length = 0;
        
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
    
        if (this.restartButton && typeof this.restartButton.dispose === 'function') {this.restartButton.dispose();}
    
        document.removeEventListener("BeatMissed", this.handleBeatMissed);
        document.removeEventListener('beatTimeDataReady', this.handleBeatTimeDataReady);

        // Resetting variables to their initial state
        this.resetVariables();

        // Remove references to DOM elements and external objects
        this.canvas = null;
        this.fileInput = null;
       // this.volumeSlider = null;

       this.audioManager.dispose();
       this.keyboardManager.dispose();

       // if (this.keyboardManager) {this.keyboardManager.dispose();}
    
    }


    ////////////////////////////////////////////////////////////////////////////
    ////////these methods depend on these arrays in the constructor/////////////
    /////////// this.leftSwipeArray = [];///////////////////////////////////////
    /////////// this.rightSwipeArray = [];//////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////


// populates the swipe arrays
checkFingerPositionsAndUpdateFingerArrays() {
    let leftPoint = this.mediaPipe.getPointOfIndex("Left", 8);
    let rightPoint = this.mediaPipe.getPointOfIndex("Right", 8);
    let currentTime = new Date().getTime(); // Get current time in milliseconds

    // Add time to the point object
    if (leftPoint && leftPoint.x !== undefined && leftPoint.y !== undefined) {
        leftPoint.time = currentTime;
        this.leftSwipeArray.push(leftPoint);
        if(this.leftSwipeArray.length > 2) { this.leftSwipeArray.shift(); }
    }

    if (rightPoint && rightPoint.x !== undefined && rightPoint.y !== undefined) {
        rightPoint.time = currentTime;
        this.rightSwipeArray.push(rightPoint);
        if(this.rightSwipeArray.length > 2) { this.rightSwipeArray.shift(); }
    }
}

// makes a line from the finger arrays and checks if that line touches a sweetSpotCircle
checkLineCircleTouch() 
{
    for (var sweetSpotCircle of this.SweetSpotCircleArray) 
    {
        let leftTouches = false;
        let rightTouches = false;

        // Check for left touch
        if (this.leftSwipeArray[0] && this.leftSwipeArray[1]) {
            leftTouches = this.circleLineToucheyMath(
                            { x: sweetSpotCircle.position.x, y: sweetSpotCircle.position.y },
                            sweetSpotCircle.baseRadius,
                            [this.leftSwipeArray[0].x, this.leftSwipeArray[0].y],
                            [this.leftSwipeArray[1].x, this.leftSwipeArray[1].y]
                        );
        }
        
        // Check for right touch
        if (this.rightSwipeArray[0] && this.rightSwipeArray[1]) {
            rightTouches = this.circleLineToucheyMath(
                            { x: sweetSpotCircle.position.x, y: sweetSpotCircle.position.y },
                            sweetSpotCircle.baseRadius,
                            [this.rightSwipeArray[0].x, this.rightSwipeArray[0].y],
                            [this.rightSwipeArray[1].x, this.rightSwipeArray[1].y]
                        );
        }

        // Ensure swipeLogged is initialized for each sweetSpotCircle
        if (sweetSpotCircle.swipeLogged === undefined) {
            sweetSpotCircle.swipeLogged = false;
        }

        // if a touch is detected: 'activate' SweetSpotCircle (includes a toggle: swipeLogged)
        if ((leftTouches || rightTouches) && !sweetSpotCircle.swipeLogged) 
        {
            sweetSpotCircle.puffy = true;
            sweetSpotCircle.swipeLogged = true;

            let swipeArray = leftTouches ? this.leftSwipeArray : this.rightSwipeArray;
            let swipeAngle = this.calculateAngle(swipeArray[0].x, swipeArray[0].y, swipeArray[1].x, swipeArray[1].y);
            


/*
            // New code to log and push
            let hand = leftTouches ? "left" : "right";
            let direction = Math.abs(swipeAngle) <= 90 ? 90 : -90;

            // Find the latest entry for the corresponding hand and update its direction
            let latestEntry = this.swipeData.slice().reverse().find(entry => entry.hand === hand && entry.dir === null);
            if (latestEntry) {
                latestEntry.dir = direction;
            }
*/




                        // Inside your swipe detection logic
            let hand = leftTouches ? "left" : "right";
            let direction = Math.abs(swipeAngle) <= 90 ? 90 : -90;
            // Right after detecting a swipe and setting the direction
            console.log(`Swipe detected: Hand: ${hand}, Direction: ${direction}`);

            // Update the direction for the latest entry for the corresponding hand
            let latestEntry = this.swipeData.slice().reverse().find(entry => entry.hand === hand && entry.dir === null);
            if (latestEntry) {
                latestEntry.dir = direction;
            }
                        console.log("swipeData state after update:", JSON.stringify(this.swipeData, null, 2));






            // Calculate distance for speed
            let distance = Math.sqrt(Math.pow(swipeArray[1].x - swipeArray[0].x, 2) + Math.pow(swipeArray[1].y - swipeArray[0].y, 2));

            // Calculate time difference in seconds
            let timeDiff = (swipeArray[1].time - swipeArray[0].time) / 1000; // Convert milliseconds to seconds
            let currentSwipeSpeed = timeDiff > 0 ? distance / timeDiff : 0;

            // Store and log swipe details
            sweetSpotCircle.lastSwipeEntryPoint = swipeArray[0];
            sweetSpotCircle.lastSwipeAngle = swipeAngle;
            sweetSpotCircle.lastSwipeSpeed = currentSwipeSpeed; // Storing speed using distance as a proxy for speed 
            sweetSpotCircle.isSwipeActive = true; // Flag to indicate an active swipe

            let percentAccuracyIfTouched = sweetSpotCircle.touch();
            if (percentAccuracyIfTouched) {
                this.touchSuccessfulWithPercentage(percentAccuracyIfTouched, sweetSpotCircle);
            }

            console.log(`Swipe Direction: ${leftTouches ? "Left" : "Right"}, Angle: ${swipeAngle}`);


            // New logging logic for record Direciton TEST only
            if (Math.abs(swipeAngle) > 179) {
           //     console.log("Left: -90");
            } else {
          //      console.log("Right: 90");
            }

            
            
        }
        else if (!leftTouches && !rightTouches && sweetSpotCircle.swipeLogged) 
        {
            sweetSpotCircle.puffy = false;
            sweetSpotCircle.swipeLogged = false;
            sweetSpotCircle.isSwipeActive = false; // Optionally reset the swipe activity flags
        }
    }


    
}



    circleLineToucheyMath(circleCenter, circleRadius, linePoint1, linePoint2) 
    {
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






    calculateAngle(x1, y1, x2, y2) 
    {
        // Calculate the angle in radians
        const angleRadians = Math.atan2(y2 - y1, x2 - x1);

        // Convert the angle to degrees
        const angleDegrees = (angleRadians * 180) / Math.PI;

        return angleDegrees;
    }





    drawSwipeForEachFingerFromFingerArrayData()
    {
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
 
    drawSwipeVisualization()//testEntryPoint, entryPoint, swipeAngle) 
    {
        for (let sweetSpotCircle of this.SweetSpotCircleArray) 
        {
            if (sweetSpotCircle.isSwipeActive) 
            {
                // Draw dynamic arrow based on swipe data
                if (sweetSpotCircle.lastSwipeEntryPoint && sweetSpotCircle.lastSwipeAngle !== undefined) {
                    this.drawArrow(sweetSpotCircle.lastSwipeEntryPoint, sweetSpotCircle.lastSwipeAngle, 'white'); // Actual dynamic arrow in white
                }
            }
        }
    }
    
    drawArrow(startPoint, angle, color) 
    {
        const arrowLength = 100; // Length of the arrow
        const dotRadius = 5; // Radius of the red dot
        const arrowheadLength = 20; // Length of the arrowhead
    
        // Calculate the end point of the arrow based on the angle
        const endPoint = {
            x: startPoint.x + arrowLength * Math.cos(angle * Math.PI / 180),
            y: startPoint.y + arrowLength * Math.sin(angle * Math.PI / 180)
        };
    
        // Draw the red dot
        this.ctx.beginPath();
        this.ctx.arc(startPoint.x, startPoint.y, dotRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
    
        // Draw the arrow line
        this.ctx.beginPath();
        this.ctx.moveTo(startPoint.x, startPoint.y);
        this.ctx.lineTo(endPoint.x, endPoint.y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3; // Adjust the line width as needed
        this.ctx.stroke();
    
        // Draw the arrowhead
        this.ctx.beginPath();
        this.ctx.moveTo(endPoint.x, endPoint.y);
        this.ctx.lineTo(endPoint.x - arrowheadLength * Math.cos((angle - 45) * Math.PI / 180), 
                       endPoint.y - arrowheadLength * Math.sin((angle - 45) * Math.PI / 180));
        this.ctx.lineTo(endPoint.x - arrowheadLength * Math.cos((angle + 45) * Math.PI / 180), 
                       endPoint.y - arrowheadLength * Math.sin((angle + 45) * Math.PI / 180));
        this.ctx.lineTo(endPoint.x, endPoint.y);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
    

}



    


