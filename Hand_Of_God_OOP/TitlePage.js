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
            // this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
             leftButtonX,
             buttonY,
             buttonWidth,
             buttonHeight,
             buttonRadius,
             "#003a46",
             //"#08282e", // Deep blue color
             "#0000CD", // Lighter blue for hover effect
             "Start",
             "rgba(0, 0, 0, 0.5)",
             // Here, instead of passing a callback, you pass the actionData directly
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the background image
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        this.levelSelectButton.draw();



        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
    }
}
    /*
dispose() 
    {
        // Remove event listeners - assuming you have methods to remove event listeners in your BlueButton class
        this.levelSelectButton.removeEventListeners(); 

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Dereference the backgroundImage to help with garbage collection
            this.backgroundImage.onload = null;
            this.backgroundImage.src = '';

                // Remove references to DOM elements and other resources
        this.canvas = null;
        this.ctx = null;
        this.levelSelectButton = null;
       // this.mediaPipe = null;



    }
*/

