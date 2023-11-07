
// Assuming the BoxUI class has been imported correctly
import BoxUI from './BoxUI.js';

export default class LevelSelectVisual {
 
    constructor(playInfoBoxVisual) {
    this.playInfoBoxVisual = playInfoBoxVisual;
    //console.log(this.playInfoBoxVisual);

   
    
    this.canvas = document.getElementById("output_canvas");
    this.ctx = this.canvas.getContext("2d");


        // Define the box properties, ensuring they can be modified dynamically
        this.RESIZE_FACTOR = 0.8;
        this.POSITION_OFFSET_X = 0;
        this.POSITION_OFFSET_Y = 0;
        this.LEADERBOARD_WIDTH = 800 * this.RESIZE_FACTOR;
        this.LEADERBOARD_HEIGHT = 800;
        this.LEADERBOARD_X = ((1920 - this.LEADERBOARD_WIDTH) / 2) + this.POSITION_OFFSET_X;
        this.LEADERBOARD_Y = ((1080 - this.LEADERBOARD_HEIGHT) / 2) + this.POSITION_OFFSET_Y;
        this.LEADERBOARD_RADIUS = 100;

        // Create an instance of BoxUI for the leaderboard
        this.box = new BoxUI(this.ctx,
                             this.LEADERBOARD_X,
                             this.LEADERBOARD_Y,
                             this.LEADERBOARD_WIDTH,
                             this.LEADERBOARD_HEIGHT,
                             this.LEADERBOARD_RADIUS);

        // Header and score styling variables
        this.HEADER_HEIGHT = 80;
        this.HEADER_FONT_SIZE = 50;
        this.SCORE_FONT_SIZE = 35;
        this.SCORE_LINE_HEIGHT = 50;
        this.SCORE_MARGIN_LEFT = 50;
        this.SCORE_MARGIN_TOP = 70; // You may want to adjust this as needed
        this.SCORE_MARGIN_RIGHT = 50;

        // Initialize the level array and selected index here
        this.levelArray = [
                        {
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Just Dance' Lady Gaga", 
                            fireBaseLevelLeaderBoard: "JustDance_easy_LeaderBoard",
                          //  fireBaseLevelLeaderBoard1: "JustDance_normal_LeaderBoard",//refers to my collection name
                            duration: "1:07",
                            mp3Path:"Level_Mp3AndJson/JustDance/JustDance.mp3",
                            jsonPath:"Level_Mp3AndJson/JustDance/JustDanceLevel.json"
                        },
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Pneuma' Tool", 
                            fireBaseLevelLeaderBoard: "Pneuma_Easy", 
                            duration: ":56",
                            mp3Path:"Level_Mp3AndJson/Tool/tool_short.mp3", 
                            jsonPath:"Level_Mp3AndJson/Tool/toolv3.json"
                        },
                        {   
                            fileName: "Level_05_Recorder", 
                            levelDisplayName: "Level_Recorder", 
                            fireBaseLevelLeaderBoard: "TBD", 
                            duration: "",
                            mp3Path:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.mp3", 
                            jsonPath:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.json"
                        },
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "Level_3NoteTest", 
                            fireBaseLevelLeaderBoard: "TBD", 
                            duration: "",
                            mp3Path:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.mp3", 
                            jsonPath:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.json"
                        },


            //{fileName: "Level_Wonder_Boy", levelDisplayName: "Wonder Boy", fireBaseLevelLeaderBoard: "LINK", duration: "2min"},
            //{fileName: "Level_Green Day", levelDisplayName: "Green Day", fireBaseLevelLeaderBoard: "LINK", duration: "1:30"}
        ];
        this.currentSelectedLevelIndex = 0;
        this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[0]);


        // Call the initial drawing function
        //this.draw();

         // Bind event handlers to the instance
         this.handleKeyDown = this.handleKeyDown.bind(this);
         this.handleMouseClick = this.handleMouseClick.bind(this);
 
         // Call the function to set up event listeners
         this.bindEvents();
    }


     // This method is added to your class
     bindEvents() {
      window.addEventListener('keydown', this.handleKeyDown);
      this.canvas.addEventListener('click', this.handleMouseClick);
  }

  // This method is added to your class
  handleKeyDown(event) {
   if (event.key === 'ArrowUp' && this.currentSelectedLevelIndex > 0) {
       this.currentSelectedLevelIndex -= 1;
       this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[this.currentSelectedLevelIndex]);

   } else if (event.key === 'ArrowDown' && this.currentSelectedLevelIndex < this.levelArray.length - 1) {
       this.currentSelectedLevelIndex += 1;
       this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[this.currentSelectedLevelIndex]);

   }

   // Log after the index has been updated
   //console.log(`Selected Index: ${this.currentSelectedLevelIndex}`);
   //console.log('Selected Level:', this.levelArray[this.currentSelectedLevelIndex]);

   this.draw(); // Re-draw to update the visual selection
}

  // This method is added to your class
  // This method is added to your class
