// PlayInfoBoxVisual.js
import BoxUI from './BoxUI.js'; // Assuming BoxUI.js exists and is in the same directory

export default class PlayInfoBoxVisual {
  constructor() {

   this.currentLevelData = null;
   this.boundUpdateCurrentLevel = this.updateCurrentLevel.bind(this);
   window.addEventListener('levelSelected', this.boundUpdateCurrentLevel);
   this.levelselectvisual;


    // Canvas setup
    this.canvas = document.getElementById("output_canvas");
    this.ctx = this.canvas.getContext("2d");

    // Box properties
    this.RESIZE_FACTOR = 0.65; // Smaller size for the play info box
    this.POSITION_OFFSET_X = 600;
    this.POSITION_OFFSET_Y = -200;
    this.BOX_WIDTH = 800 * this.RESIZE_FACTOR;
    this.BOX_HEIGHT = 400 * this.RESIZE_FACTOR;
    this.BOX_X = ((1920 - this.BOX_WIDTH) / 2) + this.POSITION_OFFSET_X;
    this.BOX_Y = ((1080 - this.BOX_HEIGHT) / 2) + this.POSITION_OFFSET_Y;
    this.BOX_RADIUS = 50; // Smaller radius for the play info box

    // Header and level info styling variables
    this.HEADER_HEIGHT = 40; // Smaller header for the play info box
    this.HEADER_FONT_SIZE = 25;
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


  }

  updateCurrentLevel(event) {
   // Make sure to modify this to handle the event object
   //this.currentLevelData = event.detail;
   //this.currentLevelData = this.levelselectvisual.levelArray[this.levelselectvisual.currentSelectedLevelIndex];
    if (this.levelselectvisual)
     {  
     this.currentLevelData = this.levelselectvisual.levelArray[this.levelselectvisual.currentSelectedLevelIndex];
     console.log(this.levelselectvisual.levelArray[0]);
     }

   this.draw();
  // console.log("UPDATE LEVEL FUNTION")
 }

 draw() {
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

  // TODO: Other drawing code...
  
  this.ctx.restore();
}

 

  // Placeholder function for the play button interaction
  onPlayButtonClick() {
    console.log("Play button pressed");
    //console.log(`Loading level: ${this.levelArray[this.currentSelectedLevelIndex].fileName}`);
    // Actual game level loading logic will go here
  }


  
  // TODO: Add event listeners for mouse hover and click events
  
  // Add a new method to clean up when the object is destroyed
   dispose() 
   {
    window.removeEventListener('levelSelected', this.boundUpdateCurrentLevel);
    // ... other cleanup code ...
   }
}
