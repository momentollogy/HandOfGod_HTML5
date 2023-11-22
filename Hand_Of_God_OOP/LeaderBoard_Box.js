// LeaderBoard_Box.js

import BoxUI from './BoxUI.js';
import { getTopScores, getLatestScore, getPlayerTopScores } from './Leaderboard.js'; // Adjust the path if necessary


export default class LeaderBoard_Box 
{
    constructor() 
    {
        // Initialize scores array to hold leaderboard data
        this.scores = [];

        // Set up the canvas and context for drawing
        this.initializeCanvas();

        // Configure properties related to the leaderboard's position and size
        this.initializeBoxProperties();

        // Set up styling properties for header and score text
        this.initializeHeaderAndScoreStyling();

        // Create an instance of BoxUI for the leaderboard
        this.createBoxUIInstance();

        // Bind event handlers for handling events like level selection
        this.bindEventHandlers();

            // Bind event handlers for handling events like level selection and store them as properties
        this.boundLevelSelected = this.levelSelected.bind(this);
        this.boundHandleButtonClick = this.handleButtonClick.bind(this);
        this.boundHandleMouseMove = this.handleMouseMove.bind(this);

    // Add event listeners using the bound functions
    window.addEventListener('levelSelected', this.boundLevelSelected);
    this.canvas.addEventListener('click', this.boundHandleButtonClick);
    this.canvas.addEventListener('mousemove', this.boundHandleMouseMove);

        
        //When hovering over buttons pop up will appear.
        this.tooltip = { visible: false, text: '', x: 0, y: 0 };
       // this.tooltip = { visible: false, text: '', x: 0, y: 0, width: 150, height: 30 }; // Adjusted size
        //this.hoverTimer = null;
        //this.hoverDelay = 1000; // Delay in milliseconds





        // Step 1: Define Button Properties
        this.buttons = {
            topScores: {
                x: 70, y: 420, width: 35, height: 35,
                imagePath: 'images/topScores.png',
                hoverImagePath: 'images/topScoresHover.png', 
                selectedImagePath: 'images/topScoresSelected.png', 
                state: 'topScores',
                isHovered: false,
                isSelected: false  // Tracks if the button is selected
            },

            latestScores: {
                x: 70, y: 520, width: 35, height: 35,
                imagePath: 'images/latestScores.png',
                hoverImagePath: 'images/latestScoresHover.png', 
                selectedImagePath: 'images/latestScoresSelected.png', 
                isHovered: false,
                state: 'latestScores',
                isSelected: false  // Tracks if the button is selected

            },
            playerTopScores: {
                x: 70, y:620, width: 35, height: 35,
                imagePath: 'images/playerTopScores.png',
                hoverImagePath: 'images/playerTopScoresHover.png', 
                selectedImagePath: 'images/playerTopScoresSelected.png', 
                state: 'PlayerTopScores',
                isHovered: false,
                isSelected: false  // Tracks if the button is selected

            }
        };

        // Step 2: Load Button Images
        this.loadButtonIcons();

        // Step 4: Add event listener for clicks
        this.canvas.addEventListener('click', this.handleButtonClick.bind(this));

        
    }

    //END OF CONSTUCTOR

      // Utility function to check if a click is inside a button's area
    isInside(point, rect) 
    {
        return point.x >= rect.x && point.x <= rect.x + rect.width &&
        point.y >= rect.y && point.y <= rect.y + rect.height;
    }


 // Load button images
 loadButtonIcons() {
    Object.values(this.buttons).forEach(button => {
        button.image = new Image();
        button.image.src = button.imagePath;
        button.hoverImage = new Image();
        button.hoverImage.src = button.hoverImagePath;
        button.selectedImage = new Image();
        button.selectedImage.src = button.selectedImagePath;
    });
}

    drawButtons() {
        Object.values(this.buttons).forEach(button => {
            let imageToDraw = button.image; // Default image

            // Check if the button is selected
            if (button.isSelected) {
                imageToDraw = button.selectedImage;
            } 
            // Check if the button is hovered (and not selected)
            else if (button.isHovered) {
                imageToDraw = button.hoverImage;
            }

            this.ctx.drawImage(imageToDraw, button.x, button.y, button.width, button.height);
        });
    }


