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



    static drawScore(ctx, scoreNumber, comboNumber, missesNumber) 
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
        const missNumberX = baseXPosition + (lineWidth / 2);
        ctx.fillText(missesNumber, missNumberX, baseYPosition + 250);

    }   
}
