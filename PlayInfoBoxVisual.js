

// PlayInfoBoxVisual.js
import BoxUI from './BoxUI.js'; // Assuming BoxUI.js exists and is in the same directory

export default class PlayInfoBoxVisual 
{

 
  constructor() {
    this.currentLevelData = null;
    this.boundUpdateCurrentLevel = this.updateCurrentLevel.bind(this);
    window.addEventListener('levelSelected', this.boundUpdateCurrentLevel);
    this.songselect_box;
  
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
  
    // Bind event handler methods
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnMouseDown = this.onMouseDown.bind(this);
    this.boundOnMouseUp = this.onMouseUp.bind(this);
    this.boundOnPlayButtonClick = this.onPlayButtonClick.bind(this);

    this.boundOnKeyUp = this.onKeyUp.bind(this);
    window.addEventListener('keyup', this.boundOnKeyUp);

    
  
  
    // Add mouse event listeners for the button interactions
    this.canvas.addEventListener('mousemove', this.boundOnMouseMove);
    this.canvas.addEventListener('mousedown', this.boundOnMouseDown);
    this.canvas.addEventListener('mouseup', this.boundOnMouseUp);
    this.canvas.addEventListener('click', this.boundOnPlayButtonClick);
  
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
    // this.isButtonHovered = false;
    // this.isButtonPressed = false;
  }
  



  onKeyUp(event) {
    if (event.key === 'Enter' || event.key === 'Return') {
      this.onPlayButtonClick();
    }
  }


      initializeButtonPosition() 
      {
      this.BUTTON_X = this.BOX_X + (this.BOX_WIDTH - this.BUTTON_WIDTH) / 2; // Centered inside the box
      this.BUTTON_Y = this.BOX_Y + this.BOX_HEIGHT - this.BUTTON_HEIGHT - 55; // Positioned at the bottom with some margin
      }
    
    

      updateCurrentLevel(event) 
      {
        if (this.songselect_box)
        {  
          this.currentLevelData = this.songselect_box.levelArray[this.songselect_box.currentSelectedLevelIndex];
        }
          this.draw();
      }



      drawButton() 
      {
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
    onMouseMove(event) {
      // Check if the canvas element is available
      if (!this.canvas) {
        return; // Exit the function if canvas is not available
      }
    
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
      if (!this.canvas) 
      {
        return; // Exit if canvas is not available
      }
      //console.log(event.clientX,event.clientY, this.BOX_X,this.BOX_Y, this.BUTTON_X, this.BUTTON_Y);
      if (this.isButtonHovered) {
       //console.log('Button should be pressed down'); // For debugging

        this.isButtonPressed = true;
        this.draw(); // Redraw the canvas to reflect the button pressed state
      }
    }



    // Event handler for mouse button up
    onMouseUp(event) 
    {
      if (!this.canvas) {
        return; // Exit the function if canvas is not available
      }

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





    onPlayButtonClick(event = null) {
      let isButtonClick = false;
  
      // Check if the event is a mouse event and if the click is inside the button area
      if (event && event.offsetX !== undefined && event.offsetY !== undefined) {
          const mouseX = event.offsetX;
          const mouseY = event.offsetY;
  
          isButtonClick = mouseX >= this.BUTTON_X && mouseX <= this.BUTTON_X + this.BUTTON_WIDTH &&
                          mouseY >= this.BUTTON_Y && mouseY <= this.BUTTON_Y + this.BUTTON_HEIGHT;
      } else {
          // If there's no event, assume it's a 'Return' key press
          isButtonClick = true;
      }
  
      // Execute the level change if it's a valid button click or 'Return' key press
      if (isButtonClick && this.currentLevelData) {
          // Resume AudioContext if it's suspended
          if (this.audioContext && this.audioContext.state === 'suspended') {
              this.audioContext.resume().then(() => {
                  console.log("AudioContext resumed successfully.");
              }).catch(error => {
                  console.error("Error resuming AudioContext:", error);
              });
          }
  
          const detailData = {
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
  
    


    

    dispose() 
    {
      console.log("Disposeing PlayInfo_Box...")
      // Remove event listeners
      this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
      this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
      this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
      this.canvas.removeEventListener('click', this.onPlayButtonClick.bind(this));
      window.removeEventListener('levelSelected', this.boundUpdateCurrentLevel);
      window.removeEventListener('keyup', this.boundOnKeyUp);


      // Nullify DOM references
      this.canvas = null;
      this.ctx = null;

      // Dispose of BoxUI if it has a dispose method
      if (this.playInfoBox && typeof this.playInfoBox.dispose === 'function') {
          this.playInfoBox.dispose();
      }

      // Nullify other object references
      this.playInfoBox = null;
      this.currentLevelData = null;
      this.boundUpdateCurrentLevel = null;
      // ... any other objects that need to be nullified ...
    }

}

