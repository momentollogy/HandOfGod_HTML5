
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






        // Step 1: Define Button Properties
        this.buttons = {
            topScores: {
                x: 70, // Example position
                y: 420, // Example position
                width: 35, // Example size
                height: 35, // Example size
                imagePath: 'images/topScores.png', // Adjust path as needed
                state: 'topScores'
            },
            latestScores: {
                x: 70,
                y: 520,
                width: 35,
                height: 35,
                imagePath: 'images/latestScores.png',
                state: 'latestScores'
            },
            playerTopScores: {
                x: 70,
                y:620,
                width: 35,
                height: 35,
                imagePath: 'images/playerTopScores.png',
                state: 'PlayerTopScores'
            }
        };

        // Step 2: Load Button Images
        this.loadButtonIcons();

        // ... rest of the constructor code ...

        // Step 4: Add event listener for clicks
        this.canvas.addEventListener('click', this.handleButtonClick.bind(this));

        
    }
    //END OF CONSTUCTOR

      // Utility function to check if a click is inside a button's area
      isInside(point, rect) {
        return point.x >= rect.x && point.x <= rect.x + rect.width &&
               point.y >= rect.y && point.y <= rect.y + rect.height;
    }


 // Load button images
 loadButtonIcons() {
    Object.values(this.buttons).forEach(button => {
        button.image = new Image();
        button.image.src = button.imagePath;
    });
}

    // Draw buttons
    drawButtons() {
        Object.values(this.buttons).forEach(button => {
            this.ctx.drawImage(button.image, button.x, button.y, button.width, button.height);
        });
    }

    // Handle button clicks
    handleButtonClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;
    
        Object.values(this.buttons).forEach(button => {
            if (clickX >= button.x && clickX <= button.x + button.width &&
                clickY >= button.y && clickY <= button.y + button.height) {
                // Check if the currentFireBaseLevelLeaderBoard is set
                if (this.currentFireBaseLevelLeaderBoard) {
                    this.populateAndDraw(this.currentFireBaseLevelLeaderBoard, button.state);
                } else {
                    console.error("No current Firebase leaderboard set");
                }
            }
        });
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
        // Bind the levelSelected method to handle level selection events
        this.boundLevelSelected = this.levelSelected.bind(this);
        window.addEventListener('levelSelected', this.boundLevelSelected);
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
        }
    
        // Draw buttons
        this.drawButtons();
        
        this.ctx.restore();
    }

    currentFireBaseLevelLeaderBoard = null;


   /* // Handle the levelSelected event
    levelSelected(event) 
    {
        const selectedLevelLeaderboard = event.detail.fireBaseLevelLeaderBoard;
        this.populateAndDraw(selectedLevelLeaderboard, 'latestScores');

    }
    //topScores   latestScores //topPlayerscores
*/

    // Modify levelSelected to update currentFireBaseLevelLeaderBoard
    levelSelected(event) {
        this.currentFireBaseLevelLeaderBoard = event.detail.fireBaseLevelLeaderBoard;
        this.populateAndDraw(this.currentFireBaseLevelLeaderBoard, 'latestScores');
    }


    async populateAndDraw(fireBaseLevelLeaderBoard, dataType) {
        console.log("populateAndDraw called with:", fireBaseLevelLeaderBoard, dataType); // Log received parameters

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
                console.log("Fetching PlayerTopScores with:", fireBaseLevelLeaderBoard); // Log parameter for Firebase call

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


