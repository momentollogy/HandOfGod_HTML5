
// Exported UIManager
export default class UIManager
{
    constructor(_audio, _butts) 
    {
        this.audio = _audio;
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.scoreNumber=0;
        this.comboNumber=0;
        this.missesNumber=0; 
    }

  

    draw() {

        //DRAWING THE SCORE
       // Positioning for the score and combo display
        const baseXPosition = 10; // left padding
        const baseYPosition = 10; // top padding
        const lineWidth = 150; // width of the horizontal lines, adjust as needed

        // Style for the text labels (e.g., "Combo")
        this.ctx.fillStyle = "rgb(255,255,255)";  // Text color (white)


        // Combo stuff ///////////////////////////////////////////
        // Draw top line for Combo
        this.ctx.fillRect(baseXPosition, baseYPosition, lineWidth, 2);

        // Draw Combo text (centered)
        const comboText = "Combo";
        this.ctx.font = "24px Verdana"; // Font for the text labels
        this.ctx.textAlign = "center";
        const comboTextX = baseXPosition + (lineWidth / 2); // Centering the text
        this.ctx.fillText(comboText, comboTextX, baseYPosition + 20); // Positioning just below the top line

        // Draw Combo number (bigger and centered)
        this.ctx.font = "30px Verdana"; 
        const comboNumberX = baseXPosition + (lineWidth / 2); // Centering the number
        this.ctx.fillText(this.comboNumber, comboNumberX, baseYPosition + 60); // Below the "Combo" text




        // Score stuff ///////////////////////////////////////////
        // Draw bottom line (divider between Combo and Score)
        this.ctx.fillRect(baseXPosition, baseYPosition + 120, lineWidth, 2);

        // Draw Score number (centered)
        this.ctx.font = "24px Verdana"; 
        const scoreNumberX = baseXPosition + (lineWidth / 2); // Centering the number
        //if(this.scoreNumber>1000){console.log("add comma to the number") }
        this.ctx.fillText(this.scoreNumber, scoreNumberX, baseYPosition + 160); // Below the divider line



        // Misses stuff ///////////////////////////////////////////
        // Draw bottom line (divider between Score and misses)
        this.ctx.fillRect(baseXPosition, baseYPosition + 200, lineWidth, 2);
        // Draw Score number (centered)
        this.ctx.font = "24px Verdana"; 
        const missNumberX = baseXPosition + (lineWidth / 2); // Centering the number
        this.ctx.fillText(this.missesNumber, scoreNumberX, baseYPosition + 250); // Below the divider line


    }
        
}