// PlayInfoBoxVisual.js
import BoxUI from './BoxUI.js'; // Assuming BoxUI.js exists and is in the same directory

export default class PlayInfoBoxVisual {

 
  constructor() 
  {

   this.currentLevelData = null;
   this.boundUpdateCurrentLevel = this.updateCurrentLevel.bind(this);
   window.addEventListener('levelSelected', this.boundUpdateCurrentLevel);
   this.levelselectvisual;


    // Canvas setup
    this.canvas = document.getElementById("output_canvas");
    this.ctx = this.canvas.getContext("2d");

    // Box properties
    this.RESIZE_FACTOR = 0.65; // Smaller size for the play info box
    this.POSITION_OFFSET_X = 680;
    this.POSITION_OFFSET_Y = -200;
    this.BOX_WIDTH = 800 * this.RESIZE_FACTOR;
    this.BOX_HEIGHT = 400 * this.RESIZE_FACTOR;
    this.BOX_X = ((1920 - this.BOX_WIDTH) / 2) + this.POSITION_OFFSET_X;
    this.BOX_Y = ((1080 - this.BOX_HEIGHT) / 2) + this.POSITION_OFFSET_Y;
    this.BOX_RADIUS = 50; // Smaller radius for the play info box

    // Header and level info styling variables
    this.HEADER_HEIGHT = 50; // Smaller header for the play info box
    this.HEADER_FONT_SIZE = 37;
    this.LEVEL_INFO_FONT_SIZE = 20;

    // Create BoxUI instance for the play info box
    this.playInfoBox = new BoxUI(
      this.ctx,
      this.BOX_X,
      this.BOX_Y,
      this.BOX_WIDTH,
      this.BOX_HEIGHT,
      this.BOX_RADIUS
    );

      // Add mouse event listeners for the button interactions
      this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
      this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
      this.canvas.addEventListener('click', this.onPlayButtonClick.bind(this));



            // Button properties
       this.BUTTON_WIDTH = 200;
       this.BUTTON_HEIGHT = 50;
       this.BUTTON_RADIUS = 10;
       this.BUTTON_COLOR = "#00008B"; // Deep blue color
       this.BUTTON_HOVER_COLOR = "#0000CD"; // Slightly lighter blue for hover effect
       this.BUTTON_SHADOW_COLOR = "rgba(0, 0, 0, 0.5)";
       this.BUTTON_X = this.BOX_X + (this.BOX_WIDTH - this.BUTTON_WIDTH) / 2; // Centered inside the box
       this.BUTTON_Y = this.BOX_Y + this.BOX_HEIGHT - this.BUTTON_HEIGHT - 30; // Positioned at the bottom with some margin
       this.BUTTON_TEXT = "Play";
       
       // State variables for button interaction
       //this.isButtonHovered = false;
       //this.isButtonPressed = false;
 

  }


  initializeButtonPosition() 
  {
   this.BUTTON_X = this.BOX_X + (this.BOX_WIDTH - this.BUTTON_WIDTH) / 2; // Centered inside the box
   this.BUTTON_Y = this.BOX_Y + this.BOX_HEIGHT - this.BUTTON_HEIGHT - 55; // Positioned at the bottom with some margin
  }
 
 

  updateCurrentLevel(event) 
  {

    if (this.levelselectvisual)
     {  
     this.currentLevelData = this.levelselectvisual.levelArray[this.levelselectvisual.currentSelectedLevelIndex];
     }

   this.draw();
  }



 drawButton() {
  const { ctx, BUTTON_X, BUTTON_Y, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_RADIUS, BUTTON_COLOR, BUTTON_HOVER_COLOR, isButtonHovered, isButtonPressed } = this;

  // Draw button with or without shadow based on isButtonPressed
  ctx.fillStyle = isButtonHovered ? BUTTON_HOVER_COLOR : BUTTON_COLOR;
  ctx.shadowColor = isButtonPressed ? 'transparent' : this.BUTTON_SHADOW_COLOR;
  ctx.shadowBlur = isButtonPressed ? 0 : 20;
  ctx.beginPath();
  ctx.moveTo(BUTTON_X + BUTTON_RADIUS, BUTTON_Y);
  ctx.arcTo(BUTTON_X + BUTTON_WIDTH, BUTTON_Y, BUTTON_X + BUTTON_WIDTH, BUTTON_Y + BUTTON_HEIGHT, BUTTON_RADIUS);
  ctx.arcTo(BUTTON_X + BUTTON_WIDTH, BUTTON_Y + BUTTON_HEIGHT, BUTTON_X, BUTTON_Y + BUTTON_HEIGHT, BUTTON_RADIUS);
  ctx.arcTo(BUTTON_X, BUTTON_Y + BUTTON_HEIGHT, BUTTON_X, BUTTON_Y, BUTTON_RADIUS);
  ctx.arcTo(BUTTON_X, BUTTON_Y, BUTTON_X + BUTTON_WIDTH, BUTTON_Y, BUTTON_RADIUS);
  ctx.closePath();
  ctx.fill();

  // Text for button
  ctx.font = `20px Arial`;
  ctx.fillStyle = isButtonPressed ? BUTTON_HOVER_COLOR : "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(this.BUTTON_TEXT, BUTTON_X + BUTTON_WIDTH / 2, BUTTON_Y + BUTTON_HEIGHT / 2);
}


