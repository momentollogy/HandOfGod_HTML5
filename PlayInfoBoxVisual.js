// PlayInfoBoxVisual.js
import BoxUI from './BoxUI.js'; // Assuming BoxUI.js exists and is in the same directory
import BlueButton from './BlueButton.js';


export default class PlayInfoBoxVisual 
{

  constructor() {
    this.currentLevelData = null;
    this.boundUpdateCurrentLevel = this.updateCurrentLevel.bind(this);
    window.addEventListener('levelSelected', this.boundUpdateCurrentLevel);
  
    // Default selected difficulty
    this.selectedDifficulty = 'Easy';
  
    // Canvas setup
    this.canvas = document.getElementById("output_canvas");
    this.ctx = this.canvas.getContext("2d");
  
    // Box properties
    this.RESIZE_FACTOR = 0.65; // Smaller size for the play info box
    this.POSITION_OFFSET_X = 680;
    this.POSITION_OFFSET_Y = -200;
    this.BOX_WIDTH = 800 * this.RESIZE_FACTOR;
    this.BOX_HEIGHT = 500 * this.RESIZE_FACTOR;
    this.BOX_X = ((1920 - this.BOX_WIDTH) / 2) + this.POSITION_OFFSET_X;
    this.BOX_Y = ((1080 - this.BOX_HEIGHT) / 2) + this.POSITION_OFFSET_Y;
    this.BOX_RADIUS = 50; // Smaller radius for the play info box
  
    // Create BoxUI instance for the play info box
    this.playInfoBox = new BoxUI(
      this.ctx,
      this.BOX_X,
      this.BOX_Y,
      this.BOX_WIDTH,
      this.BOX_HEIGHT,
      this.BOX_RADIUS
    );
  
    // Initialize difficulty buttons
    this.initializeDifficultyButtons();
  
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
  
    // Button properties for the Play button
    this.BUTTON_WIDTH = 200;
    this.BUTTON_HEIGHT = 50;
    this.BUTTON_RADIUS = 10;
    this.BUTTON_COLOR = "#00008B"; // Deep blue color
    this.BUTTON_HOVER_COLOR = "#0000CD"; // Slightly lighter blue for hover effect
    this.BUTTON_SHADOW_COLOR = "rgba(0, 0, 0, 0.5)";
    this.BUTTON_X = this.BOX_X + (this.BOX_WIDTH - this.BUTTON_WIDTH) / 2; // Centered inside the box
    this.BUTTON_Y = this.BOX_Y + this.BOX_HEIGHT - this.BUTTON_HEIGHT - 10; // more minus moves up Positioned at the bottom with some margin
    this.BUTTON_TEXT = "Play";
  
    // Draw the box and buttons
    this.draw(); 
  }
  
  initializeDifficultyButtons() 
  {
    // Button layout parameters
    const buttonWidth = 75; // Small width for each button
    const buttonHeight = 30;
    const buttonSpacing = 10; // Space between buttons
    const numberOfButtons = 4;
    const totalButtonsWidth = numberOfButtons * buttonWidth + (numberOfButtons - 1) * buttonSpacing;
    const startX = this.BOX_X + (this.BOX_WIDTH - totalButtonsWidth) / 2; // Center buttons within the box
    const startY = this.BOX_Y + this.BOX_HEIGHT - buttonHeight - 60; // Adjust Y position as needed
    
    // Create difficulty buttons
    this.difficultyButtons = [];
    const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];
    const buttonColors = {
      default: "#00008B", // Deep blue for default state
      hover: "#FF0000",   // Red for hover and selected state
    };
  
    difficulties.forEach((difficulty, index) => {
      const buttonX = startX + index * (buttonWidth + buttonSpacing);
      this.difficultyButtons.push(new BlueButton(
        buttonX,
        startY,
        buttonWidth,
        buttonHeight,
        10, // Button corner radius
        buttonColors.default,
        buttonColors.hover,
        difficulty,
        "rgba(0, 0, 0, 0.5)", // Button shadow color
        { difficulty: difficulty },
        this.handleDifficultySelection.bind(this, difficulty) // We will define this method next
      ));
    });

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


     draw() {
      // Check if currentLevelData is not available and return to stop the drawing
      if (!this.currentLevelData) {
        console.error("No current level data available to draw.");
        return; // Stop drawing if no data is present
      }
    
      // Clear the part of the canvas where the play info box will be drawn
      // You can adjust the clearRect parameters to match the area that needs to be cleared
      this.ctx.clearRect(this.BOX_X, this.BOX_Y, this.BOX_WIDTH, this.BOX_HEIGHT + 100); // The +100 is an example
    
      // Start fresh drawing context
      this.ctx.save();
    
      // Draw the box background first
      this.playInfoBox.draw();
    
      // Set text properties for the level display name and duration
      this.ctx.fillStyle = "white";
      this.ctx.font = `${this.HEADER_FONT_SIZE}px Arial`;
      this.ctx.textAlign = "center";
    
      // Draw the level display name header
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
    
      // Draw difficulty buttons
      this.difficultyButtons.forEach(button => button.draw());
    
      // Draw the 'Play' button last so it's on top
      this.drawButton();
    
      // Restore the context to avoid interfering with other canvas drawings
      this.ctx.restore();
    }
    

/*
Buttons all drawn but no text
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

        this.difficultyButtons.forEach(button => button.draw());


        this.drawButton();

        
        this.ctx.restore();

    }

 */

   


  
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
  


    handleDifficultySelection(difficulty) 
    {
      // Update selected difficulty
      this.selectedDifficulty = difficulty;
    
      // Update the JSON path based on the selected difficulty
      if (this.currentLevelData && this.currentLevelData.jsonPaths) {
        this.currentLevelData.jsonPath = this.currentLevelData.jsonPaths[difficulty];
      }
    
      // Update the visual state of the buttons
      this.difficultyButtons.forEach(button => {
        button.isPressed = (button.actionData.difficulty === difficulty);
        button.draw(); // Redraw each button to reflect the new state
      });
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

      this.difficultyButtons.forEach(button => button.dispose());

    }

}
