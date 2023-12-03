import MediaPipeTracker from './MediaPipeTracker.js';
//import UIManager, { Button } from './UIManager.js';
import BlueButton from './BlueButton.js';


export default class Level_TitlePage
{
    constructor()
    {
        this.mediaPipe = MediaPipeTracker.getInstance();
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");

        // Button dimensions and properties
        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonRadius = 10;

        // Initialize 'Start' button with temporary positions
        this.startButton = new BlueButton(
            0, // Temporary X position, will be set in updateButtonPositions
            0, // Temporary Y position, will be set in updateButtonPositions
            buttonWidth,
            buttonHeight,
            buttonRadius,
            "#003a46", // Base color
            "#0000CD", // Hover color
            "START", // Button text
            "rgba(0, 0, 0, 0.5)", // Shadow color
            {}, // No specific actionData needed
            this.startButtonAction // Action on button click
        );

        // Set initial button positions
        this.updateButtonPositions();

        // Load and draw background image
        this.loadBackgroundImage();
    }

    updateButtonPositions() {
        const scaleFactor = 1;
        const leftButtonX = this.canvas.width / 2 * scaleFactor;
        const buttonY = this.canvas.height / 2  * scaleFactor;

        // Update startButton position
        this.startButton.x = leftButtonX;
        this.startButton.y = buttonY;
    }

    startButtonAction() {
        // Existing code for start button action
        let playerName = window.prompt("Enter Player Name (max 14 characters):", "Guest" + Math.floor(Math.random() * 10000));
        while (playerName && playerName.length > 14) {
            playerName = window.prompt("Name too long. Enter Player Name (max 14 characters):", playerName);
        }
        if (playerName) {
            window.playerName = playerName;
            document.dispatchEvent(new CustomEvent('levelChange', { detail: { levelName: "Level_StageSelect", leaderBoardState: "topScores" } }));
        } else {
            console.log('User did not enter a name, using default.');
            window.playerName = "Guest" + Math.floor(Math.random() * 10000);
        }
        console.log('Username set to:', window.playerName);
    }

    loadBackgroundImage() {
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            this.ctx.globalAlpha = 0.5; // Adjust opacity as needed
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalAlpha = 1.0; // Reset opacity
        };
        this.backgroundImage.src = 'images/TitlePageImage_v1.jpeg';
    }




    level_loop() 
    {   
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        this.startButton.draw();
      //  this.usernameButton.draw();


        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
    }


    dispose() {
      
        // Remove event listeners from buttons
        // Assuming you have a method in your BlueButton class to remove event listeners
       
    
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.startButton = null;

     // Dispose of buttons if they have a dispose method
     if (this.startButton && typeof this.startButton.dispose === 'function') {
        this.startButton.dispose();
    }
    
    }
    

}