    // Handle button clicks
    handleButtonClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;
    
        // Deselect all buttons initially
        Object.values(this.buttons).forEach(button => button.isSelected = false);
    
        Object.values(this.buttons).forEach(button => {
            if (clickX >= button.x && clickX <= button.x + button.width &&
                clickY >= button.y && clickY <= button.y + button.height) {
                // Select the clicked button
                button.isSelected = true;
    
                // Check if the currentFireBaseLevelLeaderBoard is set
                if (this.currentFireBaseLevelLeaderBoard) {
                    this.populateAndDraw(this.currentFireBaseLevelLeaderBoard, button.state);
                } else {
                    console.error("No current Firebase leaderboard set");
                }
    
                // Break the loop once a button is found and clicked
                return;
            }
        });
    
        // Redraw buttons to reflect the new selected state
        this.drawButtons();
    }
    

    handleMouseMove(event) 
    {
        if (!this.canvas) {
            console.error("Canvas is null in handleMouseMove");
            return;
        }
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.canvas.height / rect.height);
    
        let anyButtonHovered = false;
    
        Object.values(this.buttons).forEach(button => {
            if (mouseX >= button.x && mouseX <= button.x + button.width &&
                mouseY >= button.y && mouseY <= button.y + button.height) {
                button.isHovered = true;
                anyButtonHovered = true;
    
                // Set tooltip properties when hovering over a button
                this.tooltip = {
                    visible: true,
                    text: this.getTooltipText(button.state), // Assuming a method to get the tooltip text based on button state
                    x: button.x,
                    y: button.y - 50 // Position the tooltip above the button
                };
    
            } else {
                button.isHovered = false;
            }
        });
    
        if (!anyButtonHovered) {
            this.tooltip.visible = false;
        }     
       
     
        
    }
    




    // Helper method to get tooltip text based on button state
    getTooltipText(state) {
        switch (state) {
            case 'topScores':
                return "Top Scores";
            case 'latestScores':
                return "Latest Scores";
            case 'PlayerTopScores':
                return "Player Top Scores";
            default:
                return "";
        }
    }
    
    

    initializeCanvas() {
        // Retrieve and set the canvas and its drawing context
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    initializeBoxProperties() {
        // Define properties for the leaderboard's dimensions and position
        this.RESIZE_FACTOR = 0.8;
        this.POSITION_OFFSET_X = -590;
        this.POSITION_OFFSET_Y = 0;
        this.LEADERBOARD_WIDTH = 800 * this.RESIZE_FACTOR;
        this.LEADERBOARD_HEIGHT = 800;
        this.LEADERBOARD_X = ((1920 - this.LEADERBOARD_WIDTH) / 2) + this.POSITION_OFFSET_X;
        this.LEADERBOARD_Y = ((1080 - this.LEADERBOARD_HEIGHT) / 2) + this.POSITION_OFFSET_Y;
        this.LEADERBOARD_RADIUS = 100;
    }

    initializeHeaderAndScoreStyling() {
        // Set styling properties for the leaderboard header and scores
        this.HEADER_HEIGHT = 155;
        this.HEADER_FONT_SIZE = 50;
        this.SCORE_FONT_SIZE = 30;
        this.SCORE_LINE_HEIGHT = 50;
        this.SCORE_MARGIN_LEFT = 90;
        this.SCORE_MARGIN_RIGHT = 50;
    }

    createBoxUIInstance() 
    {
        // Instantiate the BoxUI object for leaderboard display
        this.leaderboardBox = new BoxUI(
            this.ctx,
            this.LEADERBOARD_X,
            this.LEADERBOARD_Y,
            this.LEADERBOARD_WIDTH,
            this.LEADERBOARD_HEIGHT,
            this.LEADERBOARD_RADIUS
        );
    }

    bindEventHandlers() 
    {
    
    }


    setCurrentSongLevel(songData)
    {
        this.currentSongData = songData;
    }

    setState(fb,LB_state)
    {
        //console.log(LB_state)
        this.populateAndDraw(fb,LB_state);
        
    }
    

    

// working Draw
    draw() 
    {
        this.ctx.save();
        // Set the style for the box
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.leaderboardBox.draw();
    
        // Draw the HIGHSCORES header
        this.ctx.font = `${this.HEADER_FONT_SIZE}px Verdana`;
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
            "HIGHSCORES", 
            this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2), 
            this.LEADERBOARD_Y + this.HEADER_HEIGHT / 2 + 37
        );
    
        // Start of new code for drawing the scores
        let startY = this.LEADERBOARD_Y + this.HEADER_HEIGHT + this.SCORE_LINE_HEIGHT;
    
        if (this.scores && this.scores.length > 0) {
            // Check if the scores include a 'rank' property
            let includesRank = 'rank' in this.scores[0];
    
            for (let i = 0; i < this.scores.length && i < 10; i++) {
                let scoreItem = this.scores[i];
    
                //  the rank or index
                this.ctx.font = `${this.SCORE_FONT_SIZE}px Verdana`;
               // this.ctx.fillStyle = "white";
               this.ctx.fillStyle = scoreItem.isLatest ? "red" : "white";

    
                if (includesRank) {
                    this.ctx.textAlign = "left";
                    this.ctx.fillText(
                        scoreItem.rank.toString(), 
                        this.LEADERBOARD_X + this.SCORE_MARGIN_LEFT, 
                        startY + (i * this.SCORE_LINE_HEIGHT)
                    );
                } else {
                    this.ctx.textAlign = "left";
                    this.ctx.fillText(
                        (i + 1).toString(), 
                        this.LEADERBOARD_X + this.SCORE_MARGIN_LEFT, 
                        startY + (i * this.SCORE_LINE_HEIGHT)
                    );
                }
    
                // Draw player name
                this.ctx.textAlign = "center";
                this.ctx.fillText(
                    scoreItem.playerName, 
                    this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2), 
                    startY + (i * this.SCORE_LINE_HEIGHT)
                );
    
                // Draw score
                this.ctx.textAlign = "right";
                this.ctx.fillText(
                    scoreItem.score.toString(), 
                    this.LEADERBOARD_X + this.LEADERBOARD_WIDTH - this.SCORE_MARGIN_RIGHT, 
                    startY + (i * this.SCORE_LINE_HEIGHT)
                );
            }

            if (this.tooltip.visible) {
                // Draw the tooltip
                this.ctx.fillStyle = 'black'; // Background color of the tooltip
                this.ctx.fillRect(this.tooltip.x, this.tooltip.y, 100, 20); // Adjust size as needed
                this.ctx.fillStyle = 'white'; // Text color
                this.ctx.font = '12px Arial';
                this.ctx.fillText(this.tooltip.text, this.tooltip.x + 5, this.tooltip.y + 15); // Adjust text position as needed
            }

        }
    
        // Draw buttons
        this.drawButtons();
        
        this.ctx.restore();
    }

    

   

    currentFireBaseLevelLeaderBoard = null;


    // Modify levelSelected to update currentFireBaseLevelLeaderBoard
    levelSelected(event) {
        this.currentFireBaseLevelLeaderBoard = event.detail.fireBaseLevelLeaderBoard;
        this.populateAndDraw(this.currentFireBaseLevelLeaderBoard, 'latestScores');
    }



    async populateAndDraw(fireBaseLevelLeaderBoard, dataType='topScores') {
        console.log("populateAndDraw called with:", fireBaseLevelLeaderBoard, dataType); // Log received parameters

        if (!fireBaseLevelLeaderBoard) {
            fireBaseLevelLeaderBoard = this.currentFireBaseLevelLeaderBoard || "Default_Leaderboard_ID";
        }

        let transformedScores;
    
        switch (dataType) {
            case 'topScores': {
                console.log("Fetching topScores with:", fireBaseLevelLeaderBoard); // Log parameter for Firebase call

                let topScores = await getTopScores(fireBaseLevelLeaderBoard); 
                transformedScores = topScores.map(score => ({
                    playerName: score.name,
                    score: score.score
                }));
                break;
            }


            case 'latestScores': {
                console.log("Fetching latestScores with:", fireBaseLevelLeaderBoard); // Log parameter for Firebase call
            
                let latestScoreData = await getLatestScore(fireBaseLevelLeaderBoard);
                // Use the rank directly from the score data, no need to adjust it here
                transformedScores = latestScoreData.surroundingScores.map(score => ({
                    rank: score.rank, // Use the assigned rank directly
                    playerName: score.name,
                    score: score.score,
                    isLatest: score.isLatest // Use the isLatest flag from the score data
                }));
                break;
            }
            


            case 'PlayerTopScores': {
                console.log("Fetching PlayerTopScores with:", fireBaseLevelLeaderBoard); // Log parameter for Firebase call

                let playerTopScores = await getPlayerTopScores(fireBaseLevelLeaderBoard);
                transformedScores = playerTopScores.map(score => ({
                    playerName: score.name,
                    score: score.score
                }));
                break;
            }
        }
        this.draw();
        this.update(transformedScores);
        
    }

    update(newScores) {
        this.scores = newScores;
    }

    dispose() {
        console.log("Disposing Leaderboard_Box...")

        if (this.canvas) {
            this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        }
    
        window.removeEventListener('levelSelected', this.boundLevelSelected);
        this.canvas.removeEventListener('click', this.boundHandleButtonClick);
        this.canvas.removeEventListener('mousemove', this.boundHandleMouseMove);
       // this.canvas = null;
      //  this.ctx = null;

          // Remove event listeners using the stored bound functions
      

      }
}



