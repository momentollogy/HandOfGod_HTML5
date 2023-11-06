import { db } from './firebase.js';
import { testAddScore, getTopScores } from './Leaderboard.js'; // Update the path if necessary

// Class for the Leaderboard
export default class LeaderBoardVisual {
    constructor() {
        this.scores = [];  // Placeholder for scores
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
        
        // Resizing and positioning variables
        this.RESIZE_FACTOR = 0.8;  // 80% of the original size
        this.POSITION_OFFSET_X = 0;  // Move board left or right
        this.POSITION_OFFSET_Y = 0;  // Move board up or down
        
        // Adjusted width and position using resizing and positioning variables
        this.LEADERBOARD_WIDTH = 1100 * this.RESIZE_FACTOR;
        this.LEADERBOARD_HEIGHT = 800;  // Height remains the same, change if needed
        this.LEADERBOARD_X = ((1920 - this.LEADERBOARD_WIDTH) / 2) + this.POSITION_OFFSET_X;
        this.LEADERBOARD_Y = ((1080 - this.LEADERBOARD_HEIGHT) / 2) + this.POSITION_OFFSET_Y;
        
        this.LEADERBOARD_RADIUS = 20;  // Radius for rounded corners
        this.HEADER_HEIGHT = 80;  // Height of the header area
        
        // Styling and text layout variables
        this.HEADER_FONT_SIZE = 50;  // Font size for the header
        this.SCORE_FONT_SIZE = 35;  // Font size for the scores
        this.SCORE_LINE_HEIGHT = 50; // Vertical space between lines
        this.SCORE_MARGIN_LEFT = 50; // Horizontal space from the left edge
        this.SCORE_MARGIN_RIGHT = 50; // Horizontal space from the right edge
        
        // Immediately attempt to populate and draw the leaderboard
        this.populateAndDraw(); 
    }

    // Simple function to draw a rounded rectangle
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.arcTo(x + width, y, x + width, y + height, radius);
        this.ctx.arcTo(x + width, y + height, x, y + height, radius);
        this.ctx.arcTo(x, y + height, x, y, radius);
        this.ctx.arcTo(x, y, x + width, y, radius);
        this.ctx.closePath();
        this.ctx.fill();
    }

    // Draw the leaderboard
    draw() {
        // Draw the main leaderboard box with rounded edges
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";  // Slightly transparent black background
        this.roundRect(this.LEADERBOARD_X, this.LEADERBOARD_Y, this.LEADERBOARD_WIDTH, this.LEADERBOARD_HEIGHT, this.LEADERBOARD_RADIUS);
    
        // Draw the HIGHSCORES header, centered within the leaderboard
        this.ctx.font = `${this.HEADER_FONT_SIZE}px Verdana`;
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText("HIGHSCORES", this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2), this.LEADERBOARD_Y + this.HEADER_HEIGHT / 2 + 10);
    
        // Temp positions for rank, player name, and score
        this.ctx.font = `${this.SCORE_FONT_SIZE}px Verdana`;
        let startY = this.LEADERBOARD_Y + this.HEADER_HEIGHT + this.SCORE_LINE_HEIGHT;  // Starting Y position for the first score line
        for (let i = 0; i < this.scores.length && i < 10; i++) {  // Draw up to 10 scores
            this.ctx.textAlign = "left";
            this.ctx.fillText((i + 1).toString(), this.LEADERBOARD_X + this.SCORE_MARGIN_LEFT, startY + (i * this.SCORE_LINE_HEIGHT));  // Rank
    
            this.ctx.textAlign = "center";
            this.ctx.fillText(this.scores[i].playerName, this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2), startY + (i * this.SCORE_LINE_HEIGHT));  // Player Name
    
            this.ctx.textAlign = "right";
            this.ctx.fillText(this.scores[i].score.toString(), this.LEADERBOARD_X + this.LEADERBOARD_WIDTH - this.SCORE_MARGIN_RIGHT, startY + (i * this.SCORE_LINE_HEIGHT));  // Score
        }
    }

    async populateAndDraw() {
        // Fetch the top scores
        const topScores = await getTopScores();
        
        // Transform the scores to match what the draw function expects
        const transformedScores = topScores.map(score => ({
            playerName: score.name,
            score: score.score
        }));
        
        this.update(transformedScores);  // Update the leaderboard scores
        this.draw();  // Display the updated leaderboard scores
    }

    update(newScores) {
        this.scores = newScores;
    }
}
