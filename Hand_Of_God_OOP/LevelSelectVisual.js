
// Assuming the BoxUI class has been imported correctly
import BoxUI from './BoxUI.js';

export default class LevelSelectVisual 
{
 
    constructor(playInfoBoxVisual) 
    {
        this.playInfoBoxVisual = playInfoBoxVisual;
        //console.log(this.playInfoBoxVisual);

    
        
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");

        

        // Define the box properties, ensuring they can be modified dynamically
        this.RESIZE_FACTOR = 0.8;
        this.POSITION_OFFSET_X = 90;
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
        this.HEADER_HEIGHT = 113;
        this.HEADER_FONT_SIZE = 50;
        this.SCORE_FONT_SIZE = 35;
        this.SCORE_LINE_HEIGHT = 50;
        this.SCORE_MARGIN_LEFT = 90;
        this.SCORE_MARGIN_TOP = 90; // You may want to adjust this as needed
        this.SCORE_MARGIN_RIGHT = 50;
        this.TEXT_ALIGN_LEFT = 90; // Margin from the left of the box to start text
        this.TEXT_ALIGN_TOP = this.HEADER_HEIGHT + this.SCORE_MARGIN_TOP; // Margin from the top of the box to start text
        this.TEXT_CENTER_X = this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2);

        // Initialize the level array and selected index here
        this.levelArray = [
                        {
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Just Dance'  Lady Gaga", 
                            fireBaseLevelLeaderBoard: "JustDance_easy_LeaderBoard",
                            duration: "1:07",
                            mp3Path:"Level_Mp3AndJson/JustDance/JustDance.mp3",
                            jsonPath:"Level_Mp3AndJson/JustDance/JustDanceLevel.json"
                        },
                        
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Pneuma'  Tool", 
                            fireBaseLevelLeaderBoard: "Pneuma_easy_LeaderBoard", 
                            duration: ":56",
                            mp3Path:"Level_Mp3AndJson/Tool/tool_short.mp3", 
                            jsonPath:"Level_Mp3AndJson/Tool/toolv3.json"
                        },
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Dance The Night'  Dua Lipa", 
                            fireBaseLevelLeaderBoard: "DanceTheNight_LeaderBoard", 
                            duration: "1:05",
                            mp3Path:"Level_Mp3AndJson/DanceTheNight/DanceTheNight.wav", 
                            jsonPath:"Level_Mp3AndJson/DanceTheNight/DanceTheNight.json"
                        },
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'WonderBoy'  Tenacious D", 
                            fireBaseLevelLeaderBoard: "WonderBoy_LeaderBoard", 
                            duration: ":57",
                            mp3Path:"Level_Mp3AndJson/WonderBoy/WonderBoy.mp3", 
                            jsonPath:"Level_Mp3AndJson/WonderBoy/WonderBoy.json"
                        },
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Chandelier'  Sia", 
                            fireBaseLevelLeaderBoard: "Chandelier_LB", 
                            duration: "1:09",
                            mp3Path:"Level_Mp3AndJson/Chandelier/Chandelier.wav", 
                            jsonPath:"Level_Mp3AndJson/Chandelier/Chandelier.json"
                        },
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Elastic Heart'  Sia", 
                            fireBaseLevelLeaderBoard: "ElasticHeart_LB", 
                            duration: "1:24",
                            mp3Path:"Level_Mp3AndJson/ElasticHeart/ElasticHeart.wav", 
                            jsonPath:"Level_Mp3AndJson/ElasticHeart/ElasticHeart.json"
                        },
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Apache'  Sugar Hill Gang", 
                            fireBaseLevelLeaderBoard: "Apache_LB", 
                            duration: "1:24",
                            mp3Path:"Level_Mp3AndJson/Apache/Apache.wav", 
                            jsonPath:"Level_Mp3AndJson/Apache/Apache.json"
                        },
                        {   
                            fileName: "Level_05_Recorder", 
                            levelDisplayName: "RECORDER", 
                            fireBaseLevelLeaderBoard: "TBD", 
                            duration: "",
                            mp3Path:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.mp3", 
                            jsonPath:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.json"
                        },
                        
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "Level_3NoteTest", 
                            fireBaseLevelLeaderBoard: "Level_3NoteTest_LB", 
                            duration: "1:23",
                            mp3Path:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.mp3", 
                            jsonPath:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.json"
                        },
                        /*
                        {   
                            fileName: "Level_StageSelect", 
                            levelDisplayName: "Test to get pass LevelStage", 
                            fireBaseLevelLeaderBoard: "JustDance_easy_LeaderBoard", 
                            duration: "1:23",
                            mp3Path:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.mp3", 
                            jsonPath:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.json"
                        },
                        */
                       
                        


        ];
        
        this.currentSelectedLevelIndex = this.getCurrentLevelIndex();
        this.getCurrentLevelIndex();
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
    bindEvents() 
    {
        window.addEventListener('keydown', this.handleKeyDown);
        this.canvas.addEventListener('click', this.handleMouseClick);
    }

    // This method is added to your class
    handleKeyDown(event) {
    if (event.key === 'ArrowUp' && this.currentSelectedLevelIndex > 0) {
        this.currentSelectedLevelIndex -= 1;
        this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[this.currentSelectedLevelIndex]);
        this.dispatchLevelSelectedEvent(); // Add this line to dispatch the event


    } else if (event.key === 'ArrowDown' && this.currentSelectedLevelIndex < this.levelArray.length - 1) {
        this.currentSelectedLevelIndex += 1;
        this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[this.currentSelectedLevelIndex]);
        this.dispatchLevelSelectedEvent(); // Add this line to dispatch the event


    }

    this.draw(); // Re-draw to update the visual selection
    }

    handleMouseClick(event) 
    {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;    // calculate the scale of the canvas
        const scaleY = this.canvas.height / rect.height;
        const clickX = (event.clientX - rect.left) * scaleX;  // adjust click position based on canvas scale
        const clickY = (event.clientY - rect.top) * scaleY;
    
        // Define a margin for the clickable area to make it wider than the text itself
        const clickMargin =120; // This adds 20 pixels on each side of the text
    
        // Initial guess for Y_OFFSET
        const Y_OFFSET = this.SCORE_LINE_HEIGHT / 2;
    
        // Now we iterate over the levels and their bounding boxes
        this.levelArray.forEach((level, index) => {
        // Adjust topY by subtracting the Y_OFFSET to center vertically
        let levelTopY = this.LEADERBOARD_Y + this.HEADER_HEIGHT + this.SCORE_MARGIN_TOP + (index * this.SCORE_LINE_HEIGHT) - Y_OFFSET;
        let levelBottomY = levelTopY + this.SCORE_LINE_HEIGHT;
    
        // Center the level display name horizontally and add margin
        let textWidth = this.ctx.measureText(level.levelDisplayName).width;
        let levelLeftX = this.TEXT_CENTER_X - (textWidth / 2) - clickMargin;
        let levelRightX = this.TEXT_CENTER_X + (textWidth / 2) + clickMargin;
    
        // Check if the click is within the bounds of the level's bounding box
        if (
            clickX >= levelLeftX &&
            clickX <= levelRightX &&
            clickY >= levelTopY &&
            clickY <= levelBottomY
        ) {
            this.setCurrentLevelIndex(index);
           // this.currentSelectedLevelIndex = index; // Set the current index to the clicked one
            this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[this.currentSelectedLevelIndex]);
            this.draw(); // Re-draw to update the visual selection
            this.dispatchLevelSelectedEvent(); // Notify that a level was selected
          }
        });
    }
   
   
    setCurrentLevelIndex(num)
    {
        window.myCurrentLevelIndex = num;
        this.currentSelectedLevelIndex = window.myCurrentLevelIndex
    }

    getCurrentLevelIndex()
    {
        
        if (!window.myCurrentLevelIndex)
        {
            window.myCurrentLevelIndex = 0;
        }
      
        this.currentSelectedLevelIndex = window.myCurrentLevelIndex
       // console.log("Window Index is:", window.myCurrentLevelIndex)
        return this.currentSelectedLevelIndex;
    }
 



    // This method is added to your class
    dispatchLevelSelectedEvent() 
    {
        const selectedLevel = this.levelArray[this.currentSelectedLevelIndex];
        const event = new CustomEvent('levelSelected', { detail: selectedLevel });
        window.dispatchEvent(event);
    }

    // This method is added to your class
    dispose() 
    {
        window.removeEventListener('keydown', this.handleKeyDown);
        this.canvas.removeEventListener('click', this.handleMouseClick);
    }

    draw() 
    {
        this.ctx.save();

        // Set the fill style for the box and draw it
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.box.draw();

        // Draw the header for the level selection, centered
        this.ctx.textAlign = "center"; // Center-align text
        this.ctx.fillStyle = '#FFF'; // Text color
        this.ctx.font = `${this.HEADER_FONT_SIZE}px Verdana`;
        // Use the center of the box for X position
        this.ctx.fillText('LEVEL SELECT', this.TEXT_CENTER_X, this.LEADERBOARD_Y + this.HEADER_HEIGHT);

        // Draw the level names, centered
        this.ctx.font = `${this.SCORE_FONT_SIZE}px Arial`; // Set the font for the level names
        this.levelArray.forEach((level, index) => {
            this.ctx.fillStyle = index === this.currentSelectedLevelIndex ? 'red' : '#FFF'; // Highlight selected level
            // Calculate the Y position for each level name
            let textY = this.LEADERBOARD_Y + this.TEXT_ALIGN_TOP + (index * this.SCORE_LINE_HEIGHT);
            // Draw each level name centered in the box
            this.ctx.fillText(level.levelDisplayName, this.TEXT_CENTER_X, textY);
        });

        this.ctx.restore();
    }
    
    

}






