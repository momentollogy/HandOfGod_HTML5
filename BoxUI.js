// BoxUI.js
// Class for creating a box with rounded corners with customizable properties.

export default class BoxUI {
    constructor(ctx, x, y, width, height, radius, resizeFactor = 1, offsetX = 0, offsetY = 0) {
        this.ctx = ctx; // Canvas rendering context
        this.x = x + offsetX; // X position of the box, with optional offset
        this.y = y + offsetY; // Y position of the box, with optional offset
        this.width = width * resizeFactor; // Width of the box, adjusted by resize factor
        this.height = height; // Height of the box
        this.radius = radius; // Radius for rounded corners
    }

    draw() {
        // Draw a rounded rectangle as per the instance properties
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.radius, this.y);
        this.ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height, this.radius);
        this.ctx.arcTo(this.x + this.width, this.y + this.height, this.x, this.y + this.height, this.radius);
        this.ctx.arcTo(this.x, this.y + this.height, this.x, this.y, this.radius);
        this.ctx.arcTo(this.x, this.y, this.x + this.width, this.y, this.radius);
        this.ctx.closePath();
        this.ctx.fill();
    }

    dispose() 
    {
        console.log("Disposing BoxUI...");
        // No further action needed if BoxUI doesn't manage complex resources
    }
    
}
