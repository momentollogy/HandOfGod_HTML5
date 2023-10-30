export class Button 
{
    constructor(xRatio, yRatio, widthRatio, heightRatio, text) {
        this.xRatio = xRatio;
        this.yRatio = yRatio;
        this.widthRatio = widthRatio;
        this.heightRatio = heightRatio;
        this.text = text;
        this.canvas =  document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.recordMode = false;
    }

    // Draw the button on a canvas context
    draw(isHovered = false, isActive = false, yPos) {
        const x = this.xRatio * this.canvas.width;
        const y = yPos * this.canvas.height;
        const width = (this.widthRatio * this.canvas.width)// + (this.widthRatio * this.canvas.width)/4; // this addition adds a quarter of the button's width to it's drawable area.
        const height = this.heightRatio * this.canvas.height;;
    
        if (isActive) {
            this.ctx.fillStyle = "#ccccee";  // Active state color
            this.ctx.shadowColor = 'transparent';  // No shadow when button is pressed
        } else {
            this.ctx.fillStyle = isHovered ? "#a0a0a0" : "#f0f0f0";  // Normal/Hover state color
            this.ctx.shadowColor = "rgba(0, 0, 0, 0.3)"; 
            this.ctx.shadowBlur = 5;
            this.ctx.shadowOffsetX = 3;  
            this.ctx.shadowOffsetY = 3;  
        }
    
        this.ctx.fillRect(x, y, width, height);
        this.ctx.shadowColor = 'transparent';  // Reset shadow after drawing button
    
        this.ctx.fillStyle = "#000";  // Text color
        this.ctx.font = "24px Arial"; 
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.text, x + width / 2, y + height / 2);
    }
    

    // Check if a point is inside the button
    isInside(x, y, canvasWidth, canvasHeight) {
        const btnX = this.xRatio * canvasWidth;// + this.widthRatio * canvasWidth;
        const btnY = this.yRatio * canvasHeight;
        const btnWidth = this.widthRatio * canvasWidth;
        const btnHeight = this.heightRatio * canvasHeight;
    
        const isWithinButton = x > btnX && x < btnX + btnWidth && y > btnY && y < btnY + btnHeight;
        return isWithinButton;
    }
}


// Exported UIManager
export default class UIManager
{
    constructor(_audio, _butts) {
        this.audio = _audio;
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.recordMode = false;
        this.yPos = 0.9;
        this.yTarget = this.yPos;
        this.myButtons = _butts;// ["StartStop","Reset","ExportBeats","LoadBeats","LoadSong","RecordPlayMode"];
        this.buttons = {};
        let butWidth = 1 / (this.myButtons.length*2);
        this.scoreNumber=0;
        this.comboNumber=0;
        
        for ( let i=0; i<this.myButtons.length; i++){
            let but = new Button((butWidth/2)+butWidth*2*i, this.yPos, butWidth, butWidth/2, this.myButtons[i]);
            //console.log(but.xRatio, but.yRatio);
            this.buttons[this.myButtons[i]]=but;
        }

        //console.log("BUTTONS:  BUTTONS:  BUTTONS:");
        //console.log(this.buttons);

        this.hoveredButton = null;
        this.activeButton = null;
    }

    setY(num){
        this.yTarget = num;
    }