 draw() 
 {
  this.initializeButtonPosition();

    // Check if currentLevelData is not available and return to stop the drawing
    if (!this.currentLevelData) {
      return; // Stop drawing if no data is present
    }

    this.ctx.save();
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    // Draw the box
    this.playInfoBox.draw();

    // Draw the level display name header
    this.ctx.font = `${this.HEADER_FONT_SIZE}px Arial`;
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      this.currentLevelData.levelDisplayName,
      this.BOX_X + (this.BOX_WIDTH / 2),
      this.BOX_Y + this.HEADER_HEIGHT
    );
    
    // Draw the level duration
    this.ctx.font = `${this.LEVEL_INFO_FONT_SIZE}px Arial`;
    this.ctx.fillText(
      `Duration: ${this.currentLevelData.duration}`,
      this.BOX_X + (this.BOX_WIDTH / 2),
      this.BOX_Y + this.HEADER_HEIGHT + 30
    );

    this.drawButton();
    
    this.ctx.restore();
}

 

   


  
 // Event handler for mouse movement over the canvas
     onMouseMove(event) 
     {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;   // relationship bitmap vs. element for X
      const scaleY = this.canvas.height / rect.height; // relationship bitmap vs. element for Y

      const mouseX = (event.clientX - rect.left) * scaleX; // scale mouseX from event
      const mouseY = (event.clientY - rect.top) * scaleY; // scale mouseY from event

      // Check if the mouse is over the button
      this.isButtonHovered = mouseX >= this.BUTTON_X && mouseX <= this.BUTTON_X + this.BUTTON_WIDTH &&
                             mouseY >= this.BUTTON_Y && mouseY <= this.BUTTON_Y + this.BUTTON_HEIGHT;

      this.draw(); // Redraw the canvas to reflect hover state changes
    }

    // Event handler for mouse button down
    onMouseDown(event) 
    {
      //console.log(event.clientX,event.clientY, this.BOX_X,this.BOX_Y, this.BUTTON_X, this.BUTTON_Y);
      if (this.isButtonHovered) {
       //console.log('Button should be pressed down'); // For debugging

        this.isButtonPressed = true;
        this.draw(); // Redraw the canvas to reflect the button pressed state
      }
    }

    // Event handler for mouse button up
   onMouseUp(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;   // relationship bitmap vs. element for X
    const scaleY = this.canvas.height / rect.height; // relationship bitmap vs. element for Y

    const mouseX = (event.clientX - rect.left) * scaleX; // scale mouseX from event
    const mouseY = (event.clientY - rect.top) * scaleY; // scale mouseY from event

    if (this.isButtonHovered) {
      //console.log('Button should be released'); // For debugging

      // Simulate a button click when mouse button goes up while hovering the button
      this.onPlayButtonClick({ offsetX: mouseX, offsetY: mouseY });
    }

    this.isButtonPressed = false;
    this.draw(); // Redraw the canvas to reflect the button released state
   }


    onPlayButtonClick(event) {
     const mouseX = event.offsetX;
     const mouseY = event.offsetY;
   
     // Check if the click is inside the button area
     if ( mouseX >= this.BUTTON_X && mouseX <= this.BUTTON_X + this.BUTTON_WIDTH &&
          mouseY >= this.BUTTON_Y && mouseY <= this.BUTTON_Y + this.BUTTON_HEIGHT) {

       // Ensure that the currentLevelData is available
       if (this.currentLevelData) {
        const detailData = 
        {
          
          levelName: this.currentLevelData.fileName,
          levelDisplayName: this.currentLevelData.levelDisplayName,
          fireBaseLevelLeaderBoard: this.currentLevelData.fireBaseLevelLeaderBoard,
          duration: this.currentLevelData.duration,
          mp3Path: this.currentLevelData.mp3Path,
          jsonPath: this.currentLevelData.jsonPath
          // Add other properties from this.currentLevelData as needed
          
        };        
        console.log('Dispatching levelChange with details:', detailData);
        document.dispatchEvent(new CustomEvent('levelChange', { detail: detailData }));
       }
     }
   }
   

  dispose() 
  {
    window.removeEventListener('levelSelected', this.boundUpdateCurrentLevel);
    // ... other cleanup code ...
  }
}
