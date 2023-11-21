import MediaPipeTracker from './MediaPipeTracker.js';
import Results_Box from './Results_Box.js'; // Make sure the path is correct

export default class LevelResultsStage {
    constructor(_data) {
        this.mediaPipe = MediaPipeTracker.getInstance();
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.resultsData = _data;
        

        //BACKGOUND IMAGE
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => 
         // Draw the image onto the canvas once it's loaded
        {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        };
        this.backgroundImage.src = 'images/bg_imageda66opacity.jpeg'; 


        // Instantiate the ResultsBox with the canvas context
    
        this.results_Box = new Results_Box(_data);


       // this.results_Box.setState('levelComplete', _data.score, _data.grade, _data.isNewHighScore);

    }

    level_loop() {
        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
        // Clear the canvas or draw your game's background here
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);


        // Draw the results display box
        this.results_Box.draw();

        // Additional game loop logic...
    }

    // You can add a method to update the state of the results display box
    // based on game events such as level completion or failure
    updateResults(newState, score, rank, isNewHighScore) {
        this.results_Box.setState(newState, score, rank, isNewHighScore);
    }


    dispose() {
        console.log("Disposing LevelResultsStage...");
    
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.removeEventListener('ended', this.onAudioEnded);
            this.audio = new Audio();
        }
    
        // Safely reset elements of SweetSpotCircleArray
        if (this.SweetSpotCircleArray && this.SweetSpotCircleArray.length > 0) {
            this.SweetSpotCircleArray.forEach(circle => {
                if (circle && typeof circle.reset === 'function') {
                    circle.reset();
                }
            });
        }
    
        // Dispose other components...
        if (this.levelSelectButton) {
            this.levelSelectButton.dispose();
        }
        if (this.restartButton) {
            this.restartButton.dispose();
        }
        if (this.results_Box) {
            this.results_Box.dispose();
        }
    
        // Clear any other states or arrays...
    }

}


/*

import MediaPipeTracker from './MediaPipeTracker.js';
import Results_Box from './Results_Box.js'; // Make sure the path is correct

export default class LevelResultsStage {
    constructor(_data) 
    {
        this.mediaPipe = MediaPipeTracker.getInstance();
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.resultsData = _data;
        

        //BACKGOUND IMAGE
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => 
         // Draw the image onto the canvas once it's loaded
        {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        };
        this.backgroundImage.src = 'images/bg_imageda66opacity.jpeg'; 
       // this.results_Box = new Results_Box();


    }

    level_loop() {
        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
        // Clear the canvas or draw your game's background here
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);


        // Draw the results display box
        this.results_Box.draw();

        // Additional game loop logic...
    }

    // You can add a method to update the state of the results display box
    // based on game events such as level completion or failure
    updateResults(newState, score, rank, isNewHighScore) {
        this.results_Box.setState(newState, score, rank, isNewHighScore);
    }


    dispose() {
        console.log("Disposing LevelResultsStage...");
    
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.removeEventListener('ended', this.onAudioEnded);
            this.audio = new Audio();
        }
    
        // Safely reset elements of SweetSpotCircleArray
        if (this.SweetSpotCircleArray && this.SweetSpotCircleArray.length > 0) {
            this.SweetSpotCircleArray.forEach(circle => {
                if (circle && typeof circle.reset === 'function') {
                    circle.reset();
                }
            });
        }
    
        // Dispose other components...
        if (this.levelSelectButton) {
            this.levelSelectButton.dispose();
        }
        if (this.restartButton) {
            this.restartButton.dispose();
        }
        if (this.results_Box) {
            this.results_Box.dispose();
        }
    
        // Clear any other states or arrays...
    }

}
*/