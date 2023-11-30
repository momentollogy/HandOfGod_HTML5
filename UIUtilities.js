// UIUtilities.js
export class UIUtilities 
{

    //static 
    static createVolumeSlider(audio, canvas) 
    {
        const volumeSlider = {
            audio: audio,
            canvas: canvas,
            ctx: canvas.getContext("2d"),
            volumeSliderX: 30,
            volumeSliderY: canvas.height / 2 - 40,
            volumeSliderHeight: 300,
            volumeSliderWidth: 20,
            isMouseDown: false,

            drawVolumeSlider() {
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(this.volumeSliderX, this.volumeSliderY, this.volumeSliderWidth, this.volumeSliderHeight);

                this.ctx.fillStyle = '#00FF00';
                const filledHeight = this.audio.volume * this.volumeSliderHeight;
                this.ctx.fillRect(this.volumeSliderX, this.volumeSliderY + this.volumeSliderHeight - filledHeight, this.volumeSliderWidth, filledHeight);
            },

            handleMouseDown(event) {
                if (this.isClickWithinSlider(event)) {
                    this.isMouseDown = true;
                    this.handleVolumeClick(event);
                }
            },

            handleMouseMove(event) {
                if (this.isMouseDown) {
                    this.handleVolumeClick(event);
                }
            },

            handleMouseUp(event) {
                this.isMouseDown = false;
            },

            handleVolumeClick(event) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleY = this.canvas.height / rect.height;
                const mouseY = (event.clientY - rect.top) * scaleY;

                let newVolume = (this.volumeSliderY + this.volumeSliderHeight - mouseY) / this.volumeSliderHeight;
                newVolume = Math.max(0, Math.min(newVolume, 1));
                this.audio.volume = newVolume;
                this.drawVolumeSlider();
            },

            isClickWithinSlider(event) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;

                const mouseX = (event.clientX - rect.left) * scaleX;
                const mouseY = (event.clientY - rect.top) * scaleY;

                return mouseX > this.volumeSliderX && mouseX < this.volumeSliderX + this.volumeSliderWidth &&
                       mouseY > this.volumeSliderY && mouseY < this.volumeSliderY + this.volumeSliderHeight;
            }
        };

        // Bind event listeners for mouse interactions
        canvas.addEventListener('mousedown', volumeSlider.handleMouseDown.bind(volumeSlider), false);
        canvas.addEventListener('mousemove', volumeSlider.handleMouseMove.bind(volumeSlider), false);
        canvas.addEventListener('mouseup', volumeSlider.handleMouseUp.bind(volumeSlider), false);

        return volumeSlider;
    }


/*
    static drawScore(ctx, scoreNumber, comboNumber, bufferValue, maxBufferLimit) 
    {
        // Positioning for the score and combo display
        const baseXPosition = 10; // left padding
        const baseYPosition = 10; // top padding
        const lineWidth = 150; // width of the horizontal lines, adjust as needed

        // Style for the text labels (e.g., "Combo")
        ctx.fillStyle = "rgb(255,255,255)"; // Text color (white)

        // Combo stuff
        ctx.fillRect(baseXPosition, baseYPosition, lineWidth, 2);
        const comboText = "Combo";
        ctx.font = "24px Verdana";
        ctx.textAlign = "center";
        const comboTextX = baseXPosition + (lineWidth / 2);
        ctx.fillText(comboText, comboTextX, baseYPosition + 20);

        ctx.font = "30px Verdana";
        const comboNumberX = baseXPosition + (lineWidth / 2);
        ctx.fillText(comboNumber, comboNumberX, baseYPosition + 60);

        // Score stuff
        ctx.fillRect(baseXPosition, baseYPosition + 120, lineWidth, 2);
        ctx.font = "24px Verdana";
        const scoreNumberX = baseXPosition + (lineWidth / 2);
        ctx.fillText(scoreNumber, scoreNumberX, baseYPosition + 160);

        // Misses stuff
        ctx.fillRect(baseXPosition, baseYPosition + 200, lineWidth, 2);
        ctx.font = "24px Verdana";

        // Calculate the number of misses left based on bufferValue
        const missesLeft = bufferValue; // bufferValue should decrement with each miss
        const missesText = "Misses Left: " + missesLeft;

        const missesTextX = baseXPosition + (lineWidth / 2);
        ctx.fillText(missesText, missesTextX, baseYPosition + 250);

    }   
    */

    static drawScore(ctx, scoreNumber, comboNumber, bufferValue, maxBufferLimit) {
        // Base position and scale factor
        const baseXPosition = 80; // Base X position for the entire score display
        const baseYPosition = 50;  // Base Y position for the entire score display
        const scale = 1.0;         // Scale factor (1.0 = original size, adjust as needed)
    
        // Component layout adjustments (don't need to be changed)
        const lineHeight = 2 * scale;
        const lineSpacing = 60 * scale; // Spacing between lines
        const textSpacing = 20 * scale; // Spacing for text
        const fontSize = 24 * scale;    // Base font size, scaled
    
        // Style for the text labels
        ctx.fillStyle = "rgb(255,255,255)"; // Text color (white)
        ctx.textAlign = "center";           // Center align text
    
        // Function to scale a value
        const scaled = (value) => value * scale;
    
        // Combo display
        ctx.fillRect(baseXPosition, baseYPosition, scaled(150), lineHeight);
        ctx.font = scaled(fontSize) + "px Verdana";
        ctx.fillText("Combo", baseXPosition + scaled(75), baseYPosition + textSpacing);
    
        // Combo number
        ctx.fillText(comboNumber, baseXPosition + scaled(75), baseYPosition + lineSpacing);
    
        // Score display
        ctx.fillRect(baseXPosition, baseYPosition + scaled(120), scaled(150), lineHeight);
        ctx.fillText(scoreNumber, baseXPosition + scaled(75), baseYPosition + scaled(160));
    
        // Misses left
        ctx.fillRect(baseXPosition, baseYPosition + scaled(200), scaled(150), lineHeight);
        ctx.fillText("Misses Left: " + bufferValue, baseXPosition + scaled(75), baseYPosition + scaled(250));
    }
    
}
