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

    
            const buttonRadius = 10;
            this.buttonWidth = 150;
            this.buttonHeight = 50;

            this.startButtonVisible = true; // Add this line


        // Initialize 'Start' button with temporary positions
        this.startButton = new BlueButton(
            0, 0, // Temporary positions
            this.buttonWidth, this.buttonHeight,
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
        // Define the position of the button as a percentage of the canvas size
        // These should be values between 0 and 100
        const buttonXPercentage = 50; // Center of the canvas width-wise
        const buttonYPercentage = 50; // Center of the canvas height-wise
    
        // Calculate the actual pixel position based on the canvas size
        const leftButtonX = (this.canvas.width * buttonXPercentage / 100) - (this.buttonWidth / 2);
        const buttonY = (this.canvas.height * buttonYPercentage / 100) - (this.buttonHeight / 2);
    
        // Set the button's position
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
        if (this.startButtonVisible) {
            this.startButton.draw();
        }

        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
    }


    showStartButton() {
        this.startButtonVisible = true;
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


