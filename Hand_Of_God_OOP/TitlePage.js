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
 
         
 
 
         // 'LEVEL SELECT' BUTTON
         this.levelSelectButton = new BlueButton(
             this.ctx,
             leftButtonX,
             buttonY,
             buttonWidth,
             buttonHeight,
             buttonRadius,
             "#003a46", //button color - change in photoshop etc to get value.
             "#0000CD", // Lighter blue for hover effect
             "Start",
             "rgba(0, 0, 0, 0.5)",
             { levelName: "Level_StageSelect" } // This will be used as this.actionData in the BlueButton class
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

        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
    }
}


