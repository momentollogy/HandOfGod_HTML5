
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

        this.isMouseDown = false;
        this.volumeSliderX = 30; // Closer to the left edge
        this.volumeSliderY = this.canvas.height / 2 - 40; // Adjust Y to lower the slider
        this.volumeSliderHeight = 300;
        this.volumeSliderWidth = 20; // A thinner rectangle

         // Bind event listeners for mouse interactions
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
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
        
        this.drawVolumeSlider();


    }


    // Inside UIManager class

drawVolumeSlider() {
    this.volumeSliderX = 30; // Closer to the left edge
    //const volumeSliderY = 100;
    this.volumeSliderY = this.canvas.height / 2 - 40; // Adjust Y to lower the slider

    this.volumeSliderHeight = 300;
    this.volumeSliderWidth = 20; // A thinner rectangle

    // Draw the background rectangle for the volume slider
    this.ctx.fillStyle = '#333'; // A darker color for the background
    this.ctx.fillRect(this.volumeSliderX, this.volumeSliderY, this.volumeSliderWidth, this.volumeSliderHeight);

    // Draw the filled part of the volume slider based on the current volume
    this.ctx.fillStyle = '#00FF00'; // A bright color for the filled part
    const filledHeight = this.audio.volume * this.volumeSliderHeight; // Calculate filled height
    this.ctx.fillRect(this.volumeSliderX, this.volumeSliderY + this.volumeSliderHeight - filledHeight, this.volumeSliderWidth, filledHeight);
}

handleMouseDown(event) {
    // Check if we are within the slider
    if (this.isClickWithinSlider(event)) {
        this.isMouseDown = true;
        this.handleVolumeClick(event); // Set the initial volume
    }
}

handleMouseMove(event) {
    if (this.isMouseDown) {
        this.handleVolumeClick(event); // Adjust the volume while dragging
    }
}

handleMouseUp(event) {
    this.isMouseDown = false;
}

handleVolumeClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const y = event.clientY - rect.top; // Y position of the click
  
    // Constants for the slider position and dimensions
    const volumeSliderY = this.canvas.height / 2;
    const volumeSliderHeight = 300;

    // Calculate the new volume based on where the slider was clicked
    // The top of the slider (y = volumeSliderY) is 100% volume
    // The bottom of the slider (y = volumeSliderY + volumeSliderHeight) is 0% volume
  //  let newVolume = (volumeSliderY + volumeSliderHeight - y) / volumeSliderHeight;
    let newVolume = (volumeSliderY + volumeSliderHeight - y) / volumeSliderHeight;
    
    // Invert the volume, because the canvas Y coordinate increases downwards
    newVolume = 1 - newVolume;

    // Ensure the volume is within the 0 to 1 range
    newVolume = Math.max(0, Math.min(newVolume, 1));

    // Set the audio volume
    this.audio.volume = newVolume;

    // Redraw the slider to reflect the new volume
    this.drawVolumeSlider();
}


isClickWithinSlider(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const volumeSliderX = 30;
    const volumeSliderY = this.canvas.height / 2;
    const volumeSliderWidth = 20;
    const volumeSliderHeight = 300;

    return x >= volumeSliderX && x <= volumeSliderX + volumeSliderWidth &&
           y >= volumeSliderY && y <= volumeSliderY + volumeSliderHeight;
}

        
}