    draw() {


        //console.log(this.yPos, this.yTarget, (this.yTarget - this.yPos), (this.yTarget - this.yPos) * .01 );
        this.yPos += (this.yTarget - this.yPos) * .1;


        Object.values(this.buttons).forEach(btn => {
            const isHovered = btn === this.hoveredButton;
            const isActive = btn === this.activeButton;
            btn.draw(isHovered, isActive, this.yPos);
        });

        // Draw timer above the start/stop button
        const timerYPosition = this.yPos * this.canvas.height - 20;//this.buttons.startStopButton.yRatio * this.canvas.height - 35;//lower y value lowers the timer text
        const offset = -780; // higher neg = move timer text left        
        const timerXPosition = (this.canvas.width / 2) + offset;

        this.ctx.fillStyle = "rgb(0,255,0)";  // Text color
        this.ctx.font = "24px Arial"; 
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        // Format timer with two decimal places
        const formattedTimer = this.audio.currentTime ? this.audio.currentTime.toFixed(2) : 0.0;
        this.ctx.fillText(`${formattedTimer}s`, timerXPosition, timerYPosition);
        
        //DRAWING THE SCORE
       // Positioning for the score and combo display
        const baseXPosition = 10; // left padding
        const baseYPosition = 10; // top padding
        const lineWidth = 150; // width of the horizontal lines, adjust as needed

        // Style for the text labels (e.g., "Combo")
        this.ctx.fillStyle = "rgb(255,255,255)";  // Text color (white)

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
       // const comboNumber = 0; // Assuming you will update this dynamically later
        const comboNumberX = baseXPosition + (lineWidth / 2); // Centering the number
        this.ctx.fillText(this.comboNumber, comboNumberX, baseYPosition + 60); // Below the "Combo" text

        // Draw bottom line (divider between Combo and Score)
        this.ctx.fillRect(baseXPosition, baseYPosition + 120, lineWidth, 2);

        // Draw Score number (centered)
        this.ctx.font = "24px Verdana"; 
       // const scoreNumber = 0; // Assuming you will update this dynamically later
        const scoreNumberX = baseXPosition + (lineWidth / 2); // Centering the number
        this.ctx.fillText(this.scoreNumber, scoreNumberX, baseYPosition + 160); // Below the divider line



        if(this.recordMode){
            this.ctx.strokeStyle = "rgba(255,0,0,0.25)";
            this.ctx.shadowColor = "red";
            this.ctx.shadowBlur = 7;
            this.ctx.beginPath();
            this.ctx.lineWidth = 40;
            this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.stroke();
        }
    }


        setScore(num)
        {
        console.log(num,this.scoreNumber);
        }





    handleCanvasClick(x, y, canvasWidth, canvasHeight) 
    {
        let actualWidth = this.canvas.parentNode.offsetWidth;
        let actualHeight = actualWidth * 1080/1920;
         
        for (const [buttonName, button] of Object.entries(this.buttons)) {
            if (button.isInside(x, y, actualWidth, actualHeight)) {
                document.dispatchEvent(new Event(buttonName));
            }
        }
    }
    
    findStartStopLabelFromAudioState(){
        if (this.audio.paused) {    return "Start Track";   } 
        else {  return "Stop Track";   }
    }

    //handing the varios mouse position and clicks on the canvus:
    getRelativeMousePosition(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;
        return {
            x: x,
            y: y
        };
    }
    
    // this method is only used to calculate the offset of the canvas size vs the screen size.
    getPositionAndDimensions(e)
    {
        const position = this.getRelativeMousePosition(e);

        let actualWidth = this.canvas.parentNode.offsetWidth;
        let actualHeight = actualWidth * 1080/1920; //this.canvas.parentNode.offsetHeight;
        //let adjustedX = Math.round((this.canvas.width /actualWidth ) * position.x);
        //let adjustedY = Math.round((this.canvas.height/actualHeight) * position.y);
        return {x:position.x, y:position.y, w:actualWidth, h:actualHeight}
    }
    
    handleMouseMove(e) {
        const pos = this.getPositionAndDimensions(e)
        this.hoveredButton = Object.values(this.buttons).find(btn => btn.isInside(pos.x, pos.y, pos.w, pos.h));
        this.yTarget = 0.9;
    }
 
    handleMouseDown(e) {
        const pos = this.getPositionAndDimensions(e)
        this.activeButton = Object.values(this.buttons).find(btn => btn.isInside(pos.x, pos.y, pos.w, pos.h));
    }
 
    handleMouseUp() {
        this.activeButton = null;
    }
 
    handleClick(e) {
        const position = this.getRelativeMousePosition(e);
        this.handleCanvasClick(position.x, position.y, e.target.width, e.target.height);
    }
}