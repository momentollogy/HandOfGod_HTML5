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



export default class Level_Swipe
{
    constructor(_levelArrayDataObject, audio) 
    {
        // Initialize MediaPipe and drawing utilities
        this.mediaPipe = MediaPipeTracker.getInstance();
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.drawEngine = DrawEngine.getInstance();
    
        // Audio setup
        this.audio = new Audio();
        this.audio.volume = 0.3; // Set initial volume
    
        // JSON management for level data
        this.jsonManager = new JsonManager(); 
        this.mp3Path = _levelArrayDataObject.mp3Path;
        this.jsonPath = _levelArrayDataObject.jsonPath;



           // Mouse event listeners for SweetspotCircle Calibration might move or kill
        this.selectedCircle = null;
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));

        //For Swipes
        this.leftSwipeArray = [];
        this.rightSwipeArray = [];

        this.lastSwipeEntryPoint = null;
        this.lastSwipeAngle = null;

        this.showSwipeArrow = false;
        this.swipeEntryPoint = null;
        this.swipeAngle = 0;
        
        // Keyboard event listeners for adjusting SweetSpotCircles
        this.movementStep = 20; // Adjust this value for normal movement speed
        this.fastMovementStep = 45; // Adjust for faster movement speed


            this.handleBeatTimeDataReady = (event) => {
                this.totalNotes = this.jsonManager.leftCircleData.length + this.jsonManager.rightCircleData.length;
                console.log("Total notes calculated:", this.totalNotes);
            };

            // Set up the event listener
            document.addEventListener('beatTimeDataReady', this.handleBeatTimeDataReady);


            // Trigger JSON loading
            this.jsonManager.loadJsonFileByPath(this.jsonPath);

            

        this.levelArrayDataObject = _levelArrayDataObject; // Store level data
    
        // UI component for volume control
        this.volumeSlider = UIUtilities.createVolumeSlider(this.audio, this.canvas);
    
        // Event binding for audio end
        this.boundAudioEnded = this.audioEnded.bind(this);
        this.audio.addEventListener('ended', this.boundAudioEnded);
    
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
        this.calculateRank = this.defineRankLogic();
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
    
        // Audio source setup and event listener for loading
        this.audio.src = _levelArrayDataObject.mp3Path;
        this.audio.addEventListener('loadeddata', () => this.startAudio());

        //END OF CONSTRUCTOR//

         // Initialize the box UI and visibility flag
         this.boxUI = new BoxUI(this.ctx, this.canvas.width - 300, 20, 280, 300, 10); // Adjusted dimensions for larger size
         this.boxVisible = false;
    }
    



    // Sweet spot circles setup
    setupSweetSpotCircles() 
    {
        // Initialize two sweet spot circles with specific attributes
        this.SweetSpotCircleArray[0] = new SweetSpotCircle(this.audio, 'rgb(0, 255, 0)', { x: this.canvas.width /2 -135, y: this.canvas.height/2+100 });
        this.SweetSpotCircleArray[1] = new SweetSpotCircle(this.audio, 'rgb(0, 255, 200)', { x: this.canvas.width /2 +135, y: this.canvas.height/2+100 });
        // Setting additional properties
        this.SweetSpotCircleArray[0].beatCirclePathDirectionAngle = -90;
        this.SweetSpotCircleArray[1].beatCirclePathDirectionAngle = -90;
        this.SweetSpotCircleArray[0].name = "LeftSSCir";
        this.SweetSpotCircleArray[1].name = "RightSSCir";
    }
    
    // Rank calculation logic
    defineRankLogic() {
        // Function returns a lambda function for rank calculation
        return (score) => {
            if (score > 200) return 'A';
            if (score > 100) return 'B';
            return 'C';
        };
    }
    
    // High score check logic
    defineHighScoreLogic() {
        // Function returns a lambda function for high score check
        return (score) => score > 50;
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


        //Playable Keys version
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    


        // Event listener for toggling beat ranges
        document.addEventListener('keydown', (event) => {
            if (event.key === 'b' || event.key === 'B') {
                // Assuming SweetSpotCircleArray is an array of your SweetSpotCircle instances
                this.SweetSpotCircleArray.forEach(circle => {
                    circle.showBeatRanges = !circle.showBeatRanges;
                });
            }
        });

        //Keyboard "L and  Carrots" to adjust beatRangers on the fly
        document.addEventListener('keydown', (event) => {
            const adjustmentAmount = 10; // Adjust this value as needed
    
            if (event.key === ',') {
                // Decrease beatBufferTime
                this.SweetSpotCircleArray.forEach(circle => {
                    circle.decreaseBeatBufferTime(adjustmentAmount);
                });
            } else if (event.key === '.') {
                // Increase beatBufferTime
                this.SweetSpotCircleArray.forEach(circle => {
                    circle.increaseBeatBufferTime(adjustmentAmount);
                });
            }
        });


        document.addEventListener('keydown', (event) => {
            const velocityAdjustmentAmount = 10; // Adjust this value as needed
    
            if (event.key === '-') {
                // Decrease velocity
                this.SweetSpotCircleArray.forEach(circle => {
                    circle.decreaseVelocity(velocityAdjustmentAmount);
                });
            } else if (event.key === '=') {
                // Increase velocity
                this.SweetSpotCircleArray.forEach(circle => {
                    circle.increaseVelocity(velocityAdjustmentAmount);
                });
            }
        });




        document.addEventListener('keydown', (event) => {
            if (event.key === 'p' || event.key === 'P') {
                // Toggle play/pause
                if (this.audio.paused) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            }
        });

        
        // Event listener for toggling the box with the 'K' key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'k' || event.key === 'K') {
                this.boxVisible = !this.boxVisible;
            }
        });


                // Event listener for restarting the level with the 'R' key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'r' || event.key === 'R') {
                this.resetLevel();
            }
        });


                // Event listener for decreasing the maxBufferLimit with the '1' key
        document.addEventListener('keydown', (event) => {
            if (event.key === '1') {
                this.stats.maxBufferLimit = Math.max(1, this.stats.maxBufferLimit - 1); // Decrease limit but keep it at least 1
            }
        });

        // Event listener for increasing the maxBufferLimit with the '2' key
        document.addEventListener('keydown', (event) => {
            if (event.key === '2') {
                this.stats.maxBufferLimit += 1; // Increase limit
            }
        });


        //this.spacePressed = false;
        this.A_pressed = false;
        this.S_pressed = false;

    }

    drawShortcutsBox() {
        if (!this.boxVisible) return;

        // Set transparency for the box
        this.ctx.globalAlpha = 0.7; // Adjust transparency as needed
        //this.boxUI.draw();
        this.ctx.globalAlpha = 1.0; // Reset alpha to fully opaque for text

        // Text settings
        this.ctx.fillStyle = 'white'; // White text color
        this.ctx.font = '24px Arial'; // Adjust font size as needed
        const shortcuts = [
            "P = Pause",
            "R = Restart",
            "B = Toggle BeatRanges + Data",
            "</> = Inc. BeatRange",
            "+/- = Speed",
            "Arrows = Move Target Circles",
            "1/2 = Dec/Inc Misses Allowed (" + this.stats.maxBufferLimit + ")",
            "K = hide/key."
            
        ];
        
        // Draw each line of text
        let textY = this.boxUI.y + 50; // Starting Y position for text
        for (const line of shortcuts) {
            this.ctx.fillText(line, this.boxUI.x + 20, textY);
            textY += 34; // Increase Y for the next line, adjust spacing as needed
        }
    }



    resetLevel() {
        // Reset audio
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.play();
    
        // Reset stats and other game variables
        this.stats.reset();
        this.beatCircles_Array.length = 0;
    
          // Call reset on each SweetSpotCircle instance
          for (let sweetspotcircle of this.SweetSpotCircleArray) {
            sweetspotcircle.reset();
        }
    
        this.draw(); // Assuming you have a method to redraw the game state
    }


    //Code to fix weird DOM issue with audio. 
    async startAudio() 
    {
        if (!this.audio.paused) {console.log("Audio is already playing.");return;}
        try 
        {await this.audio.play();} 
         catch (err) 
        {console.error("Error starting audio playback:", err);}
    }


