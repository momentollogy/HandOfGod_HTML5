import MediaPipeTracker from './MediaPipeTracker.js';
//import UIManager, { Button } from './UIManager.js';
import BlueButton from './BlueButton.js';


export default class Level_TitlePage
{
    constructor()
    {
        this.mediaPipe = MediaPipeTracker.getInstance()
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
        
   
         // Button positions (You may need to adjust these positions to fit your layout)
         const scaleFactor = 1;
         const leftButtonX = this.canvas.width / 2 -30 * scaleFactor; // for example, 100 pixels from the left
         const rightButtonX = this.canvas.width - 500 * scaleFactor; // for example, 300 pixels from the right edge
         const buttonY = this.canvas.height / 2 + 430 * scaleFactor; // vertical center for demonstration
         const buttonWidth = 150;
         const buttonHeight = 50;
         const buttonRadius = 10;
 
         
 
        // 'Start' button specific code
        this.levelSelectButton = new BlueButton
        (
           // this.ctx,
            leftButtonX,
            buttonY,
            buttonWidth,
            buttonHeight,
            buttonRadius,
            "#003a46",
            "#0000CD",
            "Start",
            "rgba(0, 0, 0, 0.5)",
            { levelName: "Level_StageSelect" },
            () => 
            {
                if (typeof window.playerName === 'undefined') {
                    window.playerName = "Guest" + Math.floor(Math.random() * 10000);
                    console.log('Default playerName set:', window.playerName);
                }
            
                // Dispatch the event to proceed to level selection
                document.dispatchEvent(new CustomEvent('levelChange', { detail: { levelName: "Level_StageSelect",leaderBoardState:"topScores"} }));
            }
        ); 



        // 'Username' button specific code
    this.usernameButton = new BlueButton(
        rightButtonX,  // X position of the button
        buttonY,       // Y position of the button
        buttonWidth,   // Button width
        buttonHeight,  // Button height
        buttonRadius,  // Button corner radius
        "#006400",     // Button color
        "#008000",     // Hover color
        "Username",    // Button text
        "rgba(0, 0, 0, 0.5)", // Shadow color
        {},  // No specific actionData needed for username button
        () => {
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
            // Proceed to level selection
        }




);








         
         this.backgroundImage = new Image();
         this.backgroundImage.onload = () => 
          // Draw the image onto the canvas once it's loaded
         {
             this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
         };
         this.backgroundImage.src = 'images/TitlePageImage_v1.jpeg'; 
 

    }
    


    level_loop() 
    {   
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        this.levelSelectButton.draw();
        this.usernameButton.draw();


        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
    }


    dispose() {
      
        // Remove event listeners from buttons
        // Assuming you have a method in your BlueButton class to remove event listeners
       
    
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.levelSelectButton = null;
        this.usernameButton = null;

     // Dispose of buttons if they have a dispose method
     if (this.levelSelectButton && typeof this.levelSelectButton.dispose === 'function') {
        this.levelSelectButton.dispose();
    }
    
    }
    

}


