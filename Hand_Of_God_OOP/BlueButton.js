import BoxUI from './BoxUI.js'; // Assuming BoxUI.js exists and is in the same directory

export default class BlueButton {
  constructor(ctx, x, y, width, height, radius, color, hoverColor, text, shadowColor,callback) {
    // Context from the canvas where the button will be drawn
    this.ctx = ctx;

    // Button properties
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.color = color;
    this.hoverColor = hoverColor;
    this.text = text;
    this.shadowColor = shadowColor || 'rgba(0, 0, 0, 0.5)';
    this.callback = callback;


    // State variables for button interaction
    this.isHovered = false;
    this.isPressed = false;

    // Bind event handlers to keep the context of 'this' correct
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onClick = this.onClick.bind(this);

    // Add event listeners for the button
    this.ctx.canvas.addEventListener('mousemove', this.onMouseMove);
    this.ctx.canvas.addEventListener('mousedown', this.onMouseDown);
    this.ctx.canvas.addEventListener('mouseup', this.onMouseUp);
    this.ctx.canvas.addEventListener('click', this.onClick);

    // New variable to store the event detail or callback for the click event
    //this.onClickDetail = onClickDetail;
    //this.dispatchClickEvent = this.dispatchClickEvent.bind(this);

  }

  

  draw() {
    // Draw button with or without shadow based on isPressed
    this.ctx.fillStyle = this.isHovered ? this.hoverColor : this.color;
    this.ctx.shadowColor = this.isPressed ? 'transparent' : this.shadowColor;
    this.ctx.shadowBlur = this.isPressed ? 0 : 20;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + this.radius, this.y);
    this.ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height, this.radius);
    this.ctx.arcTo(this.x + this.width, this.y + this.height, this.x, this.y + this.height, this.radius);
    this.ctx.arcTo(this.x, this.y + this.height, this.x, this.y, this.radius);
    this.ctx.arcTo(this.x, this.y, this.x + this.width, this.y, this.radius);
    this.ctx.closePath();
    this.ctx.fill();

    // Text for button
    this.ctx.font = `20px Arial`;
    this.ctx.fillStyle = this.isPressed ? this.hoverColor : "white";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }

  // Event handler for mouse movement over the canvas
  onMouseMove(event) {
    const rect = this.ctx.canvas.getBoundingClientRect();
    const scaleX = this.ctx.canvas.width / rect.width;
    const scaleY = this.ctx.canvas.height / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    // Check if the mouse is over the button
    this.isHovered = mouseX >= this.x && mouseX <= this.x + this.width &&
                      mouseY >= this.y && mouseY <= this.y + this.height;

    this.draw(); // Redraw the button to reflect hover state changes
  }

  // Event handler for mouse button down
  onMouseDown(event) {
    if (this.isHovered) {
      this.isPressed = true;
      this.draw(); // Redraw the button to reflect the pressed state
    }
  }

  // Event handler for mouse button up
  onMouseUp(event) {
    if (this.isHovered) {
      this.isPressed = false;
      this.draw(); // Redraw the button to reflect the released state
    }
  }

  // Event handler for click on the button
  onClick(event) {
    if (this.isHovered) {
      // Perform action or dispatch custom event
      console.log('Button clicked!');
      this.callback();
      //this.dispatchClickEvent();
      // Dispatch custom event or call callback function here
    }
  }

  dispatchClickEvent() {
   if (this.onClickDetail) {
     const event = new CustomEvent('levelChange', { detail: this.onClickDetail });
     document.dispatchEvent(event);
   }
 }

  dispose() {
    // Remove event listeners when the button is no longer needed
    this.ctx.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.ctx.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.ctx.canvas.removeEventListener('mouseup', this.onMouseUp);
    this.ctx.canvas.removeEventListener('click', this.onClick);
  }
}