/*Not the issue bring back soon. 


// Assuming the BoxUI class has been imported correctly
import BoxUI from './BoxUI.js';

export default class LevelSelectVisual 
{
 
    constructor(playInfoBoxVisual) 
    {
        this.playInfoBoxVisual = playInfoBoxVisual;
        //console.log(this.playInfoBoxVisual);

    
        
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");

        

        // Define the box properties, ensuring they can be modified dynamically
        this.RESIZE_FACTOR = 0.8;
        this.POSITION_OFFSET_X = 90;
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
        this.HEADER_HEIGHT = 113;
        this.HEADER_FONT_SIZE = 50;
        this.SCORE_FONT_SIZE = 35;
        this.SCORE_LINE_HEIGHT = 50;
        this.SCORE_MARGIN_LEFT = 90;
        this.SCORE_MARGIN_TOP = 90; // You may want to adjust this as needed
        this.SCORE_MARGIN_RIGHT = 50;
        this.TEXT_ALIGN_LEFT = 90; // Margin from the left of the box to start text
        this.TEXT_ALIGN_TOP = this.HEADER_HEIGHT + this.SCORE_MARGIN_TOP; // Margin from the top of the box to start text
        this.TEXT_CENTER_X = this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2);

        // Initialize the level array and selected index here
        this.levelArray = [
                        {
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Just Dance'  Lady Gaga", 
                            fireBaseLevelLeaderBoard: "JustDance_easy_LeaderBoard",
                            duration: "1:07",
                            mp3Path:"Level_Mp3AndJson/JustDance/JustDance.mp3",
                            jsonPath:"Level_Mp3AndJson/JustDance/JustDanceLevel.json"
                        },
                        
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Pneuma'  Tool", 
                            fireBaseLevelLeaderBoard: "Pneuma_easy_LeaderBoard", 
                            duration: ":56",
                            mp3Path:"Level_Mp3AndJson/Tool/tool_short.mp3", 
                            jsonPath:"Level_Mp3AndJson/Tool/toolv3.json"
                        },
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Dance The Night'  Dua Lipa", 
                            fireBaseLevelLeaderBoard: "DanceTheNight_LeaderBoard", 
                            duration: "1:05",
                            mp3Path:"Level_Mp3AndJson/DanceTheNight/DanceTheNight.wav", 
                            jsonPath:"Level_Mp3AndJson/DanceTheNight/DanceTheNight.json"
                        },
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'WonderBoy'  Tenacious D", 
                            fireBaseLevelLeaderBoard: "WonderBoy_LeaderBoard", 
                            duration: ":57",
                            mp3Path:"Level_Mp3AndJson/WonderBoy/WonderBoy.mp3", 
                            jsonPath:"Level_Mp3AndJson/WonderBoy/WonderBoy.json"
                        },
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Chandelier'  Sia", 
                            fireBaseLevelLeaderBoard: "Chandelier_LB", 
                            duration: "1:09",
                            mp3Path:"Level_Mp3AndJson/Chandelier/Chandelier.wav", 
                            jsonPath:"Level_Mp3AndJson/Chandelier/Chandelier.json"
                        },
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Elastic Heart'  Sia", 
                            fireBaseLevelLeaderBoard: "ElasticHeart_LB", 
                            duration: "1:24",
                            mp3Path:"Level_Mp3AndJson/ElasticHeart/ElasticHeart.wav", 
                            jsonPath:"Level_Mp3AndJson/ElasticHeart/ElasticHeart.json"
                        },
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "'Apache'  Sugar Hill Gang", 
                            fireBaseLevelLeaderBoard: "Apache_LB", 
                            duration: "1:24",
                            mp3Path:"Level_Mp3AndJson/Apache/Apache.wav", 
                            jsonPath:"Level_Mp3AndJson/Apache/Apache.json"
                        },
                        {   
                            fileName: "Level_05_Recorder", 
                            levelDisplayName: "RECORDER", 
                            fireBaseLevelLeaderBoard: "TBD", 
                            duration: "",
                            mp3Path:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.mp3", 
                            jsonPath:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.json"
                        },
                        
                        {   
                            fileName: "Level_BasicTouch", 
                            levelDisplayName: "Level_3NoteTest", 
                            fireBaseLevelLeaderBoard: "JustDance_easy_LeaderBoard", 
                            duration: "1:23",
                            mp3Path:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.mp3", 
                            jsonPath:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.json"
                        },
                        /*
                        {   
                            fileName: "Level_StageSelect", 
                            levelDisplayName: "Test to get pass LevelStage", 
                            fireBaseLevelLeaderBoard: "JustDance_easy_LeaderBoard", 
                            duration: "1:23",
                            mp3Path:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.mp3", 
                            jsonPath:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.json"
                        },
                        */




        /*
                        


        ];
        
        this.currentSelectedLevelIndex = this.getCurrentLevelIndex();
        this.getCurrentLevelIndex();
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
    bindEvents() 
    {
        window.addEventListener('keydown', this.handleKeyDown);
        this.canvas.addEventListener('click', this.handleMouseClick);
    }

    // This method is added to your class
    handleKeyDown(event) {
    if (event.key === 'ArrowUp' && this.currentSelectedLevelIndex > 0) {
        this.currentSelectedLevelIndex -= 1;
        this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[this.currentSelectedLevelIndex]);
        this.dispatchLevelSelectedEvent(); // Add this line to dispatch the event


    } else if (event.key === 'ArrowDown' && this.currentSelectedLevelIndex < this.levelArray.length - 1) {
        this.currentSelectedLevelIndex += 1;
        this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[this.currentSelectedLevelIndex]);
        this.dispatchLevelSelectedEvent(); // Add this line to dispatch the event


    }

    this.draw(); // Re-draw to update the visual selection
    }

    handleMouseClick(event) 
    {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;    // calculate the scale of the canvas
        const scaleY = this.canvas.height / rect.height;
        const clickX = (event.clientX - rect.left) * scaleX;  // adjust click position based on canvas scale
        const clickY = (event.clientY - rect.top) * scaleY;
    
        // Define a margin for the clickable area to make it wider than the text itself
        const clickMargin =120; // This adds 20 pixels on each side of the text
    
        // Initial guess for Y_OFFSET
        const Y_OFFSET = this.SCORE_LINE_HEIGHT / 2;
    
        // Now we iterate over the levels and their bounding boxes
        this.levelArray.forEach((level, index) => {
        // Adjust topY by subtracting the Y_OFFSET to center vertically
        let levelTopY = this.LEADERBOARD_Y + this.HEADER_HEIGHT + this.SCORE_MARGIN_TOP + (index * this.SCORE_LINE_HEIGHT) - Y_OFFSET;
        let levelBottomY = levelTopY + this.SCORE_LINE_HEIGHT;
    
        // Center the level display name horizontally and add margin
        let textWidth = this.ctx.measureText(level.levelDisplayName).width;
        let levelLeftX = this.TEXT_CENTER_X - (textWidth / 2) - clickMargin;
        let levelRightX = this.TEXT_CENTER_X + (textWidth / 2) + clickMargin;
    
        // Check if the click is within the bounds of the level's bounding box
        if (
            clickX >= levelLeftX &&
            clickX <= levelRightX &&
            clickY >= levelTopY &&
            clickY <= levelBottomY
        ) {
            this.setCurrentLevelIndex(index);
           // this.currentSelectedLevelIndex = index; // Set the current index to the clicked one
            this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[this.currentSelectedLevelIndex]);
            this.draw(); // Re-draw to update the visual selection
            this.dispatchLevelSelectedEvent(); // Notify that a level was selected
          }
        });
    }
   
   
    setCurrentLevelIndex(num)
    {
        window.myCurrentLevelIndex = num;
        this.currentSelectedLevelIndex = window.myCurrentLevelIndex
    }

    getCurrentLevelIndex()
    {
        
        if (!window.myCurrentLevelIndex)
        {
            window.myCurrentLevelIndex = 0;
        }
      
        this.currentSelectedLevelIndex = window.myCurrentLevelIndex
       // console.log("Window Index is:", window.myCurrentLevelIndex)
        return this.currentSelectedLevelIndex;
    }
 



    // This method is added to your class
    dispatchLevelSelectedEvent() 
    {
        const selectedLevel = this.levelArray[this.currentSelectedLevelIndex];
        const event = new CustomEvent('levelSelected', { detail: selectedLevel });
        window.dispatchEvent(event);
    }

    // This method is added to your class
    dispose() 
    {
        window.removeEventListener('keydown', this.handleKeyDown);
        this.canvas.removeEventListener('click', this.handleMouseClick);
    }

    draw() 
    {
        this.ctx.save();

        // Set the fill style for the box and draw it
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.box.draw();

        // Draw the header for the level selection, centered
        this.ctx.textAlign = "center"; // Center-align text
        this.ctx.fillStyle = '#FFF'; // Text color
        this.ctx.font = `${this.HEADER_FONT_SIZE}px Verdana`;
        // Use the center of the box for X position
        this.ctx.fillText('LEVEL SELECT', this.TEXT_CENTER_X, this.LEADERBOARD_Y + this.HEADER_HEIGHT);

        // Draw the level names, centered
        this.ctx.font = `${this.SCORE_FONT_SIZE}px Arial`; // Set the font for the level names
        this.levelArray.forEach((level, index) => {
            this.ctx.fillStyle = index === this.currentSelectedLevelIndex ? 'red' : '#FFF'; // Highlight selected level
            // Calculate the Y position for each level name
            let textY = this.LEADERBOARD_Y + this.TEXT_ALIGN_TOP + (index * this.SCORE_LINE_HEIGHT);
            // Draw each level name centered in the box
            this.ctx.fillText(level.levelDisplayName, this.TEXT_CENTER_X, textY);
        });

        this.ctx.restore();
    }
    
    

}

*/