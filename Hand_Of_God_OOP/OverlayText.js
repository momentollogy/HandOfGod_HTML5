// OverlayText.js

export class OverlayText {
    constructor() {

        this.textObjects = [];
        this.fadeDuration = 200; // Number of frames over which the text will fade out
        this.horizontalMoveDistance = 2,5; // The horizontal distance text will move each frame
        this.verticalMoveDistance = -2.5; // The vertical distance text will move each frame
        this.startSize = 30; // Start size of the text
        this.sizeDecrease = 0.5; // How much the text size decreases each frame
    }

    // Add a new text object to the array
    addText(accuracy, rgbValue, startPosition) {
        let direction = this.getDirectionFromColor(rgbValue);
        const newTextObject = {
            accuracy: accuracy,
            x: startPosition.x,
            y: startPosition.y,
            size: this.startSize, // Set the initial size
            direction: direction,
            opacity: 1
        };
        this.textObjects.push(newTextObject); // Add the new text object to the array
    }

    // Determine the direction based on the RGB value
    getDirectionFromColor(rgbValue) {
        let colorComponents = rgbValue.match(/\d+/g).map(Number);
        if (colorComponents[1] === 255 && colorComponents[2] === 0) { // Green
            return 'left';
        } else if (colorComponents[1] === 255) { // Aqua or other color with green component
            return 'right';
        }
        return 'none'; // Default case if needed
    }

    // Update the position and opacity of each text object
    update() {
        this.textObjects.forEach(textObject => {
            // Horizontal movement
            textObject.x += (textObject.direction === 'left' ? -this.horizontalMoveDistance : this.horizontalMoveDistance);
            // Vertical movement to simulate moving back into the distance
            textObject.y += this.verticalMoveDistance;
            // Make the text smaller to simulate moving back
            textObject.size = Math.max(textObject.size - this.sizeDecrease, 0); // Prevent negative size
            // Fade out the text
            textObject.opacity = Math.max(textObject.opacity - 1 / this.fadeDuration, 0); // Prevent negative opacity
        });

        // Remove text objects that are fully faded out or shrunk to nothing
        this.textObjects = this.textObjects.filter(textObject => textObject.opacity > 0 && textObject.size > 0);
    }

    
    draw(ctx) {
        this.textObjects.forEach(textObject => {
            ctx.save();
            ctx.fillStyle = `rgba(255, 255, 255, ${textObject.opacity})`;
            ctx.font = `${textObject.size}px Arial`; // Use the size property here
            ctx.fillText(`${textObject.accuracy}%`, textObject.x, textObject.y);
            ctx.restore();
        });
    }
    
}
