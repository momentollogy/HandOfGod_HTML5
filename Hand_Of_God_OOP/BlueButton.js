import BoxUI from './BoxUI.js'; // Assuming BoxUI.js exists and is in the same directory

export default class BlueButton {
  constructor(ctx, x, y, width, height, radius, color, hoverColor, text, shadowColor,actionData, buttonAction) {
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

    this.actionData = actionData; // The data needed to perform the action (like level details)
    this.buttonAction = buttonAction; // The type of action this button represents ("restart", "levelSelect", etc.)



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


  //disbatches whatever happens when Blue Button Object is clicked.
  onClick(event) 
  {
    if (this.isHovered) {
      console.log(`${this.text} Button clicked!`);
      console.log('Dispatching event with details:', this.actionData);
      
  
      // Dispatch the event with the actionData
      // Make sure the event name here matches what your GameManager is listening for
      document.dispatchEvent(new CustomEvent('levelChange', { detail: this.actionData }));
    }
 }


/*
/////////////////////////////////
/////////////////////////////////
//INCLUDES Prompt for user name.
/////////////////////////////////
/////////////////////////////////

onClick(event) {
  if (this.isHovered) {
      console.log(`${this.text} Button clicked!`);
      
      // Check if the button clicked is the 'Start' button from the title screen
      if (this.text === "Start" && this.actionData.levelName === "Level_StageSelect") {
          let playerName = window.prompt("Enter Player Name (max 14 characters):", "");
          
          // Keep prompting if the input is too long
          while (playerName && playerName.length > 14) {
              playerName = window.prompt("Name too long. Enter Player Name (max 14 characters):", "");
          }

          // If a playerName is entered and within the character limit, store it and dispatch the event
          if (playerName) {
              window.playerName = playerName; // Store the player's name globally
              
              // Dispatch the event with the actionData
              document.dispatchEvent(new CustomEvent('levelChange', { detail: this.actionData }));
          } else {
              console.log('User did not enter a name.');
              // Handle the case where the user does not enter a name
          }
      } else {
          // If it's any other button, just dispatch the event as before
          document.dispatchEvent(new CustomEvent('levelChange', { detail: this.actionData }));
      }
  }
}
*/


/*
/////////////////////////////////
/////////////////////////////////
//INCLUDES Prompt for user name.
/////////////////////////////////
/////////////////////////////////

onClick(event) {
  if (this.isHovered) {
      console.log(`${this.text} Button clicked!`);
      
      // Check if the button clicked is the 'Start' button from the title screen
      if (this.text === "Start" && this.actionData.levelName === "Level_StageSelect") {
          let playerName = window.prompt("Enter Player Name (max 14 characters):", "");
          
          // Keep prompting if the input is too long
          while (playerName && playerName.length > 14) {
              playerName = window.prompt("Name too long. Enter Player Name (max 14 characters):", "");
          }

          // If a playerName is entered and within the character limit, store it and dispatch the event
          if (playerName) {
              window.playerName = playerName; // Store the player's name globally
              
              // Dispatch the event with the actionData
              document.dispatchEvent(new CustomEvent('levelChange', { detail: this.actionData }));
          } else {
              console.log('User did not enter a name.');
              // Handle the case where the user does not enter a name
          }
      } else {
          // If it's any other button, just dispatch the event as before
          document.dispatchEvent(new CustomEvent('levelChange', { detail: this.actionData }));
      }
  }
}
*/


  dispose() {
    // Remove event listeners when the button is no longer needed
    this.ctx.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.ctx.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.ctx.canvas.removeEventListener('mouseup', this.onMouseUp);
    this.ctx.canvas.removeEventListener('click', this.onClick);
  }
}
