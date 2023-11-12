
// LeaderBoardVisual.js
// Class for visualizing the leaderboard, including text and interactions with Firebase.

import BoxUI from './BoxUI.js';
import { getTopScores } from './Leaderboard.js'; // Update the path if necessary

export default class LeaderBoardVisual {
    constructor() {
        this.scores = []; // Placeholder for scores
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");


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

        // Immediately attempt to populate and draw the leaderboard
        this.populateAndDraw();
        
    }

    draw() {
        this.ctx.save();
        // Set the style for the box
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        
        // Draw the box with rounded edges
        this.leaderboardBox.draw();

        // Draw the HIGHSCORES header, centered within the leaderboard
        this.ctx.font = `${this.HEADER_FONT_SIZE}px Verdana`;
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
            "HIGHSCORES", 
            this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2), 
            this.LEADERBOARD_Y + this.HEADER_HEIGHT / 2 + 37
        );

        // Draw the scores
        this.ctx.font = `${this.SCORE_FONT_SIZE}px Verdana`;
        let startY = this.LEADERBOARD_Y + this.HEADER_HEIGHT + this.SCORE_LINE_HEIGHT;
        for (let i = 0; i < this.scores.length && i < 10; i++) {
            this.ctx.textAlign = "left";
            this.ctx.fillText(
                (i + 1).toString(), 
                this.LEADERBOARD_X + this.SCORE_MARGIN_LEFT, 
                startY + (i * this.SCORE_LINE_HEIGHT)
            );

            this.ctx.textAlign = "center";
            this.ctx.fillText(
                this.scores[i].playerName, 
                this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2), 
                startY + (i * this.SCORE_LINE_HEIGHT)
            );

            this.ctx.textAlign = "right";
            this.ctx.fillText(
                this.scores[i].score.toString(), 
                this.LEADERBOARD_X + this.LEADERBOARD_WIDTH - this.SCORE_MARGIN_RIGHT, 
                startY + (i * this.SCORE_LINE_HEIGHT)
            );
        }
        this.ctx.restore();
    }

    // Handle the levelSelected event
    levelSelected(event) 
    {
        const selectedLevelLeaderboard = event.detail.fireBaseLevelLeaderBoard;
        this.populateAndDraw(selectedLevelLeaderboard);
    }
  

    async populateAndDraw(fireBaseLevelLeaderBoard) {
        // Fetch the top scores
        let topScores = await getTopScores(fireBaseLevelLeaderBoard); // Adjust getTopScores to accept an id
        
        // Transform the scores to match what the draw function expects
       let transformedScores = topScores.map(score => ({
            playerName: score.name,
            score: score.score
        }));

        this.update(transformedScores); // Update the leaderboard scores
      //  this.draw(); // Display the updated leaderboard scores
    }

    update(newScores) {
        this.scores = newScores;
    }

    dispose() {
        window.removeEventListener('levelSelected', this.boundLevelSelected);
        // ... other cleanup code ...
      }
}
