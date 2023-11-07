
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
        this.rect = this.canvas.getBoundingClientRect();
        this.isMouseDown = false;
        this.volumeSliderX = 30; // Closer to the left edge
        this.volumeSliderY = this.canvas.height / 2 - 40; // Adjust Y to lower the slider
        this.volumeSliderHeight = 300;
        this.volumeSliderWidth = 20; // A thinner rectangle
        this.mouseCanvasX = 0;
        this.mouseCanvasY = 0;

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

    drawVolumeSlider() {
        this.volumeSliderX = 30; // Closer to the left edge
        //const volumeSliderY = 100;
        //this.volumeSliderY = this.canvas.height / 2 - 40; // Adjust Y to lower the slider

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
        //console.log("down",this.isClickWithinSlider());
        if (this.isClickWithinSlider()) {
            this.isMouseDown = true;
            this.handleVolumeClick(event); // Set the initial volume
        }
    }

    handleMouseMove(event) {
        //console.log("move",this.isClickWithinSlider());
        this.setMouseCoords(event);
        if (this.isMouseDown) {
            this.handleVolumeClick(event); // Adjust the volume while dragging
        }
    }

    handleMouseUp(event) {
        //console.log("up",this.isClickWithinSlider());
        this.isMouseDown = false;
    }

    handleVolumeClick(event) {
        //console.log("changing volume in UIManager.handleVolumeClick()");
        let newVolume = (this.volumeSliderY + this.volumeSliderHeight - this.mouseCanvasY) / this.volumeSliderHeight;
    
        // Ensure the volume is within the 0 to 1 range
        newVolume = Math.max(0, Math.min(newVolume, 1));

        // Set the audio volume
        this.audio.volume = newVolume;

        // Redraw the slider to reflect the new volume
        this.drawVolumeSlider();
    }

    setMouseCoords(event){
        var scaleX = this.canvas.width / this.rect.width;
        var scaleY = this.canvas.height / this.rect.height;

        this.mouseCanvasX = (event.clientX - this.rect.left) * scaleX;
        this.mouseCanvasY = (event.clientY - this.rect.top) * scaleY;
    }

    isClickWithinSlider() {
        return this.mouseCanvasX > this.volumeSliderX && this.mouseCanvasX < this.volumeSliderX + this.volumeSliderWidth && this.mouseCanvasY > this.volumeSliderY && this.mouseCanvasY < this.volumeSliderY + this.volumeSliderHeight
    }

        
}