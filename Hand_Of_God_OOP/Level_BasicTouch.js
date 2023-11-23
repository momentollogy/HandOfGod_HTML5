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
    constructor(_levelArrayDataObject, audio) {
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
        this.stats = new GameStats(14); 
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
    }
    
    // Sweet spot circles setup
    setupSweetSpotCircles() {
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
    
    // UI Buttons setup
    setupUIButtons() {
        // Define positions and dimensions for buttons
        const leftButtonX = 100;
        const rightButtonX = this.canvas.width - 300;
        const buttonY = this.canvas.height / 2 + 400;
        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonRadius = 10;
    
        // 'Level Select' button
        this.levelSelectButton = new BlueButton(leftButtonX, buttonY, buttonWidth, buttonHeight, buttonRadius, "#00008B", "#0000CD", "Level Select", "rgba(0, 0, 0, 0.5)", { levelName: "Level_StageSelect", leaderBoardState: "latestScores"}, actionData => {
            console.log("Level select button clicked. Current buffer:", this.stats.buffer);
            document.dispatchEvent(new CustomEvent('levelChange', { detail: actionData }));
        });
    
        // 'Restart' button
        this.restartButton = new BlueButton(rightButtonX, buttonY, buttonWidth, buttonHeight, buttonRadius, "#8B0000", "#CD5C5C", "Restart", "rgba(0, 0, 0, 0.5)", this.levelArrayDataObject, actionData => {
            console.log("Restart button clicked, dispatching levelChange event with details:", actionData);
            document.dispatchEvent(new CustomEvent('levelChange', { detail: actionData }));
        });


        //Playable Keys version
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    


        this.spacePressed = false;
        this.A_pressed = false;
        this.S_pressed = false;

    }




    /////////////////////
    //END OF CONSTUCTOR//
    /////////////////////


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
    if (event.code === 'Space' && !this.spacePressed) {
        this.spacePressed = true;
        console.log("Spacebar Down");
        // Perform actions for spacebar down
    }
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
    if (event.code === 'Space') {
        this.spacePressed = false;
        console.log("Spacebar Up");
        // Perform actions for spacebar up
    }
    if (event.code === 'KeyA') { this.A_pressed = false; }
    if (event.code === 'KeyS') { this.S_pressed = false; }
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
        
        //for keyboard inputs
        this.checkForClick();
        this. checkIndividualClicks();


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



    checkForClick()
    {
        for(let sweetspotcircle of this.SweetSpotCircleArray){
            if (this.spacePressed)
            {
                console.log("mousePessed in Check method");
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


    //For keyboard clicks
    checkIndividualClicks(){
        let sweetspotcircle = this.SweetSpotCircleArray[0];
        if (this.A_pressed)
        {
            console.log("A pressed in Check method");
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
            console.log("S pressed in Check method");
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
           // console.log("Received rank in audioEnded: ", rank);


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
    
}