//////////////////
//next few functions are for sweetspotcircle calibration, allowing users to move them in level.
    onMouseDown(event) {
        const mousePos = this.getMousePos(event);
        this.SweetSpotCircleArray.forEach(circle => {
            if (this.isInsideCircle(mousePos, circle)) {
                this.selectedCircle = circle;
            }
        });
    }
    
    onMouseMove(event) {
        if (this.selectedCircle) {
            const mousePos = this.getMousePos(event);
            const deltaX = mousePos.x - this.selectedCircle.position.x;
            const deltaY = mousePos.y - this.selectedCircle.position.y;
    
            // Update positions
            this.selectedCircle.position.x += deltaX;
            this.selectedCircle.position.y += deltaY;
    
            // Mirror movement for the other circle
            const otherCircle = this.SweetSpotCircleArray.find(circle => circle !== this.selectedCircle);
            otherCircle.position.x -= deltaX;
            otherCircle.position.y += deltaY;
        }
    }
    
    
    onMouseUp() {
        this.selectedCircle = null;
    }


    
    getMousePos(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
    }



    isInsideCircle(mousePos, circle) {
        const dx = mousePos.x - circle.position.x;
        const dy = mousePos.y - circle.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle.radius;
    }
    //MIGht get rid of all this later above
//////////////////
//////////////////