/*

// LeaderBoard_Box.js
// Class for visualizing the leaderboard, including text and interactions with Firebase.

import BoxUI from './BoxUI.js';
import { getTopScores, getLatestScore, getPlayerTopScores } from './Leaderboard.js'; // Adjust the path if necessary


export default class LeaderBoard_Box {
    constructor() {
        this.scores = []; // Placeholder for scores
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
    
        this.currentSongData;

        this.boundLevelSelected = this.levelSelected.bind(this);
        window.addEventListener('levelSelected', this.boundLevelSelected);

        // Box properties
        this.RESIZE_FACTOR = 0.8;
        this.POSITION_OFFSET_X = -610;
        this.POSITION_OFFSET_Y = 0;
        this.LEADERBOARD_WIDTH = 700 * this.RESIZE_FACTOR;
        this.LEADERBOARD_HEIGHT = 800;
        this.LEADERBOARD_X = ((1920 - this.LEADERBOARD_WIDTH) / 2) + this.POSITION_OFFSET_X;
        this.LEADERBOARD_Y = ((1080 - this.LEADERBOARD_HEIGHT) / 2) + this.POSITION_OFFSET_Y;
        this.LEADERBOARD_RADIUS = 100;
        
        // Header and score styling variables
        this.HEADER_HEIGHT = 155;
        this.HEADER_FONT_SIZE = 50;
        this.SCORE_FONT_SIZE = 30;
        this.SCORE_LINE_HEIGHT = 50;
        this.SCORE_MARGIN_LEFT = 50;
        this.SCORE_MARGIN_RIGHT = 50;

        // Create BoxUI instance
        this.leaderboardBox = new BoxUI(
            this.ctx,
            this.LEADERBOARD_X,
            this.LEADERBOARD_Y,
            this.LEADERBOARD_WIDTH,
            this.LEADERBOARD_HEIGHT,
            this.LEADERBOARD_RADIUS
            // No resize factor or offsets here, as they are already calculated in width and X, Y positions.
        );

             //   const defaultLeaderboardId = "JustDance_easy_LeaderBoard";


        // Immediately attempt to populate and draw the leaderboard
   // this.populateAndDraw(defaultLeaderboardId, detail.leaderBoardState); //or latestScores or playerTopscores   
      // this.setState(detail.leaderBoardState);
    }

    setCurrentSongLevel(songData)
    {
        this.currentSongData = songData;
    }

    setState(fb,LB_state)
    {
        //console.log(LB_state)
        this.populateAndDraw(fb,LB_state);
        
    }

    //window.myCurrentLevelIndex = 0;

   

    draw() {

      //  console.log("Drawing leaderboard with scores: ", this.scores);

        this.ctx.save();
        // Set the style for the box
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.leaderboardBox.draw();
    
        // Draw the HIGHSCORES header
        this.ctx.font = `${this.HEADER_FONT_SIZE}px Verdana`;
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
            "HIGHSCORES", 
            this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2), 
            this.LEADERBOARD_Y + this.HEADER_HEIGHT / 2 + 37
        );
    
        // Start of new code for drawing the scores
        let startY = this.LEADERBOARD_Y + this.HEADER_HEIGHT + this.SCORE_LINE_HEIGHT;
    
        if (this.scores && this.scores.length > 0) {
            // Check if the scores include a 'rank' property
            let includesRank = 'rank' in this.scores[0];
    
            for (let i = 0; i < this.scores.length && i < 10; i++) {
                let scoreItem = this.scores[i];

               // console.log(`Setting fillStyle for ${scoreItem.playerName}: `, scoreItem.isLatest ? "red" : "white");

    
                //  the rank or index
                this.ctx.font = `${this.SCORE_FONT_SIZE}px Verdana`;
               // this.ctx.fillStyle = "white";
               this.ctx.fillStyle = scoreItem.isLatest ? "red" : "white";

    
                if (includesRank) {
                    this.ctx.textAlign = "left";
                    this.ctx.fillText(
                        scoreItem.rank.toString(), 
                        this.LEADERBOARD_X + this.SCORE_MARGIN_LEFT, 
                        startY + (i * this.SCORE_LINE_HEIGHT)
                    );
                } else {
                    this.ctx.textAlign = "left";
                    this.ctx.fillText(
                        (i + 1).toString(), 
                        this.LEADERBOARD_X + this.SCORE_MARGIN_LEFT, 
                        startY + (i * this.SCORE_LINE_HEIGHT)
                    );
                }
    
                // Draw player name
                this.ctx.textAlign = "center";
                this.ctx.fillText(
                    scoreItem.playerName, 
                    this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2), 
                    startY + (i * this.SCORE_LINE_HEIGHT)
                );
    
                // Draw score
                this.ctx.textAlign = "right";
                this.ctx.fillText(
                    scoreItem.score.toString(), 
                    this.LEADERBOARD_X + this.LEADERBOARD_WIDTH - this.SCORE_MARGIN_RIGHT, 
                    startY + (i * this.SCORE_LINE_HEIGHT)
                );
            }
        }
    
        this.ctx.restore();
    }

    

    // Handle the levelSelected event
    levelSelected(event) 
    {
        const selectedLevelLeaderboard = event.detail.fireBaseLevelLeaderBoard;
        this.populateAndDraw(selectedLevelLeaderboard, 'topScores');
       // console.log(`Drawing score for ${scoreItem.playerName}, isLatest in levelSelected loop: `, scoreItem.isLatest);

    }
    //topScores   latestScores //topPlayerscores



    async populateAndDraw(fireBaseLevelLeaderBoard, dataType) {
     // console.log("right after pop and draw",dataType)

        let transformedScores;
    
        switch (dataType) {
            case 'topScores': {
                let topScores = await getTopScores(fireBaseLevelLeaderBoard); 
                transformedScores = topScores.map(score => ({
                    playerName: score.name,
                    score: score.score
                }));
                break;
            }


            case 'latestScores': {
                let latestScoreData = await getLatestScore(fireBaseLevelLeaderBoard);
                transformedScores = latestScoreData.surroundingScores.map((score, index) => {
                    let rankAdjustment = index - latestScoreData.surroundingScores.indexOf(latestScoreData.recentScoreData);
                    let rank = latestScoreData.rank + rankAdjustment;
                    return {
                        rank: rank,
                        playerName: score.name,
                        score: score.score,
                        isLatest: index === latestScoreData.surroundingScores.indexOf(latestScoreData.recentScoreData)
                    };
                });
                break;
            }


            case 'PlayerTopScores': {
                let playerTopScores = await getPlayerTopScores(fireBaseLevelLeaderBoard);
                transformedScores = playerTopScores.map(score => ({
                    playerName: score.name,
                    score: score.score
                }));
                break;
            }
        }
    
        this.update(transformedScores);
        this.draw();
    }

    update(newScores) {
        this.scores = newScores;
    }

    dispose() {
        window.removeEventListener('levelSelected', this.boundLevelSelected);
      }
}

*/


















