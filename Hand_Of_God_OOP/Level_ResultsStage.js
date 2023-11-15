import MediaPipeTracker from './MediaPipeTracker.js';
import ResultsDisplayBox from './ResultsDisplayBox.js'; // Make sure the path is correct

export default class LevelResultsStage {
    constructor(_data) {
        this.mediaPipe = MediaPipeTracker.getInstance();
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.resultsData = _data;
        
        // Instantiate the ResultsDisplayBox with the canvas context
        this.resultsDisplayBox = new ResultsDisplayBox(this.resultsData);

        // Set initial state for ResultsDisplayBox
        // You can modify these values as needed when the level ends
        this.resultsDisplayBox.setState('levelComplete', 100, 'A', true);
    }

    level_loop() {
        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
        // Clear the canvas or draw your game's background here
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the results display box
        this.resultsDisplayBox.draw();

        // Additional game loop logic...
    }

    // You can add a method to update the state of the results display box
    // based on game events such as level completion or failure
    updateResults(newState, score, rank, isNewHighScore) {
        this.resultsDisplayBox.setState(newState, score, rank, isNewHighScore);
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
        this.resetVariables();


        this.levelSelectButton.dispose();
        this.restartButton.dispose();
        this.resultsDisplayBox.dispose();
        

    }
}
