export class Button 
{
    constructor(xRatio, yRatio, widthRatio, heightRatio, text) {
        this.xRatio = xRatio;
        this.yRatio = yRatio;
        this.widthRatio = widthRatio;
        this.heightRatio = heightRatio;
        this.text = text;
    }

    // Draw the button on a canvas context
    draw(ctx, canvasWidth, canvasHeight, isHovered = false, isActive = false) {
        const x = this.xRatio * canvasWidth;
        const y = this.yRatio * canvasHeight;
        const width = this.widthRatio * canvasWidth;
        const height = this.heightRatio * canvasHeight;
    
        if (isActive) {
            ctx.fillStyle = "#ccccee";  // Active state color
            ctx.shadowColor = 'transparent';  // No shadow when button is pressed
        } else {
            ctx.fillStyle = isHovered ? "#a0a0a0" : "#f0f0f0";  // Normal/Hover state color
            ctx.shadowColor = "rgba(0, 0, 0, 0.3)"; 
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 3;  
            ctx.shadowOffsetY = 3;  
        }
    
        ctx.fillRect(x, y, width, height);
        ctx.shadowColor = 'transparent';  // Reset shadow after drawing button
    
        ctx.fillStyle = "#000";  // Text color
        ctx.font = "24px Arial"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, x + width / 2, y + height / 2);
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
    constructor(_canvas) {
        this.canvas = _canvas
        this.ctx = this.canvas.getContext("2d");
        this.buttons = {
            startStopButton: new Button(0.1, 0.9, 0.1, 0.05, "Start Track"),
            resetButton: new Button(0.3, 0.9, 0.1, 0.05, "Reset"),
            exportBeatsButton: new Button(0.5, 0.9, 0.1, 0.05, "Export Beats"),
            loadBeatsButton: new Button(0.7, 0.9, 0.1, 0.05, "Load Beat5")
        };

        this.hoveredButton = null;
        this.activeButton = null;

        // Timer properties
        this.timer = 0;  // in seconds
        this.timerInterval = null;  // to hold the setInterval reference
    }

    startTimer() {
        if (!this.timerInterval) {
            this.timerInterval = setInterval(() => {
                this.timer += 0.01; // Increment by 0.01 to represent milliseconds
            }, 10); // Run every 10ms for smoothness
        }
    }
    

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    resetTimer() {
        this.timer = 0;
    }

    drawAll(ctx, canvasWidth, canvasHeight) {

        

        Object.values(this.buttons).forEach(btn => {
            const isHovered = btn === this.hoveredButton;
            const isActive = btn === this.activeButton;
            btn.draw(ctx, canvasWidth, canvasHeight, isHovered, isActive);
        });

        // Draw timer above the start/stop button
        const timerYPosition = this.buttons.startStopButton.yRatio * canvasHeight - 60;

        // Calculate the x-position with an offset (adjust as needed)
        const offset = -670; // This will move the text 50 pixels to the right
        const timerXPosition = (canvasWidth / 2) + offset;

        ctx.fillStyle = "#000";  // Text color
        ctx.font = "24px Arial"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Format timer with two decimal places
        const formattedTimer = this.timer.toFixed(2);

        ctx.fillText(`${formattedTimer}s`, timerXPosition, timerYPosition);
    }


    //logic for what to do with buttons when mouse is clicked
    handleCanvasClick(x, y, canvasWidth, canvasHeight) {

        let actualWidth = this.canvas.parentNode.offsetWidth;
        let actualHeight = actualWidth * 1080/1920; //this.canvas.parentNode.offsetHeight;

        let adjustedX = Math.round((canvasWidth /actualWidth ) * x);
        let adjustedY = Math.round((canvasHeight/actualHeight) * y);

        //console.log("actual: ",x,y, "adjusted: ",adjustedX, adjustedY);
        
        for (const [buttonName, button] of Object.entries(this.buttons)) {
            //if (button.isInside(x, y, canvasWidth, canvasHeight)) {
            if (button.isInside(x, y, actualWidth, actualHeight)) {
                if (buttonName === "startStopButton") {
                    if (button.text === "Start Track") {
                        button.text = "Stop Track";
                        this.startTimer();
                    } else {
                        button.text = "Start Track";
                        this.stopTimer();
                    }
                } else if (buttonName === "resetButton") {
                    this.resetTimer();
                } // ... other button logic remains unchanged
            }
        }
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