onKeyDown(event) {
    // Your existing key handling logic
   
    if (event.code === 'KeyA' && !this.A_pressed) { this.A_pressed = true; }
    if (event.code === 'KeyS' && !this.S_pressed) { this.S_pressed = true; }

    // Additional logic for moving SweetSpotCircles
    let step = event.shiftKey ? this.fastMovementStep : this.movementStep; // Define these steps in your class

    switch(event.key) {
        case 'ArrowLeft':
            // Move circles closer together
            this.SweetSpotCircleArray[0].position.x -= step;
            this.SweetSpotCircleArray[1].position.x += step;
            break;
        case 'ArrowRight':
            // Move circles further apart
            this.SweetSpotCircleArray[0].position.x += step;
            this.SweetSpotCircleArray[1].position.x -= step;
            break;
        case 'ArrowUp':
            // Move circles up
            this.SweetSpotCircleArray.forEach(circle => circle.position.y -= step);
            break;
        case 'ArrowDown':
            // Move circles down
            this.SweetSpotCircleArray.forEach(circle => circle.position.y += step);
            break;
    }
}

onKeyUp(event) {
    // Your existing key up handling logic
  
    if (event.code === 'KeyA') { this.A_pressed = false; }
    if (event.code === 'KeyS') { this.S_pressed = false; }
}


    /////////////////////
    /////LEVEL LOOP//////
    ////////////////////

    level_loop() 
    {

        if (!this.ctx) {
            return;
        }

        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
        this.checkForFingerTouchCircles(); 
        // update display stuff and process classes stuff
        for(let sweetspotcircle of this.SweetSpotCircleArray) { sweetspotcircle.updateAndDraw(); }
        
        //for keyboard inputs
        this.checkForClick();
        this. checkIndividualClicks();


        this.restartButton.draw();
        this.levelSelectButton.draw();

        //Draw Score from GameStat.js
       // UIUtilities.drawScore(this.ctx, this.stats.score, this.stats.combo, this.stats.buffer);
        UIUtilities.drawScore(this.ctx, this.stats.score, this.stats.combo, this.stats.buffer, this.stats.maxBufferLimit);


        // Update and draw percentage overlay texts with succesful beat hits
        this.overlayText.update(); 
        this.overlayText.draw(this.ctx); 

        //misses.
        this.missesOverlay.update();
        this.missesOverlay.draw(this.ctx);

        this.drawShortcutsBox();



        //Draw volume slider
        this.volumeSlider.drawVolumeSlider();

        this.checkFingerPositionsAndUpdateFingerArrays();
        this.drawSwipeForEachFingerFromFingerArrayData();
        this.checkLineCircleTouch();

       const testEntryPoint = { x: 100, y: 100 };

    
  

       // if (this.lastSwipeEntryPoint && this.lastSwipeAngle !== null) {
       //     this.drawSwipeVisualization(null, this.lastSwipeEntryPoint, this.lastSwipeAngle);
      //  }

      for (let sweetSpotCircle of this.SweetSpotCircleArray) {
        if (sweetSpotCircle.isSwipeActive) {
            this.drawSwipeVisualization(null, sweetSpotCircle.lastSwipeEntryPoint, sweetSpotCircle.lastSwipeAngle);
        }
    }



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



    checkForClick() {
        for (let sweetspotcircle of this.SweetSpotCircleArray) {
            // Check if 'A' or 'S' key is pressed
            if (this.A_Pressed || this.S_Pressed) {
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


    //For keyboard clicks
    checkIndividualClicks(){
        let sweetspotcircle = this.SweetSpotCircleArray[0];
        if (this.A_pressed)
        {
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
    beatMissed(sweetspotcircle) 
    {
        this.stats.addMiss();
       
        //TRIGGER MISS ANIMATION
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
    
        this.missesOverlay.addMiss({ x: centerX, y: centerY });
       // this.missesOverlay.addMiss(sweetspotcircle.color);

        this.resetComboNumber();  // Resets the combo count
    
        // Check if the buffer is depleted
        if (this.stats.buffer === 0) {
    
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
      

    audioEnded() {
        console.log('Level Complete');
        console.log('Score is:', this.stats.score);
        console.log('Player Name:', window.playerName);
        console.log('Level Array Data Object:', this.levelArrayDataObject);
        
        // Define the levelResultsData object with the available data
        const levelResultsData = {
            levelName: 'Level_ResultsStage', // The name of the results level/stage
            state: 'levelComplete',
            score: this.stats.score,
            playerName: window.playerName,
            levelData: this.levelArrayDataObject,
            totalNotes: this.totalNotes

            // Do not dispatch the event here yet, because we don't have the rank
        };
    
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

        document.removeEventListener('beatTimeDataReady', this.handleBeatTimeDataReady);



        //Playable Keys version
        document.removeEventListener('keydown', this.onKeyDown.bind(this));
        document.removeEventListener('keyup', this.onKeyUp.bind(this));


        // Resetting variables to their initial state
        this.resetVariables();

    
        // Remove references to DOM elements and external objects
        this.canvas = null;
        this.fileInput = null;
        this.volumeSlider = null;
    
    }
    




    ///////////////////////////////////////////////////////////////////////////
    ////////these methods depend on these arrays in the constructor/////////////
    /////////// this.leftSwipeArray = [];///////////////////////////////////////
    /////////// this.rightSwipeArray = [];//////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    checkFingerPositionsAndUpdateFingerArrays()
    {
        this.leftSwipeArray.push(this.mediaPipe.getPointOfIndex("Left",8));
        this.rightSwipeArray.push(this.mediaPipe.getPointOfIndex("Right",8));

        if(this.leftSwipeArray.length > 2){ this.leftSwipeArray.shift() };
        if(this.rightSwipeArray.length > 2){ this.rightSwipeArray.shift() };
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



 
    drawSwipeVisualization(testEntryPoint, entryPoint, swipeAngle) 
    {
        if (!this.ctx) {
            console.error('Canvas context (ctx) not found');
            return;
        }
    
        // Draw test arrow at a fixed position but with a dynamic angle
        if (testEntryPoint && swipeAngle !== undefined) {
            this.drawArrow(testEntryPoint, swipeAngle, 'blue'); // Test arrow in blue
        }
    
        // Draw dynamic arrow based on swipe data
        if (entryPoint && swipeAngle !== undefined) {
            this.drawArrow(entryPoint, swipeAngle, 'white'); // Actual dynamic arrow in white
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
    



    checkLineCircleTouch() {
        for (var sweetSpotCircle of this.SweetSpotCircleArray) {
            let leftTouches = false;
            let rightTouches = false;
    
            // Ensure swipeLogged is initialized for each sweetSpotCircle
            if (sweetSpotCircle.swipeLogged === undefined) {
                sweetSpotCircle.swipeLogged = false;
            }
    
            // Determine if there's a left or right touch
            if (this.leftSwipeArray[0] && this.leftSwipeArray[1]) {
                leftTouches = this.circleLineToucheyMath(
                    { x: sweetSpotCircle.position.x, y: sweetSpotCircle.position.y },
                    sweetSpotCircle.baseRadius,
                    [this.leftSwipeArray[0].x, this.leftSwipeArray[0].y],
                    [this.leftSwipeArray[1].x, this.leftSwipeArray[1].y]
                );
            }
            if (this.rightSwipeArray[0] && this.rightSwipeArray[1]) {
                rightTouches = this.circleLineToucheyMath(
                    { x: sweetSpotCircle.position.x, y: sweetSpotCircle.position.y },
                    sweetSpotCircle.baseRadius,
                    [this.rightSwipeArray[0].x, this.rightSwipeArray[0].y],
                    [this.rightSwipeArray[1].x, this.rightSwipeArray[1].y]
                );
            }
    
            // Log the swipe and manage arrow drawing only if a new touch is detected and not already logged
            if ((leftTouches || rightTouches) && !sweetSpotCircle.swipeLogged) {
                sweetSpotCircle.puffy = true;
                sweetSpotCircle.swipeLogged = true;
    
                let swipeArray = leftTouches ? this.leftSwipeArray : this.rightSwipeArray;
                let swipeAngle = this.calculateAngle(
                    swipeArray[0].x, swipeArray[0].y,
                    swipeArray[1].x, swipeArray[1].y
                );
    
                // Store swipe details in the circle
                sweetSpotCircle.lastSwipeEntryPoint = swipeArray[0];
                sweetSpotCircle.lastSwipeAngle = swipeAngle;
                sweetSpotCircle.isSwipeActive = true; // Flag to indicate an active swipe
    
                console.log(`Swipe Direction: ${leftTouches ? "Left" : "Right"}, Angle: ${swipeAngle}`);
            } else if (!leftTouches && !rightTouches && sweetSpotCircle.swipeLogged) {
                sweetSpotCircle.puffy = false;
                sweetSpotCircle.swipeLogged = false;
                // No need to reset the swipe visibility flag here
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

    

    
}