handleMouseClick(event) {
 const rect = this.canvas.getBoundingClientRect();
 const scaleX = this.canvas.width / rect.width;    // calculate the scale of the canvas
 const scaleY = this.canvas.height / rect.height;
 const clickX = (event.clientX - rect.left) * scaleX;  // adjust click position based on canvas scale
 const clickY = (event.clientY - rect.top) * scaleY;
 
 // Initial guess for Y_OFFSET
 const Y_OFFSET = this.SCORE_LINE_HEIGHT / 2;

 // Log to see if the click is being registered with adjusted positions
 //console.log(`Adjusted Click X: ${clickX}, Adjusted Click Y: ${clickY}`);

 // Now we iterate over the levels and their bounding boxes
 this.levelArray.forEach((level, index) => {
   // Adjust topY by subtracting the Y_OFFSET
   let levelTopY = this.LEADERBOARD_Y + this.HEADER_HEIGHT + this.SCORE_MARGIN_TOP + (index * this.SCORE_LINE_HEIGHT) - Y_OFFSET;
   let levelBottomY = levelTopY + this.SCORE_LINE_HEIGHT;

   // We are assuming the X coordinate starts at a constant, adjust if your levels are indented
   let levelLeftX = this.LEADERBOARD_X + this.SCORE_MARGIN_LEFT;
   let levelRightX = levelLeftX + this.ctx.measureText(level.levelDisplayName).width;

   // Check if the click is within the bounds of the level's bounding box
   if (
     clickX >= levelLeftX &&
     clickX <= levelRightX &&
     clickY >= levelTopY &&
     clickY <= levelBottomY
   ) {
     this.currentSelectedLevelIndex = index; // Set the current index to the clicked one

     this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[this.currentSelectedLevelIndex]);


     // Log to see which level was clicked
     //console.log(`Level ${level.levelDisplayName} was clicked!`);
     //console.log(`Selected Index: ${this.currentSelectedLevelIndex}`);

     this.draw(); // Re-draw to update the visual selection
     this.dispatchLevelSelectedEvent(); // Notify that a level was selected
   }
 });
}


 



       // This method is added to your class
       dispatchLevelSelectedEvent() {
           const selectedLevel = this.levelArray[this.currentSelectedLevelIndex];
           const event = new CustomEvent('levelSelected', { detail: selectedLevel });
           window.dispatchEvent(event);
       }

       // This method is added to your class
       dispose() {
           window.removeEventListener('keydown', this.handleKeyDown);
           this.canvas.removeEventListener('click', this.handleMouseClick);
       }

    draw() 
    {
        this.ctx.save();
        // Clear the canvas for redrawing
        //this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Set the fill style for the box and draw it
        this.ctx.fillStyle = '#000'; // The fill color for the box
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";

        this.box.draw();

        // Draw the header for the level selection
        this.ctx.fillStyle = '#FFF'; // Text color
        this.ctx.font = `${this.HEADER_FONT_SIZE}px Arial`;
        this.ctx.fillText('Level Select', this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2) - this.ctx.measureText('Level Select').width / 2, this.LEADERBOARD_Y + this.HEADER_HEIGHT);

        // Draw the level names
        this.levelArray.forEach((level, index) => {
            this.ctx.fillStyle = index === this.currentSelectedLevelIndex ? 'red' : '#FFF'; // Highlight selected level
            this.ctx.font = `${this.SCORE_FONT_SIZE}px Arial`;
            let textX = this.LEADERBOARD_X + this.SCORE_MARGIN_LEFT;
            let textY = this.LEADERBOARD_Y + this.HEADER_HEIGHT + this.SCORE_MARGIN_TOP + (index * this.SCORE_LINE_HEIGHT);
            this.ctx.fillText(level.levelDisplayName, textX, textY);
        });

        // ... Any additional drawing code goes here
        this.ctx.save();
    }
    

}

